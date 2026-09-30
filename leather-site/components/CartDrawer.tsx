'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { X, Minus, Plus, ShoppingBag, Tag, Check, ArrowRight, Gift } from 'lucide-react';
import { applyPromoCode } from '@/lib/leather-data';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = promoApplied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  const handleApplyPromo = () => {
    const code = promoInput.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoError('');
    setTimeout(() => {
      const result = applyPromoCode(code, subtotal);
      if (result.valid) {
        setPromoApplied({ code, discount: result.discount, message: result.message });
        setPromoInput('');
      } else {
        setPromoError(result.message);
        setPromoApplied(null);
      }
      setPromoLoading(false);
    }, 300);
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoError('');
    setPromoInput('');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-4 w-4 text-neutral-900" strokeWidth={1.8} />
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
              Your Bag
            </h2>
            {items.length > 0 && (
              <span className="text-xs text-neutral-500">({items.length})</span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5 pb-16">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
                <ShoppingBag className="h-7 w-7 text-neutral-300" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-1">Your bag is empty</p>
                <p className="text-xs text-neutral-400">Add something beautiful to get started</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-60 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Product image */}
                  <div className="relative h-24 w-20 bg-[#F2EDE8] flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 leading-tight line-clamp-2">{item.name}</p>
                        {(item.color || item.size) && (
                          <p className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-wide">
                            {item.color}{item.size ? ` / ${item.size}` : ''}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-300 hover:text-neutral-900 transition-colors flex-shrink-0 mt-0.5"
                        aria-label="Remove item"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-900 disabled:opacity-30"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-neutral-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-900"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — only when items exist */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 px-6 py-5 space-y-4">

            {/* Promo code */}
            {promoApplied ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Gift className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800">{promoApplied.code} applied</p>
                    <p className="text-[10px] text-emerald-600">{promoApplied.message}</p>
                  </div>
                </div>
                <button onClick={handleRemovePromo} className="text-emerald-600 hover:text-emerald-900">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
                    <input
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      placeholder="Promo code"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tracking-wider"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoInput.trim() || promoLoading}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-700 transition-colors disabled:opacity-40"
                  >
                    {promoLoading ? '…' : 'Apply'}
                  </button>
                </div>
                {promoError && (
                  <p className="text-[10px] text-red-600 mt-1.5">{promoError}</p>
                )}
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({promoApplied?.code})</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-1.5 border-t border-neutral-100">
                <span className="text-sm font-bold text-neutral-900">Total</span>
                <span className="text-lg font-bold text-neutral-900">${total.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[10px] text-center text-neutral-400">
              Shipping &amp; taxes calculated at checkout
            </p>

            {/* Checkout CTA */}
            <Link
              href={`/checkout${promoApplied ? `?promo=${promoApplied.code}` : ''}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-neutral-900 text-white py-3.5 text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-700 transition-colors"
            >
              Proceed to Checkout <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-[10px] font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
