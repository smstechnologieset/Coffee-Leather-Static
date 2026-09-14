/**
 * shared/site-config.ts
 *
 * ⚠️  SINGLE SOURCE OF TRUTH for the company name and global brand constants.
 * This is the ONLY place "Highland Roots Trading PLC" should appear as a
 * hard-coded string. Update here when the client confirms the real name.
 *
 * MOCK: everything marked [MOCK] is a placeholder — see /docs/MOCK_DATA.md
 */

export const SITE_CONFIG = {
  // ── Company identity ───────────────────────────────────────────────────────
  companyName:    'Highland Roots Trading PLC',          // [MOCK] replace with real name
  companyTagline: 'Ethiopia\'s Finest, Delivered to the World', // [MOCK]
  foundedYear:    2019,                                  // [MOCK]

  // ── Contact details ────────────────────────────────────────────────────────
  contact: {
    email:   'info@highlandroots.example.com',           // [MOCK]
    phone:   '+251 11 234 5678',                         // [MOCK]
    address: 'Bole Road, Addis Ababa, Ethiopia',         // [MOCK]
  },

  // ── Social links ───────────────────────────────────────────────────────────
  social: {
    linkedin:  'https://linkedin.com/company/highland-roots', // [MOCK placeholder URL]
    twitter:   'https://twitter.com/highland_roots',          // [MOCK placeholder URL]
    instagram: 'https://instagram.com/highland_roots',        // [MOCK placeholder URL]
  },

  // ── Cross-site URLs (overridden by env vars at runtime) ───────────────────
  urls: {
    mainSite:    process.env.NEXT_PUBLIC_MAIN_SITE_URL   ?? 'http://localhost:3000',
    coffeeSite:  process.env.NEXT_PUBLIC_COFFEE_SITE_URL ?? 'http://localhost:3001',
    leatherSite: process.env.NEXT_PUBLIC_LEATHER_SITE_URL ?? 'http://localhost:3002',
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
