'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();

  const NAV_LINKS = [
    { href: '/',           label: t('nav.home') },
    { href: '/about',      label: t('nav.about') },
    { href: '/businesses', label: t('nav.businesses') },
    { href: '/gallery',    label: t('nav.gallery') },
    { href: '/news',       label: t('nav.news') },
    { href: '/currency',   label: t('nav.currency') },
    { href: '/contact',    label: t('nav.contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 shadow-subtle'
          : 'bg-neutral-950/90 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 rounded-xs bg-primary-700 border border-primary-500/40 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:border-primary-400">
              <span className="text-white font-serif font-bold text-sm tracking-wider">KI</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-white font-medium text-base tracking-wide leading-tight group-hover:text-primary-100 transition-colors">
                {SITE_CONFIG.companyName}
              </span>
              <span className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-medium leading-tight mt-0.5">
                Specialty Coffee & Leather
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.14em] font-medium transition-colors duration-200 py-1 relative ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Language Switcher */}
            <div className="pl-4 border-l border-neutral-800 flex items-center">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors duration-150"
                aria-label="Toggle language"
              >
                <span className="text-neutral-400 text-[11px]">Lang:</span>
                <span className="font-semibold text-white tracking-wide">
                  {language === 'en' ? 'EN' : 'አማ'}
                </span>
              </button>
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-2.5">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-xs border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'EN' : 'አማ'}
            </button>
            <button
              id="mobile-menu-toggle"
              className="p-2 text-neutral-300 hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm uppercase tracking-[0.15em] font-medium py-2 transition-colors ${
                    isActive ? 'text-primary-400 font-semibold' : 'text-neutral-300 hover:text-white'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
