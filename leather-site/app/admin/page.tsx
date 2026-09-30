'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Tag, ShoppingBag,
  Percent, FileText, BarChart3, ArrowLeft, Menu, X,
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy-load heavy tab components
const OverviewTab    = dynamic(() => import('@/components/admin/OverviewTab'),    { ssr: false });
const ProductsTab    = dynamic(() => import('@/components/admin/ProductsTab'),    { ssr: false });
const OrdersTab      = dynamic(() => import('@/components/admin/OrdersTab'),      { ssr: false });
const PromoCodesTab  = dynamic(() => import('@/components/admin/PromoCodesTab'),  { ssr: false });
const ContentTab     = dynamic(() => import('@/components/admin/ContentTab'),     { ssr: false });
const AnalyticsTab   = dynamic(() => import('@/components/admin/AnalyticsTab'),   { ssr: false });

type TabId = 'overview' | 'products' | 'orders' | 'promos' | 'content' | 'analytics';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview',   label: 'Overview',    icon: LayoutDashboard },
  { id: 'products',   label: 'Products',    icon: Tag             },
  { id: 'orders',     label: 'Orders',      icon: ShoppingBag     },
  { id: 'promos',     label: 'Promo Codes', icon: Percent         },
  { id: 'content',    label: 'Content',     icon: FileText        },
  { id: 'analytics',  label: 'Analytics',   icon: BarChart3       },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabClick = (id: TabId) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  const Sidebar = () => (
    <nav className="flex flex-col h-full">
      {/* Brand header */}
      <div className="px-5 py-5 border-b border-neutral-100">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-0.5">KIJIJ Leather</p>
        <h1 className="text-sm font-bold text-neutral-900">Admin Dashboard</h1>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTabClick(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left ${
              activeTab === id
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {/* Footer link */}
      <div className="px-4 py-4 border-t border-neutral-100">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to site
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col bg-white border-r border-neutral-200">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="w-64 bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <span className="text-sm font-bold text-neutral-900">Menu</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
            <div className="flex-1">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-neutral-600" />
          </button>

          <div className="flex items-center gap-2">
            <currentTab.icon className="h-4 w-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-900">{currentTab.label}</h2>
          </div>

          <div className="flex-1" />

          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Package className="h-3 w-3" /> View Store
          </Link>
        </header>

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'overview'   && <OverviewTab />}
          {activeTab === 'products'   && <ProductsTab />}
          {activeTab === 'orders'     && <OrdersTab />}
          {activeTab === 'promos'     && <PromoCodesTab />}
          {activeTab === 'content'    && <ContentTab />}
          {activeTab === 'analytics'  && <AnalyticsTab />}
        </main>
      </div>
    </div>
  );
}
