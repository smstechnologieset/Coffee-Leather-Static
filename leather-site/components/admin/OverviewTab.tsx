'use client';

import { useEffect, useState } from 'react';
import {
  Package, Users, Tag, TrendingUp, ShoppingBag, AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import {
  getLeatherProducts, getLeatherOrders, fetchLeatherOrdersFromDb, LeatherOrder,
} from '@/lib/leather-data';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped:    'bg-purple-50 text-purple-700',
  delivered:  'bg-emerald-50 text-emerald-700',
  cancelled:  'bg-red-50 text-red-700',
};

export default function OverviewTab() {
  const [products, setProducts] = useState(getLeatherProducts());
  const [orders, setOrders] = useState<LeatherOrder[]>(getLeatherOrders());

  useEffect(() => {
    fetchLeatherOrdersFromDb().then((dbOrders) => {
      if (dbOrders && dbOrders.length > 0) setOrders(dbOrders);
    });
    const refresh = () => {
      setProducts(getLeatherProducts());
      setOrders(getLeatherOrders());
    };
    window.addEventListener('kijij_leather_products_updated', refresh);
    window.addEventListener('kijij_leather_orders_updated', refresh);
    return () => {
      window.removeEventListener('kijij_leather_products_updated', refresh);
      window.removeEventListener('kijij_leather_orders_updated', refresh);
    };
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStockProducts = products.filter(
    (p) => p.stockCount !== undefined && p.stockCount <= 5
  );

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.toString(),
      icon: Package,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Products',
      value: products.length.toString(),
      icon: Tag,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-3`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-xs text-neutral-500 font-medium mb-0.5">{s.label}</p>
            <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800">
              Low Stock Alert — {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-1.5">
                <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" unoptimized />
                </div>
                <span className="text-xs font-medium text-neutral-900">{p.name}</span>
                <span className="text-xs font-bold text-amber-700">{p.stockCount} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 text-sm">Recent Orders</h3>
          <span className="text-xs text-neutral-400">{orders.length} total</span>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="h-8 w-8 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">No orders yet</p>
            <p className="text-xs text-neutral-300 mt-1">Orders will appear here after customers checkout</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">#{order.id.slice(-6)}</td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-xs font-semibold text-neutral-900">{order.customerName}</p>
                        <p className="text-[10px] text-neutral-400">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-neutral-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td className="px-5 py-3 text-xs font-bold text-neutral-900">${order.total.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
