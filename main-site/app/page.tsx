import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Coffee, Shirt, ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { COMPANY_COPY, NEWS_POSTS } from '@/lib/mock-content';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.companyName} — Ethiopia's Finest, Delivered to the World`,
  description: COMPANY_COPY.mission,
  openGraph: {
    title: SITE_CONFIG.companyName,
    description: COMPANY_COPY.mission,
    images: [{ url: 'https://picsum.photos/seed/og-home/1200/630', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  const recentNews = NEWS_POSTS.slice(0, 2);

  return (
    <main className="flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/hero-coffee/1920/1080"
            alt="Ethiopian coffee landscape"
            fill
            className="object-cover opacity-30"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/40 to-neutral-950" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20">
          <p className="text-primary-400 text-sm uppercase tracking-[0.3em] font-medium mb-6">
            Addis Ababa, Ethiopia · Est. {SITE_CONFIG.foundedYear}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6">
            Ethiopia&apos;s Finest,<br />
            <span className="text-primary-400">Delivered to the World</span>
          </h1>
          <p className="text-neutral-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Highland Roots Trading PLC connects Ethiopia&apos;s world-renowned specialty coffees
            and artisanal goods with buyers across North America, Europe, and Asia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={SITE_CONFIG.urls.coffeeSite}
              id="hero-browse-coffees"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500
                         hover:bg-primary-400 text-white font-semibold rounded-xl
                         transition-all duration-200 shadow-brand-lg"
            >
              Browse Our Coffees <ArrowRight size={18} />
            </a>
            <Link
              href="/about"
              id="hero-learn-more"
              className="inline-flex items-center justify-center gap-2 px-8 py-4
                         border border-white/20 hover:bg-white/10 text-white font-semibold
                         rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              Our Story
            </Link>
            <a
              href={SITE_CONFIG.urls.leatherSite}
              id="hero-browse-leather"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-700
                         hover:bg-accent-600 text-white font-semibold rounded-xl
                         transition-all duration-200 shadow-brand-lg"
            >
              Browse Leather <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-neutral-500">
          <ChevronRight className="rotate-90" size={24} />
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────────── */}
      <section className="bg-primary-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {COMPANY_COPY.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-serif font-bold text-white">{stat.value}</p>
                <p className="text-primary-100 text-sm mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company intro ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-primary-600 text-sm uppercase tracking-widest font-semibold">
                Who We Are
              </p>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
                Rooted in Ethiopia,<br />Reaching the World
              </h2>
              <p className="text-neutral-600 text-lg leading-relaxed">
                {COMPANY_COPY.intro}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-primary-600 font-semibold
                           hover:text-primary-500 transition-colors"
              >
                Read our full story <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-brand-lg">
              <Image
                src="https://picsum.photos/seed/about-intro/700/500"
                alt="Ethiopian coffee farm — placeholder image"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission teaser ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold">
            Our Mission
          </p>
          <blockquote className="text-3xl sm:text-4xl font-serif text-white leading-relaxed">
            &ldquo;{COMPANY_COPY.mission}&rdquo;
          </blockquote>
          <div className="w-16 h-px bg-primary-500 mx-auto" />
          <p className="text-neutral-400 text-lg leading-relaxed">
            {COMPANY_COPY.vision}
          </p>
        </div>
      </section>

      {/* ── Our Businesses ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-primary-600 text-sm uppercase tracking-widest font-semibold">
              Our Businesses
            </p>
            <h2 className="text-4xl font-serif font-bold text-neutral-900">
              Two Pillars of Ethiopian Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coffee card */}
            <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 shadow-brand-lg">
              <div className="absolute inset-0">
                <Image
                  src="https://picsum.photos/seed/biz-coffee/700/500"
                  alt="Ethiopian specialty coffee"
                  fill
                  className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/50 to-transparent" />
              </div>
              <div className="relative z-10 p-8 h-80 flex flex-col justify-end space-y-4">
                <div className="p-3 bg-primary-500/20 rounded-xl w-fit">
                  <Coffee size={28} className="text-primary-400" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-white">Coffee Trading</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Specialty-grade Ethiopian arabicas — Yirgacheffe, Sidamo, Guji, Harar,
                  Limu, and Jimma — for wholesale buyers worldwide.
                </p>
                <a
                  href={SITE_CONFIG.urls.coffeeSite}
                  id="businesses-coffee-link"
                  className="inline-flex items-center gap-2 text-primary-400 font-semibold
                             hover:text-primary-300 transition-colors"
                >
                  Explore coffees <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Leather card */}
            <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 shadow-brand-lg">
              <div className="absolute inset-0">
                <Image
                  src="https://picsum.photos/seed/biz-leather/700/500"
                  alt="Ethiopian leather goods"
                  fill
                  className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/50 to-transparent" />
              </div>
              <div className="relative z-10 p-8 h-80 flex flex-col justify-end space-y-4">
                <div className="p-3 bg-accent-700/30 rounded-xl w-fit">
                  <Shirt size={28} className="text-accent-400" />
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-serif font-bold text-white">Leather Store</h3>
                  <span className="px-2 py-1 bg-accent-700/40 text-accent-300 text-xs
                                   font-semibold rounded-full uppercase tracking-wide">
                    Coming Soon
                  </span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  Premium Ethiopian leather goods — bags, accessories, and garments — crafted
                  from the finest East African hides.
                </p>
                <a
                  href={SITE_CONFIG.urls.leatherSite}
                  id="businesses-leather-link"
                  className="inline-flex items-center gap-2 text-accent-400 font-semibold
                             hover:text-accent-300 transition-colors"
                >
                  Join the waitlist <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── News preview ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <p className="text-primary-600 text-sm uppercase tracking-widest font-semibold">
                Latest News
              </p>
              <h2 className="text-3xl font-serif font-bold text-neutral-900">
                Updates from Highland Roots
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden sm:inline-flex items-center gap-2 text-primary-600
                         font-semibold hover:text-primary-500 transition-colors"
            >
              All posts <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentNews.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl overflow-hidden border border-neutral-100
                           hover:shadow-brand transition-shadow duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={`${post.title} — placeholder image`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary-500 text-white
                                   text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-neutral-400 text-xs font-medium">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  <h3 className="text-xl font-serif font-semibold text-neutral-900
                                 group-hover:text-primary-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-1 text-primary-600 text-sm
                               font-semibold hover:text-primary-500 transition-colors"
                  >
                    Read more <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/news" className="text-primary-600 font-semibold hover:text-primary-500">
              View all posts →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl font-serif font-bold text-white">
            Ready to Source Ethiopian Coffee?
          </h2>
          <p className="text-primary-100 text-lg">
            Browse our full catalog, request samples, and start a conversation with our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={SITE_CONFIG.urls.coffeeSite}
              id="cta-browse-coffees"
              className="inline-flex items-center justify-center gap-2 px-8 py-4
                         bg-white hover:bg-neutral-50 text-primary-600 font-bold
                         rounded-xl transition-colors duration-200"
            >
              Browse Coffees <ArrowRight size={18} />
            </a>
            <Link
              href="/contact"
              id="cta-contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4
                         border-2 border-white/30 hover:border-white/60 text-white
                         font-semibold rounded-xl transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
