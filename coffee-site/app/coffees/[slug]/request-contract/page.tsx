'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, FileText, MinusCircle, PlusCircle } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

const COFFEES: Record<string, any> = {
  '1': { name: 'Yirgacheffe Grade 1 Washed', region: 'Yirgacheffe', process: 'Washed', grade: 'Grade 1', pricePerMT: 4200, minOrderMT: 1, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' },
  '2': { name: 'Sidamo Natural G1', region: 'Sidamo', process: 'Natural', grade: 'Grade 1', pricePerMT: 3800, minOrderMT: 1, image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80' },
  '3': { name: 'Harar Longberry Natural', region: 'Harar', process: 'Natural', grade: 'Grade 1', pricePerMT: 4600, minOrderMT: 0.5, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80' },
  '4': { name: 'Limu Washed G2', region: 'Limu', process: 'Washed', grade: 'Grade 2', pricePerMT: 3400, minOrderMT: 1, image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80' },
  '5': { name: 'Guji Zone Natural G1', region: 'Guji', process: 'Natural', grade: 'Grade 1', pricePerMT: 4900, minOrderMT: 1, image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=80' },
  '6': { name: 'Jimma Honey Process', region: 'Jimma', process: 'Honey', grade: 'Grade 2', pricePerMT: 4100, minOrderMT: 0.5, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80' },
};

const INCOTERMS = ['FOB Addis Ababa', 'CIF Destination Port', 'EXW Warehouse', 'CFR Destination'];
const DELIVERY_WINDOWS = ['30 days', '60 days', '90 days', '120 days', 'Flexible'];

export default function RequestContractPage() {
  const params = useParams();
  const productId = params.slug as string;
  const coffee = COFFEES[productId];

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    quantity: coffee?.minOrderMT || 1,
    incoterms: 'FOB Addis Ababa',
    deliveryWindow: '60 days',
    notes: '',
  });

  const [savedCompanies, setSavedCompanies] = useState<any[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        const companies = metadata.companies || [];
        const addresses = metadata.addresses || [];
        setSavedCompanies(companies);
        setSavedAddresses(addresses);
        
        // Auto-fill email and contact name if available
        setFormData(prev => ({
          ...prev,
          email: session.user.email || prev.email,
          contactName: metadata.full_name || prev.contactName,
        }));
      }
    };
    fetchUser();
  }, []);

  const handleCompanySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCompanyId(id);
    if (id) {
      const comp = savedCompanies.find(c => c.id === id);
      if (comp) {
        setFormData(prev => ({ ...prev, companyName: comp.name, country: prev.country || comp.country }));
      }
    }
  };

  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    if (id) {
      const addr = savedAddresses.find(a => a.id === id);
      if (addr) {
        setFormData(prev => ({ ...prev, address: addr.label, city: addr.city, country: addr.country }));
      }
    }
  };

  if (!coffee) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-neutral-900 mb-3">Product Not Found</h2>
          <Link href="/coffees" className="text-primary-600 hover:underline">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const total = formData.quantity * coffee.pricePerMT;

  const update = (field: string, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email || !formData.country) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setShowSuccess(true);
  };

  return (
    <>
      <main className="min-h-screen bg-neutral-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-neutral-400 mb-6 flex items-center gap-2">
            <Link href="/coffees" className="hover:text-primary-600 transition-colors">Coffees</Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium">Request Contract</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-1">Request Contract</h1>
          <p className="text-neutral-500 mb-10">Complete the form to initiate a supply contract for <strong>{coffee.name}</strong></p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left — Product image + details */}
            <div className="space-y-5">
              <div className="relative h-52 rounded-2xl overflow-hidden shadow-sm">
                <Image src={coffee.image} alt={coffee.name} fill className="object-cover" sizes="480px" />
              </div>

              {/* Order summary */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <h2 className="font-serif font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">Order Summary</h2>
                <div className="space-y-2 mb-5">
                  {[
                    ['Product', coffee.name],
                    ['Region', coffee.region],
                    ['Grade', coffee.grade],
                    ['Process', coffee.process],
                    ['Unit Price', `$${coffee.pricePerMT.toLocaleString()}/MT`],
                    ['Incoterms', formData.incoterms],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-1.5 border-b border-neutral-50">
                      <span className="text-sm text-neutral-500">{label}</span>
                      <span className="text-sm font-semibold text-neutral-800 text-right max-w-[55%]">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between py-2 border-t-2 border-neutral-200">
                  <span className="text-sm font-bold text-neutral-700">Quantity (MT)</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => update('quantity', Math.max(coffee.minOrderMT, formData.quantity - 1))} className="text-primary-600 hover:text-primary-800">
                      <MinusCircle className="h-6 w-6" />
                    </button>
                    <input
                      type="number"
                      min={coffee.minOrderMT}
                      value={formData.quantity}
                      onChange={(e) => update('quantity', Math.max(coffee.minOrderMT, Number(e.target.value)))}
                      className="w-20 text-center border border-neutral-200 rounded-lg py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button type="button" onClick={() => update('quantity', formData.quantity + 1)} className="text-primary-600 hover:text-primary-800">
                      <PlusCircle className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t-2 border-primary-200 flex justify-between items-center">
                  <span className="font-bold text-neutral-900">Indicative Total</span>
                  <span className="text-2xl font-bold text-primary-700">${total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">Subject to final contract negotiation and market rates</p>
              </div>
            </div>

            {/* Right — Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>
              )}

              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-neutral-900">Company Information</h3>
                  {savedCompanies.length > 0 && (
                    <select 
                      value={selectedCompanyId} 
                      onChange={handleCompanySelect}
                      className="text-sm border border-neutral-200 rounded-lg px-2 py-1 bg-neutral-50 text-neutral-600 outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">-- Use Saved Company --</option>
                      {savedCompanies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Company Name *</label>
                      <input type="text" required value={formData.companyName} onChange={(e) => update('companyName', e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Company name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Contact Name</label>
                      <input type="text" value={formData.contactName} onChange={(e) => update('contactName', e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Your name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Email *</label>
                      <input type="email" required value={formData.email} onChange={(e) => update('email', e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="you@company.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="+1 234 567 8900" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-neutral-900 flex items-center gap-2">Delivery Address</h3>
                  {savedAddresses.length > 0 && (
                    <select 
                      value={selectedAddressId} 
                      onChange={handleAddressSelect}
                      className="text-sm border border-neutral-200 rounded-lg px-2 py-1 bg-neutral-50 text-neutral-600 outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">-- Use Saved Address --</option>
                      {savedAddresses.map(a => (
                        <option key={a.id} value={a.id}>{a.label}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">City</label>
                      <input type="text" value={formData.city} onChange={(e) => update('city', e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Country *</label>
                      <input type="text" required value={formData.country} onChange={(e) => update('country', e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Country" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Incoterms */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-3">Incoterms</h3>
                <div className="grid grid-cols-2 gap-2">
                  {INCOTERMS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => update('incoterms', term)}
                      className={`text-left px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${formData.incoterms === term ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-100 text-neutral-600 hover:border-primary-300'}`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery window */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-3">Requested Delivery Window</h3>
                <select
                  value={formData.deliveryWindow}
                  onChange={(e) => update('deliveryWindow', e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {DELIVERY_WINDOWS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-2">Additional Requirements</h3>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Certifications (Organic, Fair Trade), packaging specs, moisture requirements, etc."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 text-white py-4 rounded-full font-bold text-base hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Initiating Contract...' : `Initiate Contract — $${total.toLocaleString()} est.`}
              </button>
              <p className="text-xs text-neutral-400 text-center">Final pricing subject to formal contract. Our team will contact you within 24h.</p>
            </form>
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
            <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">Contract Request Sent!</h3>
            <p className="text-neutral-500 text-sm mb-1">
              <strong>{formData.quantity} MT</strong> of <strong>{coffee.name}</strong>
            </p>
            <p className="text-neutral-500 text-sm mb-6">
              Estimated value: <strong className="text-primary-700">${total.toLocaleString()}</strong>. 
              Our trade specialists will contact you within 24 hours to finalize terms.
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
