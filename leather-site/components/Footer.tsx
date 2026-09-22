import Link from 'next/link';
import { Shirt, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';

const FOOTER_LINKS = {
  Shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Leather Bags', href: '/products?category=Bags' },
    { name: 'Leather Jackets', href: '/products?category=Jackets' },
    { name: 'Accessories', href: '/products?category=Accessories' },
  ],
  Support: [
    { name: 'Shipping & Returns', href: '/support' },
    { name: 'Leather Care Guide', href: '/care' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Track Order', href: '/account' },
  ],
  Company: [
    { name: 'Highland Roots HQ', href: 'http://localhost:3000' },
    { name: 'Coffee Trading', href: 'http://localhost:3001' },
    { name: 'About Us', href: 'http://localhost:3000/about' },
    { name: 'Contact', href: 'http://localhost:3000/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent-900 rounded-lg">
                <Shirt className="h-6 w-6 text-accent-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">Highland Roots</p>
                <p className="text-accent-400 text-xs mt-1 uppercase tracking-widest">Leather Goods</p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm mb-8">
              Crafting premium Ethiopian leather goods with sustainable practices and timeless design.
              Each piece tells a story of East African heritage.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-accent-400 transition-colors flex items-center gap-2 group"
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

      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.companyName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
