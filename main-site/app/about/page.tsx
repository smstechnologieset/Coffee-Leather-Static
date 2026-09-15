import type { Metadata } from 'next';
import Image from 'next/image';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { COMPANY_COPY, TEAM_MEMBERS } from '@/lib/mock-content';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_CONFIG.companyName} — our mission, vision, values, and the story of how we became Ethiopia's trusted agricultural export partner.`,
  openGraph: {
    title: `About Us | ${SITE_CONFIG.companyName}`,
    description: COMPANY_COPY.mission,
  },
};

export default function AboutPage() {
  return (
    <main className="flex flex-col">

      {/* ── Page hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/about-hero/1920/600"
            alt="Highland Roots — placeholder hero image"
            fill
            className="object-cover opacity-20"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 to-neutral-950" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold">
            Who We Are
          </p>
          <h1 className="text-5xl lg:text-6xl font-serif font-bold text-white">
            About Highland Roots
          </h1>
          <p className="text-neutral-300 text-xl leading-relaxed max-w-2xl mx-auto">
            An Ethiopian company built on the belief that the world deserves better access to
            what Ethiopia grows.
          </p>
        </div>
      </section>

      {/* ── Company overview ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-bold text-neutral-900">Company Overview</h2>
              <div className="space-y-4">
                {COMPANY_COPY.about.map((para, i) => (
                  <p key={i} className="text-neutral-600 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-brand">
                <Image
                  src="https://picsum.photos/seed/about-overview/700/400"
                  alt="Ethiopian highland — placeholder"
                  fill className="object-cover" unoptimized
                />
              </div>
              {/* Founding story callout */}
              <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 space-y-3">
                <p className="text-primary-600 text-xs uppercase tracking-widest font-semibold">
                  Founding Story · {COMPANY_COPY.foundingStory.year}
                </p>
                <h3 className="text-xl font-serif font-bold text-neutral-900">
                  {COMPANY_COPY.foundingStory.headline}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {COMPANY_COPY.foundingStory.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission / Vision ───────────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold">
              Our Purpose
            </p>
            <h2 className="text-4xl font-serif font-bold text-white">
              Mission, Vision & Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
              <p className="text-primary-400 text-xs uppercase tracking-widest font-semibold">Mission</p>
              <p className="text-white text-xl font-serif leading-relaxed">{COMPANY_COPY.mission}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
              <p className="text-accent-400 text-xs uppercase tracking-widest font-semibold">Vision</p>
              <p className="text-white text-xl font-serif leading-relaxed">{COMPANY_COPY.vision}</p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPANY_COPY.values.map((value) => (
              <div key={value.title} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3
                                                hover:bg-white/10 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary-400" />
                </div>
                <h3 className="text-white font-semibold">{value.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <p className="text-primary-600 text-sm uppercase tracking-widest font-semibold">
              Our People
            </p>
            <h2 className="text-4xl font-serif font-bold text-neutral-900">Leadership Team</h2>
            <p className="text-neutral-500 text-sm">[MOCK] — placeholder team; real bios pending client input</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name}
                   className="bg-white rounded-2xl overflow-hidden shadow-sm
                              border border-neutral-100 hover:shadow-brand transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={member.image}
                    alt={`${member.name} — placeholder portrait`}
                    fill className="object-cover" unoptimized
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-serif font-bold text-neutral-900 text-lg">{member.name}</h3>
                  <p className="text-primary-600 text-sm font-medium">{member.role}</p>
                  <p className="text-neutral-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
