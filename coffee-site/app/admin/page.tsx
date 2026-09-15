'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
  LayoutDashboard, Package, FlaskConical, FileText, MessageSquare,
  Star, LogOut, Menu, X, TrendingUp, Users, ChevronRight
} from 'lucide-react';

// ── Section imports ────────────────────────────────────────────
import OverviewSection from '@/components/admin/OverviewSection';
import ProductsSection from '@/components/admin/ProductsSection';
import SampleRequestsSection from '@/components/admin/SampleRequestsSection';
import ContractRequestsSection from '@/components/admin/ContractRequestsSection';
import MessagesSection from '@/components/admin/MessagesSection';
import TopProductsSection from '@/components/admin/TopProductsSection';

type Section = 'overview' | 'products' | 'sample-requests' | 'contract-requests' | 'messages' | 'top-products';

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'sample-requests', label: 'Sample Requests', icon: FlaskConical },
  { id: 'contract-requests', label: 'Contract Requests', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'top-products', label: 'Top Products', icon: Star },
];

// Mock stats for demo (replace with Supabase queries)
const MOCK_STATS = {
  products: 6,
  sampleRequests: 12,
  pendingSampleRequests: 4,
  contractRequests: 8,
  pendingContractRequests: 2,
  messages: 15,
  unreadMessages: 3,
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.user_metadata?.role || 'user';
      setUserRole(role);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Allow access for demo — in production check userRole === 'admin'
  const SECTION_LABELS: Record<Section, string> = {
    'overview': 'Dashboard Overview',
    'products': 'Products & Categories',
    'sample-requests': 'Sample Requests',
    'contract-requests': 'Contract Requests',
    'messages': 'Messages',
    'top-products': 'Featured Products',
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection stats={MOCK_STATS} onNavigate={setActiveSection} />;
      case 'products': return <ProductsSection />;
      case 'sample-requests': return <SampleRequestsSection />;
      case 'contract-requests': return <ContractRequestsSection />;
      case 'messages': return <MessagesSection />;
      case 'top-products': return <TopProductsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex pt-16">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-amber-50 border-r border-amber-200 flex flex-col shadow-lg
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:top-0
        mt-16 md:mt-0
      `}>
        <div className="p-5 border-b border-amber-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-neutral-900 text-lg">Admin Panel</h2>
            <p className="text-xs text-neutral-500">Highland Roots Coffee</p>
          </div>
          <button className="md:hidden text-neutral-500 hover:text-neutral-900" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            const badge = id === 'sample-requests' ? MOCK_STATS.pendingSampleRequests
              : id === 'contract-requests' ? MOCK_STATS.pendingContractRequests
              : id === 'messages' ? MOCK_STATS.unreadMessages : 0;

            return (
              <button
                key={id}
                onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-neutral-900 border-l-4 border-primary-600 shadow-sm'
                    : 'text-neutral-700 hover:bg-amber-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary-600' : 'text-neutral-500'}`} />
                <span className="flex-1 text-left">{label}</span>
                {badge > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    id === 'messages' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-amber-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-neutral-200 sticky top-16 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-neutral-500 hover:text-neutral-900">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <span>Admin</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-neutral-900">{SECTION_LABELS[activeSection]}</span>
            </div>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
