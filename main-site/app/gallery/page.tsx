import type { Metadata } from 'next';
import Image from 'next/image';
import { SITE_CONFIG } from '@highland/shared/site-config';
import GalleryGrid from './GalleryGrid';

export const metadata: Metadata = {
  title: 'Visual Archive — Specialty Coffee, Premium Leather & Global Delivery',
  description: `Visual archive of ${SITE_CONFIG.companyName}: Ethiopian specialty coffee harvest, handcrafted leather goods, and direct worldwide delivery.`,
};

export default function GalleryPage() {
  return (
    <main className="flex flex-col bg-white">

      {/* ── 1. Page Header ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-neutral-950 text-white relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=85"
            alt="International maritime shipping container vessel"
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
                Visual Archive
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-serif font-normal text-white leading-tight tracking-tight">
              African Craft & Commerce Through Our Lens
            </h1>

            <p className="text-neutral-300 text-lg sm:text-xl font-light leading-relaxed">
              From deep-water container ports and highland coffee drying beds to artisan leather workshops — explore the real products and trade operations behind {SITE_CONFIG.companyName}.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Visual Archive Grid ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid />
        </div>
      </section>

    </main>
  );
}
