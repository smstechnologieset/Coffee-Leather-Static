import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, ShoppingBag } from 'lucide-react';

export default function LeatherHomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1920&q=85"
            alt="Premium Ethiopian Leather"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-neutral-900/40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-10">
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg leading-tight">
            Timeless Craft.<br />
            <span className="italic font-light">Ethiopian Heritage.</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Discover our collection of premium, sustainably sourced leather bags, 
            jackets, and accessories crafted by master artisans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-white text-neutral-900 hover:bg-neutral-100 font-bold tracking-wide uppercase text-sm transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              href="/products?category=Jackets"
              className="px-8 py-4 border border-white text-white hover:bg-white/10 font-bold tracking-wide uppercase text-sm transition-colors"
            >
              Explore Outerwear
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-neutral-900">Shop by Category</h2>
            <p className="text-neutral-500 mt-3">Find your next staple piece.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category 1 */}
            <Link href="/products?category=Bags" className="group block relative h-96 overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80"
                alt="Leather Bags"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-8">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Bags & Luggage</h3>
                <span className="text-white text-sm font-medium uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Shop Now <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            {/* Category 2 */}
            <Link href="/products?category=Jackets" className="group block relative h-96 overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"
                alt="Leather Jackets"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-8">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Outerwear</h3>
                <span className="text-white text-sm font-medium uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Shop Now <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            {/* Category 3 */}
            <Link href="/products?category=Accessories" className="group block relative h-96 overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80"
                alt="Leather Accessories"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-8">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Accessories</h3>
                <span className="text-white text-sm font-medium uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Shop Now <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Craftsmanship / Video Teaser ──────────────────────────────────── */}
      <section className="bg-neutral-950 py-24 text-center px-4 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <p className="text-accent-400 text-sm uppercase tracking-widest font-semibold">Our Process</p>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">
            Artisan Quality, <br className="hidden sm:block" />Rooted in Tradition.
          </h2>
          <p className="text-neutral-400 text-lg">
            Every Highland Roots piece is hand-crafted in Addis Ababa using ethically sourced hides. 
            We partner with local tanneries to ensure exceptional quality and sustainable practices 
            that empower our community.
          </p>
          <button className="inline-flex items-center gap-3 text-white font-semibold hover:text-accent-400 transition-colors group">
            <span className="p-4 bg-white/10 rounded-full group-hover:bg-accent-900/50 transition-colors backdrop-blur-sm">
              <Play className="h-6 w-6 fill-current" />
            </span>
            Watch our story
          </button>
        </div>
      </section>
    </div>
  );
}
