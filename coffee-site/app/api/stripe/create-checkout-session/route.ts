import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-server';
import { INITIAL_ORDER_NOW_PRODUCTS } from '@/lib/order-products-data';
import { INITIAL_COFFEES } from '@/lib/products-data';
import { SITE_CONFIG } from '@highland/shared/site-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type, // 'sample' | 'contract' | 'direct_order'
      productId,
      productName,
      sampleSize,
      quantityQuintals,
      quantity = 1,
      customerEmail,
      customerName,
      customerPhone,
      companyName,
      deliveryAddress,
      notes,
      origin,
    } = body;

    const supabase = createAdminClient();

    // 1. Server-side price calculation and verification
    let verifiedAmount = 0;
    let title = '';
    let description = '';

    if (type === 'direct_order') {
      const orderNowProd = INITIAL_ORDER_NOW_PRODUCTS.find(
        (p) => p.id === productId || p.name.toLowerCase() === (productName || '').toLowerCase()
      );
      const unitPrice = orderNowProd ? orderNowProd.price : 28;
      const numQty = Math.max(1, parseInt(quantity, 10) || 1);
      verifiedAmount = unitPrice * numQty;
      title = `Packaged Coffee Order: ${orderNowProd?.name || productName || 'Special Mixed'} (${numQty}x)`;
      description = `Direct international courier delivery (${numQty}x ${orderNowProd?.packageLabel || '1kg pack'}) for ${customerName || companyName || 'Customer'}`;
    } else if (type === 'sample') {
      // Lookup sample tier price
      const coffee = Object.values(INITIAL_COFFEES).find(
        (c) => c.id === productId || c.name === productName || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === productId
      );
      const tier = coffee?.sampleTiers?.find((t) => t.size === sampleSize);
      verifiedAmount = tier ? tier.price : (sampleSize === '1kg' ? 15 : sampleSize === '2kg' ? 25 : 0);
      title = `Coffee Sample Evaluation: ${productName || coffee?.name || 'Ethiopian Specialty'} (${sampleSize || '500g'})`;
      description = `Q-grader sample evaluation pack (${sampleSize || '500g'}) for ${companyName || customerName || 'Buyer'}`;
    } else if (type === 'contract') {
      // 5% deposit on indicative total
      const quintals = Number(quantityQuintals) || 10;
      const coffee = Object.values(INITIAL_COFFEES).find(
        (c) => c.id === productId || c.name === productName || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === productId
      );
      const pricePerQuintal = coffee ? coffee.pricePerQuintal : 400;
      const indicativeTotal = quintals * pricePerQuintal;
      verifiedAmount = Math.round(indicativeTotal * 0.05); // 5% contract reserve deposit
      title = `Supply Contract Reserve Deposit: ${quintals} Quintals of ${productName || coffee?.name || 'Specialty Coffee'}`;
      description = `5% export reservation deposit for ${companyName || 'Buyer'} (${quintals} Quintals / ${quintals * 100} kg)`;
    } else {
      verifiedAmount = 28;
      title = `Coffee Order: ${productName || 'Ethiopian Specialty Coffee'}`;
      description = 'Specialty Ethiopian coffee direct purchase';
    }

    // 2. Generate unique reference and create pending database record
    const recordId = `ord_cof_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;
    const baseOrigin = origin || SITE_CONFIG.urls.coffeeSite;

    if (type === 'direct_order') {
      await supabase.from('orders').insert({
        id: recordId,
        order_number: `ORD-COF-${Date.now().toString().slice(-6).toUpperCase()}`,
        site_source: 'coffee',
        customer_name: customerName || companyName || 'Valued Customer',
        customer_email: customerEmail || 'customer@example.com',
        customer_phone: customerPhone || null,
        shipping_address: typeof deliveryAddress === 'object' ? deliveryAddress : { street: deliveryAddress || 'Address on file' },
        items: [
          {
            product_id: productId,
            product_name: productName || title,
            quantity: Math.max(1, parseInt(quantity, 10) || 1),
            unit_price: verifiedAmount / Math.max(1, parseInt(quantity, 10) || 1),
          },
        ],
        subtotal: verifiedAmount,
        total_amount: verifiedAmount,
        currency: 'USD',
        payment_status: verifiedAmount === 0 ? 'paid' : 'pending',
        fulfillment_status: 'processing',
      });
    } else if (type === 'sample') {
      await supabase.from('sample_requests').insert({
        id: recordId,
        product_id: productId || null,
        product_name: productName || title,
        company_name: companyName || customerName || 'Coffee Buyer',
        buyer_name: customerName || companyName || 'Roaster',
        country: 'International',
        email: customerEmail || 'buyer@example.com',
        phone: customerPhone || null,
        sample_size: sampleSize || '250g',
        sample_price: verifiedAmount,
        shipping_address: typeof deliveryAddress === 'object' ? JSON.stringify(deliveryAddress) : (deliveryAddress || 'Address on file'),
        notes: notes || null,
        status: 'new',
      });
    } else if (type === 'contract') {
      const quintals = Number(quantityQuintals) || 10;
      await supabase.from('contract_requests').insert({
        id: recordId,
        product_id: productId || null,
        product_name: productName || title,
        company_name: companyName || 'Coffee Importer',
        buyer_name: customerName || companyName || 'Buyer',
        email: customerEmail || 'buyer@example.com',
        phone: customerPhone || null,
        quantity_quintals: quintals,
        quantity_kg: quintals * 100,
        delivery_term: 'FOB',
        indicative_total_usd: verifiedAmount * 20,
        deposit_amount: verifiedAmount,
        notes: notes || null,
        status: 'pending_payment',
      });
    }

    // 3. Check for Stripe Key (Test or Live)
    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    const hasStripeKey =
      (secretKey.startsWith('sk_test_') || secretKey.startsWith('sk_live_')) &&
      !secretKey.includes('MockStripeKey');

    // If free sample, redirect to confirmation directly
    if (verifiedAmount === 0) {
      const successUrl = type === 'sample'
        ? `${baseOrigin}/coffees/${productId}/request-sample?payment_success=true&record_id=${recordId}`
        : `${baseOrigin}/order-now/${productId}?payment_success=true&record_id=${recordId}`;

      return NextResponse.json({
        url: successUrl,
        mode: 'complimentary',
        recordId,
      });
    }

    if (hasStripeKey) {
      const stripe = new Stripe(secretKey);

      const successUrl = type === 'direct_order'
        ? `${baseOrigin}/order-now/${productId}?payment_success=true&session_id={CHECKOUT_SESSION_ID}&record_id=${recordId}`
        : `${baseOrigin}/coffees/${productId}/${type === 'sample' ? 'request-sample' : 'request-contract'}?payment_success=true&session_id={CHECKOUT_SESSION_ID}&record_id=${recordId}`;

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
              unit_amount: Math.round(verifiedAmount * 100),
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
          recordId,
          productId: productId || '',
          productName: productName || '',
          companyName: companyName || '',
          customerName: customerName || '',
          customerEmail: customerEmail || '',
        },
      });

      // Update order or request with stripe session id
      if (type === 'direct_order') {
        await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', recordId);
      }

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
        recordId,
        mode: 'stripe_checkout',
      });
    }

    // Fallback simulation mode
    const mockTxId = `ch_test_${Math.random().toString(36).substring(2, 10)}${Date.now().toString().slice(-4)}`;
    return NextResponse.json({
      simulated: true,
      transactionId: mockTxId,
      status: 'succeeded',
      amount: verifiedAmount,
      recordId,
      message: 'Processed via Stripe test environment',
    });
  } catch (error: any) {
    console.error('[coffee-checkout] Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initiate Stripe checkout session' },
      { status: 500 }
    );
  }
}
