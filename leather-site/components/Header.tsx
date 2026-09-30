'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingBag, User, Search, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { getLeatherProducts } from '@/lib/leather-data';
import { createClient } from '@/lib/supabase';

// Mega-menu structure
const MEGA_MENU = [
  {
    label: 'Bags',
    navLabel: 'Bags',
    href: '/products?category=Bags',
    subs: [
      { name: 'All Bags', href: '/products?category=Bags' },
      { name: 'Duffles & Travel', href: '/products?category=Bags&sub=Duffle' },
      { name: 'Totes', href: '/products?category=Bags&sub=Tote' },
      { name: 'Backpacks', href: '/products?category=Bags&sub=Backpack' },
      { name: 'Crossbody', href: '/products?category=Bags&sub=Crossbody' },
    ],
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80',
  },
  {
    label: 'Outerwear',
    navLabel: 'Outerwear',
    href: '/products?category=Jackets',
    subs: [
      { name: 'All Jackets', href: '/products?category=Jackets' },
      { name: 'Biker Jackets', href: '/products?category=Jackets&sub=Biker+Jacket' },
      { name: 'Trench Coats', href: '/products?category=Jackets&sub=Trench' },
      { name: 'Bomber Jackets', href: '/products?category=Jackets&sub=Bomber' },
    ],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
  },
  {
    label: 'Wallets',
    navLabel: 'Wallets',
    href: '/products?category=Wallets',
    subs: [
      { name: 'All Wallets', href: '/products?category=Wallets' },
      { name: 'Bifold', href: '/products?category=Wallets&sub=Bifold' },
      { name: 'Card Holders', href: '/products?category=Wallets&sub=Card+Holder' },
    ],
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
  },
  {
    label: 'Small Leather Goods',
    navLabel: 'Small Goods',
    href: '/products?category=Small+Leather+Goods',
    subs: [
      { name: 'All Small Goods', href: '/products?category=Small+Leather+Goods' },
      { name: 'Keychains', href: '/products?category=Small+Leather+Goods&sub=Keychain' },
      { name: 'Passport Holders', href: '/products?category=Small+Leather+Goods&sub=Passport' },
    ],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
  },
  {
    label: 'Belts & Accessories',
    navLabel: 'Accessories',
    href: '/products?category=Belts+%26+Accessories',
    subs: [
      { name: 'All Accessories', href: '/products?category=Belts+%26+Accessories' },
      { name: 'Belts', href: '/products?category=Belts+%26+Accessories&sub=Belt' },
      { name: 'Cuffs & Bands', href: '/products?category=Belts+%26+Accessories&sub=Cuff' },
    ],
    image: 'https://images.unsplash.com/photo-1611911813383-67769b37a149?w=400&q=80',
  },
];

