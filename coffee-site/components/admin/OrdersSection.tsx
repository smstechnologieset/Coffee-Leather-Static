'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronDown,
  Eye,
  X,
  CreditCard,
  Package,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  DirectOrder,
  getDirectOrders,
  updateDirectOrderStatus,
} from '@/lib/direct-orders-data';

export default function OrdersSection() {
  const [orders, setOrders] = useState<DirectOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<DirectOrder | null>(null);

  // Status edit modal state
  const [editingStatus, setEditingStatus] = useState<DirectOrder['status']>('Paid / Processing');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const loadOrders = () => {
    const list = getDirectOrders();
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('kijij_direct_orders_updated', loadOrders);
    window.addEventListener('storage', loadOrders);
    return () => {
      window.removeEventListener('kijij_direct_orders_updated', loadOrders);
      window.removeEventListener('storage', loadOrders);
    };
  }, []);

  const handleOpenDetail = (order: DirectOrder) => {
    setSelectedOrder(order);
    setEditingStatus(order.status);
    setCarrier(order.carrier || 'DHL Express Worldwide');
    setTrackingNumber(order.trackingNumber || '');
  };

  const handleSaveStatus = () => {
    if (!selectedOrder) return;
    const updated = updateDirectOrderStatus(selectedOrder.id, editingStatus, trackingNumber, carrier);
    if (updated) {
      setSelectedOrder(updated);
      loadOrders();
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchEmail = o.customerEmail?.toLowerCase().includes(q);
      const matchId = o.id?.toLowerCase().includes(q);
      const matchProd = o.productName?.toLowerCase().includes(q);
      const matchCountry = o.shippingAddress?.country?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchProd && !matchCountry) return false;
    }
    return true;
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'Paid / Processing').length;
  const shippedCount = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const getStatusBadge = (status: DirectOrder['status']) => {
    switch (status) {
      case 'Paid / Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3 text-amber-600" />
            Paid / Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Truck className="h-3 w-3 text-blue-600" />
            Shipped / In Transit
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
            <X className="h-3 w-3 text-red-600" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
            Direct Consumer Orders
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage retail orders placed by international customers via "Order Now" with 100% Stripe payments.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition shadow-sm w-fit"
        >
          <RefreshCw className="h-3.5 w-3.5 text-neutral-500" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Total Orders</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 mt-1 block">{orders.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Total Revenue</span>
          <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Awaiting Dispatch</span>
          <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">{pendingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Shipped / Delivered</span>
          <span className="text-2xl font-bold font-mono text-blue-700 mt-1 block">
            {shippedCount + deliveredCount}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, email, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'Paid / Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                statusFilter === st
                  ? 'bg-primary-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
            <h3 className="font-semibold text-neutral-800 text-sm">No Orders Found</h3>
            <p className="text-xs text-neutral-500 mt-1">
              No orders matched your current search and filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer & Destination</th>
                  <th className="py-3.5 px-4">Product & Package</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/70 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-neutral-900 block">{order.id}</span>
                      <span className="text-[11px] text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-900 block">{order.customerName}</span>
                      <span className="text-[11px] text-neutral-500 block">{order.customerEmail}</span>
                      <span className="text-[11px] text-primary-800 font-medium inline-flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {order.shippingAddress.city}, {order.shippingAddress.country}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-serif font-bold text-neutral-900 block">
                        {order.productName} ({order.quantity}x)
                      </span>
                      <span className="text-[11px] text-neutral-500">{order.packageLabel}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-sm text-neutral-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                      <span className="block text-[10px] text-emerald-600 font-semibold">
                        Stripe Paid
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                      {order.trackingNumber && (
                        <span className="block font-mono text-[10px] text-neutral-500 mt-1">
                          {order.trackingNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-lg text-xs transition"
                      >
                        <Eye className="h-3.5 w-3.5 text-neutral-500" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details & Fulfillment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-neutral-900 to-primary-950 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                  Direct Retail Order
                </span>
                <h3 className="text-xl font-bold font-serif mt-0.5">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/60 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700">
              {/* Customer & Shipping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-primary-800 font-bold uppercase tracking-wider text-[11px]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Shipping Destination</span>
                  </div>
                  <p className="font-bold text-sm text-neutral-900">{selectedOrder.customerName}</p>
                  <p className="text-neutral-600 leading-relaxed">
                    {selectedOrder.shippingAddress.street}
                    <br />
                    {selectedOrder.shippingAddress.city}
                    {selectedOrder.shippingAddress.state ? `, ${selectedOrder.shippingAddress.state}` : ''}{' '}
                    {selectedOrder.shippingAddress.postalCode}
                    <br />
                    <strong className="text-neutral-800">{selectedOrder.shippingAddress.country}</strong>
                  </p>
                  <div className="pt-1 text-neutral-500 space-y-0.5 font-mono text-[11px]">
                    <p>Phone: {selectedOrder.customerPhone}</p>
                    <p>Email: {selectedOrder.customerEmail}</p>
                  </div>
                  {selectedOrder.deliveryNotes && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                      <strong>Delivery Instructions:</strong> {selectedOrder.deliveryNotes}
                    </div>
                  )}
                </div>

                {/* Product & Payment */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-primary-800 font-bold uppercase tracking-wider text-[11px]">
                    <Package className="h-3.5 w-3.5" />
                    <span>Product & Payment</span>
                  </div>
                  <p className="font-bold text-sm text-neutral-900">{selectedOrder.productName}</p>
                  <p className="text-neutral-600">
                    Package: <strong>{selectedOrder.packageLabel}</strong>
                  </p>
                  <p className="text-neutral-600">
                    Quantity: <strong>{selectedOrder.quantity}</strong>
                  </p>

                  <div className="pt-2 border-t border-neutral-200">
                    <p className="flex justify-between items-baseline">
                      <span>Total Paid:</span>
                      <strong className="font-mono text-base text-neutral-900">
                        ${selectedOrder.totalAmount.toFixed(2)} USD
                      </strong>
                    </p>
                    <p className="flex justify-between text-[11px] text-neutral-500 mt-1">
                      <span>Stripe Tx:</span>
                      <code className="font-mono">{selectedOrder.stripeTransactionId}</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* Status & Fulfillment Controls */}
              <div className="bg-white p-5 rounded-2xl border border-primary-200 bg-primary-50/20 space-y-4">
                <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary-800" />
                  <span>Update Fulfillment & Courier Tracking</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                      Fulfillment Status
                    </label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as DirectOrder['status'])}
                      className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <option value="Paid / Processing">Paid / Processing</option>
                      <option value="Shipped">Shipped / In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                      Courier Carrier
                    </label>
                    <input
                      type="text"
                      placeholder="DHL Express Worldwide"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DHL-8829104712"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold rounded-xl text-xs transition"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveStatus}
                    className="px-5 py-2 bg-primary-800 hover:bg-primary-900 text-white font-semibold rounded-xl text-xs shadow transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Save Order Updates</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
