'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag, Heart, Settings, LayoutDashboard,
  Package, Truck, Check, X, Eye, EyeOff, ArrowRight,
  ChevronDown, ChevronUp, AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { getLeatherOrders, LeatherOrder, LeatherOrderStatus } from '@/lib/leather-data';
import { getWishlist } from '@/lib/wishlist';
import { getLeatherProducts, LeatherProduct } from '@/lib/leather-data';
import SignOutButton from './SignOutButton';

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'orders' | 'wishlist' | 'settings';

const STATUS_COLORS: Record<LeatherOrderStatus, string> = {
  pending:    'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped:    'bg-purple-50 text-purple-700',
  delivered:  'bg-emerald-50 text-emerald-700',
  cancelled:  'bg-red-50 text-red-700',
};

const STATUS_STEPS: LeatherOrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

// ── Order tracker progress bar ─────────────────────────────────────────────
function OrderTracker({ order }: { order: LeatherOrder }) {
  const [open, setOpen] = useState(false);
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="flex gap-4">
          {order.items[0]?.productImage && (
            <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-[#F2EDE8]">
              <Image
                src={order.items[0].productImage}
                alt={order.items[0].productName}
                fill className="object-cover" unoptimized
              />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              Order #{order.id.slice(-6)}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              {order.items.length > 1 && ` · ${order.items[0].productName} & more`}
              {order.items.length === 1 && ` · ${order.items[0].productName}`}
            </p>
            <p className="text-xs font-bold text-neutral-900 mt-1">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
          {open ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-neutral-100 px-5 pb-5 pt-4 space-y-5">

          {/* Progress stepper */}
          {!isCancelled && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                Order Progress
              </p>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        done
                          ? active ? 'bg-neutral-900' : 'bg-neutral-900'
                          : 'bg-neutral-200'
                      }`}>
                        {done && !active && <Check className="h-3 w-3 text-white" />}
                        {active && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 transition-colors ${i < currentStep ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2">
                {STATUS_STEPS.map((step) => (
                  <p key={step} className="text-[9px] text-neutral-500 capitalize">{step}</p>
                ))}
              </div>
            </div>
          )}
          {isCancelled && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              <X className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-700 font-medium">This order has been cancelled.</p>
            </div>
          )}

          {/* Tracking info */}
          {order.trackingNumber && (
            <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-2.5">
              <Truck className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-neutral-500">{order.carrier}</p>
                <p className="text-xs font-mono font-semibold text-neutral-900">{order.trackingNumber}</p>
              </div>
            </div>
          )}

          {/* Items list */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Items</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.productImage && (
                  <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-[#F2EDE8]">
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" unoptimized />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">{item.productName}</p>
                  <p className="text-[10px] text-neutral-400">
                    {item.color}{item.size ? ` / ${item.size}` : ''} × {item.quantity}
                  </p>
                </div>
                <p className="text-xs font-bold text-neutral-900">${(item.unitPrice * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="border-t border-neutral-100 pt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600">
                <span>Discount {order.promoCode && `(${order.promoCode})`}</span>
                <span>-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1">
              <span>Total</span><span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-[10px] text-neutral-400">
            Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Wishlist card ─────────────────────────────────────────────────────────────
function WishlistCard({ product, onRemove }: { product: LeatherProduct; onRemove: () => void }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative bg-[#F2EDE8] overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs font-semibold text-neutral-900 leading-tight hover:underline underline-offset-2">{product.name}</h3>
        </Link>
        <p className="text-xs text-neutral-500 mt-0.5 mb-2">{product.tagline}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-neutral-900">${product.price.toFixed(2)}</p>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="text-[10px] font-bold uppercase tracking-wide bg-neutral-900 text-white px-2.5 py-1.5 hover:bg-neutral-700 transition-colors flex items-center gap-1"
            >
              View <ArrowRight className="h-2.5 w-2.5" />
            </Link>
            <button
              onClick={onRemove}
              className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors border border-neutral-200 rounded hover:border-red-200"
              title="Remove from wishlist"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AccountClient({
  initialEmail,
  initialName,
  userId,
  isAdmin,
}: {
  initialEmail: string;
  initialName: string;
  userId: string;
  isAdmin: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<LeatherOrder[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<LeatherProduct[]>([]);

  // Settings state
  const [displayName, setDisplayName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load user data
  useEffect(() => {
    // Orders belonging to this user's email
    const allOrders = getLeatherOrders();
    setOrders(allOrders.filter((o) => o.customerEmail.toLowerCase() === initialEmail.toLowerCase()));

    // Wishlist
    const ids = getWishlist(userId);
    setWishlistIds(ids);
    const products = getLeatherProducts();
    setWishlistProducts(products.filter((p) => ids.includes(p.id)));
  }, [userId, initialEmail]);

  // Keep wishlist in sync
  useEffect(() => {
    const h = () => {
      const ids = getWishlist(userId);
      setWishlistIds(ids);
      const products = getLeatherProducts();
      setWishlistProducts(products.filter((p) => ids.includes(p.id)));
    };
    window.addEventListener('kijij_wishlist_updated', h);
    return () => window.removeEventListener('kijij_wishlist_updated', h);
  }, [userId]);

  const removeFromWishlist = (productId: string) => {
    const { toggleWishlist } = require('@/lib/wishlist');
    toggleWishlist(userId, productId);
  };

  // ── Profile settings save ────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    setSettingsMsg(null);
    const supabase = createClient();

    try {
      // Update display name
      const updates: Parameters<typeof supabase.auth.updateUser>[0] = {
        data: { full_name: displayName },
      };

      // Email change
      if (email !== initialEmail) {
        updates.email = email;
      }

      // Password change
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setSettingsMsg({ type: 'error', text: 'New passwords do not match.' });
          setSettingsSaving(false);
          return;
        }
        if (newPassword.length < 6) {
          setSettingsMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
          setSettingsSaving(false);
          return;
        }
        updates.password = newPassword;
      }

      const { error } = await supabase.auth.updateUser(updates);

      if (error) {
        setSettingsMsg({ type: 'error', text: error.message });
      } else {
        setSettingsMsg({
          type: 'success',
          text: email !== initialEmail
            ? 'Check your new email inbox for a confirmation link.'
            : 'Profile updated successfully.',
        });
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
      }
    } catch {
      setSettingsMsg({ type: 'error', text: 'An unexpected error occurred.' });
    }
    setSettingsSaving(false);
  };

  const avatar = (displayName || initialEmail)[0].toUpperCase();

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'orders',   label: 'My Orders',  icon: ShoppingBag, count: orders.length },
    { id: 'wishlist', label: 'Wishlist',    icon: Heart,       count: wishlistIds.length },
    { id: 'settings', label: 'Profile',    icon: Settings },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold text-neutral-900">My Account</h1>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">

          {/* Sidebar */}
          <aside>
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              {/* Avatar / info */}
              <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold text-lg mb-3">
                  {avatar}
                </div>
                <p className="font-semibold text-neutral-900 text-sm truncate">{displayName || initialEmail}</p>
                <p className="text-xs text-neutral-400 truncate">{initialEmail}</p>
              </div>

              {/* Nav */}
              <nav className="p-2 space-y-0.5">
                {tabs.map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left ${
                      activeTab === id
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {count !== undefined && count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                ))}

                {/* Admin link */}
                {isAdmin && (
                  <>
                    <div className="my-1 border-t border-neutral-100" />
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Access Dashboard
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0">

            {/* ── MY ORDERS ─────────────────────────────────────────── */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
                  My Orders {orders.length > 0 && `(${orders.length})`}
                </h2>
                {orders.length === 0 ? (
                  <div className="bg-white border border-neutral-200 rounded-xl py-20 text-center">
                    <ShoppingBag className="h-10 w-10 text-neutral-200 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-neutral-700 mb-1">No orders yet</p>
                    <p className="text-xs text-neutral-400 mb-5">When you place an order, it will appear here.</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 px-5 py-2.5 hover:bg-neutral-700 transition-colors"
                    >
                      Shop Collection <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  orders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((order) => <OrderTracker key={order.id} order={order} />)
                )}
              </div>
            )}

            {/* ── WISHLIST ──────────────────────────────────────────── */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
                  Wishlist {wishlistProducts.length > 0 && `(${wishlistProducts.length})`}
                </h2>
                {wishlistProducts.length === 0 ? (
                  <div className="bg-white border border-neutral-200 rounded-xl py-20 text-center">
                    <Heart className="h-10 w-10 text-neutral-200 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-neutral-700 mb-1">Your wishlist is empty</p>
                    <p className="text-xs text-neutral-400 mb-5">Tap the ♡ on any product to save it here.</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 px-5 py-2.5 hover:bg-neutral-700 transition-colors"
                    >
                      Browse Products <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlistProducts.map((product) => (
                      <WishlistCard
                        key={product.id}
                        product={product}
                        onRemove={() => removeFromWishlist(product.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PROFILE SETTINGS ─────────────────────────────────── */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Profile Settings</h2>

                {/* Alert */}
                {settingsMsg && (
                  <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm border ${
                    settingsMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {settingsMsg.text}
                  </div>
                )}

                {/* Display name */}
                <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Display Name</h3>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Name</label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email Address</h3>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    {email !== initialEmail && (
                      <p className="text-[11px] text-amber-600 mt-1.5">
                        You will receive a confirmation email to verify the new address.
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Change Password</h3>
                  <p className="text-xs text-neutral-400">Leave blank to keep your current password.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">New Password</label>
                      <div className="relative">
                        <input
                          type={showPw ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          placeholder="Min. 6 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                        >
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Confirm New Password</label>
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="Repeat new password"
                      />
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsSaving}
                  className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                    settingsSaving
                      ? 'bg-neutral-400 text-white cursor-not-allowed'
                      : 'bg-neutral-900 text-white hover:bg-neutral-700'
                  }`}
                >
                  {settingsSaving ? (
                    <span className="animate-pulse">Saving…</span>
                  ) : (
                    <><Check className="h-4 w-4" /> Save Changes</>
                  )}
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
