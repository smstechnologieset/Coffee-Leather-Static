import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Coffee, Package, Globe, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { COMPANY_COPY, NEWS_POSTS } from '@/lib/mock-content';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.companyName} — Ethiopia's Finest, Delivered to the World`,
  description: COMPANY_COPY.mission,
  openGraph: {
    title: SITE_CONFIG.companyName,
    description: COMPANY_COPY.mission,
    images: [{ url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  const featuredNews = NEWS_POSTS[0];
  const secondaryNews = NEWS_POSTS[1];

  return (
    <main className="flex flex-col bg-white">

      {/* ── 1. Hero: Editorial Asymmetric Composition ──────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center bg-neutral-950 overflow-hidden pt-28 pb-20">
        {/* Ambient atmospheric backdrop */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=85"
            alt="KIJIJ International — Global container export logistics and maritime trade"
            fill
            className="object-cover opacity-20 filter contrast-125 brightness-90"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Narrative Column — 7 cols */}
            <div className="lg:col-span-7 space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-white font-normal leading-[1.08] tracking-tight">
                Ethiopia&apos;s Finest, Delivered to the World.
              </h1>

              <p className="text-neutral-300 text-lg sm:text-xl font-light leading-relaxed max-w-2xl">
                {SITE_CONFIG.companyName} connects Ethiopia&apos;s world-renowned specialty coffees,
                premium handcrafted leather goods, and authentic African commodities with buyers across the globe.
              </p>

              {/* Action Pair: One dominant CTA + one quiet link */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 pt-3">
                <Link
                  href="/businesses"
                  id="hero-browse-products"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold tracking-wide rounded-xs transition-colors duration-200"
                >
                  <span>Browse Our Products</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/about"
                  id="hero-learn-more"
                  className="inline-flex items-center justify-center gap-2 text-neutral-300 hover:text-white text-sm font-medium tracking-wide py-3 px-2 group transition-colors"
                >
                  <span>Our Heritage & Ethos</span>
                  <ArrowRight size={16} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Quiet footnote status */}
              <div className="pt-6 border-t border-neutral-800/80 flex items-center gap-6 text-xs text-neutral-400 font-light">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-primary-400" />
                  Direct Sourcing & Export
                </span>
                <span className="text-neutral-700">|</span>
                <span>FOB / CIF Global Terms</span>
              </div>
            </div>

            {/* Right Visual Anchor — 5 cols */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] overflow-hidden rounded-xs border border-neutral-800 shadow-elevate">
                <Image
                  src="https://images.unsplash.com/photo-1761275389856-3c4f7d61b623?q=80&w=1170&auto=format&fit=crop"
                  alt="Burlap sacks of green specialty coffee staged for export in warehouse"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-neutral-950/85 backdrop-blur-md border border-white/10 rounded-xs">
                  <p className="text-primary-400 text-[11px] uppercase tracking-widest font-semibold">Origin Assurance</p>
                  <p className="text-white text-sm font-medium mt-1">Export-graded Ethiopian coffees & artisanal craft ready for international delivery.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Editorial Statistics Strip (Pure White + Forest Green Accents) ─ */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
            {COMPANY_COPY.stats.map((stat, i) => (
              <div key={stat.label} className={`px-6 py-4 ${i === 0 ? 'lg:pl-0' : ''} ${i === 3 ? 'lg:pr-0' : ''}`}>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-primary-700 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 font-medium mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Company Story / Narrative Split ──────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
                Who We Are
              </p>
              <h2 className="text-4xl sm:text-5xl font-serif font-normal text-neutral-950 leading-tight">
                Rooted in Ethiopia, Reaching the World.
              </h2>
              <p className="text-neutral-600 text-base sm:text-lg leading-relaxed font-normal">
                {COMPANY_COPY.intro}
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 text-sm font-semibold tracking-wide group"
                >
                  <span>Read our full founding story</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Framed Imagery */}
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-neutral-200 shadow-lift">
                  <Image
                    src="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=900&q=80"
                    alt="Selective hand-harvest of ripe Ethiopian coffee cherries"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {/* Understated caption card */}
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 border-b border-neutral-200 pb-2">
                  <span className="font-medium text-neutral-700">Selective Cherry Harvest · Southern Highlands</span>
                  <span>100% Traceable</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Core Businesses: Two Bespoke Editorial Layouts ────────────────── */}
      <section className="py-24 sm:py-32 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 space-y-3">
            <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
              Our Businesses
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif font-normal text-neutral-950">
              Two Pillars of Ethiopian Excellence
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed">
              Direct access to Ethiopia&apos;s two most revered exports — specialty agricultural commodities and luxury artisanal craftsmanship.
            </p>
          </div>

          <div className="space-y-16">
            {/* Coffee Trading: Wide Horizontal Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-subtle">
              <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-full">
                <Image
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1100&q=80"
                  alt="Ethiopian specialty roasted and green arabica coffee beans"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary-700">
                    <Coffee size={20} />
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold">Agricultural Division</span>
                  </div>
                  <h3 className="text-3xl font-serif font-normal text-neutral-950">
                    Coffee Trading Platform
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    Specialty-grade Ethiopian arabicas — Yirgacheffe, Sidamo, Guji, Harar,
                    Limu, and Jimma — for wholesale buyers and roasters worldwide.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    {['Yirgacheffe', 'Sidamo', 'Guji', 'Harar', 'Limu', 'Jimma'].map((origin) => (
                      <span key={origin} className="px-2.5 py-1 bg-neutral-100 text-neutral-700 font-medium rounded-xs">
                        {origin}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <a
                    href={SITE_CONFIG.urls.coffeeSite}
                    id="businesses-coffee-link"
                    className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 text-sm font-semibold group"
                  >
                    <span>Explore coffees & origin lots</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <span className="text-xs text-neutral-500 font-medium">Grades 1–4</span>
                </div>
              </div>
            </div>

            {/* Leather Goods: Artisanal Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-subtle">
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6 order-2 lg:order-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary-700">
                    <Package size={20} />
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold">Artisan Division</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-3xl font-serif font-normal text-neutral-950">
                      Leather Goods Store
                    </h3>
                  </div>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    Premium Ethiopian leather goods — bags, accessories, and garments — crafted
                    from the finest East African hides by experienced local artisans.
                  </p>
                  <ul className="space-y-2 text-xs text-neutral-600 pt-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-700 rounded-full" />
                      Centuries of Ethiopian tanning heritage
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-700 rounded-full" />
                      Handstitched travel bags, briefcases & totes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-700 rounded-full" />
                      Export-grade finishing for overseas clients
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <a
                    href={SITE_CONFIG.urls.leatherSite}
                    id="businesses-leather-link"
                    className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 text-sm font-semibold group"
                  >
                    <span>View catalogue</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <span className="text-xs text-neutral-500 font-medium">Bags & Accessories</span>
                </div>
              </div>

              <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-full order-1 lg:order-2">
                <Image
                  src="https://leathergoods.es/wp-content/uploads/2021/04/Productos-para-empresas-%E2%80%98Made-in-Spain.jpg"
                  alt="Handcrafted luxury Ethiopian leather travel goods and accessories"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Product & Fulfillment Sequence ───────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-2xl">
              <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
                Direct Export Trade
              </p>
              <h2 className="text-4xl font-serif font-normal text-neutral-950">
                Products in Action, From Origin to Port
              </h2>
            </div>
            <p className="text-neutral-500 text-sm max-w-sm font-light">
              We sell tangible African goods — handling export inspection, certifications, and container dispatch directly to ordering clients.
            </p>
          </div>

          {/* Asymmetric 3-Column Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Export Fulfillment */}
            <div className="border border-neutral-200 rounded-xs p-6 flex flex-col justify-between space-y-6 hover:border-neutral-300 transition-colors">
              <div className="space-y-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
                  <Image
                    src="https://media.istockphoto.com/id/1287632115/photo/were-the-best-when-it-comes-to-fast-delivery.jpg?s=612x612&w=0&k=20&c=lEkFNmAApPthHuV1RlrmYGtAyA5fA0e2Za93ssGSGG8="
                    alt="Export vessel and port shipping KIJIJ International products worldwide"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex items-center gap-2 text-primary-700 text-xs font-semibold uppercase tracking-wider">
                  <Globe size={14} /> Global Delivery
                </div>
                <h3 className="text-xl font-serif font-normal text-neutral-950">
                  Exported Directly to Your Destination
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  When you order our coffees or leather goods, we handle all export formalities, phytosanitary certifications, and container dispatch — delivering directly to your port or business under FOB / CIF terms.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-primary-700 text-xs uppercase tracking-wider font-semibold hover:text-primary-800 transition-colors pt-3 border-t border-neutral-100"
              >
                <span>How we export</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Column 2: Coffee Sourcing */}
            <div className="border border-neutral-200 rounded-xs p-6 flex flex-col justify-between space-y-6 hover:border-neutral-300 transition-colors">
              <div className="space-y-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Burlap sacks of green specialty coffee staged for export"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex items-center gap-2 text-primary-700 text-xs font-semibold uppercase tracking-wider">
                  <Coffee size={14} /> Specialty Origins
                </div>
                <h3 className="text-xl font-serif font-normal text-neutral-950">
                  Direct Trade Specialty Arabica
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Single-origin washed, natural, and honey coffees from Yirgacheffe, Sidamo, and Guji. Certified organic micro-lots and commercial container volumes with cupping scores 84+.
                </p>
              </div>
              <a
                href={SITE_CONFIG.urls.coffeeSite}
                className="inline-flex items-center gap-1.5 text-primary-700 text-xs uppercase tracking-wider font-semibold hover:text-primary-800 transition-colors pt-3 border-t border-neutral-100"
              >
                <span>Browse coffee lots</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Column 3: Handcrafted Leather */}
            <div className="border border-neutral-200 rounded-xs p-6 flex flex-col justify-between space-y-6 hover:border-neutral-300 transition-colors">
              <div className="space-y-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"
                    alt="Ethiopian leather artisan precision tooling and hand stitching"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex items-center gap-2 text-primary-700 text-xs font-semibold uppercase tracking-wider">
                  <Package size={14} /> Premium Leather
                </div>
                <h3 className="text-xl font-serif font-normal text-neutral-950">
                  Handcrafted Goods & Accessories
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Centuries of Ethiopian tanning heritage and highland hides fashioned into weekend bags, executive briefcases, totes, and accessories designed for international markets.
                </p>
              </div>
              <a
                href={SITE_CONFIG.urls.leatherSite}
                className="inline-flex items-center gap-1.5 text-primary-700 text-xs uppercase tracking-wider font-semibold hover:text-primary-800 transition-colors pt-3 border-t border-neutral-100"
              >
                <span>Discover leather goods</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. News & Trade Dispatches: Editorial Spread ─────────────────────── */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14 border-b border-neutral-200 pb-6">
            <div className="space-y-2">
              <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
                Trade Journal
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
                Dispatches from {SITE_CONFIG.companyName}
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-neutral-700 hover:text-primary-700 transition-colors"
            >
              <span>View all dispatches</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Primary Featured Article — 7 cols */}
            {featuredNews && (
              <article className="lg:col-span-7 space-y-6">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xs border border-neutral-200">
                  <Image
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-neutral-950 text-white text-[11px] uppercase tracking-wider font-medium">
                    {featuredNews.category}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                    {new Date(featuredNews.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · {featuredNews.author}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-950 hover:text-primary-700 transition-colors leading-snug">
                    <Link href="/news">{featuredNews.title}</Link>
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {featuredNews.excerpt}
                  </p>
                </div>
              </article>
            )}

            {/* Secondary Article & Publications — 5 cols */}
            <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l lg:border-neutral-200 lg:pl-10 pt-8 lg:pt-0 space-y-8">
              {secondaryNews && (
                <article className="space-y-4">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xs border border-neutral-200">
                    <Image
                      src={secondaryNews.image}
                      alt={secondaryNews.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-neutral-950 text-white text-[10px] uppercase tracking-wider font-medium">
                      {secondaryNews.category}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                      {new Date(secondaryNews.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h4 className="text-xl font-serif font-normal text-neutral-950 hover:text-primary-700 transition-colors leading-snug">
                      <Link href="/news">{secondaryNews.title}</Link>
                    </h4>
                    <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
                      {secondaryNews.excerpt}
                    </p>
                  </div>
                </article>
              )}

              <div className="pt-6 border-t border-neutral-200">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 text-xs uppercase tracking-wider font-semibold"
                >
                  <span>Explore harvest updates & press announcements</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Blue-Black Closing Invitation CTA ────────────────────────────── */}
      <section className="py-24 bg-neutral-950 text-white border-t border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-primary-400 text-xs uppercase tracking-[0.25em] font-semibold">
            Trade & Sourcing Inquiries
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif font-normal text-white leading-tight">
            Ready to Source Ethiopian Specialty Commodities?
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Contact our trade offices in the United States and Addis Ababa for wholesale coffee contract schedules, cupping samples, and product delivery terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/contact"
              id="cta-contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold tracking-wide rounded-xs transition-colors duration-150"
            >
              <span>Get in Touch with Our Team</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href={SITE_CONFIG.urls.coffeeSite}
              id="cta-browse-coffees"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-700 hover:border-neutral-500 text-neutral-200 hover:text-white text-sm font-medium tracking-wide rounded-xs transition-colors duration-150"
            >
              <span>Browse Coffee Catalog</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
