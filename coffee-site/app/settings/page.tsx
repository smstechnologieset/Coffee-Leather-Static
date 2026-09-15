'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, Building2, MapPin, FlaskConical, Edit2, Trash2, Plus, Save } from 'lucide-react';

type Tab = 'profile' | 'companies' | 'addresses' | 'requests';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demo
  const [companies, setCompanies] = useState([{ id: 1, name: 'Nordic Roasters AB', country: 'Sweden', vat: 'SE123456789' }]);
  const [addresses, setAddresses] = useState([{ id: 1, label: 'Main Warehouse', city: 'Stockholm', country: 'Sweden' }]);
  const [requests] = useState([
    { id: '1', type: 'Sample', product: 'Yirgacheffe Grade 1', status: 'Shipped', date: '2026-09-12' },
    { id: '2', type: 'Contract', product: 'Guji Zone Natural G1', status: 'Pending', date: '2026-09-14' },
  ]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    fetchUser();
  }, []);

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
                  <button className="bg-primary-700 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary-800 transition-colors mt-2">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'companies' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sm:p-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">My Companies</h2>
                  <button className="flex items-center gap-2 text-primary-600 text-sm font-bold hover:text-primary-800">
                    <Plus className="h-4 w-4" /> Add Company
                  </button>
                </div>
                <div className="grid gap-4">
                  {companies.map((company) => (
                    <div key={company.id} className="border border-neutral-100 rounded-xl p-4 flex items-center justify-between hover:border-primary-200 transition-colors">
                      <div>
                        <p className="font-bold text-neutral-900">{company.name}</p>
                        <p className="text-xs text-neutral-500">{company.country} • VAT: {company.vat}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-neutral-400 hover:text-primary-600"><Edit2 className="h-4 w-4" /></button>
                        <button className="text-neutral-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sm:p-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">Shipping Addresses</h2>
                  <button className="flex items-center gap-2 text-primary-600 text-sm font-bold hover:text-primary-800">
                    <Plus className="h-4 w-4" /> Add Address
                  </button>
                </div>
                <div className="grid gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-neutral-100 rounded-xl p-4 flex items-center justify-between hover:border-primary-200 transition-colors">
                      <div>
                        <p className="font-bold text-neutral-900">{addr.label}</p>
                        <p className="text-xs text-neutral-500">{addr.city}, {addr.country}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-neutral-400 hover:text-primary-600"><Edit2 className="h-4 w-4" /></button>
                        <button className="text-neutral-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
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
