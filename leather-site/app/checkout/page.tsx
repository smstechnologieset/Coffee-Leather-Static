'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { applyPromoCode, LeatherPromo } from '@/lib/leather-data';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  Tag,
  AlertCircle,
  CreditCard,
  Sparkles,
} from 'lucide-react';

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'United Arab Emirates',
  'Saudi Arabia',
  'Japan',
  'Switzerland',
  'Netherlands',
  'Ethiopia',
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPromo = searchParams.get('promo') || '';

  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Promo Code State
  const [promoCode, setPromoCode] = useState(initialPromo);
  const [appliedPromo, setAppliedPromo] = useState<LeatherPromo | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Apply initial promo if present
  useEffect(() => {
    if (initialPromo && subtotal > 0) {
      const res = applyPromoCode(initialPromo, subtotal);
      if (res.valid && res.promo) {
        setAppliedPromo(res.promo);
        setPromoDiscount(res.discount);
        setPromoCode(res.promo.code);
      }
    }
  }, [initialPromo, subtotal]);

  const shippingFee = subtotal >= 200 || subtotal === 0 ? 0 : 25;
  const grandTotal = Math.max(0, subtotal - promoDiscount + shippingFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!email.trim() || !firstName.trim() || !lastName.trim() || !street.trim() || !city.trim() || !postalCode.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            unitPrice: i.price,
            quantity: i.quantity,
            color: i.color,
            size: i.size,
          })),
          customerName: `${firstName.trim()} ${lastName.trim()}`,
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          shippingAddress: {
            street: street.trim(),
            line2: apartment.trim() || undefined,
            city: city.trim(),
            state: stateRegion.trim() || undefined,
            postalCode: postalCode.trim(),
            country: country.trim(),
          },
          promoCode: appliedPromo ? appliedPromo.code : undefined,
          origin: window.location.origin,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to initialize payment.');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received.');
      }
    } catch (err: any) {
      console.error('[checkout] Error:', err);
      setErrorMessage(err?.message || 'Payment initiation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28 text-center">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-4">Your cart is empty</h1>
        <p className="text-sm text-neutral-600 mb-8">
          Browse our collection of genuine Ethiopian leather goods before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium rounded-lg hover:bg-neutral-800 transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Cart
          </Link>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Checkout Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Contact */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                <h2 className="text-lg font-serif font-bold text-neutral-900 mb-4">
                  1. Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email address (for order confirmation and tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah.smith@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Phone Number (for DHL delivery courier)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                <h2 className="text-lg font-serif font-bold text-neutral-900 mb-4">
                  2. Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">First name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Sarah"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Last name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Smith"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="452 Madison Avenue"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Apartment, suite, etc. (Optional)</label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Suite 14B"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      placeholder="NY"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Postal / ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="10022"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Country *</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Secure Payment Notice */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-neutral-800" />
                    <span>3. Payment Method</span>
                  </h2>
                  <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                    Powered by Stripe
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-neutral-700 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900">
                      Credit Card & Digital Wallets via Stripe Checkout
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Encrypted and processed on Stripe's secure infrastructure. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-neutral-900/10 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Pay ${grandTotal.toFixed(2)} USD via Stripe</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Side (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200/80 space-y-6">
              <h2 className="text-lg font-serif font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>

              <div className="space-y-4 divide-y divide-neutral-100">
                {items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-1 right-1 h-5 w-5 bg-neutral-900 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-neutral-900 truncate">{item.name}</h3>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.color} {item.size ? `• ${item.size}` : ''}
                      </p>
                    </div>
                    <div className="text-xs font-mono font-bold text-neutral-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-mono">-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Worldwide Delivery</span>
                  <span className="font-mono font-medium text-neutral-900">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-bold uppercase text-[10px]">Free</span> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-serif font-bold text-neutral-900">Total</span>
                  <span className="font-mono font-bold text-xl text-neutral-900">
                    ${grandTotal.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
                  <span>Dispatched via DHL Express International with tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
                  <span>Full payment encrypted with Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 flex items-center justify-center bg-neutral-50">
          <div className="h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
