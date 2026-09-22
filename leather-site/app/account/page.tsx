import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { LogOut, Package, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';
import SignOutButton from './SignOutButton';

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;
  const name = user.user_metadata?.full_name || user.email;

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold text-neutral-900">My Account</h1>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <div className="h-12 w-12 bg-accent-100 rounded-full flex items-center justify-center text-accent-700 font-bold text-xl mb-4">
                  {name[0].toUpperCase()}
                </div>
                <h2 className="text-lg font-bold text-neutral-900 line-clamp-1">{name}</h2>
                <p className="text-sm text-neutral-500 line-clamp-1">{user.email}</p>
              </div>
              <nav className="p-2 space-y-1">
                <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-accent-50 text-accent-700">
                  <Package className="h-5 w-5" /> Order History
                </Link>
                <Link href="#addresses" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-neutral-600 hover:bg-neutral-50">
                  <MapPin className="h-5 w-5" /> Saved Addresses
                </Link>
                <Link href="#settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-neutral-600 hover:bg-neutral-50">
                  <Settings className="h-5 w-5" /> Account Settings
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sm:p-8">
              <h2 className="text-xl font-serif font-bold text-neutral-900 mb-6">Order History</h2>
              
              <div className="text-center py-16">
                <Package className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-1">No orders yet</h3>
                <p className="text-sm text-neutral-500 mb-6">When you place an order, it will appear here.</p>
                <Link href="/products" className="inline-block bg-accent-700 text-white px-6 py-2 rounded-md font-medium hover:bg-accent-800 transition-colors">
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
