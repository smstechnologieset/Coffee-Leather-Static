'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
  User,
  Building2,
  MapPin,
  FlaskConical,
  Edit2,
  Trash2,
  Plus,
  Save,
  X,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Package,
  Calendar,
  DollarSign,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { UserRequest, getStoredUserRequests } from '@/lib/requests-data';

type Tab = 'profile' | 'companies' | 'addresses' | 'requests';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [companies, setCompanies] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [requestFilter, setRequestFilter] = useState<'all' | 'sample' | 'contract'>('all');
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null);

  // Forms for adding new
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', country: '', vat: '' });

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', city: '', country: '' });

  const [updating, setUpdating] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as Tab;
    if (tabParam && ['profile', 'companies', 'addresses', 'requests'].includes(tabParam)) {
      setActiveTab(tabParam);
      if (tabParam === 'companies') setShowAddCompany(true);
      if (tabParam === 'addresses') setShowAddAddress(true);
    }

    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      let metadataRequests: UserRequest[] = [];

      if (session?.user) {
        setUser(session.user);
        setCompanies(session.user.user_metadata?.companies || []);
        setAddresses(session.user.user_metadata?.addresses || []);

        const metadataContracts: UserRequest[] = session.user.user_metadata?.contract_requests || [];
        const metadataSamples: UserRequest[] = session.user.user_metadata?.sample_requests || [];
        metadataRequests = [...metadataContracts, ...metadataSamples];
      }

      // Merge with persistent store
      const stored = getStoredUserRequests();
      const map = new Map<string, UserRequest>();

      // Metadata requests take precedence if present
      metadataRequests.forEach((r) => map.set(r.id, r));
      stored.forEach((r) => {
        if (!map.has(r.id)) {
          map.set(r.id, r);
        }
      });

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      setRequests(merged);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const saveMetadata = async (newCompanies: any[], newAddresses: any[]) => {
    setUpdating(true);
    const { data, error } = await supabase.auth.updateUser({
      data: {
        companies: newCompanies,
        addresses: newAddresses,
      },
    });
    if (!error && data.user) {
      setUser(data.user);
      setCompanies(newCompanies);
      setAddresses(newAddresses);
    }
    setUpdating(false);
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.country) return;
    const company = { ...newCompany, id: Date.now().toString() };
    const updated = [...companies, company];
    await saveMetadata(updated, addresses);
    setShowAddCompany(false);
    setNewCompany({ name: '', country: '', vat: '' });
  };

  const handleDeleteCompany = async (id: string) => {
    const updated = companies.filter((c) => c.id !== id);
    await saveMetadata(updated, addresses);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.city || !newAddress.country) return;
    const address = { ...newAddress, id: Date.now().toString() };
    const updated = [...addresses, address];
    await saveMetadata(companies, updated);
    setShowAddAddress(false);
    setNewAddress({ label: '', city: '', country: '' });
  };

  const handleDeleteAddress = async (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    await saveMetadata(companies, updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'companies', label: 'My Companies', icon: Building2 },
    { id: 'addresses', label: 'Shipping Addresses', icon: MapPin },
    { id: 'requests', label: 'My Requests', icon: FlaskConical },
  ];

  const filteredRequests = requests.filter((r) => {
    if (requestFilter === 'all') return true;
    return r.type === requestFilter;
  });

  const sampleCount = requests.filter((r) => r.type === 'sample').length;
  const contractCount = requests.filter((r) => r.type === 'contract').length;

  return (
    <main className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-8">Account Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4">
              <div className="flex items-center gap-3 mb-6 p-2 border-b border-neutral-100 pb-4">
                <div className="h-12 w-12 rounded-full bg-amber-400 flex items-center justify-center text-primary-900 font-bold text-xl">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-neutral-900 truncate">
                    {user?.user_metadata?.full_name || 'Buyer Account'}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'bg-primary-50 text-primary-800 font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${activeTab === id ? 'text-primary-700' : 'text-neutral-400'}`} />
                      {label}
                    </div>
                    {id === 'requests' && requests.length > 0 && (
                      <span className="bg-primary-100 text-primary-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {requests.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sm:p-8 animate-fadeIn">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Profile Details</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Email Address</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={user?.user_metadata?.full_name || 'Trader / Roaster'}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Account Role</label>
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2.5 py-1 rounded-full font-bold">
                      {user?.user_metadata?.role || 'Buyer / Roaster'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'companies' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sm:p-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">Registered Companies</h2>
                    <p className="text-neutral-500 text-xs mt-0.5">
                      Required for initiating sample requests and commercial contracts.
                    </p>
                  </div>
                  {!showAddCompany && (
                    <button
                      onClick={() => setShowAddCompany(true)}
                      className="flex items-center gap-1.5 text-xs font-bold bg-primary-700 text-white px-3 py-2 rounded-lg hover:bg-primary-800 transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Add Company
                    </button>
                  )}
                </div>

                {companies.length === 0 && !showAddCompany && (
                  <div className="text-center py-10 border-2 border-dashed border-neutral-100 rounded-xl">
                    <Building2 className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-neutral-500 text-sm">No companies registered yet.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {companies.map((comp) => (
                    <div key={comp.id} className="border border-neutral-200 rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-neutral-900 text-sm">{comp.name}</h3>
                        <p className="text-xs text-neutral-500 mt-1">{comp.country}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">VAT: {comp.vat || 'None'}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCompany(comp.id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {showAddCompany && (
                  <form onSubmit={handleAddCompany} className="border border-primary-200 bg-primary-50/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-neutral-900 text-sm">Add New Company</h4>
                      <button type="button" onClick={() => setShowAddCompany(false)} className="text-neutral-400 hover:text-neutral-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Company Name *</label>
                        <input
                          type="text"
                          required
                          value={newCompany.name}
                          onChange={(e) => setNewCompany((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Country *</label>
                          <input
                            type="text"
                            required
                            value={newCompany.country}
                            onChange={(e) => setNewCompany((prev) => ({ ...prev, country: e.target.value }))}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">VAT / Tax ID (Optional)</label>
                          <input
                            type="text"
                            value={newCompany.vat}
                            onChange={(e) => setNewCompany((prev) => ({ ...prev, vat: e.target.value }))}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={updating}
                        className="w-full bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-800 disabled:opacity-50"
                      >
                        {updating ? 'Saving...' : 'Save Company'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sm:p-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">Delivery Addresses</h2>
                    <p className="text-neutral-500 text-xs mt-0.5">
                      Required for receiving sample batches and container delivery schedules.
                    </p>
                  </div>
                  {!showAddAddress && (
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="flex items-center gap-1.5 text-xs font-bold bg-primary-700 text-white px-3 py-2 rounded-lg hover:bg-primary-800 transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Add Address
                    </button>
                  )}
                </div>

                {addresses.length === 0 && !showAddAddress && (
                  <div className="text-center py-10 border-2 border-dashed border-neutral-100 rounded-xl">
                    <MapPin className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-neutral-500 text-sm">No delivery addresses registered yet.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-neutral-200 rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-neutral-900 text-sm">{addr.label}</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          {addr.city}, {addr.country}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="border border-primary-200 bg-primary-50/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-neutral-900 text-sm">Add New Address</h4>
                      <button type="button" onClick={() => setShowAddAddress(false)} className="text-neutral-400 hover:text-neutral-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Address / Street *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.label}
                          onChange={(e) => setNewAddress((prev) => ({ ...prev, label: e.target.value }))}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">City *</label>
                          <input
                            type="text"
                            required
                            value={newAddress.city}
                            onChange={(e) => setNewAddress((prev) => ({ ...prev, city: e.target.value }))}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Country *</label>
                          <input
                            type="text"
                            required
                            value={newAddress.country}
                            onChange={(e) => setNewAddress((prev) => ({ ...prev, country: e.target.value }))}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={updating}
                        className="w-full bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-800 disabled:opacity-50"
                      >
                        {updating ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sm:p-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">My Requests</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Review all sample evaluations and commercial contract allocations. Click any request to view full details.
                    </p>
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
                    <button
                      onClick={() => setRequestFilter('all')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        requestFilter === 'all'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      All ({requests.length})
                    </button>
                    <button
                      onClick={() => setRequestFilter('contract')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        requestFilter === 'contract'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Contracts ({contractCount})
                    </button>
                    <button
                      onClick={() => setRequestFilter('sample')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        requestFilter === 'sample'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Samples ({sampleCount})
                    </button>
                  </div>
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-neutral-100 rounded-2xl">
                    <FileText className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-600 font-medium text-sm">No requests found in this category.</p>
                    <p className="text-neutral-400 text-xs mt-1">
                      Browse our coffee catalog to request samples or initiate supply contracts.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden">
                    {filteredRequests.map((req) => {
                      const isContract = req.type === 'contract';
                      const formattedDate = req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Recent';

                      return (
                        <div
                          key={req.id}
                          onClick={() => setSelectedRequest(req)}
                          className="p-4 sm:p-5 hover:bg-neutral-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                        >
                          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                            <div
                              className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                                isContract ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {isContract ? <FileText className="h-5 w-5" /> : <FlaskConical className="h-5 w-5" />}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                    isContract ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'
                                  }`}
                                >
                                  {isContract ? 'Contract' : 'Sample'}
                                </span>
                                <span className="text-xs text-neutral-400 font-mono">#{req.id.slice(-8)}</span>
                                <span className="text-xs text-neutral-400">• {formattedDate}</span>
                              </div>

                              <p className="text-base font-bold text-neutral-900 truncate mt-0.5 group-hover:text-primary-700 transition-colors">
                                {req.productName}
                              </p>

                              <p className="text-xs text-neutral-500 truncate mt-0.5">
                                {isContract
                                  ? `${req.quantityQuintals || 5} Quintals (${req.quantityKg || 500} kg) · Total: $${(req.totalValue || 0).toLocaleString()} USD`
                                  : `Sample Size: ${req.sampleSize || '250g'} · ${req.deliveryMethod || 'DHL Express'}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                            <div className="text-left sm:text-right">
                              {isContract ? (
                                <>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {req.status}
                                  </span>
                                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                                    Deposit: ${Number(req.depositAmount || 250).toLocaleString()} USD
                                  </p>
                                </>
                              ) : (
                                <>
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                      req.paymentStatus === 'paid'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                    {req.status}
                                  </span>
                                  <p className="text-[11px] text-neutral-500 mt-0.5">
                                    {req.samplePrice && req.samplePrice > 0 ? `$${req.samplePrice} USD` : 'Free / Complimentary'}
                                  </p>
                                </>
                              )}
                            </div>

                            <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Request Details Modal ──────────────────────────────────────────────── */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-neutral-900 to-primary-950 text-white relative">
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    selectedRequest.type === 'contract'
                      ? 'bg-amber-400 text-neutral-950'
                      : 'bg-indigo-400 text-neutral-950'
                  }`}
                >
                  {selectedRequest.type === 'contract' ? 'Supply Contract Request' : 'Roaster Sample Evaluation'}
                </span>
                <span className="text-xs text-neutral-400 font-mono">ID: {selectedRequest.id}</span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-white pr-8">
                {selectedRequest.productName}
              </h2>

              <p className="text-xs text-neutral-300 mt-1">
                Requested by <strong>{selectedRequest.companyName}</strong> on{' '}
                {new Date(selectedRequest.createdAt || Date.now()).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Status Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-950 text-sm">{selectedRequest.status}</p>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      {selectedRequest.type === 'contract'
                        ? 'Allocation locked in Addis Ababa export warehouse. Trade desk review in progress.'
                        : 'Sample package queued for quality evaluation packaging and dispatch.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-100">
                  <p className="text-[11px] text-neutral-500 uppercase font-semibold">Volume / Size</p>
                  <p className="text-base font-bold text-neutral-900 mt-1">
                    {selectedRequest.type === 'contract'
                      ? `${selectedRequest.quantityQuintals} Quintals`
                      : selectedRequest.sampleSize || '500g'}
                  </p>
                  {selectedRequest.quantityKg && (
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      ({selectedRequest.quantityKg.toLocaleString()} kg)
                    </p>
                  )}
                </div>

                <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-100">
                  <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                    {selectedRequest.type === 'contract' ? 'Secured Deposit' : 'Sample Fee'}
                  </p>
                  <p className="text-base font-bold font-mono text-primary-700 mt-1">
                    {selectedRequest.type === 'contract'
                      ? `$${Number(selectedRequest.depositAmount || 250).toLocaleString()} USD`
                      : selectedRequest.samplePrice && selectedRequest.samplePrice > 0
                      ? `$${selectedRequest.samplePrice} USD`
                      : 'Free'}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Stripe Verified
                  </p>
                </div>

                <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-100 col-span-2 sm:col-span-1">
                  <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                    {selectedRequest.type === 'contract' ? 'Contract Value' : 'Courier Method'}
                  </p>
                  <p className="text-base font-bold font-mono text-neutral-900 mt-1">
                    {selectedRequest.type === 'contract'
                      ? `$${Number(selectedRequest.totalValue || 0).toLocaleString()} USD`
                      : selectedRequest.deliveryMethod || 'DHL Express'}
                  </p>
                  {selectedRequest.deliveryWindow && (
                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{selectedRequest.deliveryWindow}</p>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="border border-neutral-200 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Request Workflow Status</p>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-emerald-500" />
                    <p className="font-semibold text-neutral-900">Initiated</p>
                    <p className="text-neutral-400 text-[10px]">Complete</p>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-emerald-500" />
                    <p className="font-semibold text-neutral-900">Payment</p>
                    <p className="text-emerald-700 text-[10px] font-bold">Secured</p>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-primary-600 animate-pulse" />
                    <p className="font-semibold text-primary-900">Trade Review</p>
                    <p className="text-primary-700 text-[10px]">In Progress</p>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-neutral-200" />
                    <p className="font-semibold text-neutral-400">Export Dispatch</p>
                    <p className="text-neutral-400 text-[10px]">Pending</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Buyer Information */}
                <div className="border border-neutral-100 rounded-2xl p-4 space-y-2 bg-neutral-50/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase">
                    <Building2 className="h-3.5 w-3.5 text-primary-700" />
                    <span>Buyer & Contact</span>
                  </div>
                  <div className="text-xs space-y-1 text-neutral-600">
                    <p>
                      <strong className="text-neutral-900">Company:</strong> {selectedRequest.companyName}
                    </p>
                    <p>
                      <strong className="text-neutral-900">Contact:</strong> {selectedRequest.contactName}
                    </p>
                    <p>
                      <strong className="text-neutral-900">Email:</strong> {selectedRequest.email}
                    </p>
                    {selectedRequest.phone && (
                      <p>
                        <strong className="text-neutral-900">Phone:</strong> {selectedRequest.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="border border-neutral-100 rounded-2xl p-4 space-y-2 bg-neutral-50/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase">
                    <MapPin className="h-3.5 w-3.5 text-primary-700" />
                    <span>Destination</span>
                  </div>
                  <div className="text-xs space-y-1 text-neutral-600">
                    <p>
                      <strong className="text-neutral-900">Address:</strong> {selectedRequest.address}
                    </p>
                    <p>
                      <strong className="text-neutral-900">City / Country:</strong> {selectedRequest.city},{' '}
                      {selectedRequest.country}
                    </p>
                    <p>
                      <strong className="text-neutral-900">Logistics Window:</strong>{' '}
                      {selectedRequest.deliveryWindow || selectedRequest.deliveryMethod || 'Standard'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stripe Payment Reference */}
              {selectedRequest.stripeTransactionId && (
                <div className="p-3.5 bg-neutral-900 text-white rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-400" />
                    <div>
                      <p className="font-semibold text-white">Stripe Test Payment Reference</p>
                      <p className="text-[11px] font-mono text-neutral-400">{selectedRequest.stripeTransactionId}</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              )}

              {/* Notes */}
              {selectedRequest.notes && (
                <div className="border border-neutral-100 rounded-xl p-3.5 bg-neutral-50 text-xs">
                  <p className="font-bold text-neutral-700 mb-1">Additional Buyer Notes:</p>
                  <p className="text-neutral-600 italic">"{selectedRequest.notes}"</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-6 py-2.5 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
