import Link from 'next/link';
import { Coffee, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const FOOTER_LINKS = {
  Trade: [
    { name: 'Browse Coffees', href: '/coffees' },
    { name: 'Request Sample', href: '/coffees' },
    { name: 'Request Contract', href: '/coffees' },
    { name: 'Checkout', href: '/checkout' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Highland Roots HQ', href: 'http://localhost:3000' },
    { name: 'Leather Products', href: 'http://localhost:3002' },
  ],
  Account: [
    { name: 'Sign In', href: '/login' },
    { name: 'My Settings', href: '/settings' },
    { name: 'My Requests', href: '/settings' },
  ],
};

const ORIGINS = ['Yirgacheffe', 'Sidamo', 'Guji', 'Harar', 'Limu', 'Jimma'];

export default function Footer() {
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
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-700 rounded-lg">
                <Coffee className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">Highland Roots</p>
                <p className="text-primary-400 text-xs">Coffee Trading PLC</p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs mb-6">
              Premium Ethiopian specialty coffee — direct from highland farms to global buyers. 
              Request samples, negotiate contracts, and build lasting supply chain partnerships.
            </p>
            <div className="space-y-2">
              <a href="mailto:coffee@highlandroots.et" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-300 transition-colors">
                <Mail className="h-4 w-4 text-primary-500" /> coffee@highlandroots.et
              </a>
              <a href="tel:+251111234567" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-300 transition-colors">
                <Phone className="h-4 w-4 text-primary-500" /> +251 11 123 4567
              </a>
              <p className="flex items-center gap-2 text-sm text-neutral-400">
                <MapPin className="h-4 w-4 text-primary-500 flex-shrink-0" /> Bole Atlas, Addis Ababa, Ethiopia
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-amber-300 transition-colors flex items-center gap-1 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Highland Roots Trading PLC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Part of</span>
            <Link href="http://localhost:3000" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
              Highland Roots Group
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
