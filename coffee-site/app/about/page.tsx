import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Coffee, ShieldCheck, Globe, Award, MapPin, ArrowRight, Building2 } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';

export const metadata: Metadata = {
  title: 'About Us — KIJIJ Coffee | Division of KIJIJ International LLC',
  description:
    'KIJIJ Coffee is the dedicated Ethiopian specialty coffee export division of KIJIJ International LLC, bridging smallholder farming cooperatives with global roasters.',
};

const PILLARS = [
  {
    icon: Building2,
    title: 'Division of KIJIJ International LLC',
    description:
      'KIJIJ Coffee operates as the premier agricultural export arm of KIJIJ International LLC. Sharing enterprise resources with our artisan leather goods division, we offer institutional stability, established international banking, and transparent trade terms.',
  },
  {
    icon: MapPin,
    title: 'Direct Origin Partnerships',
    description:
      'We partner directly with smallholder farming communities and washing stations across Ethiopia’s premier high-altitude regions—eliminating unnecessary middlemen and returning premium value to farming families.',
  },
  {
    icon: Award,
    title: 'SCA-Certified Quality Control',
    description:
      'Every export lot is cupped, graded, and verified by certified Q-Graders against Specialty Coffee Association (SCA) standards. We provide buyers with complete physical and sensory lab reports.',
  },
  {
    icon: Globe,
    title: 'Full Farm-to-Port Traceability',
    description:
      'From washing station drying beds to Addis Ababa climate-controlled warehouses, Modjo Dry Port, and Djibouti vessel loading, our supply chain maintains an unbroken chain of custody.',
  },
];

const REGIONS = [
  { name: 'Yirgacheffe', profile: 'Floral, Bergamot, Lemon Zest', altitude: '1,800–2,200 masl', process: 'Washed & Natural' },
  { name: 'Sidamo', profile: 'Wild Blueberry, Winey, Chocolate', altitude: '1,700–2,000 masl', process: 'Natural & Washed' },
  { name: 'Guji', profile: 'Tropical Peach, Jasmine, Sweet Nectar', altitude: '1,900–2,300 masl', process: 'Natural & Anaerobic' },
  { name: 'Harar', profile: 'Rich Mocha, Blackberry, Cardamom', altitude: '1,500–2,100 masl', process: 'Sun-Dried Natural' },
  { name: 'Limu', profile: 'Brown Sugar, Orange Peel, Balanced', altitude: '1,400–1,800 masl', process: 'Washed' },
  { name: 'Jimma', profile: 'Earthy, Sweet Cocoa, Heavy Body', altitude: '1,400–1,800 masl', process: 'Natural & Honey' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-50 pt-20">
      {/* ── 1. Hero Banner ──────────────────────────────────────────────── */}
      <section className="relative bg-neutral-950 text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=1920&q=85"
            alt="Ethiopian coffee cherries at origin"
            fill
            className="object-cover opacity-20 filter brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5" />
              A Division of KIJIJ International LLC
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              Rooted in Ethiopian Soil. <br />
              <span className="text-amber-300">Trusted Worldwide.</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
              KIJIJ Coffee is the dedicated agricultural and specialty coffee export division of{' '}
              <strong className="text-white font-medium">KIJIJ International LLC</strong>. With operational
              desks in Saluda, South Carolina and Addis Ababa, Ethiopia, we bridge highland smallholder
              cooperatives with premier roasters and green coffee importers around the globe.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Brief Corporate Identity Statement ───────────────────────── */}
      <section className="py-14 sm:py-20 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs uppercase tracking-widest text-primary-700 font-bold">
                Corporate Synergy & Proven Standards
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 leading-snug">
                One Visionary Enterprise. <br className="hidden sm:inline" />
                Two Specialized Divisions.
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                As part of <strong className="text-neutral-900 font-medium">KIJIJ </strong>, our coffee export operations leverage the same institutional integrity, supply-chain logistics, and strict trade compliance that govern our artisan leather goods division.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                We believe exceptional coffee starts at the root: in fertile volcanic highlands, shaded by natural indigenous canopies, harvested with care by skilled farm families. By combining direct farmer relationships with modern trade infrastructure, we deliver fully traceable, high-scoring Ethiopian micro-lots and commercial container volumes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/coffees"
                  className="inline-flex items-center gap-2 bg-primary-800 hover:bg-primary-900 text-white px-6 py-3 rounded-full text-sm font-bold transition-colors"
                >
                  <Coffee className="h-4 w-4" />
                  View Coffee Catalog
                </Link>
                <a
                  href={SITE_CONFIG.urls.mainSite}
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  Visit KIJIJ Corporate Portal
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
                <Image
                  src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=900&q=85"
                  alt="Highland Ethiopian coffee plants"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white p-4 bg-black/40 backdrop-blur-sm rounded-xl">
                  <p className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-1">Authentic Origin</p>
                  <p className="text-sm font-medium">Smallholder cooperatives across Yirgacheffe, Sidamo, and Guji</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Four Core Pillars ────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-primary-700 font-bold">How We Operate</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mt-2">
              Our Pillars of Excellence
            </h2>
            <p className="text-neutral-600 text-sm mt-3">
              Built on transparency, certified grading, and reliable international delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm hover:border-amber-200 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{p.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Key Growing Regions We Export ────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-primary-700 font-bold">Ethiopian Terroir</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mt-2">
              Export Regions & Profiles
            </h2>
            <p className="text-neutral-600 text-sm mt-3">
              We supply single-origin specialty lots and commercial grade offerings from the cradle of coffee.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONS.map((r) => (
              <div
                key={r.name}
                className="p-6 rounded-2xl border border-neutral-100 bg-neutral-50/60 hover:bg-neutral-50 hover:border-amber-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-neutral-900">{r.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800">
                    {r.altitude}
                  </span>
                </div>
                <p className="text-xs font-medium text-amber-700 mb-2">{r.process}</p>
                <p className="text-sm text-neutral-600">{r.profile}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Dual-Hub Global Footprint ────────────────────────────────── */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Global Presence</span>
            <h2 className="text-3xl font-serif font-bold text-white mt-2">
              Dual-Hub Coordination for Seamless Export
            </h2>
            <p className="text-neutral-400 text-sm mt-2">
              Bridging the gap between origin harvest schedules and international destination roasting calendars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-800/80 p-8 rounded-2xl border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary-800/80 rounded-xl text-amber-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">United States Headquarters</h3>
                  <p className="text-xs text-neutral-400">Saluda, South Carolina</p>
                </div>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                121 Gladys Lane, Saluda, SC 29138. Direct oversight of North American buyer accounts, contract negotiation, import documentation, and buyer financing.
              </p>
              <p className="text-xs font-semibold text-amber-300">+1 (850) 264-5268</p>
            </div>

            <div className="bg-neutral-800/80 p-8 rounded-2xl border border-neutral-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary-800/80 rounded-xl text-amber-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ethiopia Operations Center</h3>
                  <p className="text-xs text-neutral-400">Addis Ababa, Ethiopia</p>
                </div>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                Sebara Babur, Addis Ababa. On-the-ground cooperative sourcing, sensory cupping lab, export packaging, quality certification, and port customs clearance.
              </p>
              <p className="text-xs font-semibold text-amber-300">+251 905 458 008 · +251 912 334 771</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-medium">Ready to discuss your specialty coffee requirements?</p>
              <p className="text-xs text-neutral-400">Our export team is available to assist with green coffee samples and contracting.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="bg-amber-400 text-neutral-950 hover:bg-amber-300 font-bold px-6 py-2.5 rounded-full text-sm transition-colors"
              >
                Contact Export Desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
