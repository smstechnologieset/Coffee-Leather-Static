'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { createClient } from '@/lib/supabase';
import {
  CheckCircle2,
  Package,
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  Clock,
  MapPin,
} from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((state) => state.clearCart);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Clear cart upon reaching confirmed success page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Fetch verified order from Supabase
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId && !sessionId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        let query = supabase.from('orders').select('*');

        if (orderId) {
          query = query.eq('id', orderId);
        } else if (sessionId) {
          query = query.eq('stripe_session_id', sessionId);
        }

        const { data, error } = await query.single();
        if (data && !error) {
          setOrder(data);
        }
      } catch (e) {
        console.error('Error fetching confirmed order:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, sessionId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono">
          Verifying order details...
        </p>
      </div>
    );
  }

  const displayOrderNumber = order?.order_number || order?.id || orderId || 'ORD-CONFIRMED';
  const customerName = order?.customer_name || 'Valued Customer';
  const customerEmail = order?.customer_email || 'your registered email';
  const items = Array.isArray(order?.items) ? order.items : [];
  const totalAmount = order?.total_amount ? Number(order.total_amount) : null;
  const address = order?.shipping_address;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-neutral-900 text-white p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <CheckCircle2 className="h-9 w-9 text-emerald-400" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Payment Verified & Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold mt-4 tracking-tight">
            Thank You, {customerName}
          </h1>
          <p className="text-xs text-neutral-300 mt-2 max-w-md mx-auto leading-relaxed">
            Your handcrafted luxury leather order has been received. A receipt and tracking details
            have been sent to <strong className="text-white">{customerEmail}</strong>.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Reference Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-6 border-b border-neutral-100">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono">
                Order Reference
              </span>
              <span className="font-mono font-bold text-sm sm:text-base text-neutral-900 break-all">
                {displayOrderNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono">
                Payment Status
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Paid via Stripe
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono">
                Fulfillment
              </span>
              <span className="font-medium text-xs sm:text-sm text-neutral-800 flex items-center gap-1 mt-0.5">
                <Clock className="h-3.5 w-3.5 text-neutral-500" /> Dispatch in 24-48h
              </span>
            </div>
          </div>

          {/* Purchased Items */}
          {items.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 font-mono">
                Purchased Items ({items.length})
              </h3>
              <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden bg-neutral-50/50">
                {items.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 flex items-center gap-4">
                    {item.image && (
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-neutral-900 text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Qty: {item.quantity} {item.color ? `• ${item.color}` : ''} {item.size ? `• Size: ${item.size}` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-sm text-neutral-900">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total & Shipping Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {address && (
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                <div className="flex items-center gap-2 mb-2 text-neutral-700 font-semibold text-xs uppercase tracking-wider font-mono">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Delivery Destination</span>
                </div>
                <p className="font-bold text-neutral-900 text-xs">{customerName}</p>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {address.street || address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}
                  <br />
                  {address.city}
                  {address.state ? `, ${address.state}` : ''} {address.postalCode || address.postal_code}
                  <br />
                  {address.country}
                </p>
              </div>
            )}

            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-neutral-700 font-semibold text-xs uppercase tracking-wider font-mono">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Courier Service</span>
                </div>
                <p className="text-xs text-neutral-600">
                  DHL Express International Tracked Courier. Tracking number will be emailed upon carrier handover.
                </p>
              </div>
              {totalAmount !== null && (
                <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="text-xs text-neutral-500 font-medium">Total Paid</span>
                  <span className="font-mono font-bold text-lg text-neutral-900">
                    ${totalAmount.toFixed(2)} USD
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/account"
              className="flex-1 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-widest rounded-xl transition text-center flex items-center justify-center gap-2"
            >
              <Package className="h-4 w-4" />
              <span>View in My Orders</span>
            </Link>
            <Link
              href="/products"
              className="flex-1 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium text-xs uppercase tracking-widest rounded-xl transition text-center flex items-center justify-center gap-2 border border-neutral-200"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen pt-10 sm:pt-14 pb-20 bg-neutral-50">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
