import type { Metadata } from 'next';
import Image from 'next/image';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { COMPANY_COPY } from '@/lib/mock-content';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_CONFIG.companyName} — our mission, vision, values, and the story of an African company selling products, not just opportunities.`,
  openGraph: {
    title: `About Us | ${SITE_CONFIG.companyName}`,
    description: COMPANY_COPY.mission,
  },
};

export default function AboutPage() {
  return (
    <main className="flex flex-col bg-white">

      {/* ── 1. Editorial Page Header ────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-neutral-950 text-white relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=85"
            alt="KIJIJ International — Global maritime export logistics and container shipping"
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
                Our Story & Heritage
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-serif font-normal text-white leading-tight tracking-tight">
              An African Company Built to Deliver Real Goods.
            </h1>

            <p className="text-neutral-300 text-lg sm:text-xl font-light leading-relaxed">
              Founded on the belief that the world doesn&apos;t just need more opportunities — it needs real, tangible products of exceptional African provenance.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Company Narrative & Founding Milestone ───────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Narrative Column — 7 cols */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
                  Company Overview
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950 leading-snug">
                  Bridging Ethiopia and Global Markets
                </h2>
              </div>

              <div className="space-y-5 text-neutral-600 text-base sm:text-lg font-light leading-relaxed">
                {COMPANY_COPY.about.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-neutral-700">
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">USA Headquarters</p>
                  <p className="font-medium text-neutral-900">Saluda, South Carolina</p>
                  <p className="text-neutral-500 text-xs">International trade governance & buyer accounts</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Ethiopian Operations</p>
                  <p className="font-medium text-neutral-900">Addis Ababa, Ethiopia</p>
                  <p className="text-neutral-500 text-xs">Direct origin sourcing, cupping & export dispatch</p>
                </div>
              </div>
            </div>

            {/* Right Editorial Pillar: Founding Story & Visual — 5 cols */}
            <div className="lg:col-span-5 space-y-8">
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-neutral-200 shadow-lift">
                <Image
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80"
                  alt="Staged export shipping containers and global freight logistics"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Founding Story Callout */}
              <div className="border border-neutral-200 bg-neutral-50 rounded-xs p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <p className="text-primary-700 text-xs uppercase tracking-[0.2em] font-semibold">
                    Founding Milestone
                  </p>
                  <span className="text-xs font-serif text-neutral-500 font-medium">
                    Est. {COMPANY_COPY.foundingStory.year}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-normal text-neutral-950">
                  {COMPANY_COPY.foundingStory.headline}
                </h3>

                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  {COMPANY_COPY.foundingStory.body}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Direct Export & Product Divisions: Editorial Sequence ─────────── */}
      <section className="py-20 bg-neutral-50 border-t border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-3">
            <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
              Export Operations
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
              From Origin to Overseas Buyers
            </h2>
            <p className="text-neutral-600 text-sm leading-relaxed">
              We sell real African products — managing origin quality grading, export certificates, and international fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Division 1: Coffee */}
            <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-4 shadow-subtle flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&q=80"
                    alt="Burlap sacks of green specialty coffee staged for export"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Product Division</span>
                  <h3 className="font-serif font-normal text-xl text-neutral-950">Specialty Coffee Supply</h3>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  Direct sourcing with Ethiopian farmer cooperatives across Yirgacheffe, Sidamo, and Guji for certified Grade 1 green coffees.
                </p>
              </div>
              <a
                href={SITE_CONFIG.urls.coffeeSite}
                className="inline-flex items-center gap-1.5 text-primary-700 text-xs uppercase tracking-wider font-semibold hover:text-primary-800 pt-3 border-t border-neutral-100"
              >
                <span>Browse Coffee Sourcing</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Division 2: Leather */}
            <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-4 shadow-subtle flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80"
                    alt="Handcrafted Ethiopian luxury leather travel goods"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Product Division</span>
                  <h3 className="font-serif font-normal text-xl text-neutral-950">Artisan Leather Goods</h3>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  Export-ready bags, travel gear, and accessories fashioned by skilled Ethiopian leather artisans from premium highland hides.
                </p>
              </div>
              <a
                href={SITE_CONFIG.urls.leatherSite}
                className="inline-flex items-center gap-1.5 text-primary-700 text-xs uppercase tracking-wider font-semibold hover:text-primary-800 pt-3 border-t border-neutral-100"
              >
                <span>View Leather Catalog</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Division 3: Export Logistics */}
            <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-4 shadow-subtle flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80"
                    alt="Deep-water export port cranes and container shipping"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Fulfillment</span>
                  <h3 className="font-serif font-normal text-xl text-neutral-950">Direct Delivery to Clients</h3>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  When clients place orders, we take care of all export certifications and container shipping directly to your port or business worldwide.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-primary-700 text-xs uppercase tracking-wider font-semibold hover:text-primary-800 pt-3 border-t border-neutral-100"
              >
                <span>Inquire About Export Terms</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Mission, Vision & Core Values ────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
              Guiding Principles
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
              Mission, Vision & Core Values
            </h2>
          </div>

          {/* Mission & Vision Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="border border-neutral-200 rounded-xs p-8 sm:p-10 space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary-700">Our Mission</span>
              <p className="text-2xl font-serif font-normal text-neutral-950 leading-relaxed">
                &ldquo;{COMPANY_COPY.mission}&rdquo;
              </p>
            </div>

            <div className="border border-neutral-200 rounded-xs p-8 sm:p-10 space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary-700">Our Vision</span>
              <p className="text-2xl font-serif font-normal text-neutral-950 leading-relaxed">
                &ldquo;{COMPANY_COPY.vision}&rdquo;
              </p>
            </div>
          </div>

          {/* Values Grid with Hairline Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-neutral-200">
            {COMPANY_COPY.values.map((value) => (
              <div key={value.title} className="space-y-3">
                <div className="w-8 h-8 rounded-xs border border-primary-500/30 bg-primary-50 flex items-center justify-center text-primary-700">
                  <Check size={16} />
                </div>
                <h3 className="font-serif font-normal text-xl text-neutral-950">{value.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
