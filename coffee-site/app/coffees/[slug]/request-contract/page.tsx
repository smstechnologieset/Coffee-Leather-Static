'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  FileText,
  MinusCircle,
  PlusCircle,
  Building2,
  MapPin,
  AlertTriangle,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

const COFFEES: Record<string, any> = {
  '1': {
    name: 'Yirgacheffe Grade 1 Washed',
    region: 'Yirgacheffe',
    process: 'Washed',
    grade: 'Grade 1',
    pricePerMT: 4200,
    minOrderMT: 1,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
  },
  '2': {
    name: 'Sidamo Natural G1',
    region: 'Sidamo',
    process: 'Natural',
    grade: 'Grade 1',
    pricePerMT: 3800,
    minOrderMT: 1,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
  },
  '3': {
    name: 'Harar Longberry Natural',
    region: 'Harar',
    process: 'Natural',
    grade: 'Grade 1',
    pricePerMT: 4600,
    minOrderMT: 0.5,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  },
  '4': {
    name: 'Limu Washed G2',
    region: 'Limu',
    process: 'Washed',
    grade: 'Grade 2',
    pricePerMT: 3400,
    minOrderMT: 1,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
  },
  '5': {
    name: 'Guji Zone Natural G1',
    region: 'Guji',
    process: 'Natural',
    grade: 'Grade 1',
    pricePerMT: 4900,
    minOrderMT: 1,
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=80',
  },
  '6': {
    name: 'Jimma Honey Process',
    region: 'Jimma',
    process: 'Honey',
    grade: 'Grade 2',
    pricePerMT: 4100,
    minOrderMT: 0.5,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
  },
};

const DELIVERY_WINDOWS = ['30 days', '60 days', '90 days', '120 days', 'Flexible / Seasonal Call-off'];

export default function RequestContractPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.slug as string;
  const coffee = COFFEES[productId];

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
    phone: '',
    address: '',
    city: '',
    country: '',
    quantity: coffee?.minOrderMT || 1,
    deliveryWindow: '60 days',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

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

        let initialCompanyId = '';
        let initialCompanyName = '';
        let initialCountry = '';

        if (companies.length > 0) {
          initialCompanyId = companies[0].id;
          initialCompanyName = companies[0].name;
          initialCountry = companies[0].country;
        }

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

  const total = formData.quantity * coffee.pricePerMT;

  const update = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please sign in to initiate a supply contract.');
      return;
    }

    if (!isProfileComplete) {
      setError(
        'You must register at least one company and one delivery address in your profile before requesting a contract.'
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

    setSubmitting(true);
    setError('');

    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setShowSuccess(true);
  };

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
            <span className="text-neutral-700 font-medium">Request Contract</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-1">
            Initiate Supply Contract
          </h1>
          <p className="text-neutral-500 mb-10">
            Submit contract specifications for <strong>{coffee.name}</strong>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left — Product card + Order summary */}
            <div className="space-y-5">
              <div className="relative h-52 rounded-2xl overflow-hidden shadow-sm">
                <Image
                  src={coffee.image}
                  alt={coffee.name}
                  fill
                  className="object-cover"
                  sizes="480px"
                />
              </div>

              {/* Order summary */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                <h2 className="font-serif font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">
                  Contract Summary
                </h2>
                <div className="space-y-2 mb-5">
                  {[
                    ['Product', coffee.name],
                    ['Region', coffee.region],
                    ['Grade', coffee.grade],
                    ['Process', coffee.process],
                    ['Unit Price', `$${coffee.pricePerMT.toLocaleString()}/MT`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between py-1.5 border-b border-neutral-50"
                    >
                      <span className="text-sm text-neutral-500">{label}</span>
                      <span className="text-sm font-semibold text-neutral-800 text-right max-w-[55%]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between py-2 border-t-2 border-neutral-200">
                  <span className="text-sm font-bold text-neutral-700">Quantity (MT)</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        update('quantity', Math.max(coffee.minOrderMT, formData.quantity - 1))
                      }
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <MinusCircle className="h-6 w-6" />
                    </button>
                    <input
                      type="number"
                      min={coffee.minOrderMT}
                      value={formData.quantity}
                      onChange={(e) =>
                        update(
                          'quantity',
                          Math.max(coffee.minOrderMT, Number(e.target.value))
                        )
                      }
                      className="w-20 text-center border border-neutral-200 rounded-lg py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => update('quantity', formData.quantity + 1)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <PlusCircle className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Indicative Total */}
                <div className="mt-4 pt-4 border-t-2 border-primary-200 flex justify-between items-center">
                  <span className="font-bold text-neutral-900">Indicative Total</span>
                  <span className="text-2xl font-bold text-primary-700">
                    ${total.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Subject to formal export contract negotiation and shipping schedule confirmation.
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
                      To initiate formal coffee supply contracts, you must be signed in to your registered buyer account with a registered company and delivery address.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/login?redirect=/coffees/${productId}/request-contract`}
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
                        To request a commercial coffee contract, your profile must have at least{' '}
                        <strong>one registered company</strong> and{' '}
                        <strong>one registered delivery address</strong>.
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
                /* Eligible: User has company + address registered */
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
                        htmlFor="contract-company-select"
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
                      id="contract-company-select"
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

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="+1 (555) 234-5678"
                      />
                    </div>
                  </div>

                  {/* 2. Choose Shipping Address Dropdown from Profile */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="contract-address-select"
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
                      id="contract-address-select"
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

                  {/* Requested Delivery Window */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                    <h3 className="font-bold text-neutral-900 mb-3 text-sm">
                      Requested Delivery Window
                    </h3>
                    <select
                      value={formData.deliveryWindow}
                      onChange={(e) => update('deliveryWindow', e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {DELIVERY_WINDOWS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes / Special Terms */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                    <h3 className="font-bold text-neutral-900 mb-2 text-sm">
                      Additional Contract Requirements
                    </h3>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => update('notes', e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      placeholder="Special certifications, destination port preferences, bag packaging (GrainPro, Jute), or payment structure..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 text-white py-4 rounded-full font-bold text-base hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {submitting
                      ? 'Initiating Contract...'
                      : `Initiate Contract — $${total.toLocaleString()} est.`}
                  </button>
                  <p className="text-xs text-neutral-400 text-center">
                    Final pricing and dispatch schedule confirmed upon formal export contract signing.
                  </p>
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
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FileText className="h-8 w-8 text-primary-700" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
              Contract Request Initiated!
            </h3>
            <p className="text-neutral-500 text-sm mb-1">
              <strong>{formData.quantity} MT</strong> of <strong>{coffee.name}</strong>
            </p>
            <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
              Estimated contract value:{' '}
              <strong className="text-primary-700">${total.toLocaleString()}</strong>.
              Our trade specialists will contact <strong>{formData.companyName}</strong> within 24
              hours to finalize formal export terms.
            </p>
            <Link
              href="/coffees"
              className="block w-full bg-primary-700 text-white py-3 rounded-full font-bold hover:bg-primary-800 transition-colors"
            >
              Back to Coffees
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
