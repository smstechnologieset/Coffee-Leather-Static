'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MOCK_REQUESTS = [
  { id: 'sr1', productName: 'Yirgacheffe Grade 1 Washed', companyName: 'Nordic Roasters AB', contactName: 'Erik Johansson', email: 'erik@nordicr.se', country: 'Sweden', sampleSize: '500g', deliveryMethod: 'DHL', status: 'new', date: '2026-09-14' },
  { id: 'sr2', productName: 'Guji Zone Natural G1', companyName: 'Blue Bottle Coffee', contactName: 'Sara Lee', email: 'sara@bluebottle.com', country: 'USA', sampleSize: '1kg', deliveryMethod: 'DHL', status: 'sample_shipped', date: '2026-09-12' },
  { id: 'sr3', productName: 'Sidamo Natural G1', companyName: 'Café de Flore', contactName: 'Pierre Martin', email: 'pierre@cafedeflore.fr', country: 'France', sampleSize: '250g', deliveryMethod: 'Drop Location', status: 'new', date: '2026-09-11' },
  { id: 'sr4', productName: 'Harar Longberry Natural', companyName: 'Tokyo Coffee Supply', contactName: 'Kenji Sato', email: 'kenji@tokyocoffee.jp', country: 'Japan', sampleSize: '1kg', deliveryMethod: 'DHL', status: 'closed', date: '2026-09-08' },
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
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  const updateStatus = (id: string, status: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-neutral-900">Sample Requests</h2>
          <p className="text-neutral-500 text-sm">{requests.filter((r) => r.status === 'new').length} pending review</p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'sample_shipped', 'closed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${filter === f ? 'bg-primary-700 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              {f === 'all' ? 'All' : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((req) => (
          <div key={req.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
              onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
            >
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[req.status]}`}>{STATUS_LABELS[req.status]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 truncate">{req.productName}</p>
                <p className="text-xs text-neutral-400">{req.companyName} • {req.country} • {req.date}</p>
              </div>
              <div className="hidden sm:block text-xs text-neutral-500">{req.sampleSize}</div>
              {expandedId === req.id ? <ChevronUp className="h-4 w-4 text-neutral-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-neutral-400 flex-shrink-0" />}
            </div>

            {expandedId === req.id && (
              <div className="border-t border-neutral-100 p-5 bg-neutral-50 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    ['Contact', req.contactName],
                    ['Email', req.email],
                    ['Country', req.country],
                    ['Sample Size', req.sampleSize],
                    ['Delivery', req.deliveryMethod],
                    ['Date', req.date],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-neutral-400">{label}</p>
                      <p className="text-sm font-semibold text-neutral-800">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Update status:</span>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(req.id, s)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors border ${req.status === s ? `${STATUS_STYLES[s]} border-transparent` : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
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
          <div className="text-center py-12 text-neutral-400 text-sm">No requests with this status.</div>
        )}
      </div>
    </div>
  );
}
