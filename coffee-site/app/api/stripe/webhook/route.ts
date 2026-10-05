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
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`[coffee-webhook] Signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { type, recordId } = session.metadata || {};

    console.log(`[coffee-webhook] Checkout completed for type: ${type}, recordId: ${recordId}`);

    if (recordId) {
      if (type === 'direct_order') {
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            fulfillment_status: 'processing',
            stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', recordId);

        if (error) console.error(`[coffee-webhook] Error updating order ${recordId}:`, error);
      } else if (type === 'sample') {
        const { error } = await supabase
          .from('sample_requests')
          .update({
            status: 'new',
            updated_at: new Date().toISOString(),
          })
          .eq('id', recordId);

        if (error) console.error(`[coffee-webhook] Error updating sample request ${recordId}:`, error);
      } else if (type === 'contract') {
        const { error } = await supabase
          .from('contract_requests')
          .update({
            status: 'paid_pending_contract',
            updated_at: new Date().toISOString(),
          })
          .eq('id', recordId);

        if (error) console.error(`[coffee-webhook] Error updating contract request ${recordId}:`, error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
