'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface ContractRequest {
  id: string;
  productName: string;
  companyName: string;
  contact: string;
  email: string;
  quantityQuintals: number;
  quantityKg: number;
  totalValue: number;
  depositAmount: number;
  status: string;
  date: string;
  deliveryWindow: string;
}

const MOCK_CONTRACTS: ContractRequest[] = [
  { id: 'cr1', productName: 'Yirgacheffe Grade 1 Washed', companyName: 'Nordic Roasters AB', contact: 'Erik Johansson', email: 'erik@nordicr.se', quantityQuintals: 50, quantityKg: 5000, totalValue: 21000, depositAmount: 1050, status: 'pending_payment', date: '2026-09-13', deliveryWindow: '60 days' },
  { id: 'cr2', productName: 'Guji Zone Natural G1', companyName: 'Blue Bottle Coffee', contact: 'Sara Lee', email: 'sara@bluebottle.com', quantityQuintals: 100, quantityKg: 10000, totalValue: 49000, depositAmount: 2450, status: 'paid_pending_contract', date: '2026-09-10', deliveryWindow: '90 days' },
  { id: 'cr3', productName: 'Harar Longberry Natural', companyName: 'Tokyo Coffee Supply', contact: 'Kenji Sato', email: 'kenji@tokyocoffee.jp', quantityQuintals: 30, quantityKg: 3000, totalValue: 13800, depositAmount: 690, status: 'contract_sent', date: '2026-09-05', deliveryWindow: '30 days' },
];

const STATUS_FLOW = ['pending_payment', 'paid_pending_contract', 'contract_sent', 'closed'];
const STATUS_STYLES: Record<string, string> = {
  pending_payment: 'bg-amber-100 text-amber-700',
  paid_pending_contract: 'bg-blue-100 text-blue-700',
  contract_sent: 'bg-green-100 text-green-700',
  closed: 'bg-neutral-100 text-neutral-600',
};
const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Pending Deposit',
  paid_pending_contract: 'Deposit Paid (Stripe) — Awaiting Contract',
  contract_sent: 'Contract Sent',
  closed: 'Closed',
};

export default function ContractRequestsSection() {
  const [contracts, setContracts] = useState<ContractRequest[]>(MOCK_CONTRACTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLiveContracts = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('contract_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0 && !error) {
        const mapped: ContractRequest[] = data.map((c: any) => ({
          id: c.id,
          productName: c.product_name || 'Specialty Coffee Allocation',
          companyName: c.company_name || 'Commercial Importer',
          contact: c.buyer_name || 'Buyer',
          email: c.email || '',
          quantityQuintals: Number(c.quantity_quintals) || Math.round(Number(c.quantity_kg || 1000) / 100),
          quantityKg: Number(c.quantity_kg) || 1000,
          totalValue: Number(c.indicative_total_usd) || 10000,
          depositAmount: Number(c.deposit_amount) || 500,
          status: c.status || 'pending_payment',
          date: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent',
          deliveryWindow: c.target_delivery || '30-60 days',
        }));
        setContracts(mapped);
      }
    } catch (e) {
      console.warn('Error fetching live contracts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveContracts();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

    try {
      const supabase = createClient();
      await supabase.from('contract_requests').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Error updating contract status in Supabase:', e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-neutral-900 flex items-center gap-2">
            <span>Contract Requests</span>
            <button
              onClick={fetchLiveContracts}
              disabled={loading}
              title="Refresh contracts"
              className="p-1 hover:bg-neutral-100 rounded-full transition"
            >
              <RefreshCw className={`h-4 w-4 text-neutral-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </h2>
          <p className="text-neutral-500 text-sm">
            {contracts.filter((c) => c.status === 'pending_payment').length} pending deposit
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {contracts.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
          >
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
            >
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  STATUS_STYLES[c.status] || 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {STATUS_LABELS[c.status] || c.status}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 truncate">{c.productName}</p>
                <p className="text-xs text-neutral-400">
                  {c.companyName} • {c.quantityQuintals} Quintals ({c.quantityKg.toLocaleString()} kg) • {c.date}
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-neutral-900">${c.totalValue.toLocaleString()}</p>
                <p className="text-xs text-amber-600 font-semibold">
                  Deposit: ${c.depositAmount.toLocaleString()}
                </p>
              </div>
              {expandedId === c.id ? (
                <ChevronUp className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              )}
            </div>

            {expandedId === c.id && (
              <div className="border-t border-neutral-100 p-5 bg-neutral-50 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    ['Contact', c.contact],
                    ['Email', c.email],
                    ['Quantity', `${c.quantityQuintals} Quintals (${c.quantityKg.toLocaleString()} kg)`],
                    ['Est. Total Value', `$${c.totalValue.toLocaleString()}`],
                    ['Deposit (5%)', `$${c.depositAmount.toLocaleString()}`],
                    ['Target Delivery', c.deliveryWindow],
                    ['Date Initiated', c.date],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-neutral-400">{label}</p>
                      <p className="text-sm font-semibold text-neutral-800">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-neutral-500">Status:</span>
                  {STATUS_FLOW.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(c.id, s)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors border ${
                        c.status === s
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
      </div>
    </div>
  );
}
