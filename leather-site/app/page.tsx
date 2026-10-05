'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Shield, Leaf, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { getLeatherProducts, LeatherProduct } from '@/lib/leather-data';
import WishlistButton from '@/components/WishlistButton';

// ── Hero slides ───────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: '/images/highland-weekender.jpg',
    tag: 'New Collection — 2026',
    headline: 'Timeless Craft.',
    headlineItalic: 'Ethiopian Heritage.',
    sub: 'Master-crafted leather goods from Addis Ababa — built to outlast trends.',
    cta: { label: 'Shop Collection', href: '/products' },
    cta2: { label: 'Explore Outerwear', href: '/products?category=Jackets' },
    align: 'center',
  },
  {
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&q=90',
    tag: 'Outerwear Edit',
    headline: 'Wear History.',
    headlineItalic: 'Own the Room.',
    sub: 'Full-grain Ethiopian cowhide jackets, hand-stitched by master cordwainers.',
    cta: { label: 'Shop Jackets', href: '/products?category=Jackets' },
    align: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1920&q=90',
    tag: 'Travel Edit',
    headline: 'Carry Less.',
    headlineItalic: 'Live More.',
    sub: 'Bags that earn their stories — vegetable-tanned, brass-hardware, lifetime quality.',
    cta: { label: 'Shop Bags', href: '/products?category=Bags' },
    align: 'right',
  },
];

// ── Brand values ──────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: Leaf,
    title: 'Ethically Sourced',
    body: 'Every hide is sourced from farms with verified humane practices in the Oromia region of Ethiopia.',
  },
  {
    icon: Award,
    title: 'Master Artisan',
    body: 'Crafted by cordwainers with 10–25 years of experience at our atelier in Addis Ababa.',
  },
  {
    icon: Shield,
    title: 'Lifetime Quality',
    body: 'Full-grain leather only. No bonded. No splits. Products that age beautifully and last decades.',
  },
];

