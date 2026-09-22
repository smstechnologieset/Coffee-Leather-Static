'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = total > 250 ? 0 : 25;
  const grandTotal = total + shipping;

  const handleMockCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-4">Order Confirmed!</h1>
        <p className="text-neutral-500 mb-8">
          Thank you for your purchase. We've received your order and will email you tracking information once it ships.
        </p>
        <Link href="/" className="inline-block bg-accent-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-800 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-4">Your cart is empty</h1>
        <Link href="/products" className="text-accent-700 font-medium hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-24">
      {/* Test Mode Banner */}
      <div className="bg-orange-100 text-orange-800 px-4 py-3 text-sm text-center font-medium flex items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4" /> 
        This is a demo environment. No real payments will be processed.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Form Side */}
          <div className="lg:col-span-7">
            <form onSubmit={handleMockCheckout} className="space-y-8">
              {/* Contact */}
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-xl font-serif font-bold text-neutral-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email address</label>
                    <input type="email" required className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2.5 px-3 border" defaultValue="customer@example.com" />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-xl font-serif font-bold text-neutral-900 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">First name</label>
                    <input type="text" required className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2.5 px-3 border" defaultValue="John" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Last name</label>
                    <input type="text" required className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2.5 px-3 border" defaultValue="Doe" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Address</label>
                    <input type="text" required className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2.5 px-3 border" defaultValue="123 Leather Lane" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                    <input type="text" required className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2.5 px-3 border" defaultValue="New York" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Postal code</label>
                    <input type="text" required className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2.5 px-3 border" defaultValue="10001" />
                  </div>
                </div>
              </div>

              {/* Payment (Mock) */}
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-xl font-serif font-bold text-neutral-900 mb-6">Payment</h2>
                <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <input type="radio" checked readOnly className="text-accent-600 focus:ring-accent-500" />
                    <span className="text-sm font-medium text-neutral-900">Credit Card (Test Mode)</span>
                  </div>
                  <div className="space-y-4 pl-6">
                    <div>
                      <input type="text" placeholder="Card number (any numbers work)" required className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2.5 px-3 border" defaultValue="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM / YY" required className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2.5 px-3 border" defaultValue="12/25" />
                      <input type="text" placeholder="CVC" required className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2.5 px-3 border" defaultValue="123" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-accent-700 text-white font-bold py-4 px-8 rounded-lg shadow hover:bg-accent-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing Payment...' : `Pay $${grandTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary Side */}
          <div className="mt-10 lg:mt-0 lg:col-span-5 sticky top-28">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutral-200">
              <h2 className="text-xl font-serif font-bold text-neutral-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      <div className="absolute -top-2 -right-2 h-5 w-5 bg-neutral-500 text-white rounded-full text-xs flex items-center justify-center font-medium">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-neutral-500 mt-1 uppercase">{item.color} {item.size ? `/ ${item.size}` : ''}</p>
                    </div>
                    <div className="text-sm font-medium text-neutral-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span className="text-neutral-900 font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 mt-4 pt-4 flex justify-between items-end">
                <span className="text-base font-bold text-neutral-900">Total</span>
                <span className="text-2xl font-bold text-neutral-900">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
