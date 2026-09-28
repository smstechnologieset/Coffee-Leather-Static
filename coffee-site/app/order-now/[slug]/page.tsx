'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Package,
  Plane,
  Truck,
  ArrowLeft,
  Lock,
  Sparkles,
  Coffee,
  HelpCircle,
  Clock,
  MapPin,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  OrderNowProduct,
  getOrderNowProduct,
  getOrderNowProducts,
} from '@/lib/order-products-data';
import {
  DirectOrder,
  saveDirectOrder,
  getDirectOrders,
} from '@/lib/direct-orders-data';
import StripeTestModal from '@/components/StripeTestModal';

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'United Arab Emirates',
  'Saudi Arabia',
  'Sweden',
  'Switzerland',
  'Australia',
  'Netherlands',
  'France',
  'Norway',
  'Italy',
  'Belgium',
  'Qatar',
  'Other',
];

export default function OrderNowCheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'onp-special-mixed-1kg';

  const [product, setProduct] = useState<OrderNowProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Order Confirmed State
  const [confirmedOrder, setConfirmedOrder] = useState<DirectOrder | null>(null);

  // 1. Fetch Product
  useEffect(() => {
    const p = getOrderNowProduct(slug);
    if (p) {
      setProduct(p);
    } else {
      // Fallback: try first order-now product
      const all = getOrderNowProducts();
      if (all.length > 0) {
        setProduct(all[0]);
      }
    }
    setLoading(false);
  }, [slug]);

  // 2. Check for redirect from hosted Stripe checkout (?payment_success=true)
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const sessionId = searchParams.get('session_id');

    if (paymentSuccess === 'true' && product) {
      // Retrieve temporary stored customer data if available or create confirmed order
      const existingOrders = getDirectOrders();
      const match = existingOrders.find((o) => o.stripeTransactionId === sessionId);

      if (match) {
        setConfirmedOrder(match);
      } else {
        const orderId = `ord_${Date.now().toString().slice(-8)}`;
        const newOrder = saveDirectOrder({
          productId: product.id,
          productName: product.name,
          quantity: 1,
          packageLabel: `${product.packageWeight} ${product.unit}`,
          unitPrice: product.price,
          totalAmount: product.price,
          customerName: 'Valued Customer',
          customerEmail: 'customer@stripe-checkout.com',
          customerPhone: 'Provided via Stripe Checkout',
          shippingAddress: {
            street: 'Confirmed via Stripe Express Checkout',
            city: 'International Delivery',
            country: 'Worldwide',
            postalCode: 'Standard',
          },
          status: 'Paid / Processing',
          paymentStatus: 'paid',
          stripeTransactionId: sessionId || `ch_stripe_${Date.now()}`,
        });
        setConfirmedOrder(newOrder);
      }
    }
  }, [searchParams, product]);

  const unitPrice = product?.price || 28;
  const subtotal = unitPrice * quantity;
  const shippingFee = 0; // Free express international shipping promotion
  const totalAmount = subtotal + shippingFee;

  const validateForm = () => {
    if (!customerName.trim()) return 'Please enter your full name.';
    if (!customerEmail.trim() || !customerEmail.includes('@'))
      return 'Please enter a valid email address for delivery updates.';
    if (!customerPhone.trim()) return 'Please enter a telephone or WhatsApp number for delivery couriers.';
    if (!streetAddress.trim()) return 'Please enter your delivery street address.';
    if (!city.trim()) return 'Please enter your delivery city.';
    if (!postalCode.trim()) return 'Please enter your postal / zip code.';
    if (!country.trim()) return 'Please select your delivery country.';
    return '';
  };

  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const err = validateForm();
    if (err) {
      setFormError(err);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = ({
    transactionId,
  }: {
    transactionId: string;
    last4: string;
  }) => {
    setShowPaymentModal(false);
    if (!product) return;

    const newOrder = saveDirectOrder({
      productId: product.id,
      productName: product.name,
      quantity,
      packageLabel: `${product.packageWeight} ${product.unit}`,
      unitPrice: product.price,
      totalAmount,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: {
        street: streetAddress,
        city,
        state: stateRegion,
        country,
        postalCode,
      },
      deliveryNotes: deliveryNotes || undefined,
      status: 'Paid / Processing',
      paymentStatus: 'paid',
      stripeTransactionId: transactionId,
    });

    setConfirmedOrder(newOrder);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-500 font-medium text-sm">Loading packaged coffee checkout...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 pb-16 bg-neutral-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-md text-center">
          <Package className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Product Not Found</h2>
          <p className="text-neutral-600 text-sm mb-6">
            The packaged coffee product you requested could not be located.
          </p>
          <Link
            href="/coffees"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-800 text-white font-medium rounded-xl text-sm hover:bg-primary-900 transition"
          >
            Browse Coffee Catalog
          </Link>
        </div>
      </div>
    );
  }

  // ── SUCCESS CONFIRMATION RECEIPT ──
  if (confirmedOrder) {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-8 text-white text-center">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-200 bg-emerald-950/40 px-3 py-1 rounded-full">
                Order Confirmed & Paid
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mt-3">
                Thank You for Your Order!
              </h1>
              <p className="text-emerald-100 text-sm mt-1 max-w-lg mx-auto">
                Your authentic Ethiopian coffee order has been recorded. We are preparing your fresh
                roast for dispatch.
              </p>
            </div>

            {/* Receipt Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block">Order Reference</span>
                  <span className="font-mono font-bold text-lg text-neutral-900">{confirmedOrder.id}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block">Payment Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Paid 100% via Stripe
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block">Stripe Tx ID</span>
                  <span className="font-mono text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                    {confirmedOrder.stripeTransactionId}
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Purchased Item
                </h3>
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-neutral-900 text-base">{product.name}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{product.packageWeight} {product.unit}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-600">
                      <span>Qty: <strong className="text-neutral-900">{confirmedOrder.quantity}</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-lg text-neutral-900">
                      ${confirmedOrder.totalAmount.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-neutral-400 block">USD Total</span>
                  </div>
                </div>
              </div>

              {/* Delivery Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80">
                  <div className="flex items-center gap-2 mb-2 text-primary-800 font-semibold text-xs uppercase tracking-wider">
                    <MapPin className="h-4 w-4" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="font-bold text-neutral-900 text-sm">{confirmedOrder.customerName}</p>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {confirmedOrder.shippingAddress.street}
                    <br />
                    {confirmedOrder.shippingAddress.city}
                    {confirmedOrder.shippingAddress.state ? `, ${confirmedOrder.shippingAddress.state}` : ''}{' '}
                    {confirmedOrder.shippingAddress.postalCode}
                    <br />
                    <strong className="text-neutral-800">{confirmedOrder.shippingAddress.country}</strong>
                  </p>
                  <p className="text-xs text-neutral-500 mt-2 font-mono">{confirmedOrder.customerPhone}</p>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80">
                  <div className="flex items-center gap-2 mb-2 text-primary-800 font-semibold text-xs uppercase tracking-wider">
                    <Truck className="h-4 w-4" />
                    <span>Courier & Dispatch</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-neutral-600">
                    <p className="flex items-center justify-between">
                      <span>Dispatch Hub:</span>
                      <strong className="text-neutral-800">Addis Ababa, Ethiopia</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Express Carrier:</span>
                      <strong className="text-neutral-800">DHL Express Worldwide</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Estimated Transit:</span>
                      <strong className="text-emerald-700">3 - 6 Business Days</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Email Updates:</span>
                      <strong className="text-neutral-800">{confirmedOrder.customerEmail}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/coffees"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-900 text-white font-semibold py-3 px-6 rounded-xl text-sm transition"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Explore More Coffees</span>
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-3 px-6 rounded-xl text-sm transition"
                >
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── MAIN ORDER NOW CHECKOUT INTERFACE ──
  return (
    <main className="min-h-screen pt-20 pb-20 bg-neutral-50">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-neutral-200 py-3.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/coffees"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-primary-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Coffee Catalog</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="h-4 w-4" /> 100% Authentic Ethiopian Roast
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-primary-700 font-medium">
              <Plane className="h-3.5 w-3.5" /> Worldwide Express Delivery
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-200 rounded-full text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            Direct Consumer Express Order
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
            Order {product.name}
          </h1>
          <p className="text-neutral-600 text-sm mt-1 max-w-2xl">
            {product.tagline}. Order directly from Ethiopia and pay securely with Stripe. No wholesale contract or commercial registration required.
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-800 flex items-center justify-between animate-fadeIn">
            <span>{formError}</span>
            <button
              onClick={() => setFormError('')}
              className="text-red-500 hover:text-red-700 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Checkout Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleOpenPayment} className="space-y-6">
              {/* Product Specifications Card */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h2 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-amber-700" />
                    <span>1. Package Quantity</span>
                  </h2>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                    Fresh Roast In-Stock
                  </span>
                </div>

                {/* Quantity */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Package Quantity
                    </label>
                    <span className="text-xs text-neutral-500 font-medium">
                      Each package: <strong className="text-neutral-800">{product.packageWeight} {product.unit}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3.5 py-2 hover:bg-neutral-200 font-bold text-neutral-700 transition"
                      >
                        -
                      </button>
                      <span className="px-5 py-2 font-mono font-bold text-base text-neutral-900 bg-white border-x border-neutral-300">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3.5 py-2 hover:bg-neutral-200 font-bold text-neutral-700 transition"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-neutral-500">
                      Total coffee weight: <strong className="text-neutral-900">{product.packageWeight * quantity} {product.unit}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Details Card */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
                  <h2 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-amber-700" />
                    <span>2. Delivery & Contact Details</span>
                  </h2>
                  <span className="text-xs text-neutral-400 font-normal">Living Abroad / Global Shipping</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Michael Berhanu"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address (for order tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="michael@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Mobile / WhatsApp (for courier) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (202) 555-0143"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1420 K Street NW, Apartment 4B"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Washington"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      State / Province / Region
                    </label>
                    <input
                      type="text"
                      placeholder="DC"
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Postal / ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="20005"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Delivery Instructions / Gate Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leave with concierge or call upon arrival"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 rounded text-primary-700 focus:ring-primary-600"
                    />
                    <span className="text-xs text-neutral-600 leading-relaxed">
                      I understand this order will be freshly packed in Addis Ababa and dispatched directly to my international address with express courier tracking.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!agreeTerms}
                className="w-full bg-gradient-to-r from-amber-700 via-amber-800 to-primary-900 hover:from-amber-800 hover:to-primary-950 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-amber-900/20 transition flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Lock className="h-5 w-5" />
                <span>Pay & Order Now — ${totalAmount.toFixed(2)} USD</span>
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary & Product Overview (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Product Feature Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm">
              <div className="relative h-56 w-full bg-neutral-900">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-500 text-neutral-950 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wide">
                    {product.packageWeight} {product.unit}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs text-amber-300 font-medium">{product.origin}</span>
                  <h3 className="font-serif font-bold text-2xl leading-tight">{product.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Flavor Notes */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block mb-1.5">
                    Flavor Notes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.flavorNotes.map((note) => (
                      <span
                        key={note}
                        className="text-xs bg-amber-50 text-amber-900 font-medium px-2.5 py-0.5 rounded-full border border-amber-200/80"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Order Cost Breakdown */}
                <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>
                      {product.name} ({quantity}x {product.packageWeight} {product.unit})
                    </span>
                    <span className="font-mono font-medium text-neutral-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span className="flex items-center gap-1">
                      <span>Express International Delivery</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        PROMO
                      </span>
                    </span>
                    <span className="font-medium text-emerald-700">Free</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Packaging & Multi-layer Aroma Seal</span>
                    <span className="font-medium text-neutral-700">Included</span>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-sm text-neutral-900 block">Total Due</span>
                      <span className="text-[10px] text-neutral-400">100% Full Payment via Stripe</span>
                    </div>
                    <span className="text-2xl font-serif font-bold text-neutral-900 font-mono">
                      ${totalAmount.toFixed(2)} <span className="text-xs text-neutral-400">USD</span>
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Stripe 256-bit Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-primary-600 shrink-0" />
                    <span>DHL Door-to-Door</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coffee className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Roasted in Addis Ababa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-neutral-600 shrink-0" />
                    <span>Dispatched in 48h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      <StripeTestModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={totalAmount}
        title={`${product.name} (${quantity}x)`}
        subtitle={`100% Full Payment for ${quantity}x ${product.packageWeight} ${product.unit} • Deliver to ${city}, ${country}`}
        companyName={customerName || 'Direct Retail Buyer'}
        productId={product.id}
        type="direct_order"
        customerEmail={customerEmail}
        deliveryAddress={`${streetAddress}, ${city}, ${stateRegion ? stateRegion + ' ' : ''}${postalCode}, ${country}`}
        notes={`Qty: ${quantity} | Phone: ${customerPhone}`}
      />
    </main>
  );
}