// ── Product card (compact for strips) ────────────────────────────────────────
function ProductCard({ product }: { product: LeatherProduct }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex-shrink-0 w-56 sm:w-64 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#F2EDE8]" style={{ aspectRatio: '3/4' }}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-opacity duration-500 ${hovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
            unoptimized
            sizes="256px"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 absolute inset-0 ${hovered ? 'opacity-100' : 'opacity-0'}`}
              unoptimized
              sizes="256px"
            />
          )}
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
              New In
            </span>
          )}
          <div className="absolute top-2 right-2">
            <WishlistButton
              productId={product.id}
              className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
            />
          </div>
        </div>
      </Link>
      <div className="mt-2.5 px-0.5">
        <Link href={`/products/${product.slug}`} className="block">
          <p className="text-xs font-bold text-neutral-900 leading-tight hover:underline underline-offset-2">{product.name}</p>
        </Link>
        <p className="text-[10px] text-neutral-500 mt-0.5">{product.tagline}</p>
        <p className="text-sm font-bold text-neutral-900 mt-1">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}

// ── Horizontal scroll strip ───────────────────────────────────────────────────
function ScrollStrip({ products }: { products: LeatherProduct[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };
  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-neutral-200 rounded-full shadow-md flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition-colors -translate-x-5"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-neutral-200 rounded-full shadow-md flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition-colors translate-x-5"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Main homepage ─────────────────────────────────────────────────────────────
export default function LeatherHomePage() {
  const [products, setProducts] = useState<LeatherProduct[]>([]);
  const [slide, setSlide] = useState(0);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setProducts(getLeatherProducts());
    const h = () => setProducts(getLeatherProducts());
    window.addEventListener('kijij_leather_products_updated', h);
    return () => window.removeEventListener('kijij_leather_products_updated', h);
  }, []);

  // Auto-advance hero
  useEffect(() => {
    slideTimer.current = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6000);
    return () => { if (slideTimer.current) clearInterval(slideTimer.current); };
  }, []);

  const goTo = (i: number) => {
    setSlide(i);
    if (slideTimer.current) clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6000);
  };

  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);
  const featured = products.find((p) => p.isFeatured) ?? products[0];

  const activeSlide = HERO_SLIDES[slide];

  return (
    <div className="flex flex-col bg-white">

      {/* ── Hero carousel ─────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[560px] overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={s.image}
              alt={s.headline}
              fill
              className="object-cover"
              priority={i === 0}
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/20 via-neutral-900/30 to-neutral-900/60" />
          </div>
        ))}

        {/* Text overlay */}
        <div className={`relative z-10 h-full flex flex-col items-${
          activeSlide.align === 'left' ? 'start' : activeSlide.align === 'right' ? 'end' : 'center'
        } justify-end pb-20 px-8 sm:px-16 lg:px-24`}>
          <div className={`max-w-xl ${activeSlide.align === 'center' ? 'text-center' : ''}`}>
            <p className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-medium mb-4">
              {activeSlide.tag}
            </p>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white leading-[0.95] mb-4">
              {activeSlide.headline}
              <br />
              <span className="italic font-light">{activeSlide.headlineItalic}</span>
            </h1>
            {activeSlide.sub && (
              <p className="text-base text-white/75 mb-8 max-w-md leading-relaxed">
                {activeSlide.sub}
              </p>
            )}
            <div className={`flex gap-4 ${activeSlide.align === 'center' ? 'justify-center' : ''}`}>
              <Link
                href={activeSlide.cta.href}
                className="inline-flex items-center gap-2 bg-white text-neutral-900 text-[11px] font-bold uppercase tracking-[0.15em] px-8 py-3.5 hover:bg-neutral-100 transition-colors"
              >
                {activeSlide.cta.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {activeSlide.cta2 && (
                <Link
                  href={activeSlide.cta2.href}
                  className="inline-flex items-center gap-2 border border-white text-white text-[11px] font-bold uppercase tracking-[0.15em] px-8 py-3.5 hover:bg-white/10 transition-colors"
                >
                  {activeSlide.cta2.label}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-0.5 transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-4 bg-white/40'}`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 z-10 hidden lg:flex flex-col items-center gap-1.5">
          <span className="text-[9px] text-white/50 uppercase tracking-[0.3em] font-medium" style={{ writingMode: 'vertical-lr' }}>
            Scroll
          </span>
          <div className="w-px h-8 bg-white/30" />
        </div>
      </section>



      {/* ── New Arrivals ───────────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-20 bg-[#F9F6F1]">
          <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400 mb-2">Just Arrived</p>
                <h2 className="text-3xl font-serif font-bold text-neutral-900">New In</h2>
              </div>
              <Link
                href="/products?tag=new"
                className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-neutral-900 border-b border-neutral-400 pb-0.5 transition-colors"
              >
                View All →
              </Link>
            </div>
            <ScrollStrip products={newArrivals} />
          </div>
        </section>
      )}

      {/* ── Featured Product (editorial spotlight) ────────────────────────── */}
      {featured && (
        <section className="bg-white">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Image side */}
            <div className="relative bg-[#F2EDE8] overflow-hidden min-h-[400px] lg:min-h-0">
              <Image
                src={featured.images[0]}
                alt={featured.name}
                fill
                className="object-cover"
                unoptimized
              />
              {featured.isNew && (
                <span className="absolute top-8 left-8 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                  New In
                </span>
              )}
            </div>

            {/* Text side */}
            <div className="flex flex-col justify-center px-12 lg:px-20 py-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-6">
                Featured Piece
              </p>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 leading-tight mb-4">
                {featured.name}
              </h2>
              <p className="text-sm text-neutral-500 italic mb-5">{featured.tagline}</p>
              <p className="text-sm text-neutral-600 leading-relaxed mb-8 max-w-sm">
                {featured.description.slice(0, 200)}…
              </p>
              <p className="text-2xl font-bold text-neutral-900 mb-8">${featured.price.toFixed(2)}</p>
              <div className="flex gap-4">
                <Link
                  href={`/products/${featured.slug}`}
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-[0.15em] px-8 py-3.5 hover:bg-neutral-700 transition-colors"
                >
                  View Product <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Bestsellers ───────────────────────────────────────────────────── */}
      {bestsellers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400 mb-2">Most Loved</p>
                <h2 className="text-3xl font-serif font-bold text-neutral-900">Bestsellers</h2>
              </div>
              <Link
                href="/products"
                className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-neutral-900 border-b border-neutral-400 pb-0.5 transition-colors"
              >
                View All →
              </Link>
            </div>
            <ScrollStrip products={bestsellers} />
          </div>
        </section>
      )}

      {/* ── Craftsmanship split section ────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] text-white">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          <div className="relative min-h-[300px] lg:min-h-0 overflow-hidden">
            <Image
              src="/images/our-process.jpg"
              alt="Artisan crafting leather in Addis Ababa"
              fill
              className="object-cover opacity-80"
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-center px-12 lg:px-20 py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 mb-6">Our Process</p>
            <h2 className="text-4xl font-serif font-bold text-white leading-tight mb-6">
              Artisan Quality,<br />
              <span className="italic font-light">Rooted in Tradition.</span>
            </h2>
            <p className="text-neutral-400 text-sm leading-loose mb-10 max-w-sm">
              Every KIJIJ piece is hand-crafted in Addis Ababa using ethically sourced hides.
              We partner with local tanneries to ensure exceptional quality and sustainable
              practices that empower our community.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white border border-white/30 px-8 py-3.5 hover:bg-white hover:text-neutral-900 transition-colors w-fit"
            >
              Shop the Collection <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand values ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F9F6F1]">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-20">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-3">Why KIJIJ</p>
            <h2 className="text-3xl font-serif font-bold text-neutral-900">Built on principles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-5">
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-3">{title}</h3>
                <p className="text-sm text-neutral-500 leading-loose max-w-xs mx-auto">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category grid ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-20">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400 mb-3">Collections</p>
            <h2 className="text-3xl font-serif font-bold text-neutral-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Bags', href: '/products?category=Bags', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80' },
              { name: 'Outerwear', href: '/products?category=Jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' },
              { name: 'Wallets', href: '/products?category=Wallets', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80' },
              { name: 'Accessories', href: '/products?category=Belts+%26+Accessories', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80' },
            ].map(({ name, href, img }) => (
              <Link key={name} href={href} className="group relative overflow-hidden bg-[#F2EDE8] aspect-square block">
                <Image
                  src={img}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest">{name}</h3>
                  <span className="text-white/70 text-[10px] uppercase tracking-wider flex items-center gap-1 mt-1 group-hover:gap-2 transition-all">
                    Shop <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-900 text-center px-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-500 mb-4">The Full Collection</p>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6 leading-tight">
          Every piece tells<br /><span className="italic font-light">a story.</span>
        </h2>
        <p className="text-neutral-400 mb-10 max-w-sm mx-auto text-sm leading-relaxed">
          Over 20 styles of full-grain Ethiopian leather goods, hand-stitched by artisans with decades of experience.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-3 bg-white text-neutral-900 text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-4 hover:bg-neutral-100 transition-colors"
        >
          Browse All Products <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
