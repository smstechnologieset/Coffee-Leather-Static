'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/businesses', label: 'Our Businesses' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-serif font-bold text-sm">HR</span>
            </div>
            <span className="font-serif text-white font-semibold text-lg leading-tight hidden sm:block">
              {SITE_CONFIG.companyName}
            </span>
            <span className="font-serif text-white font-semibold text-base leading-tight sm:hidden">
              Highland Roots
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white
                           hover:bg-white/10 rounded-lg transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={SITE_CONFIG.urls.coffeeSite}
              className="ml-4 px-5 py-2 bg-primary-500 hover:bg-primary-400 text-white text-sm
                         font-semibold rounded-lg transition-colors duration-150"
            >
              Browse Coffees
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            className="lg:hidden p-2 text-neutral-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-neutral-950/98 backdrop-blur-md border-t border-white/10">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-neutral-300 hover:text-white
                           hover:bg-white/10 rounded-lg transition-colors duration-150"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={SITE_CONFIG.urls.coffeeSite}
              className="mt-2 px-4 py-3 bg-primary-500 hover:bg-primary-400 text-white text-sm
                         font-semibold rounded-lg transition-colors duration-150 text-center"
            >
              Browse Coffees →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
