'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { applyPromoCode, LeatherPromo } from '@/lib/leather-data';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Tag,
} from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<LeatherPromo | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Re-calculate promo discount whenever subtotal changes
  useEffect(() => {
    if (appliedPromo) {
      const res = applyPromoCode(appliedPromo.code, subtotal);
      if (res.valid) {
        setPromoDiscount(res.discount);
      } else {
        setAppliedPromo(null);
        setPromoDiscount(0);
        setPromoError(res.message);
      }
    }
  }, [subtotal, appliedPromo]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoMessage('');
    if (!promoInput.trim()) return;

    const res = applyPromoCode(promoInput.trim(), subtotal);
    if (res.valid && res.promo) {
      setAppliedPromo(res.promo);
      setPromoDiscount(res.discount);
      setPromoMessage(res.message);
      setPromoInput('');
    } else {
      setPromoError(res.message);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoMessage('');
    setPromoError('');
  };

  const freeShippingThreshold = 200;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 25;
  const finalTotal = Math.max(0, subtotal - promoDiscount + shippingFee);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen py-16 bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-neutral-200/60 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-neutral-400 stroke-1" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-neutral-600 mt-2 mb-8 leading-relaxed">
            Discover our collection of handcrafted Ethiopian full-grain leather goods,
            created by master cordwainers in Addis Ababa.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-neutral-900 text-white font-medium text-xs uppercase tracking-widest hover:bg-neutral-800 transition"
          >
            Explore Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-8 sm:pt-10 pb-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Top Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
          </Link>
          <span className="text-xs text-neutral-500 font-mono">
            {items.reduce((acc, i) => acc + i.quantity, 0)} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight mb-8">
          Shopping Bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Free shipping banner */}
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex items-center gap-3">
              <Truck className="h-5 w-5 text-neutral-700 shrink-0" />
              <div className="flex-1 text-xs">
                {subtotal >= freeShippingThreshold ? (
                  <span className="font-semibold text-emerald-700">
                    You have unlocked Free Worldwide Express Shipping!
                  </span>
                ) : (
                  <span className="text-neutral-600">
                    Add{' '}
                    <strong className="text-neutral-900 font-semibold font-mono">
                      ${(freeShippingThreshold - subtotal).toFixed(2)}
                    </strong>{' '}
                    more to qualify for <strong>Free Worldwide Shipping</strong>.
                  </span>
                )}
                {/* Progress bar */}
                <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm divide-y divide-neutral-100 overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Thumbnail */}
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-serif font-bold text-neutral-900 hover:text-neutral-600 transition text-base sm:text-lg"
                        >
                          {item.name}
                        </Link>
                        <span className="font-mono font-bold text-neutral-900 text-base shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                        {item.color && (
                          <span>
                            Color: <strong className="text-neutral-800">{item.color}</strong>
                          </span>
                        )}
                        {item.size && (
                          <span>
                            Size: <strong className="text-neutral-800">{item.size}</strong>
                          </span>
                        )}
                        <span className="text-neutral-400 font-mono">
                          (${item.price.toFixed(2)} each)
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-50">
                      <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-neutral-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1.5 sm:px-2.5 sm:py-1 hover:bg-neutral-200 text-neutral-700 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 sm:px-4 py-1 font-mono font-bold text-xs text-neutral-900 bg-white border-x border-neutral-300">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 sm:px-2.5 sm:py-1 hover:bg-neutral-200 text-neutral-700 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-neutral-400 hover:text-rose-600 transition flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-4">
                Order Summary
              </h2>

              {/* Promo Code Input */}
              <div>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. KIJIJ20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-mono border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-wider rounded-lg transition"
                  >
                    Apply
                  </button>
                </form>

                {promoMessage && (
                  <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg flex items-center justify-between">
                    <span>{promoMessage}</span>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-emerald-900 hover:underline font-bold text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="mt-2 text-xs text-rose-600 font-medium">{promoError}</p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-xs border-t border-neutral-100 pt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-neutral-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-mono">-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="font-mono font-medium text-neutral-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span>Duties & Import Taxes</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-neutral-900 block font-serif">Estimated Total</span>
                    <span className="text-[10px] text-neutral-400 font-normal">All prices in USD</span>
                  </div>
                  <span className="font-mono font-bold text-xl sm:text-2xl text-neutral-900">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href={
                  appliedPromo
                    ? `/checkout?promo=${encodeURIComponent(appliedPromo.code)}`
                    : '/checkout'
                }
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-3 shadow-md shadow-neutral-900/10"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-neutral-100 grid grid-cols-2 gap-3 text-[11px] text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
                  <span>Secure 256-bit Stripe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
                  <span>100% Genuine Cowhide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
