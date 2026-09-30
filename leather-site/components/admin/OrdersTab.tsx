'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, X, Package, Truck, Check, ChevronRight } from 'lucide-react';
import {
  getLeatherOrders, updateLeatherOrderStatus,
  LeatherOrder, LeatherOrderStatus,
} from '@/lib/leather-data';

const STATUS_OPTIONS: LeatherOrderStatus[] = [
  'pending', 'processing', 'shipped', 'delivered', 'cancelled',
];

const STATUS_COLORS: Record<LeatherOrderStatus, string> = {
  pending:    'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<LeatherOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeatherOrderStatus | 'all'>('all');
  const [selected, setSelected] = useState<LeatherOrder | null>(null);
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [savingShip, setSavingShip] = useState(false);

  useEffect(() => {
    setOrders(getLeatherOrders());
    const h = () => setOrders(getLeatherOrders());
    window.addEventListener('kijij_leather_orders_updated', h);
    return () => window.removeEventListener('kijij_leather_orders_updated', h);
  }, []);

  // Pre-fill carrier/tracking when opening an order
  useEffect(() => {
    if (selected) {
      setCarrier(selected.carrier ?? '');
      setTracking(selected.trackingNumber ?? '');
    }
  }, [selected]);

  const filtered = orders
    .filter((o) => {
      const q = search.toLowerCase();
      return (
        (!search ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.id.includes(q)) &&
        (statusFilter === 'all' || o.status === statusFilter)
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (id: string, status: LeatherOrderStatus) => {
    updateLeatherOrderStatus(id, status);
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  };

  const handleMarkShipped = () => {
    if (!selected) return;
    setSavingShip(true);
    updateLeatherOrderStatus(selected.id, 'shipped', carrier, tracking);
    setSelected((prev) => prev ? { ...prev, status: 'shipped', carrier, trackingNumber: tracking } : null);
    setTimeout(() => setSavingShip(false), 800);
  };

  const exportCSV = () => {
    const rows = [
      ['Order ID', 'Customer', 'Email', 'Status', 'Total', 'Date'],
      ...orders.map((o) => [
        o.id, o.customerName, o.customerEmail, o.status,
        `$${o.total.toFixed(2)}`, new Date(o.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'kijij-orders.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Orders list */}
      <div className={`flex-1 min-w-0 space-y-4 ${selected ? 'hidden lg:block' : ''}`}>
        {/* Filters */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or order ID..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeatherOrderStatus | 'all')}
            className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={exportCSV}
            className="text-sm border border-neutral-200 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-50 whitespace-nowrap"
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-100">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              {filtered.length} order{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Package className="h-8 w-8 text-neutral-200 mx-auto mb-3" />
              <p className="text-sm text-neutral-400">No orders yet</p>
              <p className="text-xs text-neutral-300 mt-1">Orders placed by customers will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-neutral-50 transition-colors cursor-pointer ${selected?.id === order.id ? 'bg-neutral-50' : ''}`}
                      onClick={() => setSelected(order)}
                    >
                      <td className="px-5 py-3 font-mono text-xs text-neutral-500">
                        #{order.id.slice(-6)}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-xs font-semibold text-neutral-900">{order.customerName}</p>
                        <p className="text-[10px] text-neutral-400">{order.customerEmail}</p>
                      </td>
                      <td className="px-5 py-3 text-xs text-neutral-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-5 py-3 text-xs font-bold text-neutral-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as LeatherOrderStatus)}
                          className={`text-[10px] font-bold uppercase tracking-wide border rounded-full px-2.5 py-1 cursor-pointer focus:outline-none ${STATUS_COLORS[order.status]}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-xs text-neutral-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                      </td>
                      <td className="px-5 py-3">
                        <ChevronRight className="h-4 w-4 text-neutral-300" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Panel */}
      {selected && (
        <div className="w-full lg:w-96 flex-shrink-0 bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col">
          {/* Panel header */}
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-900 text-sm">Order #{selected.id.slice(-6)}</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {new Date(selected.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
              </p>
            </div>
            <button onClick={() => setSelected(null)}>
              <X className="h-4 w-4 text-neutral-400 hover:text-neutral-900" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* Status badge */}
            <span className={`inline-flex text-xs font-bold uppercase tracking-wide border px-3 py-1 rounded-full ${STATUS_COLORS[selected.status]}`}>
              {selected.status}
            </span>

            {/* Customer */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Customer</p>
              <p className="text-sm font-semibold text-neutral-900">{selected.customerName}</p>
              <p className="text-xs text-neutral-500">{selected.customerEmail}</p>
            </div>

            {/* Shipping address */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Ship To</p>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {selected.shippingAddress.line1}<br />
                {selected.shippingAddress.city}, {selected.shippingAddress.country}
                {selected.shippingAddress.postalCode ? ` ${selected.shippingAddress.postalCode}` : ''}
              </p>
            </div>

            {/* Items */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Items</p>
              <div className="space-y-2.5">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    {item.productImage && (
                      <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-[#F2EDE8]">
                        <Image src={item.productImage} alt={item.productName} fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{item.productName}</p>
                      <p className="text-[10px] text-neutral-500">
                        {item.color}{item.size ? ` / ${item.size}` : ''} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-neutral-900 flex-shrink-0">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="border-t border-neutral-100 pt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Subtotal</span>
                <span>${selected.subtotal.toFixed(2)}</span>
              </div>
              {selected.discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>Discount {selected.promoCode && `(${selected.promoCode})`}</span>
                  <span>-${selected.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t border-neutral-100">
                <span>Total</span>
                <span>${selected.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Tracking / Fulfillment */}
            <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Fulfillment</p>
              {selected.trackingNumber && (
                <div className="flex items-center gap-2 text-xs text-neutral-700">
                  <Truck className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="font-medium">{selected.carrier}</span>
                  <span className="font-mono">{selected.trackingNumber}</span>
                </div>
              )}
              <div className="space-y-2">
                <input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="Carrier (DHL, FedEx, EMS...)"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="Tracking number"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                />
                <button
                  onClick={handleMarkShipped}
                  disabled={!carrier || !tracking}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    !carrier || !tracking
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      : savingShip
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-900 text-white hover:bg-neutral-700'
                  }`}
                >
                  {savingShip ? <><Check className="h-3.5 w-3.5" /> Marked Shipped</> : <><Truck className="h-3.5 w-3.5" /> Mark as Shipped</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
