'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, AlertCircle, X, ShieldCheck, Zap, ExternalLink } from 'lucide-react';

interface StripeTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentResult: { transactionId: string; last4: string }) => void;
  amount: number;
  title: string;
  subtitle: string;
  companyName: string;
  productId?: string;
  type?: 'sample' | 'contract' | 'direct_order';
  customerEmail?: string;
  deliveryAddress?: string;
  sampleSize?: string;
  quantityQuintals?: number;
  notes?: string;
}

export default function StripeTestModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  title,
  subtitle,
  companyName,
  productId,
  type = 'sample',
  customerEmail,
  deliveryAddress,
  sampleSize,
  quantityQuintals,
  notes,
}: StripeTestModalProps) {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('424');
  const [zip, setZip] = useState('90210');
  const [processing, setProcessing] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('424');
    setZip('10001');
    setError('');
  };

  // Instant in-modal test payment (completes immediately without requiring second form on Stripe)
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCard = cardNumber.replace(/\D/g, '');
    if (cleanCard.length < 16) {
      setError('Please provide a 16-digit test card number (e.g. 4242 4242 4242 4242).');
      return;
    }

    setProcessing(true);

    try {
      // Simulate real Stripe test-charge processing latency
      await new Promise((r) => setTimeout(r, 1100));

      const txId = `ch_test_${Math.random().toString(36).substring(2, 10)}${Date.now().toString().slice(-4)}`;
      setCompleted(true);
      await new Promise((r) => setTimeout(r, 700));

      onSuccess({
        transactionId: txId,
        last4: cleanCard.slice(-4) || '4242',
      });
    } catch (err: any) {
      setError(err?.message || 'Payment test processing failed.');
      setProcessing(false);
    }
  };

  // Optional: Redirect to official Stripe Hosted Checkout sandbox
  const handleHostedStripe = async () => {
    setError('');
    setRedirecting(true);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          productName: title,
          companyName,
          type,
          productId,
          sampleSize,
          quantityQuintals,
          customerEmail,
          deliveryAddress,
          notes,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(data.error || 'Failed to initiate Stripe checkout');
    } catch (err: any) {
      setError(err?.message || 'Could not connect to Stripe hosted checkout.');
      setRedirecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-neutral-100 flex flex-col">
        {/* Stripe Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-primary-900 p-6 text-white relative">
          <button
            onClick={onClose}
            disabled={processing || redirecting}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
              stripe
            </span>
            <span className="bg-amber-400 text-neutral-900 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider">
              Test Mode
            </span>
          </div>

          <p className="text-xs text-indigo-200">Pay to <strong className="text-white font-semibold">KIJIJ Coffee Trading</strong></p>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-sm font-medium text-white/80">{title}</span>
            <span className="text-3xl font-bold text-white font-mono">${amount.toFixed(2)}</span>
          </div>
          <p className="text-xs text-indigo-200/80 mt-1">{subtitle}</p>
        </div>

        {/* Card Form */}
        <div className="p-6 space-y-5">
          {/* Test Card Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <Zap className="h-4 w-4 text-amber-600 shrink-0 mt-0.5 fill-amber-500" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">Stripe Sandbox (Test Mode)</p>
              <p className="text-amber-800 leading-relaxed">
                Real cards are declined in test mode. Use test card{' '}
                <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold text-amber-950">
                  4242 4242 4242 4242
                </code>
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-600">
                  Card Information
                </label>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Autofill 4242
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  required
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600 transition pl-10"
                />
                <CreditCard className="h-4 w-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  TEST
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Expires
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  required
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="CVC"
                  required
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  ZIP / Postal
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="ZIP"
                  required
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={processing || redirecting || completed}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-60"
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-white" />
                    <span>Payment Confirmed!</span>
                  </>
                ) : processing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Test Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Pay ${amount.toFixed(2)} (Instant Test Approval)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleHostedStripe}
                disabled={processing || redirecting || completed}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {redirecting ? (
                  <>
                    <div className="h-3 w-3 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin" />
                    <span>Opening Stripe Checkout...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Or Test on Official Stripe Hosted Page</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
            <span>Encrypted Stripe Test Sandbox. No real card will be charged.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
