/**
 * shared/site-config.ts
 *
 * ⚠️  SINGLE SOURCE OF TRUTH for the company name, brand constants, and cross-site URLs.
 * Update here to propagate changes across all three sites.
 */

export const PRODUCTION_URLS = {
  mainSite:    'https://kijij-main-site.vercel.app',
  coffeeSite:  'https://kijij-coffee-site.vercel.app',
  leatherSite: 'https://kijij-leather-site.vercel.app',
} as const;

export const LOCAL_URLS = {
  mainSite:    'http://localhost:3000',
  coffeeSite:  'http://localhost:3001',
  leatherSite: 'http://localhost:3002',
} as const;

export type SiteKey = 'mainSite' | 'coffeeSite' | 'leatherSite';

/**
 * Detects whether code is executing in a local development context.
 * Checks both browser hostname (localhost / 127.0.0.1) and server-side environment.
 */
export function isLocalEnvironment(): boolean {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.endsWith('.local')
    );
  }

  // Server-side detection:
  // Vercel sets VERCEL=1 or VERCEL_ENV in builds & serverless runtime
  if (process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) {
    return false;
  }

  return process.env.NODE_ENV === 'development';
}

/**
 * Resolves the URL for the specified site depending on whether the current
 * runtime is localhost or production.
 */
export function getSiteUrl(site: SiteKey): string {
  const isLocal = isLocalEnvironment();

  const envValue =
    site === 'mainSite'
      ? process.env.NEXT_PUBLIC_MAIN_SITE_URL
      : site === 'coffeeSite'
      ? process.env.NEXT_PUBLIC_COFFEE_SITE_URL
      : process.env.NEXT_PUBLIC_LEATHER_SITE_URL;

  const trimmedEnv = envValue?.trim();

  if (isLocal) {
    // If local and env var explicitly specifies a localhost/IP address, use it; otherwise fallback to standard local port
    if (trimmedEnv && (trimmedEnv.includes('localhost') || trimmedEnv.includes('127.0.0.1'))) {
      return trimmedEnv.replace(/\/$/, '');
    }
    return LOCAL_URLS[site];
  }

  // Production / Deployed environment (Vercel, custom domain)
  // If an env var is set and does not point to localhost, use it (allows future custom domain overrides)
  if (trimmedEnv && !trimmedEnv.includes('localhost') && !trimmedEnv.includes('127.0.0.1')) {
    return trimmedEnv.replace(/\/$/, '');
  }

  return PRODUCTION_URLS[site];
}

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

  // ── Cross-site URLs (adaptive: localhost during dev, production on Vercel) ───
  urls: {
    get mainSite(): string {
      return getSiteUrl('mainSite');
    },
    get coffeeSite(): string {
      return getSiteUrl('coffeeSite');
    },
    get leatherSite(): string {
      return getSiteUrl('leatherSite');
    },
  },
};

export type SiteConfig = typeof SITE_CONFIG;
