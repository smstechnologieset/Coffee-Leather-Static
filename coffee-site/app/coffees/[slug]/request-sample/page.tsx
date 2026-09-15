'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Truck, MapPin } from 'lucide-react';

// Static coffee data (matches catalog page)
const COFFEES: Record<string, any> = {
  '1': { name: 'Yirgacheffe Grade 1 Washed', region: 'Yirgacheffe', process: 'Washed', grade: 'Grade 1', price: '$4,200/MT', minOrder: '1 MT', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' },
  '2': { name: 'Sidamo Natural G1', region: 'Sidamo', process: 'Natural', grade: 'Grade 1', price: '$3,800/MT', minOrder: '1 MT', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80' },
  '3': { name: 'Harar Longberry Natural', region: 'Harar', process: 'Natural', grade: 'Grade 1', price: '$4,600/MT', minOrder: '500 KG', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80' },
  '4': { name: 'Limu Washed G2', region: 'Limu', process: 'Washed', grade: 'Grade 2', price: '$3,400/MT', minOrder: '1 MT', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80' },
  '5': { name: 'Guji Zone Natural G1', region: 'Guji', process: 'Natural', grade: 'Grade 1', price: '$4,900/MT', minOrder: '1 MT', image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=80' },
  '6': { name: 'Jimma Honey Process', region: 'Jimma', process: 'Honey', grade: 'Grade 2', price: '$4,100/MT', minOrder: '500 KG', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80' },
};

export default function RequestSamplePage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.slug as string;
  const coffee = COFFEES[productId];

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    sampleSize: '250g',
    deliveryMethod: 'DHL',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email || !formData.country) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    // Simulate submission (replace with Supabase insert)
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setShowSuccess(true);
  };

  const update = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <main className="min-h-screen bg-neutral-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-400 mb-6 flex items-center gap-2">
            <Link href="/coffees" className="hover:text-primary-600 transition-colors">Coffees</Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium">Request Sample</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-1">Request a Sample</h1>
          <p className="text-neutral-500 mb-10">Fill in your details to request a sample for <strong>{coffee.name}</strong></p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left — Product card */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 h-fit">
              <h2 className="text-xl font-serif font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">Product Details</h2>
              <div className="relative h-48 rounded-xl overflow-hidden mb-5">
                <Image src={coffee.image} alt={coffee.name} fill className="object-cover" sizes="480px" />
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
            </div>

            {/* Right — Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>
              )}

              {/* Company */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Company Name *</label>
                    <input type="text" required value={formData.companyName} onChange={(e) => update('companyName', e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Your company name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Contact Name</label>
                    <input type="text" value={formData.contactName} onChange={(e) => update('contactName', e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address *</label>
                    <input type="email" required value={formData.email} onChange={(e) => update('email', e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="you@company.com" />
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-600" /> Delivery Address</h3>
                <div className="space-y-3">
                  <input type="text" value={formData.address} onChange={(e) => update('address', e.target.value)}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Street address" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={formData.city} onChange={(e) => update('city', e.target.value)}
                      className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="City" />
                    <input type="text" required value={formData.country} onChange={(e) => update('country', e.target.value)}
                      className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Country *" />
                  </div>
                </div>
              </div>

              {/* Sample size */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-3">Sample Size</h3>
                <div className="flex flex-wrap gap-2">
                  {['250g', '500g', '1kg', '2kg'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => update('sampleSize', size)}
                      className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${formData.sampleSize === size ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-600 hover:border-primary-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery method */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2"><Truck className="h-4 w-4 text-primary-600" /> Delivery Method</h3>
                <div className="space-y-2">
                  {[
                    { id: 'DHL', label: 'DHL Express', sub: 'International courier, 3–7 days' },
                    { id: 'Drop Location', label: 'Drop Location', sub: 'Pick up from our Addis Ababa warehouse' },
                    { id: 'Freight', label: 'Sea Freight', sub: 'Container shipment (for larger samples)' },
                  ].map(({ id, label, sub }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => update('deliveryMethod', id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${formData.deliveryMethod === id ? 'border-primary-600 bg-primary-50' : 'border-neutral-100 hover:border-primary-300'}`}
                    >
                      <Truck className={`h-5 w-5 ${formData.deliveryMethod === id ? 'text-primary-600' : 'text-neutral-400'}`} />
                      <div>
                        <p className={`text-sm font-bold ${formData.deliveryMethod === id ? 'text-primary-700' : 'text-neutral-800'}`}>{label}</p>
                        <p className="text-xs text-neutral-400">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-2">Additional Notes</h3>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Specific requirements, certifications needed, etc."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-700 text-white py-4 rounded-full font-bold text-base hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting Request...' : 'Submit Sample Request'}
              </button>
            </form>
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
            <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">Request Sent!</h3>
            <p className="text-neutral-500 text-sm mb-6">
              We've received your sample request for <strong>{coffee.name}</strong>. 
              Our team will review and confirm your shipment details within 24 hours.
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
