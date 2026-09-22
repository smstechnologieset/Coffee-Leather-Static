/**
 * shared/site-config.ts
 *
 * ⚠️  SINGLE SOURCE OF TRUTH for the company name and global brand constants.
 * Update here to propagate changes across all three sites.
 */

export const SITE_CONFIG = {
  // ── Company identity ───────────────────────────────────────────────────────
  companyName:    'KIJIJ International LLC',
  companyTagline: 'Ethiopian Specialty Coffee & Premium Leather — Products, Not Just Opportunities',
  foundedYear:    2019,                                  // [MOCK — confirm with client]

  // ── Contact details ────────────────────────────────────────────────────────
  contact: {
    email:   'kijjiinternational@gmail.com',
    emails: [
      'kijjiinternational@gmail.com',
      'Rabbani1946@gmail.com',
      'fahmikemal88@gmail.com',
    ],
    phone:   '+1 (850) 264-5268',
    phones: [
      { label: 'USA',      number: '+1 (850) 264-5268' },
      { label: 'Ethiopia', number: '+251 905 458 008' },
      { label: 'Ethiopia', number: '+251 912 334 771' },
    ],
    address: '121 Gladys Lane, Saluda, SC 29138, USA',
    offices: [
      {
        label:   'USA Headquarters',
        address: '121 Gladys Lane, Saluda, SC 29138',
        country: 'United States',
        phone:   '+1 (850) 264-5268',
      },
      {
        label:   'Ethiopia Operations Center',
        address: 'Sebara Babur, Addis Ababa',
        country: 'Ethiopia',
        phone:   '+251 905 458 008',
      },
    ],
  },

  // ── Social links ───────────────────────────────────────────────────────────
  social: {
    linkedin:  'https://linkedin.com/company/kijij-international', // [MOCK — update when available]
    twitter:   'https://twitter.com/kijijiintl',                   // [MOCK — update when available]
    instagram: 'https://instagram.com/kijijiintl',                 // [MOCK — update when available]
  },

  // ── Cross-site URLs (overridden by env vars at runtime) ───────────────────
  urls: {
    mainSite:    process.env.NEXT_PUBLIC_MAIN_SITE_URL   ?? 'http://localhost:3000',
    coffeeSite:  process.env.NEXT_PUBLIC_COFFEE_SITE_URL ?? 'http://localhost:3001',
    leatherSite: process.env.NEXT_PUBLIC_LEATHER_SITE_URL ?? 'http://localhost:3002',
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
