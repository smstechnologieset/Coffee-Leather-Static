import Link from 'next/link';
import { Coffee, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';

const FOOTER_LINKS = {
  Trade: [
    { name: 'Browse Coffees', href: '/coffees' },
    { name: 'Request Sample', href: '/coffees' },
    { name: 'Request Contract', href: '/coffees' },
    { name: 'Checkout', href: '/checkout' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Export Desk', href: '/contact' },
    { name: 'KIJIJ International HQ', href: SITE_CONFIG.urls.mainSite },
    { name: 'Artisan Leather Goods', href: SITE_CONFIG.urls.leatherSite },
  ],
  Account: [
    { name: 'Sign In', href: '/login' },
    { name: 'My Settings', href: '/settings' },
    { name: 'My Requests', href: '/settings' },
  ],
};

const ORIGINS = ['Yirgacheffe', 'Sidamo', 'Guji', 'Harar', 'Limu', 'Jimma'];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      {/* Top strip */}
      <div className="bg-primary-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-amber-100 text-sm font-medium">
            🌿 Proudly sourcing from Ethiopia&apos;s finest coffee regions
          </p>
          <div className="flex flex-wrap gap-2">
            {ORIGINS.map((o) => (
              <span key={o} className="bg-white/10 text-amber-200 text-xs px-3 py-1 rounded-full">
                {o}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-700 rounded-lg">
                <Coffee className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">KIJIJ Coffee</p>
                <p className="text-primary-400 text-xs mt-1">A Division of {SITE_CONFIG.companyName}</p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Premium Ethiopian specialty coffee — direct from highland cooperatives to global roasters and buyers. 
              Request samples, negotiate contracts, and establish transparent supply chains.
            </p>

            {/* Offices & Locations */}
            <div className="pt-2 border-t border-neutral-850 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {SITE_CONFIG.contact.offices.map((office) => (
                  <div key={office.label} className="border-l-2 border-primary-600 pl-2.5 space-y-0.5">
                    <p className="text-white font-semibold">{office.label}</p>
                    <p className="text-neutral-400">{office.address}</p>
                  </div>
                ))}
              </div>

              {/* Telephone lines */}
              <div className="pt-2">
                <p className="text-neutral-500 text-[11px] uppercase tracking-wider font-semibold mb-1">Telephone Lines</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-300">
                  {SITE_CONFIG.contact.phones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.number.replace(/\s/g, '')}`}
                      className="hover:text-amber-300 transition-colors"
                    >
                      <span className="text-neutral-500 font-medium mr-1">{phone.label}:</span>
                      {phone.number}
                    </a>
                  ))}
                </div>
              </div>

              {/* Email inquiries */}
              <div className="pt-2">
                <p className="text-neutral-500 text-[11px] uppercase tracking-wider font-semibold mb-1">Email Inquiries</p>
                <div className="flex flex-col gap-1 text-xs text-neutral-300">
                  {SITE_CONFIG.contact.emails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="hover:text-amber-300 transition-colors truncate"
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-amber-300 transition-colors flex items-center gap-1 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-850 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <p>© {year} {SITE_CONFIG.companyName}. All rights reserved.</p>
          <p>
            Powered by{' '}
            <a
              href="https://smstechnologieset.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-amber-300 transition-colors"
            >
              SMS Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
