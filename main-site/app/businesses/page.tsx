import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
      'Our core business connects smallholder Ethiopian coffee producers with wholesale buyers across North America, Europe, and Asia. We offer six distinct origins — Yirgacheffe, Sidamo, Guji, Harar, Limu, and Jimma — across all major process methods. The platform supports the full buyer journey from sample request to bulk contract, with transparent pricing and full traceability.',
    highlights: [
      '6 Ethiopian coffee origins',
      '3 process methods: Washed, Natural, Honey',
      'Grades 1–4 available',
      'Samples, 60kg bags, 1-ton lots, full containers',
      'FOB / CIF / EXW delivery terms',
    ],
    cta: { label: 'Browse Coffees', href: SITE_CONFIG.urls.coffeeSite },
    image: 'https://picsum.photos/seed/biz-page-coffee/900/600',
    accentColor: 'primary',
  },
  {
    id: 'leather',
    name: 'Leather Goods Store',
    tagline: 'Premium Ethiopian Leather — Coming Soon',
    status: 'coming-soon' as const,
    description:
      'Ethiopia is home to one of Africa\'s largest livestock populations and a centuries-old tradition of leather craftsmanship. Our upcoming leather goods line will offer a curated collection of premium bags, accessories, and garments produced by skilled Ethiopian artisans using responsibly sourced hides. The store is currently in development, with a planned launch in the coming year.',
    highlights: [
      'Premium Ethiopian leather',
      'Artisan-crafted goods',
      'Bags, accessories, garments',
      'Responsibly sourced hides',
      'Direct-to-consumer retail',
    ],
    cta: { label: 'View Coming Soon Page', href: SITE_CONFIG.urls.leatherSite },
    image: 'https://picsum.photos/seed/biz-page-leather/900/600',
    accentColor: 'accent',
  },
];

export default function BusinessesPage() {
  return (
    <main className="flex flex-col">

      {/* ── Page hero ──────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold">
            Our Businesses
          </p>
          <h1 className="text-5xl font-serif font-bold text-white">
            Two Pillars of Ethiopian Excellence
          </h1>
          <p className="text-neutral-300 text-xl leading-relaxed">
            {SITE_CONFIG.companyName} operates two distinct business lines, each bringing
            a different dimension of Ethiopia&apos;s world-class agricultural and artisanal
            heritage to a global market.
          </p>
        </div>
      </section>

      {/* ── Business cards ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {BUSINESSES.map((biz, idx) => (
            <div
              key={biz.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden
                          shadow-brand-lg bg-white ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
            >
              {/* Image */}
              <div className={`relative h-72 lg:h-auto ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <Image
                  src={biz.image}
                  alt={`${biz.name} — placeholder image`}
                  fill className="object-cover" unoptimized
                />
                {biz.status === 'coming-soon' && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-accent-700 text-white
                                  text-sm font-bold rounded-full uppercase tracking-wide shadow">
                    Coming Soon
                  </div>
                )}
                {biz.status === 'live' && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-primary-500 text-white
                                  text-sm font-bold rounded-full uppercase tracking-wide shadow">
                    Live
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`p-10 lg:p-14 flex flex-col justify-center space-y-6
                              ${idx % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold text-neutral-900">{biz.name}</h2>
                  <p className={`text-sm font-semibold ${biz.accentColor === 'primary' ? 'text-primary-600' : 'text-accent-700'}`}>
                    {biz.tagline}
                  </p>
                </div>
                <p className="text-neutral-600 leading-relaxed">{biz.description}</p>
                <ul className="space-y-2">
                  {biz.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-neutral-600">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        biz.accentColor === 'primary' ? 'bg-primary-500' : 'bg-accent-600'
                      }`} />
                      {h}
                    </li>
                  ))}
                </ul>
                <a
                  href={biz.cta.href}
                  id={`businesses-${biz.id}-cta`}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-semibold
                              rounded-xl transition-colors duration-200 w-fit ${
                    biz.accentColor === 'primary'
                      ? 'bg-primary-500 hover:bg-primary-400 text-white'
                      : 'bg-accent-700 hover:bg-accent-600 text-white'
                  }`}
                >
                  {biz.cta.label} <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
