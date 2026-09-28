'use client';

import Link from 'next/link';
import { Linkedin, Twitter, Instagram } from '@/components/SocialIcons';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  const NAV_LINKS = [
    { href: '/',           label: t('nav.home') },
    { href: '/about',      label: t('nav.about') },
    { href: '/businesses', label: t('nav.businesses') },
    { href: '/news',       label: t('nav.news') },
    { href: '/currency',   label: t('nav.currency') },
    { href: '/contact',    label: t('nav.contact') },
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-neutral-850">

          {/* Brand column — 4 cols on lg */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xs bg-primary-700 border border-primary-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-serif font-bold text-sm tracking-wider">KI</span>
              </div>
              <div>
                <span className="font-serif text-white font-medium text-lg leading-tight block">
                  {SITE_CONFIG.companyName}
                </span>
                <span className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-medium">
                  {t('footer.subtitle')}
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>

            {/* Social links with restrained square styling */}
            <div className="flex gap-2.5 pt-2">
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xs border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors duration-150"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={SITE_CONFIG.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-xs border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors duration-150"
              >
                <Twitter size={16} />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xs border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors duration-150"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Navigation — 3 cols on lg */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">
              {t('footer.nav')}
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white text-sm text-neutral-400 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-neutral-900 space-y-2">
              <p className="text-neutral-500 text-xs uppercase tracking-[0.16em]">{t('footer.direct_sites')}</p>
              <a
                href={SITE_CONFIG.urls.coffeeSite}
                className="block text-sm text-neutral-300 hover:text-primary-400 transition-colors"
              >
                {t('footer.coffee_link')}
              </a>
              <a
                href={SITE_CONFIG.urls.leatherSite}
                className="block text-sm text-neutral-300 hover:text-primary-400 transition-colors"
              >
                {t('footer.leather_link')}
              </a>
            </div>
          </div>

          {/* Offices & Contact — 5 cols on lg */}
          <div className="lg:col-span-5 space-y-5">
            <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">
              {t('footer.offices')}
            </h3>
            <div className="space-y-4 text-sm">
              {/* Offices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SITE_CONFIG.contact.offices.map((office) => (
                  <div key={office.label} className="border-l-2 border-primary-700/60 pl-3 space-y-0.5">
                    <p className="text-white font-medium text-xs uppercase tracking-wider">{office.label}</p>
                    <p className="text-neutral-400 text-xs leading-relaxed">{office.address}</p>
                  </div>
                ))}
              </div>

              {/* All 3 Phone Lines */}
              <div className="pt-2 border-t border-neutral-900">
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">{t('footer.phones')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SITE_CONFIG.contact.phones.map((phone, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="text-neutral-500 block text-[10px] uppercase font-semibold">{phone.label}</span>
                      <a
                        href={`tel:${phone.number.replace(/\s/g, '')}`}
                        className="text-neutral-300 hover:text-primary-400 transition-colors"
                      >
                        {phone.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* All 3 Email Inquiries */}
              <div className="pt-2 border-t border-neutral-900">
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">{t('footer.emails')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SITE_CONFIG.contact.emails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="block text-neutral-300 hover:text-primary-400 text-xs transition-colors truncate"
                      title={email}
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© {year} {SITE_CONFIG.companyName}. {t('footer.rights')}</p>
          <p className="text-neutral-500">
            {t('footer.powered_by')}{' '}
            <a
              href="https://smstechnologieset.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-primary-400 transition-colors"
            >
              SMS Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
