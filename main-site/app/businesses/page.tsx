import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Coffee, Package, Check } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';

export const metadata: Metadata = {
  title: 'Our Businesses',
  description: `Explore the two business lines of ${SITE_CONFIG.companyName}: specialty Ethiopian coffee trading and a coming-soon premium leather goods store.`,
};

const BUSINESSES = [
  {
    id: 'coffee',
    name: 'Coffee Trading Platform',
    tagline: 'Specialty Ethiopian Arabicas for the World',
    status: 'live' as const,
    description:
      'Our flagship business connects smallholder Ethiopian coffee producers with wholesale buyers across North America, Europe, and Asia. We offer six distinct origins — Yirgacheffe, Sidamo, Guji, Harar, Limu, and Jimma — across all major process methods. When buyers place sample requests or container orders, we manage quality grading and export shipments directly to their destination.',
    highlights: [
      '6 Ethiopian coffee origins (Yirgacheffe, Sidamo, Guji, Harar, Limu, Jimma)',
      '3 process methods: Washed, Natural, Honey',
      'Grades 1–4 available with full lot traceability',
      'Samples, 60kg bags, 1-ton lots, and full containers',
      'Direct export shipping under FOB / CIF trade terms',
    ],
    cta: { label: 'Browse Coffee Catalog', href: SITE_CONFIG.urls.coffeeSite },
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=1100&q=80',
  },
  {
    id: 'leather',
    name: 'Leather Goods Store',
    tagline: 'Premium Ethiopian Leather — Coming Soon',
    status: 'coming-soon' as const,
    description:
      'Ethiopia is home to one of Africa\'s largest livestock populations and a centuries-old tradition of leather craftsmanship. Our upcoming leather goods line will offer a curated collection of premium bags, accessories, and garments produced by skilled Ethiopian artisans using responsibly sourced hides, exported directly to retail and wholesale customers worldwide.',
    highlights: [
      'Premium Ethiopian highland leather',
      'Artisan-crafted travel goods and accessories',
      'Handcrafted bags, executive briefcases, garments',
      'Responsibly sourced East African hides',
      'Direct worldwide customer delivery and export',
    ],
    cta: { label: 'View Coming Soon Page', href: SITE_CONFIG.urls.leatherSite },
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1100&q=80',
  },
];

export default function BusinessesPage() {
  const coffee = BUSINESSES[0];
  const leather = BUSINESSES[1];

  return (
    <main className="flex flex-col bg-white">

      {/* ── 1. Page Header ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-neutral-950 text-white relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=85"
            alt="Export vessel shipping products to international buyers"
            fill
            className="object-cover opacity-15 filter brightness-75"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary-500/30 bg-primary-950/60 rounded-xs">
              <span className="text-primary-300 text-xs uppercase tracking-[0.2em] font-medium">
                Our Divisions
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-serif font-normal text-white leading-tight tracking-tight">
              Two Pillars of Ethiopian Excellence
            </h1>

            <p className="text-neutral-300 text-lg sm:text-xl font-light leading-relaxed">
              {SITE_CONFIG.companyName} operates two dedicated product lines — specialty Ethiopian coffee and handcrafted leather goods — exporting and delivering real products directly to customers across the world.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Coffee Trading Showcase ───────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Content — 6 cols */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-primary-700">
                <Coffee size={22} />
                <span className="text-xs uppercase tracking-[0.22em] font-semibold">Division 01 · Active</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
                  {coffee.name}
                </h2>
                <p className="text-primary-700 text-sm font-medium">{coffee.tagline}</p>
              </div>

              <p className="text-neutral-600 text-base leading-relaxed font-light">
                {coffee.description}
              </p>

              <div className="pt-2 border-t border-neutral-150">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">Key Highlights</p>
                <ul className="space-y-2.5">
                  {coffee.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-700 font-light">
                      <Check size={16} className="text-primary-700 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <a
                  href={coffee.cta.href}
                  id="businesses-coffee-cta"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold tracking-wide rounded-xs transition-colors"
                >
                  <span>{coffee.cta.label}</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Right Large Image — 6 cols */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-neutral-200 shadow-lift">
                <Image
                  src={coffee.image}
                  alt={coffee.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Leather Goods Showcase ────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Large Image — 6 cols */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-neutral-200 shadow-lift">
                <Image
                  src={leather.image}
                  alt={leather.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Right Content — 6 cols */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="flex items-center gap-2 text-primary-700">
                <Package size={22} />
                <span className="text-xs uppercase tracking-[0.22em] font-semibold">Division 02 · Coming Soon</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
                  {leather.name}
                </h2>
                <p className="text-primary-700 text-sm font-medium">{leather.tagline}</p>
              </div>

              <p className="text-neutral-600 text-base leading-relaxed font-light">
                {leather.description}
              </p>

              <div className="pt-2 border-t border-neutral-200">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">Key Highlights</p>
                <ul className="space-y-2.5">
                  {leather.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-700 font-light">
                      <Check size={16} className="text-primary-700 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <a
                  href={leather.cta.href}
                  id="businesses-leather-cta"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-neutral-900 bg-neutral-950 hover:bg-neutral-850 text-white text-sm font-semibold tracking-wide rounded-xs transition-colors"
                >
                  <span>{leather.cta.label}</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
