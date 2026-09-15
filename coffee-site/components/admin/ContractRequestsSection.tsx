'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Upload } from 'lucide-react';

const MOCK_CONTRACTS = [
  { id: 'cr1', productName: 'Yirgacheffe Grade 1 Washed', companyName: 'Nordic Roasters AB', contact: 'Erik Johansson', email: 'erik@nordicr.se', quantity: 5, incoterms: 'FOB Addis Ababa', totalValue: 21000, status: 'pending_payment', date: '2026-09-13', deliveryWindow: '60 days' },
  { id: 'cr2', productName: 'Guji Zone Natural G1', companyName: 'Blue Bottle Coffee', contact: 'Sara Lee', email: 'sara@bluebottle.com', quantity: 10, incoterms: 'CIF Destination Port', totalValue: 49000, status: 'paid_pending_contract', date: '2026-09-10', deliveryWindow: '90 days' },
  { id: 'cr3', productName: 'Harar Longberry Natural', companyName: 'Tokyo Coffee Supply', contact: 'Kenji Sato', email: 'kenji@tokyocoffee.jp', quantity: 3, incoterms: 'FOB Addis Ababa', totalValue: 13800, status: 'contract_sent', date: '2026-09-05', deliveryWindow: '30 days' },
];

const STATUS_FLOW = ['pending_payment', 'paid_pending_contract', 'contract_sent', 'closed'];
const STATUS_STYLES: Record<string, string> = {
  pending_payment: 'bg-amber-100 text-amber-700',
  paid_pending_contract: 'bg-blue-100 text-blue-700',
  contract_sent: 'bg-green-100 text-green-700',
  closed: 'bg-neutral-100 text-neutral-600',
};
const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Pending Payment',
  paid_pending_contract: 'Paid — Awaiting Contract',
  contract_sent: 'Contract Sent',
  closed: 'Closed',
};

export default function ContractRequestsSection() {
  const [contracts, setContracts] = useState(MOCK_CONTRACTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateStatus = (id: string, status: string) => {
    setContracts((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-neutral-900">Contract Requests</h2>
          <p className="text-neutral-500 text-sm">{contracts.filter((c) => c.status === 'pending_payment').length} pending payment</p>
        </div>
      </div>

      <div className="space-y-3">
        {contracts.map((contract) => (
          <div key={contract.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
              onClick={() => setExpandedId(expandedId === contract.id ? null : contract.id)}
            >
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[contract.status]}`}>
                {STATUS_LABELS[contract.status]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 truncate">{contract.productName}</p>
                <p className="text-xs text-neutral-400">{contract.companyName} • {contract.date}</p>
              </div>
              <div className="text-sm font-bold text-primary-700 hidden sm:block">${contract.totalValue.toLocaleString()}</div>
              {expandedId === contract.id ? <ChevronUp className="h-4 w-4 text-neutral-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-neutral-400 flex-shrink-0" />}
            </div>

            {expandedId === contract.id && (
              <div className="border-t border-neutral-100 p-5 bg-neutral-50 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {[
                    ['Contact', contract.contact],
                    ['Email', contract.email],
                    ['Quantity', `${contract.quantity} MT`],
                    ['Incoterms', contract.incoterms],
                    ['Delivery', contract.deliveryWindow],
                    ['Total Value', `$${contract.totalValue.toLocaleString()}`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-neutral-400">{label}</p>
                      <p className="text-sm font-semibold text-neutral-800">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Status flow */}
                <div className="mb-4">
                  <p className="text-xs text-neutral-500 mb-2">Update status:</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_FLOW.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(contract.id, s)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors border ${contract.status === s ? `${STATUS_STYLES[s]} border-transparent` : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload contract PDF */}
                <div className="border-t border-neutral-100 pt-4">
                  <p className="text-xs text-neutral-500 mb-2">Upload Contract PDF:</p>
                  <label className="flex items-center gap-2 bg-white border-2 border-dashed border-neutral-200 hover:border-primary-400 rounded-xl px-4 py-3 cursor-pointer transition-colors">
                    <Upload className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm text-neutral-500">Click to upload signed contract (PDF)</span>
                    <input type="file" accept=".pdf" className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
