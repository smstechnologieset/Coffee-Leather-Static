'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Truck,
  MapPin,
  Building2,
  AlertTriangle,
  Lock,
  ArrowRight,
  PlusCircle,
  CreditCard,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { SampleTier, DEFAULT_SAMPLE_TIERS, getStoredProduct } from '@/lib/products-data';
import StripeTestModal from '@/components/StripeTestModal';
import { saveUserRequest } from '@/lib/requests-data';

// Static coffee fallback data with Quintal/kg pricing and sample tiers in grams/kg
const COFFEES: Record<string, any> = {
  '1': {
    name: 'Yirgacheffe Grade 1 Washed',
    region: 'Yirgacheffe',
    process: 'Washed',
    grade: 'Grade 1',
    price: '$420/Quintal ($4.20/kg)',
    minOrder: '10 Quintals (1,000 kg)',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    sampleTiers: [
      { id: '1', size: '250g', price: 0, isFree: true },
      { id: '2', size: '500g', price: 0, isFree: true },
      { id: '3', size: '1kg', price: 15, isFree: false },
      { id: '4', size: '2kg', price: 25, isFree: false },
    ],
  },
  '2': {
    name: 'Sidamo Natural G1',
    region: 'Sidamo',
    process: 'Natural',
    grade: 'Grade 1',
    price: '$380/Quintal ($3.80/kg)',
    minOrder: '10 Quintals (1,000 kg)',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    sampleTiers: [
      { id: '1', size: '250g', price: 0, isFree: true },
      { id: '2', size: '500g', price: 0, isFree: true },
      { id: '3', size: '1kg', price: 12, isFree: false },
    ],
  },
  '3': {
    name: 'Harar Longberry Natural',
    region: 'Harar',
    process: 'Natural',
    grade: 'Grade 1',
    price: '$460/Quintal ($4.60/kg)',
    minOrder: '5 Quintals (500 kg)',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    sampleTiers: [
      { id: '1', size: '250g', price: 0, isFree: true },
      { id: '2', size: '500g', price: 10, isFree: false },
      { id: '3', size: '1kg', price: 18, isFree: false },
    ],
  },
  '4': {
    name: 'Limu Washed G2',
    region: 'Limu',
    process: 'Washed',
    grade: 'Grade 2',
    price: '$340/Quintal ($3.40/kg)',
    minOrder: '10 Quintals (1,000 kg)',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
    sampleTiers: [
      { id: '1', size: '250g', price: 0, isFree: true },
      { id: '2', size: '500g', price: 0, isFree: true },
      { id: '3', size: '1kg', price: 12, isFree: false },
    ],
  },
  '5': {
    name: 'Guji Zone Natural G1',
    region: 'Guji',
    process: 'Natural',
    grade: 'Grade 1',
    price: '$490/Quintal ($4.90/kg)',
    minOrder: '10 Quintals (1,000 kg)',
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=80',
    sampleTiers: [
      { id: '1', size: '250g', price: 0, isFree: true },
      { id: '2', size: '500g', price: 0, isFree: true },
      { id: '3', size: '1kg', price: 18, isFree: false },
      { id: '4', size: '2kg', price: 30, isFree: false },
    ],
  },
  '6': {
    name: 'Jimma Honey Process',
    region: 'Jimma',
    process: 'Honey',
    grade: 'Grade 2',
    price: '$410/Quintal ($4.10/kg)',
    minOrder: '5 Quintals (500 kg)',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    sampleTiers: [
      { id: '1', size: '250g', price: 0, isFree: true },
      { id: '2', size: '500g', price: 0, isFree: true },
      { id: '3', size: '1kg', price: 15, isFree: false },
    ],
  },
};

