import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Linkedin, Twitter, Instagram } from '@/components/SocialIcons';
import { SITE_CONFIG } from '@highland/shared/site-config';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/businesses', label: 'Our Businesses' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-serif font-bold text-sm">HR</span>
              </div>
              <span className="font-serif text-white font-semibold text-lg">
                {SITE_CONFIG.companyName}
              </span>
            </div>
            <p className="text-neutral-500 leading-relaxed max-w-sm">
              {SITE_CONFIG.companyTagline}. Connecting Ethiopia&apos;s finest agricultural
              products with buyers across the globe since {SITE_CONFIG.foundedYear}.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 pt-2">
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-white/5 hover:bg-primary-500/20 hover:text-primary-400
                           transition-colors duration-150"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={SITE_CONFIG.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="p-2 rounded-lg bg-white/5 hover:bg-primary-500/20 hover:text-primary-400
                           transition-colors duration-150"
              >
                <Twitter size={18} />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-lg bg-white/5 hover:bg-primary-500/20 hover:text-primary-400
                           transition-colors duration-150"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-400 transition-colors duration-150 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2 space-y-2">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                Our Businesses
              </h3>
              <a
                href={SITE_CONFIG.urls.coffeeSite}
                className="block text-sm hover:text-primary-400 transition-colors duration-150"
              >
                ☕ Coffee Trading Platform
              </a>
              <a
                href={SITE_CONFIG.urls.leatherSite}
                className="block text-sm hover:text-primary-400 transition-colors duration-150"
              >
                👜 Leather Store (Coming Soon)
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Mail size={16} className="mt-0.5 text-primary-500 flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.contact.email}`}
                   className="hover:text-primary-400 transition-colors">
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Phone size={16} className="mt-0.5 text-primary-500 flex-shrink-0" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="mt-0.5 text-primary-500 flex-shrink-0" />
                <span>{SITE_CONFIG.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row
                        justify-between items-center gap-4 text-sm text-neutral-600">
          <p>© {year} {SITE_CONFIG.companyName}. All rights reserved.</p>
          <p className="text-xs">
            ⚠️ This site uses placeholder content — see{' '}
            <span className="text-neutral-500">MOCK_DATA.md</span> for details.
          </p>
        </div>
      </div>
    </footer>
  );
}
