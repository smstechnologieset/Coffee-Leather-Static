'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shirt, ArrowLeft, ShoppingBag, User } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { useCartStore } from '@/store/cartStore';

const NAV_LINKS = [
  { name: 'Shop All', href: '/products' },
  { name: 'Bags', href: '/products?category=Bags' },
  { name: 'Jackets', href: '/products?category=Jackets' },
  { name: 'Accessories', href: '/products?category=Accessories' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { items, setIsOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        {/* Top announcement bar */}
        <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 text-center">
          <p>Complimentary worldwide shipping on orders over $250</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-accent-50 rounded-lg group-hover:bg-accent-100 transition-colors">
                <Shirt className="h-6 w-6 text-accent-700" />
              </div>
              <div>
                <span className="block text-sm font-bold text-neutral-900 leading-none">
                  Highland Roots
                </span>
                <span className="block text-xs text-accent-600 font-medium leading-none mt-1 uppercase tracking-widest">
                  Leather Goods
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="http://localhost:3000"
                className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-accent-600 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Corporate
              </Link>
              <div className="h-4 w-px bg-neutral-200" />
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    pathname === link.href || pathname === link.href.split('?')[0]
                      ? 'text-accent-700'
                      : 'text-neutral-600 hover:text-accent-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4 lg:gap-6">
              <Link href="/login" className="text-neutral-600 hover:text-accent-700 transition-colors hidden sm:block">
                <User className="h-5 w-5" />
              </Link>
              <button 
                onClick={() => setIsOpen(true)}
                className="relative text-neutral-600 hover:text-accent-700 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-accent-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile toggle */}
              <button
                className="lg:hidden p-2 -mr-2 text-neutral-600"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-100 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-serif font-semibold text-neutral-900"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-neutral-100 flex flex-col gap-4">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                  <User className="h-4 w-4" /> Sign In / Account
                </Link>
                <Link href="http://localhost:3000" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                  <ArrowLeft className="h-4 w-4" /> Back to Corporate
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