export default function RequestSamplePage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.slug as string;

  const [coffee, setCoffee] = useState<any>(() => getStoredProduct(productId) || COFFEES[productId] || null);

  useEffect(() => {
    const loaded = getStoredProduct(productId) || COFFEES[productId] || null;
    if (loaded) {
      setCoffee(loaded);
      if (loaded.sampleTiers && loaded.sampleTiers.length > 0) {
        setSelectedTier(loaded.sampleTiers[0]);
        setFormData((prev) => ({ ...prev, sampleSize: loaded.sampleTiers[0].size }));
      }
    }
  }, [productId]);

  const sampleTiers: SampleTier[] = coffee?.sampleTiers || DEFAULT_SAMPLE_TIERS;
  const [selectedTier, setSelectedTier] = useState<SampleTier>(sampleTiers[0]);

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [savedCompanies, setSavedCompanies] = useState<any[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    sampleSize: sampleTiers[0]?.size || '250g',
    deliveryMethod: 'DHL',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ transactionId: string; last4: string } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUser = async () => {
      setAuthLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        const metadata = session.user.user_metadata || {};
        const companies: any[] = metadata.companies || [];
        const addresses: any[] = metadata.addresses || [];

        setSavedCompanies(companies);
        setSavedAddresses(addresses);

        const initialEmail = session.user.email || '';
        const initialContact = metadata.full_name || '';

        // Default to first company if available
        let initialCompanyId = '';
        let initialCompanyName = '';
        let initialCountry = '';

        if (companies.length > 0) {
          initialCompanyId = companies[0].id;
          initialCompanyName = companies[0].name;
          initialCountry = companies[0].country;
        }

        // Default to first address if available
        let initialAddressId = '';
        let initialAddressLabel = '';
        let initialCity = '';

        if (addresses.length > 0) {
          initialAddressId = addresses[0].id;
          initialAddressLabel = addresses[0].label;
          initialCity = addresses[0].city;
          if (!initialCountry) {
            initialCountry = addresses[0].country;
          }
        }

        setSelectedCompanyId(initialCompanyId);
        setSelectedAddressId(initialAddressId);

        setFormData((prev) => ({
          ...prev,
          email: initialEmail,
          contactName: initialContact,
          companyName: initialCompanyName,
          country: initialCountry,
          address: initialAddressLabel,
          city: initialCity,
        }));
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    };

    fetchUser();
  }, []);

  // Handle return redirect from official Stripe Hosted Checkout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('payment_success') === 'true') {
        const sid = sp.get('session_id') || `cs_test_${Date.now()}`;
        setPaymentResult({
          transactionId: sid,
          last4: '4242',
        });
        setShowSuccess(true);

        try {
          const raw = sessionStorage.getItem('pending_sample_request');
          if (raw) {
            const parsed = JSON.parse(raw);
            saveUserRequest({
              ...parsed,
              status: 'Paid / Processing',
              paymentStatus: 'paid',
              stripeTransactionId: sid,
            });
            sessionStorage.removeItem('pending_sample_request');
          }
        } catch (e) {}
      }
    }
  }, []);

  const handleCompanySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCompanyId(id);
    if (id) {
      const comp = savedCompanies.find((c) => c.id === id);
      if (comp) {
        setFormData((prev) => ({
          ...prev,
          companyName: comp.name,
          country: comp.country || prev.country,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, companyName: '' }));
    }
  };

  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    if (id) {
      const addr = savedAddresses.find((a) => a.id === id);
      if (addr) {
        setFormData((prev) => ({
          ...prev,
          address: addr.label,
          city: addr.city,
          country: addr.country || prev.country,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, address: '', city: '' }));
    }
  };

  if (!coffee) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-neutral-900 mb-3">Product Not Found</h2>
          <Link href="/coffees" className="text-primary-600 hover:underline">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const hasCompanies = savedCompanies.length > 0;
  const hasAddresses = savedAddresses.length > 0;
  const isProfileComplete = hasCompanies && hasAddresses;

  const selectedCompany = savedCompanies.find((c) => c.id === selectedCompanyId);
  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

  const handleStripeSuccess = (result: { transactionId: string; last4: string }) => {
    setPaymentResult(result);
    setShowStripeModal(false);
    executeSubmission(result.transactionId);
  };

  const executeSubmission = async (stripeTxId: string | null) => {
    setSubmitting(true);
    setError('');

    try {
      const sampleRecord = {
        id: `sr_${Date.now()}`,
        type: 'sample' as const,
        productId,
        productName: coffee.name,
        companyName: formData.companyName,
        contactName: formData.contactName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        sampleSize: selectedTier.size,
        samplePrice: selectedTier.price,
        isFree: selectedTier.isFree || selectedTier.price === 0,
        deliveryMethod: formData.deliveryMethod,
        notes: formData.notes,
        status: stripeTxId ? 'Paid / Processing' : (selectedTier.isFree ? 'Complimentary Approved' : 'New'),
        paymentStatus: stripeTxId ? 'paid' : (selectedTier.isFree ? 'complimentary' : 'pending'),
        stripeTransactionId: stripeTxId || null,
        createdAt: new Date().toISOString(),
      };

      saveUserRequest(sampleRecord);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_sample_request', JSON.stringify(sampleRecord));
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const existingRequests = session.user.user_metadata?.sample_requests || [];
        await supabase.auth.updateUser({
          data: {
            sample_requests: [sampleRecord, ...existingRequests],
          },
        });
      }

      setShowSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit sample request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please sign in to submit a sample request.');
      return;
    }

    if (!isProfileComplete) {
      setError(
        'You must register at least one company and one delivery address in your profile before requesting samples.'
      );
      return;
    }

    if (!selectedCompanyId || !selectedAddressId) {
      setError('Please select both a registered company and a delivery address.');
      return;
    }

    if (!formData.email) {
      setError('Please provide a valid contact email.');
      return;
    }

    // If sample tier has a price and has not been paid via Stripe yet, open Stripe Test Modal!
    if (selectedTier.price > 0 && !paymentResult) {
      setShowStripeModal(true);
      return;
    }

    await executeSubmission(paymentResult?.transactionId || null);
  };

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <main className="min-h-screen bg-neutral-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-400 mb-6 flex items-center gap-2">
            <Link href="/coffees" className="hover:text-primary-600 transition-colors">
              Coffees
            </Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium">Request Sample</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-1">
            Request a Sample
          </h1>
          <p className="text-neutral-500 mb-10">
            Submit your sample request for <strong>{coffee.name}</strong>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left — Product card */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 h-fit space-y-5">
              <h2 className="text-xl font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                Selected Coffee
              </h2>
              <div className="relative h-48 rounded-xl overflow-hidden">
                <Image
                  src={coffee.image}
                  alt={coffee.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="480px"
                />
              </div>
              <div className="space-y-2">
                {[
                  ['Product', coffee.name],
                  ['Region', coffee.region],
                  ['Process', coffee.process],
                  ['Grade', coffee.grade],
                  ['Price', coffee.price],
                  ['Min. Order', coffee.minOrder],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-neutral-50">
                    <span className="text-sm text-neutral-500">{label}</span>
                    <span className="text-sm font-semibold text-neutral-800">{value}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-primary-50/60 border border-primary-100 text-xs text-primary-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary-700" />
                  Q-Graded & Lab Tested
                </p>
                <p className="text-primary-800/80">
                  Green coffee samples are hermetically sealed and dispatched via express courier with full lot sensory profiles.
                </p>
              </div>
            </div>

            {/* Right — Form or Requirement Gate */}
            <div className="space-y-6">
              {authLoading ? (
                <div className="bg-white rounded-2xl border border-neutral-100 p-10 text-center shadow-sm">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500">Checking buyer account status...</p>
                </div>
              ) : !user ? (
                /* Gate 1: Not logged in */
                <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm space-y-5">
                  <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl flex items-center justify-center">
                    <Lock className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-neutral-900">
                      Sign In Required
                    </h2>
                    <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                      To request green coffee samples, you must be signed in to your registered buyer account with a registered company and shipping address.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/login?redirect=/coffees/${productId}/request-sample`}
                      className="inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors"
                    >
                      Sign In / Register Account
                    </Link>
                    <Link
                      href="/coffees"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      Back to Catalog
                    </Link>
                  </div>
                </div>
              ) : !isProfileComplete ? (
                /* Gate 2: Logged in, but missing at least 1 company or 1 address */
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-neutral-900">
                        Profile Registration Required
                      </h2>
                      <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                        To request coffee samples, your profile must have at least{' '}
                        <strong>one registered company</strong> and{' '}
                        <strong>one registered shipping address</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Checklist status */}
                  <div className="space-y-3 pt-2">
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        hasCompanies
                          ? 'bg-green-50/50 border-green-200 text-green-900'
                          : 'bg-amber-50/50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Building2
                          className={`h-5 w-5 ${
                            hasCompanies ? 'text-green-700' : 'text-amber-700'
                          }`}
                        />
                        <div>
                          <p className="text-sm font-bold">Company Profile</p>
                          <p className="text-xs opacity-75">
                            {hasCompanies
                              ? `${savedCompanies.length} company registered`
                              : 'Missing (at least 1 required)'}
                          </p>
                        </div>
                      </div>
                      {hasCompanies ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Link
                          href="/settings?tab=companies"
                          className="text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Add Company +
                        </Link>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        hasAddresses
                          ? 'bg-green-50/50 border-green-200 text-green-900'
                          : 'bg-amber-50/50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin
                          className={`h-5 w-5 ${
                            hasAddresses ? 'text-green-700' : 'text-amber-700'
                          }`}
                        />
                        <div>
                          <p className="text-sm font-bold">Shipping Address</p>
                          <p className="text-xs opacity-75">
                            {hasAddresses
                              ? `${savedAddresses.length} address registered`
                              : 'Missing (at least 1 required)'}
                          </p>
                        </div>
                      </div>
                      {hasAddresses ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Link
                          href="/settings?tab=addresses"
                          className="text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Add Address +
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      href={!hasCompanies ? '/settings?tab=companies' : '/settings?tab=addresses'}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors"
                    >
                      Complete Registration in Settings
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Eligible: User is logged in and has company + address registered */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  {/* 1. Choose Company Dropdown from Profile */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="company-select"
                        className="block text-sm font-bold text-neutral-900"
                      >
                        Company Profile <span className="text-amber-600">*</span>
                      </label>
                      <Link
                        href="/settings?tab=companies"
                        className="text-xs text-primary-600 hover:text-primary-800 font-semibold inline-flex items-center gap-1"
                      >
                        <PlusCircle className="h-3.5 w-3.5" /> Manage Companies
                      </Link>
                    </div>

                    <select
                      id="company-select"
                      value={selectedCompanyId}
                      onChange={handleCompanySelect}
                      required
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 bg-neutral-50/70 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                    >
                      <option value="">-- Choose a Registered Company --</option>
                      {savedCompanies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.country}){c.vat ? ` • VAT: ${c.vat}` : ''}
                        </option>
                      ))}
                    </select>

                    {selectedCompany && (
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-600 space-y-1">
                        <p>
                          <strong className="text-neutral-900">Registered Name:</strong>{' '}
                          {selectedCompany.name}
                        </p>
                        <p>
                          <strong className="text-neutral-900">Country:</strong>{' '}
                          {selectedCompany.country}
                        </p>
                        <p>
                          <strong className="text-neutral-900">VAT Number:</strong>{' '}
                          {selectedCompany.vat || 'None registered (Optional)'}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          value={formData.contactName}
                          onChange={(e) => update('contactName', e.target.value)}
                          className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => update('email', e.target.value)}
                          className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Choose Shipping Address Dropdown from Profile */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="address-select"
                        className="block text-sm font-bold text-neutral-900 flex items-center gap-1.5"
                      >
                        <MapPin className="h-4 w-4 text-primary-600" />
                        Delivery Address <span className="text-amber-600">*</span>
                      </label>
                      <Link
                        href="/settings?tab=addresses"
                        className="text-xs text-primary-600 hover:text-primary-800 font-semibold inline-flex items-center gap-1"
                      >
                        <PlusCircle className="h-3.5 w-3.5" /> Manage Addresses
                      </Link>
                    </div>

                    <select
                      id="address-select"
                      value={selectedAddressId}
                      onChange={handleAddressSelect}
                      required
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 bg-neutral-50/70 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                    >
                      <option value="">-- Choose a Registered Address --</option>
                      {savedAddresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label} — {a.city}, {a.country}
                        </option>
                      ))}
                    </select>

                    {selectedAddress && (
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-600 space-y-1">
                        <p>
                          <strong className="text-neutral-900">Address:</strong>{' '}
                          {selectedAddress.label}
                        </p>
                        <p>
                          <strong className="text-neutral-900">Destination:</strong>{' '}
                          {selectedAddress.city}, {selectedAddress.country}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sample size & Pricing */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-neutral-900 text-sm">Sample Size & Offering</h3>
                      <span className="text-xs text-neutral-400">Available in grams & kg</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {sampleTiers.map((tier) => {
                        const isSelected = selectedTier.size === tier.size;
                        return (
                          <button
                            key={tier.size}
                            type="button"
                            onClick={() => {
                              setSelectedTier(tier);
                              update('sampleSize', tier.size);
                              setPaymentResult(null); // reset prior payment if size changed
                            }}
                            className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'border-primary-600 bg-primary-50/80 shadow-sm'
                                : 'border-neutral-200 hover:border-primary-300 bg-white'
                            }`}
                          >
                            <span className={`text-sm font-bold ${isSelected ? 'text-primary-900' : 'text-neutral-800'}`}>
                              {tier.size}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                tier.isFree || tier.price === 0
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {tier.isFree || tier.price === 0 ? 'FREE' : `$${tier.price.toFixed(2)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery method */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                    <h3 className="font-bold text-neutral-900 mb-3 text-sm flex items-center gap-2">
                      <Truck className="h-4 w-4 text-primary-600" /> Delivery Method
                    </h3>
                    <div className="space-y-2">
                      {[
                        {
                          id: 'DHL',
                          label: 'DHL Express',
                          sub: 'International courier, 3–7 business days direct to your roastery',
                        },
                        {
                          id: 'Drop Location',
                          label: 'Addis Ababa Warehouse Pickup',
                          sub: 'Pick up directly from our Addis Ababa export hub',
                        },
                        {
                          id: 'Freight',
                          label: 'Consolidated Sea Freight Sample',
                          sub: 'Shipped alongside scheduled container cargo',
                        },
                      ].map(({ id, label, sub }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => update('deliveryMethod', id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                            formData.deliveryMethod === id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-neutral-100 hover:border-primary-300'
                          }`}
                        >
                          <Truck
                            className={`h-5 w-5 ${
                              formData.deliveryMethod === id
                                ? 'text-primary-600'
                                : 'text-neutral-400'
                            }`}
                          />
                          <div>
                            <p
                              className={`text-sm font-bold ${
                                formData.deliveryMethod === id
                                  ? 'text-primary-700'
                                  : 'text-neutral-800'
                              }`}
                            >
                              {label}
                            </p>
                            <p className="text-xs text-neutral-400">{sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                    <h3 className="font-bold text-neutral-900 mb-2 text-sm">Additional Notes</h3>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => update('notes', e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      placeholder="Roast profile goals, specific moisture target, or courier account numbers..."
                    />
                  </div>

                  {/* Live Order & Fee Breakdown */}
                  <div className="bg-neutral-900 text-white rounded-2xl p-5 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div>
                        <p className="text-xs text-neutral-400">Selected Product & Size</p>
                        <p className="text-sm font-bold text-white">{coffee.name} ({selectedTier.size})</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-400">Sample Evaluation Fee</p>
                        <p className="text-base font-mono font-bold text-amber-300">
                          {selectedTier.isFree || selectedTier.price === 0
                            ? 'Free ($0.00)'
                            : `$${selectedTier.price.toFixed(2)} USD`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-300">
                      <span>Delivery Method: {formData.deliveryMethod}</span>
                      <span className="text-neutral-400">Courier Shipping Account / Standard</span>
                    </div>

                    {paymentResult && (
                      <div className="bg-emerald-950/80 border border-emerald-500/50 p-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          Stripe Test Payment Confirmed
                        </span>
                        <span className="font-mono text-[11px] text-emerald-400/90">{paymentResult.transactionId}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Stripe Test Mode Integrated</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-neutral-400 mr-2">Total Due:</span>
                        <span className="text-lg font-mono font-extrabold text-white">
                          {selectedTier.isFree || selectedTier.price === 0
                            ? '$0.00 (Free)'
                            : `$${selectedTier.price.toFixed(2)} USD`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary-700 text-white py-4 rounded-full font-bold text-base hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      'Processing Request...'
                    ) : selectedTier.price > 0 && !paymentResult ? (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>Proceed to Stripe Test Payment (${selectedTier.price.toFixed(2)})</span>
                      </>
                    ) : (
                      <span>Submit Sample Request {selectedTier.isFree ? '(Complimentary)' : ''}</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-fadeIn">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
              Sample Request Sent!
            </h3>
            <p className="text-neutral-500 text-sm mb-4 leading-relaxed">
              We&apos;ve received your sample request for <strong>{coffee.name} ({selectedTier.size})</strong> from company{' '}
              <strong>{formData.companyName}</strong>.
            </p>
            {paymentResult && (
              <div className="mb-5 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 text-left space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-indigo-800">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  Stripe Payment Receipt
                </p>
                <p className="text-[11px] text-neutral-600">Amount: <strong>${selectedTier.price.toFixed(2)} USD</strong> (Test Mode)</p>
                <p className="text-[11px] font-mono text-neutral-500 truncate">ID: {paymentResult.transactionId}</p>
              </div>
            )}
            <Link
              href="/coffees"
              className="block w-full bg-primary-700 text-white py-3 rounded-full font-bold hover:bg-primary-800 transition-colors"
            >
              Back to Coffees
            </Link>
          </div>
        </div>
      )}

      {/* Stripe Test Payment Modal */}
      <StripeTestModal
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        onSuccess={handleStripeSuccess}
        amount={selectedTier.price}
        title={`${coffee.name} (${selectedTier.size})`}
        subtitle="Green Coffee Roaster Sample Evaluation Package"
        companyName={formData.companyName || 'Buyer Company'}
        productId={productId}
        type="sample"
        customerEmail={formData.email}
        deliveryAddress={`${formData.address}, ${formData.city}, ${formData.country}`}
        sampleSize={selectedTier.size}
        notes={formData.notes}
      />
    </>
  );
}
