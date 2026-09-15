'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { processPayment } from '@/lib/processPayment';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Mock data for demo
  const amount = 21000;
  const productName = 'Yirgacheffe Grade 1 Washed (5 MT)';

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    const result = await processPayment({
      amount,
      currency: 'USD',
      method: 'credit_card',
      referenceId: `CTR-${Date.now()}`
    });

    setLoading(false);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Payment failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-neutral-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-brand-lg max-w-md w-full p-8 text-center animate-fadeIn">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-3">Payment Successful!</h2>
          <p className="text-neutral-500 mb-8">
            Your payment of <strong>${amount.toLocaleString()}</strong> has been processed securely. 
            We've sent a receipt to your email.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/settings" className="w-full bg-primary-700 text-white py-3 rounded-full font-bold hover:bg-primary-800 transition-colors">
              View Request Status
            </Link>
            <Link href="/coffees" className="w-full text-primary-600 font-bold hover:underline py-2">
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-8 text-center">Secure Checkout</h1>

        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-8 flex gap-4 items-start shadow-sm">
          <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-orange-800 mb-1">TEST MODE ACTIVE</h3>
            <p className="text-sm text-orange-700">
              This checkout is running in simulation mode. No real charges will be made.
              Clicking the button below will simulate a successful payment transaction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 h-fit">
            <h2 className="font-bold text-neutral-900 mb-5 border-b border-neutral-100 pb-3">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-neutral-900">{productName}</p>
                  <p className="text-sm text-neutral-500">Contract Down Payment (20%)</p>
                </div>
                <p className="font-bold text-neutral-900">${amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="border-t border-neutral-100 pt-4 flex justify-between items-center">
              <span className="font-bold text-neutral-900">Total Due Today</span>
              <span className="text-2xl font-bold text-primary-700">${amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="font-bold text-neutral-900 mb-5 border-b border-neutral-100 pb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary-600" /> Payment Details
            </h2>
            
            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200 mb-5">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8 opacity-50 pointer-events-none">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Cardholder Name</label>
                <input type="text" value="TEST BUYER" readOnly className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm bg-neutral-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Card Number</label>
                <input type="text" value="•••• •••• •••• 4242" readOnly className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm bg-neutral-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Expiry</label>
                  <input type="text" value="12/28" readOnly className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm bg-neutral-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">CVC</label>
                  <input type="text" value="•••" readOnly className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm bg-neutral-50" />
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-primary-700 text-white py-4 rounded-full font-bold text-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-brand"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>Simulate Payment — ${amount.toLocaleString()}</>
              )}
            </button>
            
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure encrypted test transaction</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
