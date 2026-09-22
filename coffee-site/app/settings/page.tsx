'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, Building2, MapPin, FlaskConical, Edit2, Trash2, Plus, Save, X } from 'lucide-react';

type Tab = 'profile' | 'companies' | 'addresses' | 'requests';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [companies, setCompanies] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [requests] = useState([
    { id: '1', type: 'Sample', product: 'Yirgacheffe Grade 1', status: 'Shipped', date: '2026-09-12' },
    { id: '2', type: 'Contract', product: 'Guji Zone Natural G1', status: 'Pending', date: '2026-09-14' },
  ]);

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
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setCompanies(session.user.user_metadata?.companies || []);
        setAddresses(session.user.user_metadata?.addresses || []);
      }
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
      }
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
    const updated = companies.filter(c => c.id !== id);
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
    const updated = addresses.filter(a => a.id !== id);
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
                  <p className="font-bold text-neutral-900 truncate">{user?.user_metadata?.full_name || 'Buyer Account'}</p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${activeTab === id ? 'text-primary-600' : 'text-neutral-400'}`} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sm:p-8 animate-fadeIn">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Profile Information</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                    <input type="text" defaultValue={user?.user_metadata?.full_name || ''} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                    <input type="email" disabled value={user?.email || ''} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-500 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'companies' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sm:p-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">My Companies</h2>
                  <button 
                    onClick={() => setShowAddCompany(true)}
                    className="flex items-center gap-2 text-primary-600 text-sm font-bold hover:text-primary-800"
                  >
                    <Plus className="h-4 w-4" /> Add Company
                  </button>
                </div>

                {companies.length === 0 && !showAddCompany && (
                  <div className="text-center py-10 bg-neutral-50 rounded-xl border border-neutral-100">
                    <Building2 className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 text-sm">No companies added yet.</p>
                  </div>
                )}

                <div className="grid gap-4">
                  {companies.map((company) => (
                    <div key={company.id} className="border border-neutral-100 rounded-xl p-4 flex items-center justify-between hover:border-primary-200 transition-colors">
                      <div>
                        <p className="font-bold text-neutral-900">{company.name}</p>
                        <p className="text-xs text-neutral-500">{company.country} • VAT: {company.vat || 'N/A'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDeleteCompany(company.id)}
                          disabled={updating}
                          className="text-neutral-400 hover:text-red-500 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {showAddCompany && (
                  <form onSubmit={handleAddCompany} className="mt-6 p-5 border border-primary-100 bg-primary-50/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Add New Company</h3>
                      <button type="button" onClick={() => setShowAddCompany(false)} className="text-neutral-400 hover:text-neutral-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Company Name *</label>
                        <input type="text" required value={newCompany.name} onChange={e => setNewCompany(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Country *</label>
                          <input type="text" required value={newCompany.country} onChange={e => setNewCompany(prev => ({ ...prev, country: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">VAT Number</label>
                          <input type="text" value={newCompany.vat} onChange={e => setNewCompany(prev => ({ ...prev, vat: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
                        </div>
                      </div>
                      <button type="submit" disabled={updating} className="w-full bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-800 disabled:opacity-50">
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
                  <h2 className="text-xl font-bold text-neutral-900">Shipping Addresses</h2>
                  <button 
                    onClick={() => setShowAddAddress(true)}
                    className="flex items-center gap-2 text-primary-600 text-sm font-bold hover:text-primary-800"
                  >
                    <Plus className="h-4 w-4" /> Add Address
                  </button>
                </div>

                {addresses.length === 0 && !showAddAddress && (
                  <div className="text-center py-10 bg-neutral-50 rounded-xl border border-neutral-100">
                    <MapPin className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 text-sm">No addresses added yet.</p>
                  </div>
                )}

                <div className="grid gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-neutral-100 rounded-xl p-4 flex items-center justify-between hover:border-primary-200 transition-colors">
                      <div>
                        <p className="font-bold text-neutral-900">{addr.label}</p>
                        <p className="text-xs text-neutral-500">{addr.city}, {addr.country}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDeleteAddress(addr.id)}
                          disabled={updating}
                          className="text-neutral-400 hover:text-red-500 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="mt-6 p-5 border border-primary-100 bg-primary-50/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Add New Address</h3>
                      <button type="button" onClick={() => setShowAddAddress(false)} className="text-neutral-400 hover:text-neutral-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Address / Street *</label>
                        <input type="text" required value={newAddress.label} onChange={e => setNewAddress(prev => ({ ...prev, label: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">City *</label>
                          <input type="text" required value={newAddress.city} onChange={e => setNewAddress(prev => ({ ...prev, city: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Country *</label>
                          <input type="text" required value={newAddress.country} onChange={e => setNewAddress(prev => ({ ...prev, country: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
                        </div>
                      </div>
                      <button type="submit" disabled={updating} className="w-full bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-800 disabled:opacity-50">
                        {updating ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sm:p-8 animate-fadeIn">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">My Requests</h2>
                <div className="border border-neutral-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-neutral-600">Type</th>
                        <th className="px-4 py-3 font-semibold text-neutral-600">Product</th>
                        <th className="px-4 py-3 font-semibold text-neutral-600">Date</th>
                        <th className="px-4 py-3 font-semibold text-neutral-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 font-medium text-neutral-900">{req.type}</td>
                          <td className="px-4 py-3 text-neutral-600">{req.product}</td>
                          <td className="px-4 py-3 text-neutral-500 text-xs">{req.date}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              req.status === 'Shipped' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
