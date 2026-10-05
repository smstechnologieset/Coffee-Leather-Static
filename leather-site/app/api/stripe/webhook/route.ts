import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // In development or if webhook secret is not yet set, parse directly
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`[leather-webhook] Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const promoCode = session.metadata?.promo_code;

    console.log(`[leather-webhook] Checkout session completed for order: ${orderId}`);

    if (orderId) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          fulfillment_status: 'processing',
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.id,
          stripe_session_id: session.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) {
        console.error(`[leather-webhook] Failed to update order status for ${orderId}:`, updateError);
      } else {
        console.log(`[leather-webhook] Successfully marked order ${orderId} as paid`);
      }
    }

    // Increment promo code usage if applied
    if (promoCode) {
      try {
        const { data: promo } = await supabase
          .from('promo_codes')
          .select('id, used_count')
          .eq('code', promoCode.toUpperCase())
          .single();

        if (promo) {
          await supabase
            .from('promo_codes')
            .update({ used_count: (promo.used_count || 0) + 1 })
            .eq('id', promo.id);
        }
      } catch (pErr) {
        console.warn(`[leather-webhook] Could not increment promo code count:`, pErr);
      }
    }
  }

  // Handle payment failed
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.order_id;

    if (orderId) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    }
  }

  return NextResponse.json({ received: true });
}
