'use client';

import { useState, useEffect } from 'react';
import { Plus, Copy, Trash2, X, Check, Tag } from 'lucide-react';
import {
  getLeatherPromos, saveLeatherPromo, deleteLeatherPromo,
  LeatherPromo,
} from '@/lib/leather-data';

const EMPTY_PROMO: Omit<LeatherPromo, 'id' | 'createdAt' | 'usedCount'> = {
  code: '',
  discountType: 'percentage',
  discountValue: 10,
  minimumOrder: undefined,
  usageLimit: undefined,
  singleUsePerCustomer: false,
  validFrom: new Date().toISOString().slice(0, 10),
  expiresAt: undefined,
  isActive: true,
};

const inputCls = 'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900';

export default function PromoCodesTab() {
  const [promos, setPromos] = useState<LeatherPromo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<LeatherPromo | null>(null);
  const [form, setForm] = useState<Omit<LeatherPromo, 'id' | 'createdAt' | 'usedCount'>>(EMPTY_PROMO);
  const [copied, setCopied] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setPromos(getLeatherPromos());
    const h = () => setPromos(getLeatherPromos());
    window.addEventListener('kijij_leather_promos_updated', h);
    return () => window.removeEventListener('kijij_leather_promos_updated', h);
  }, []);

  const openNew = () => {
    setEditingPromo(null);
    setForm({ ...EMPTY_PROMO, validFrom: new Date().toISOString().slice(0, 10) });
    setShowModal(true);
  };

  const openEdit = (p: LeatherPromo) => {
    setEditingPromo(p);
    setForm({
      code: p.code,
      discountType: p.discountType,
      discountValue: p.discountValue,
      minimumOrder: p.minimumOrder,
      usageLimit: p.usageLimit,
      singleUsePerCustomer: p.singleUsePerCustomer,
      validFrom: p.validFrom.slice(0, 10),
      expiresAt: p.expiresAt?.slice(0, 10),
      isActive: p.isActive,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const promo: LeatherPromo = {
      ...(editingPromo ?? {}),
      id: editingPromo?.id ?? `promo-${Date.now()}`,
      ...form,
      code: form.code.toUpperCase().trim(),
      usedCount: editingPromo?.usedCount ?? 0,
      createdAt: editingPromo?.createdAt ?? new Date().toISOString(),
    };
    saveLeatherPromo(promo);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 800);
  };

  const toggleActive = (promo: LeatherPromo) => {
    saveLeatherPromo({ ...promo, isActive: !promo.isActive });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const isExpired = (p: LeatherPromo) =>
    !!p.expiresAt && new Date(p.expiresAt) < new Date();

  const setF = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-neutral-900 text-sm">Promo Codes</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{promos.filter((p) => p.isActive && !isExpired(p)).length} active</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Code
        </button>
      </div>

      {/* Promo cards */}
      {promos.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl py-20 text-center">
          <Tag className="h-8 w-8 text-neutral-200 mx-auto mb-3" />
          <p className="text-sm text-neutral-400">No promo codes yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((p) => {
            const expired = isExpired(p);
            const depleted = !!p.usageLimit && p.usedCount >= p.usageLimit;
            const effective = p.isActive && !expired && !depleted;

            return (
              <div
                key={p.id}
                className={`bg-white border rounded-xl p-4 space-y-3 transition-opacity ${!effective ? 'opacity-60' : ''} border-neutral-200`}
              >
                {/* Code + copy */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <code className="text-lg font-bold text-neutral-900 tracking-wider font-mono">
                      {p.code}
                    </code>
                    <button
                      onClick={() => copyCode(p.code)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-900 transition-colors"
                      title="Copy code"
                    >
                      {copied === p.code ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {/* Active toggle */}
                  <button
                    onClick={() => toggleActive(p)}
                    className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${p.isActive ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${p.isActive ? 'left-4' : 'left-0.5'}`} />
                  </button>
                </div>

                {/* Discount summary */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-neutral-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {p.discountType === 'percentage' ? `${p.discountValue}% off` : `$${p.discountValue} off`}
                  </span>
                  {p.minimumOrder && (
                    <span className="text-[10px] text-neutral-500 border border-neutral-200 px-2 py-0.5 rounded-full">
                      Min ${p.minimumOrder}
                    </span>
                  )}
                  {expired && <span className="text-[10px] text-red-600 font-bold">Expired</span>}
                  {depleted && !expired && <span className="text-[10px] text-amber-600 font-bold">Depleted</span>}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">Used</p>
                    <p className="font-semibold">
                      {p.usedCount}{p.usageLimit ? ` / ${p.usageLimit}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">Expires</p>
                    <p className="font-semibold">
                      {p.expiresAt
                        ? new Date(p.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                        : 'Never'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-neutral-100">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex-1 text-xs font-medium text-neutral-700 border border-neutral-200 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 border border-neutral-200 rounded-lg hover:border-red-200 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-neutral-900 mb-2">Delete promo code?</h3>
            <p className="text-sm text-neutral-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-medium py-2 rounded-lg hover:bg-neutral-50">Cancel</button>
              <button onClick={() => { deleteLeatherPromo(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="font-bold text-neutral-900">{editingPromo ? 'Edit Promo Code' : 'New Promo Code'}</h2>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-neutral-400" /></button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">Code *</label>
                <input
                  value={form.code}
                  onChange={(e) => setF('code', e.target.value.toUpperCase())}
                  className={inputCls + ' font-mono tracking-widest'}
                  placeholder="e.g. KIJIJ20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">Type</label>
                  <select value={form.discountType} onChange={(e) => setF('discountType', e.target.value as 'percentage' | 'fixed')} className={inputCls}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Value {form.discountType === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <input type="number" min={0} step="any" value={form.discountValue} onChange={(e) => setF('discountValue', parseFloat(e.target.value) || 0)} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">Min Order ($)</label>
                  <input type="number" min={0} step="any" value={form.minimumOrder ?? ''} onChange={(e) => setF('minimumOrder', e.target.value === '' ? undefined : parseFloat(e.target.value))} className={inputCls} placeholder="No minimum" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">Usage Limit</label>
                  <input type="number" min={0} value={form.usageLimit ?? ''} onChange={(e) => setF('usageLimit', e.target.value === '' ? undefined : parseInt(e.target.value))} className={inputCls} placeholder="Unlimited" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">Valid From</label>
                  <input type="date" value={form.validFrom.slice(0, 10)} onChange={(e) => setF('validFrom', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">Expires At</label>
                  <input type="date" value={form.expiresAt?.slice(0, 10) ?? ''} onChange={(e) => setF('expiresAt', e.target.value || undefined)} className={inputCls} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setF('isActive', !form.isActive)}
                  className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${form.isActive ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${form.isActive ? 'left-4' : 'left-0.5'}`} />
                </button>
                <span className="text-sm text-neutral-700">Active</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={!form.code}
                className={`flex-1 text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  saved ? 'bg-emerald-600 text-white' : !form.code ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-neutral-700'
                }`}
              >
                {saved ? <><Check className="h-4 w-4" /> Saved!</> : 'Save Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
