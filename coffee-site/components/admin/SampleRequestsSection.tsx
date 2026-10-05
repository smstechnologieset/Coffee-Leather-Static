'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface SampleRequest {
  id: string;
  productName: string;
  companyName: string;
  contactName: string;
  email: string;
  country: string;
  sampleSize: string;
  price: number;
  paymentStatus: string;
  deliveryMethod: string;
  status: string;
  date: string;
}

const MOCK_REQUESTS: SampleRequest[] = [
  { id: 'sr1', productName: 'Yirgacheffe Grade 1 Washed', companyName: 'Nordic Roasters AB', contactName: 'Erik Johansson', email: 'erik@nordicr.se', country: 'Sweden', sampleSize: '500g', price: 0, paymentStatus: 'Complimentary', deliveryMethod: 'DHL Express', status: 'new', date: '2026-09-14' },
  { id: 'sr2', productName: 'Guji Zone Natural G1', companyName: 'Blue Bottle Coffee', contactName: 'Sara Lee', email: 'sara@bluebottle.com', country: 'USA', sampleSize: '1kg', price: 40, paymentStatus: 'Paid via Stripe (Test)', deliveryMethod: 'DHL Express', status: 'sample_shipped', date: '2026-09-12' },
  { id: 'sr3', productName: 'Sidamo Natural G1', companyName: 'Café de Flore', contactName: 'Pierre Martin', email: 'pierre@cafedeflore.fr', country: 'France', sampleSize: '250g', price: 0, paymentStatus: 'Complimentary', deliveryMethod: 'Addis Ababa Warehouse Pickup', status: 'new', date: '2026-09-11' },
  { id: 'sr4', productName: 'Harar Longberry Natural', companyName: 'Tokyo Coffee Supply', contactName: 'Kenji Sato', email: 'kenji@tokyocoffee.jp', country: 'Japan', sampleSize: '2kg', price: 75, paymentStatus: 'Paid via Stripe (Test)', deliveryMethod: 'DHL Express', status: 'closed', date: '2026-09-08' },
];

const STATUS_OPTIONS = ['new', 'sample_shipped', 'closed'];
const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  sample_shipped: 'bg-amber-100 text-amber-700',
  closed: 'bg-green-100 text-green-700',
};
const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  sample_shipped: 'Sample Shipped',
  closed: 'Closed',
};

export default function SampleRequestsSection() {
  const [requests, setRequests] = useState<SampleRequest[]>(MOCK_REQUESTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const fetchLiveRequests = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('sample_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0 && !error) {
        const mapped: SampleRequest[] = data.map((r: any) => ({
          id: r.id,
          productName: r.product_name || 'Specialty Coffee Sample',
          companyName: r.company_name || 'Unknown Buyer',
          contactName: r.buyer_name || 'Buyer',
          email: r.email || '',
          country: r.country || 'International',
          sampleSize: r.sample_size || '250g',
          price: Number(r.sample_price) || 0,
          paymentStatus: Number(r.sample_price) === 0 ? 'Complimentary' : 'Paid via Stripe',
          deliveryMethod: r.delivery_method || 'DHL Express',
          status: r.status || 'new',
          date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent',
        }));
        setRequests(mapped);
      }
    } catch (e) {
      console.warn('Error fetching live sample requests:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRequests();
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  const updateStatus = async (id: string, status: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

    try {
      const supabase = createClient();
      await supabase.from('sample_requests').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Error updating status in Supabase:', e);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-neutral-900 flex items-center gap-2">
            <span>Sample Requests</span>
            <button
              onClick={fetchLiveRequests}
              disabled={loading}
              title="Refresh requests"
              className="p-1 hover:bg-neutral-100 rounded-full transition"
            >
              <RefreshCw className={`h-4 w-4 text-neutral-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </h2>
          <p className="text-neutral-500 text-sm">
            {requests.filter((r) => r.status === 'new').length} pending review
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'new', 'sample_shipped', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                filter === f
                  ? 'bg-primary-700 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {f === 'all' ? 'All' : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
          >
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
              onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
            >
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  STATUS_STYLES[req.status] || 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {STATUS_LABELS[req.status] || req.status}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 truncate">{req.productName}</p>
                <p className="text-xs text-neutral-400">
                  {req.companyName} • {req.country} • {req.date}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                  {req.sampleSize}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    req.price === 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {req.price === 0 ? 'Free' : `$${req.price}`}
                </span>
              </div>
              {expandedId === req.id ? (
                <ChevronUp className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              )}
            </div>

            {expandedId === req.id && (
              <div className="border-t border-neutral-100 p-5 bg-neutral-50 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    ['Contact', req.contactName],
                    ['Email', req.email],
                    ['Country', req.country],
                    ['Sample Size', req.sampleSize],
                    ['Sample Fee', req.price === 0 ? 'Complimentary ($0.00)' : `$${req.price}.00 USD`],
                    ['Payment Status', req.paymentStatus],
                    ['Delivery Method', req.deliveryMethod],
                    ['Request Date', req.date],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-neutral-400">{label}</p>
                      <p className="text-sm font-semibold text-neutral-800">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-neutral-500">Update status:</span>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(req.id, s)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors border ${
                        req.status === s
                          ? `${STATUS_STYLES[s]} border-transparent`
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-sm">
            No requests with this status.
          </div>
        )}
      </div>
    </div>
  );
}
