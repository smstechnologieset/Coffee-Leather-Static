import type { Metadata } from 'next';
import Image from 'next/image';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { GALLERY_IMAGES } from '@/lib/mock-content';

export const metadata: Metadata = {
  title: 'Gallery',
  description: `Photo gallery of ${SITE_CONFIG.companyName} — Ethiopian coffee farms, processing stations, and landscapes.`,
};

export default function GalleryPage() {
  return (
    <main className="flex flex-col">

      {/* ── Page hero ──────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold">
            Gallery
          </p>
          <h1 className="text-5xl font-serif font-bold text-white">
            Ethiopia Through Our Lens
          </h1>
          <p className="text-neutral-300 text-xl leading-relaxed">
            Glimpses of the landscapes, farms, and people behind every Highland Roots shipment.
          </p>
          <p className="text-neutral-500 text-sm">
            ⚠️ All images below are placeholder photos from{' '}
            <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer"
               className="underline hover:text-neutral-400">picsum.photos</a>
            {' '}— real photography to follow.
          </p>
        </div>
      </section>

      {/* ── Gallery grid ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((img) => (
              <figure
                key={img.id}
                className="group relative overflow-hidden rounded-xl bg-neutral-200 aspect-[4/3]
                           cursor-pointer shadow-sm hover:shadow-brand transition-shadow duration-300"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/40
                                transition-colors duration-300 flex items-end">
                  <figcaption className="text-white text-xs p-3 translate-y-full
                                         group-hover:translate-y-0 transition-transform duration-300
                                         bg-gradient-to-t from-neutral-950/80 w-full">
                    {img.caption}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
