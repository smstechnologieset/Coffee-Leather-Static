import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE_CONFIG } from '@highland/shared/site-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type, // 'sample' | 'contract'
      productId,
      productName,
      amount, // In USD
      sampleSize,
      quantityQuintals,
      customerEmail,
      companyName,
      deliveryAddress,
      notes,
      origin,
    } = body;

    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    const hasLiveOrTestKey = secretKey.startsWith('sk_test_') && !secretKey.includes('MockStripeKey');

    // 1. If user has configured an active Stripe test key, create a real Stripe Checkout Session
    if (hasLiveOrTestKey) {
      const stripe = new Stripe(secretKey);

      const sizeLabel = sampleSize ? ` (${sampleSize})` : '';
      const title = type === 'direct_order'
        ? `Coffee Order: ${productName}`
        : type === 'sample'
        ? (productName.includes('(') ? `Coffee Sample: ${productName}` : `Coffee Sample: ${productName}${sizeLabel}`)
        : `Contract Payment: ${quantityQuintals || '10'} Quintals of ${productName}`;

      const description = type === 'direct_order'
        ? `Direct personal delivery package (${sampleSize || 'Standard Pack'}) for ${companyName || 'Customer'}`
        : type === 'sample'
        ? `Roaster sample evaluation package${sizeLabel} for ${companyName || 'Buyer'}`
        : `Contract reserve payment for ${companyName || 'Buyer'}${deliveryAddress ? ` (${deliveryAddress})` : ''}`;

      const baseOrigin = origin || SITE_CONFIG.urls.coffeeSite;

      const successUrl = type === 'direct_order'
        ? `${baseOrigin}/order-now/${productId}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`
        : `${baseOrigin}/coffees/${productId}/${type === 'sample' ? 'request-sample' : 'request-contract'}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;

      const cancelUrl = type === 'direct_order'
        ? `${baseOrigin}/order-now/${productId}?payment_cancelled=true`
        : `${baseOrigin}/coffees/${productId}/${type === 'sample' ? 'request-sample' : 'request-contract'}?payment_cancelled=true`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: title,
                description,
              },
              unit_amount: Math.round(Number(amount) * 100), // in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: customerEmail || undefined,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          type,
          productId,
          productName,
          companyName,
          deliveryAddress,
          sampleSize: sampleSize || '',
          quantityQuintals: quantityQuintals ? String(quantityQuintals) : '',
          notes: notes || '',
        },
      });

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
        mode: 'stripe_checkout',
      });
    }

    // 2. Otherwise, return mock/test confirmation payload for interactive modal
    const mockTransactionId = `ch_test_${Math.random().toString(36).substring(2, 10)}${Date.now().toString().slice(-4)}`;
    return NextResponse.json({
      simulated: true,
      transactionId: mockTransactionId,
      status: 'succeeded',
      amount,
      message: 'Processed via Stripe Test Mode environment',
    });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initiate Stripe test checkout session' },
      { status: 500 }
    );
  }
}
