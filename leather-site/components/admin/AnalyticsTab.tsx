'use client';

import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, ShoppingBag, Tag, DollarSign } from 'lucide-react';
import { getLeatherProducts, getLeatherOrders, fetchLeatherOrdersFromDb, LeatherOrder } from '@/lib/leather-data';

const STATUS_COLOR: Record<string, string> = {
  pending:    '#F59E0B',
  processing: '#3B82F6',
  shipped:    '#8B5CF6',
  delivered:  '#10B981',
  cancelled:  '#EF4444',
};

function StatCard({
  label, value, sub, icon: Icon, color,
}: { label: string; value: string; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <div className={`inline-flex p-2 rounded-lg mb-3`} style={{ background: color + '18' }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <p className="text-xs text-neutral-500 font-medium mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// Tiny bar chart
function BarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[9px] text-neutral-500 font-semibold">{d.value}</span>
          <div
            className="w-full rounded-t transition-all"
            style={{
              height: `${Math.max((d.value / max) * 100, 4)}%`,
              background: d.color ?? '#171717',
              minHeight: '4px',
            }}
          />
          <span className="text-[8px] text-neutral-400 text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsTab() {
  const [orders, setOrders] = useState<LeatherOrder[]>([]);
  const [products, setProducts] = useState(getLeatherProducts());
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    setOrders(getLeatherOrders());
    setProducts(getLeatherProducts());
    fetchLeatherOrdersFromDb().then((dbOrders) => {
      if (dbOrders && dbOrders.length > 0) setOrders(dbOrders);
    });
    const h = () => { setOrders(getLeatherOrders()); setProducts(getLeatherProducts()); };
    window.addEventListener('kijij_leather_orders_updated', h);
    window.addEventListener('kijij_leather_products_updated', h);
    return () => {
      window.removeEventListener('kijij_leather_orders_updated', h);
      window.removeEventListener('kijij_leather_products_updated', h);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const now = Date.now();
    const ms = period === '7d' ? 7 * 86400000 : period === '30d' ? 30 * 86400000 : Infinity;
    return orders.filter((o) => now - new Date(o.createdAt).getTime() <= ms);
  }, [orders, period]);

  const activeOrders = filteredOrders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = activeOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = activeOrders.length ? totalRevenue / activeOrders.length : 0;

  // Status breakdown
  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1; });
    return Object.entries(map).map(([label, value]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value,
      color: STATUS_COLOR[label],
    }));
  }, [filteredOrders]);

  // Revenue by day (last 7 days)
  const revenueByDay = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const value = orders
        .filter((o) => {
          const od = new Date(o.createdAt);
          return (
            od.getDate() === d.getDate() &&
            od.getMonth() === d.getMonth() &&
            o.status !== 'cancelled'
          );
        })
        .reduce((s, o) => s + o.total, 0);
      days.push({ label, value: Math.round(value) });
    }
    return days;
  }, [orders]);

  // Top products by number of times ordered
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; count: number; revenue: number }> = {};
    activeOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!map[item.productId]) map[item.productId] = { name: item.productName, count: 0, revenue: 0 };
        map[item.productId].count += item.quantity;
        map[item.productId].revenue += item.unitPrice * item.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [activeOrders]);

  // Category revenue split
  const categorySplit = useMemo(() => {
    const map: Record<string, number> = {};
    activeOrders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const cat = prod?.category ?? 'Other';
        map[cat] = (map[cat] ?? 0) + item.unitPrice * item.quantity;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [activeOrders, products]);

  return (
    <div className="space-y-5">

      {/* Period toggle */}
      <div className="flex items-center gap-2">
        {(['7d', '30d', 'all'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              period === p ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'All time'}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={DollarSign} color="#10B981" />
        <StatCard label="Orders" value={filteredOrders.length.toString()} sub={`${filteredOrders.filter((o) => o.status === 'pending').length} pending`} icon={ShoppingBag} color="#3B82F6" />
        <StatCard label="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} icon={TrendingUp} color="#8B5CF6" />
        <StatCard label="Products Listed" value={products.length.toString()} sub={`${products.filter((p) => p.inStock).length} in stock`} icon={Tag} color="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue by day */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
            Daily Revenue (Last 7 Days)
          </h3>
          {revenueByDay.every((d) => d.value === 0) ? (
            <div className="h-32 flex items-center justify-center text-neutral-300 text-sm">
              No revenue data yet
            </div>
          ) : (
            <BarChart data={revenueByDay.map((d) => ({ ...d, color: '#171717' }))} />
          )}
        </div>

        {/* Order status breakdown */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
            Order Status Breakdown
          </h3>
          {statusBreakdown.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-neutral-300 text-sm">
              No orders yet
            </div>
          ) : (
            <div className="space-y-2.5">
              {statusBreakdown.map(({ label, value, color }) => {
                const pct = filteredOrders.length ? (value / filteredOrders.length) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-neutral-700">{label}</span>
                      <span className="text-neutral-500">{value} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top products */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
            Top Products by Revenue
          </h3>
          {topProducts.length === 0 ? (
            <div className="py-8 text-center text-neutral-300 text-sm">No sales data yet</div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-400 w-4 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-neutral-400">{p.count} units sold</p>
                  </div>
                  <p className="text-xs font-bold text-neutral-900">${p.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category split */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
            Revenue by Category
          </h3>
          {categorySplit.length === 0 ? (
            <div className="py-8 text-center text-neutral-300 text-sm">No sales data yet</div>
          ) : (
            <BarChart
              data={categorySplit.map(([label, value]) => ({
                label: label.length > 8 ? label.slice(0, 8) + '…' : label,
                value: Math.round(value),
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
