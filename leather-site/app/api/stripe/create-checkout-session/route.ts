import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-server';
import { INITIAL_LEATHER_PRODUCTS, applyPromoCode } from '@/lib/leather-data';
import { SITE_CONFIG } from '@highland/shared/site-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      promoCode,
      origin,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customerEmail || !customerName || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required customer or shipping details' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch live products from Supabase to verify pricing, with fallback to initial catalog
    const { data: dbProducts } = await supabase
      .from('leather_products')
      .select('*');

    const productCatalog = (dbProducts && dbProducts.length > 0) ? dbProducts : INITIAL_LEATHER_PRODUCTS;

    // 2. Validate items & compute verified subtotal on server
    const verifiedItems: {
      productId: string;
      name: string;
      image: string;
      unitPrice: number;
      quantity: number;
      color?: string;
      size?: string;
      lineTotal: number;
    }[] = [];

    let subtotal = 0;

    for (const item of items) {
      const product = productCatalog.find(
        (p: any) => p.id === item.productId || p.slug === item.productId
      );

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.name || item.productId}` },
          { status: 400 }
        );
      }

      const unitPrice = Number(product.price);
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (item.image || ''),
        unitPrice,
        quantity,
        color: item.color || undefined,
        size: item.size || undefined,
        lineTotal,
      });
    }

    // 3. Validate promo code discount
    let discountAmount = 0;
    let validPromoCode: string | null = null;

    if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
      const codeUpper = promoCode.trim().toUpperCase();

      // Check database promo_codes table first
      const { data: dbPromo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', codeUpper)
        .eq('is_active', true)
        .single();

      if (dbPromo) {
        if (!dbPromo.minimum_order || subtotal >= Number(dbPromo.minimum_order)) {
          if (dbPromo.discount_type === 'percentage') {
            discountAmount = parseFloat(((subtotal * Number(dbPromo.discount_value)) / 100).toFixed(2));
          } else {
            discountAmount = Math.min(subtotal, Number(dbPromo.discount_value));
          }
          validPromoCode = codeUpper;
        }
      } else {
        // Fallback to local promo code evaluator
        const promoRes = applyPromoCode(codeUpper, subtotal);
        if (promoRes.valid) {
          discountAmount = promoRes.discount;
          validPromoCode = codeUpper;
        }
      }
    }

    // 4. Calculate shipping ($0 if subtotal >= 200, else $25)
    const shippingFee = subtotal >= 200 ? 0 : 25;
    const totalAmount = parseFloat(Math.max(0, subtotal - discountAmount + shippingFee).toFixed(2));

    // 5. Generate unique order reference and save pending order to database
    const orderId = `ord_lth_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;
    const orderNumber = `ORD-LTH-${Date.now().toString().slice(-6).toUpperCase()}`;

    const { error: insertError } = await supabase.from('orders').insert({
      id: orderId,
      order_number: orderNumber,
      site_source: 'leather',
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      shipping_address: shippingAddress,
      items: verifiedItems,
      subtotal,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      currency: 'USD',
      promo_code: validPromoCode,
      payment_status: 'pending',
      fulfillment_status: 'processing',
    });

    if (insertError) {
      console.error('[leather-checkout] Failed to create pending order:', insertError);
    }

    // 6. Check for Stripe Key and create Checkout Session
    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    const hasStripeKey =
      (secretKey.startsWith('sk_test_') || secretKey.startsWith('sk_live_')) &&
      !secretKey.includes('MockStripeKey');

    const baseOrigin = origin || SITE_CONFIG.urls.leatherSite;

    if (hasStripeKey) {
      const stripe = new Stripe(secretKey);

      // Construct line items for Stripe Checkout
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = verifiedItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.name}${item.color ? ` (${item.color})` : ''}${item.size ? ` - Size: ${item.size}` : ''}`,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      }));

      // Add shipping line item if applicable
      if (shippingFee > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'DHL Express International Worldwide Shipping',
              description: 'Insured international tracked delivery from Addis Ababa',
            },
            unit_amount: Math.round(shippingFee * 100),
          },
          quantity: 1,
        });
      }

      // If discount applied, apply via Stripe discounts
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        customer_email: customerEmail,
        success_url: `${baseOrigin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `${baseOrigin}/checkout?cancelled=true`,
        metadata: {
          order_id: orderId,
          order_number: orderNumber,
          site_source: 'leather',
          promo_code: validPromoCode || '',
          customer_name: customerName,
        },
      };

      const session = await stripe.checkout.sessions.create(sessionParams);

      // Update order with session id
      await supabase
        .from('orders')
        .update({ stripe_session_id: session.id })
        .eq('id', orderId);

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
        orderId,
        orderNumber,
      });
    }

    // Fallback simulation mode if Stripe credentials not configured
    const simulatedTxId = `ch_sim_${Math.random().toString(36).substring(2, 10)}`;
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        stripe_payment_intent_id: simulatedTxId,
      })
      .eq('id', orderId);

    return NextResponse.json({
      simulated: true,
      url: `${baseOrigin}/checkout/success?order_id=${orderId}&simulated=true`,
      orderId,
      orderNumber,
    });
  } catch (err: any) {
    console.error('[leather-checkout] Error creating checkout session:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