const CONTENT_KEY = 'kijij_leather_content_v1';
function getAnnouncementText(): string {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(CONTENT_KEY) : null;
    if (!raw) return '';
    const data = JSON.parse(raw);
    if (!data.announcementEnabled) return '';
    return data.announcementText?.trim() ?? '';
  } catch { return ''; }
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof getLeatherProducts>>([]);
  const [scrolled, setScrolled] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { items, setIsOpen } = useCartStore();
  const searchRef = useRef<HTMLInputElement>(null);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartCount = mounted ? items.reduce((a, i) => a + i.quantity, 0) : 0;

  useEffect(() => {
    setMounted(true);
    setAnnouncement(getAnnouncementText());

    // Check auth
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));

    // Scroll
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Sync announcement
    const onContent = () => setAnnouncement(getAnnouncementText());
    window.addEventListener('kijij_leather_content_updated', onContent);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('kijij_leather_content_updated', onContent);
    };
  }, []);

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results = getLeatherProducts()
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 6);
    setSearchResults(results);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  // Close menu/search on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  const handleMenuEnter = (label: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setActiveMenu(label);
  };
  const handleMenuLeave = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const headerBg = scrolled ? 'bg-white shadow-[0_1px_0_0_#E5E7EB]' : 'bg-white';

  return (
    <>
      {/* ── Announcement bar ── */}
      {announcement && (
        <div className="bg-neutral-900 text-neutral-200 text-[11px] tracking-widest uppercase text-center py-2 px-4 font-medium">
          {announcement}
        </div>
      )}

      <header className={`sticky top-0 inset-x-0 z-40 transition-shadow duration-200 ${headerBg}`}>

        {/* ── Main header row — 3-col grid keeps logo always centred ── */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-[60px] lg:h-[68px]">

            {/* Col 1: Desktop nav | Mobile: empty (hamburger is in col 3) */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
              {MEGA_MENU.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(item.label)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link
                    href={item.href}
                    className={`text-[11px] font-bold uppercase tracking-[0.12em] transition-colors pb-1 border-b-[1.5px] whitespace-nowrap ${
                      activeMenu === item.label
                        ? 'text-neutral-900 border-neutral-900'
                        : 'text-neutral-600 border-transparent hover:text-neutral-900 hover:border-neutral-400'
                    }`}
                  >
                    {item.navLabel ?? item.label}
                  </Link>
                </div>
              ))}
            </nav>
            {/* Mobile col 1: empty div so grid stays balanced */}
            <div className="lg:hidden" />

            {/* Col 2: Logo — always centred */}
            <Link href="/" className="flex flex-col items-center leading-none group px-6">
              <span className="font-serif text-xl font-bold tracking-[0.08em] text-neutral-900 group-hover:opacity-70 transition-opacity">
                KIJIJ
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.35em] text-neutral-400 mt-0.5">
                Leather Goods
              </span>
            </Link>

            {/* Col 3: Icons right-aligned */}
            <div className="flex items-center gap-4 justify-end">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </button>

              <Link
                href={isLoggedIn ? '/account' : '/login'}
                className="text-neutral-600 hover:text-neutral-900 transition-colors hidden sm:block"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </Link>

              <button
                onClick={() => setIsOpen(true)}
                className="relative text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-neutral-900 text-white text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden text-neutral-700 p-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mega Menu ── */}
        {MEGA_MENU.map((item) =>
          activeMenu === item.label ? (
            <div
              key={item.label}
              className="absolute top-full inset-x-0 bg-white border-t border-neutral-100 shadow-xl z-50"
              onMouseEnter={() => handleMenuEnter(item.label)}
              onMouseLeave={handleMenuLeave}
            >
              <div className="max-w-[1440px] mx-auto px-16 py-10 grid grid-cols-3 gap-12">
                {/* Sub-links */}
                <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-1">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-4">
                      {item.label}
                    </p>
                    <ul className="space-y-2.5">
                      {item.subs.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            href={sub.href}
                            className="text-sm text-neutral-700 hover:text-neutral-900 hover:translate-x-1 transition-all inline-block font-medium"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-4">
                      Shop All
                    </p>
                    <Link
                      href="/products"
                      className="text-sm text-neutral-700 hover:text-neutral-900 font-medium hover:translate-x-1 transition-all inline-block"
                    >
                      View all products →
                    </Link>
                  </div>
                </div>

                {/* Featured image */}
                <div className="relative overflow-hidden bg-[#F2EDE8] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="p-4">
                    <Link
                      href={item.href}
                      className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:underline underline-offset-4"
                    >
                      Shop {item.label} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-[60px] bg-white z-50 overflow-y-auto">
            <div className="px-6 py-6 space-y-1">
              {MEGA_MENU.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-3 border-b border-neutral-100 text-sm font-bold uppercase tracking-widest text-neutral-900"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-6 space-y-3">
                <Link href="/products" className="block py-2 text-sm text-neutral-600 font-medium">
                  Shop All Products
                </Link>
                <Link href={isLoggedIn ? '/account' : '/login'} className="flex items-center gap-2 py-2 text-sm text-neutral-600 font-medium">
                  <User className="h-4 w-4" /> {isLoggedIn ? 'My Account' : 'Sign In'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-md flex flex-col">
          {/* Top bar */}
          <div className="flex items-center gap-4 px-8 py-5 border-b border-neutral-100">
            <Search className="h-5 w-5 text-neutral-400 flex-shrink-0" />
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, categories..."
              className="flex-1 text-lg text-neutral-900 bg-transparent outline-none placeholder-neutral-400"
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
                if (e.key === 'Enter' && searchQuery.trim()) {
                  router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                  setSearchOpen(false);
                }
              }}
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
              <X className="h-5 w-5 text-neutral-400 hover:text-neutral-900 transition-colors" />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {searchQuery && searchResults.length === 0 && (
              <p className="text-neutral-400 text-sm">No results for &ldquo;{searchQuery}&rdquo;</p>
            )}
            {searchResults.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">
                  Products
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="group"
                    >
                      <div className="relative bg-[#F2EDE8] overflow-hidden mb-2" style={{ aspectRatio: '4/5' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                      <p className="text-xs text-neutral-500">${p.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {!searchQuery && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Browse categories</p>
                <div className="flex flex-wrap gap-2">
                  {MEGA_MENU.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      className="text-sm font-medium text-neutral-700 border border-neutral-200 px-4 py-2 rounded-full hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
