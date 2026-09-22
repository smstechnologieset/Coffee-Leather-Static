'use client';

import { useState } from 'react';
import { Package, Users, Tag, BarChart3, Settings } from 'lucide-react';
import Image from 'next/image';
import { LEATHER_PRODUCTS } from '@/lib/leather-data';

const STATS = [
  { name: 'Total Revenue', value: '$12,450.00', change: '+12%', icon: BarChart3 },
  { name: 'Active Orders', value: '24', change: '+5%', icon: Package },
  { name: 'Customers', value: '1,204', change: '+18%', icon: Users },
  { name: 'Products', value: LEATHER_PRODUCTS.length.toString(), change: '0%', icon: Tag },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <nav className="p-2 space-y-1">
                {['Overview', 'Orders', 'Products', 'Settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab
                        ? 'bg-accent-50 text-accent-700'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {tab === 'Overview' && <BarChart3 className="h-5 w-5" />}
                    {tab === 'Orders' && <Package className="h-5 w-5" />}
                    {tab === 'Products' && <Tag className="h-5 w-5" />}
                    {tab === 'Settings' && <Settings className="h-5 w-5" />}
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'Overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {STATS.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon className="h-6 w-6 text-accent-600" />
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-neutral-500 text-sm font-medium mb-1">{stat.name}</h3>
                      <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                  <h3 className="text-lg font-serif font-bold text-neutral-900 mb-6">Recent Orders (Mock)</h3>
                  <div className="text-center py-12 text-neutral-500">
                    Supabase connection required to fetch live orders.
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Products' && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
                  <h3 className="text-lg font-serif font-bold text-neutral-900">Product Catalog</h3>
                  <button className="bg-accent-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-800 transition-colors">
                    Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-neutral-600">
                    <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">Product</th>
                        <th className="px-6 py-4 font-medium">Category</th>
                        <th className="px-6 py-4 font-medium">Price</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {LEATHER_PRODUCTS.map((product) => (
                        <tr key={product.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                                <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
                              </div>
                              <span className="font-medium text-neutral-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{product.category}</td>
                          <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
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
    </div>
  );
}
