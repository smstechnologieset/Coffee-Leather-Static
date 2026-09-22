'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ExternalLink } from 'lucide-react';
import { GALLERY_IMAGES, type GalleryItem } from '@/lib/mock-content';

type CategoryFilter = 'all' | 'coffee' | 'leather' | 'shipping';

export default function GalleryGrid() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredImages = activeFilter === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeFilter);

  const filterTabs: { id: CategoryFilter; label: string; count: number }[] = [
    { id: 'all',      label: 'All Photography', count: GALLERY_IMAGES.length },
    { id: 'coffee',   label: 'Specialty Coffee', count: GALLERY_IMAGES.filter(img => img.category === 'coffee').length },
    { id: 'leather',  label: 'Artisan Leather', count: GALLERY_IMAGES.filter(img => img.category === 'leather').length },
    { id: 'shipping', label: 'Export & Shipping', count: GALLERY_IMAGES.filter(img => img.category === 'shipping').length },
  ];

  return (
    <div className="space-y-12">

      {/* ── Category Filter Tabs (Editorial Text-Based with Underline) ──────── */}
      <div className="border-b border-neutral-200">
        <div className="flex flex-wrap items-center justify-start gap-8 sm:gap-12">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`pb-4 text-xs sm:text-sm uppercase tracking-[0.16em] font-medium transition-colors relative flex items-baseline gap-2 ${
                  isActive
                    ? 'text-neutral-950 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[11px] font-normal ${isActive ? 'text-primary-700' : 'text-neutral-400'}`}>
                  ({tab.count})
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-700" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Editorial Asymmetric Masonry / Visual Archive Grid ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredImages.map((img, idx) => {
          // In 'all' view, make certain images span 2 columns on desktop for visual rhythm
          const isSpanTwo = activeFilter === 'all' && (idx === 0 || idx === 6);

          return (
            <figure
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className={`group cursor-pointer relative overflow-hidden rounded-xs border border-neutral-200 bg-neutral-900 transition-all duration-300 hover:border-neutral-400 ${
                isSpanTwo ? 'md:col-span-2 aspect-[16/10]' : 'aspect-[4/3]'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover filter contrast-105 group-hover:scale-[1.02] transition-transform duration-500"
                unoptimized
              />

              {/* Tag pill */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2.5 py-1 text-[11px] uppercase tracking-wider font-medium bg-neutral-950/85 backdrop-blur-sm text-neutral-200 border border-white/10 rounded-xs">
                  {img.tag}
                </span>
              </div>

              {/* Hover overlay with refined captions */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <figcaption className="text-white space-y-1.5">
                  <p className="font-serif text-lg font-normal leading-snug line-clamp-1">
                    {img.alt.split('—')[0]?.trim() || img.alt}
                  </p>
                  <p className="text-neutral-300 text-xs font-light leading-relaxed line-clamp-2">
                    {img.caption}
                  </p>
                  <p className="text-primary-300 text-[11px] uppercase tracking-wider font-semibold pt-1 flex items-center gap-1.5">
                    <span>Inspect image</span>
                    <ExternalLink size={12} />
                  </p>
                </figcaption>
              </div>
            </figure>
          );
        })}
      </div>

      {/* ── Minimalist Museum Lightbox Preview ──────────────────────────────── */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-neutral-950 border border-neutral-800 rounded-xs overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close preview"
              className="absolute top-4 right-4 z-20 w-9 h-9 border border-neutral-700 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-500 rounded-xs flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            {/* High-res image stage */}
            <div className="relative w-full h-[50vh] sm:h-[65vh] bg-neutral-950">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Understated caption bar */}
            <div className="p-6 bg-neutral-900/90 border-t border-neutral-800 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-primary-400">
                  {selectedImage.tag}
                </span>
                <span className="text-neutral-600">·</span>
                <span className="text-xs text-neutral-400 capitalize">
                  {selectedImage.category}
                </span>
              </div>
              <h3 className="text-xl font-serif font-normal text-white">
                {selectedImage.alt}
              </h3>
              <p className="text-neutral-400 text-sm font-light leading-relaxed max-w-3xl">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
