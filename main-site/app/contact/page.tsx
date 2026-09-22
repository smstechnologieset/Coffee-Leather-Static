import type { Metadata } from 'next';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Linkedin, Twitter, Instagram } from '@/components/SocialIcons';
import { SITE_CONFIG } from '@highland/shared/site-config';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Trade Offices',
  description: `Get in touch with ${SITE_CONFIG.companyName}. We welcome enquiries from buyers, roasters, commercial partners, and press.`,
};

export default function ContactPage() {
  return (
    <main className="flex flex-col bg-white">

      {/* ── 1. Page Header ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-neutral-950 text-white relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=85"
            alt="International trade and logistics port terminal"
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
                Global Inquiries
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-serif font-normal text-white leading-tight tracking-tight">
              Get in Touch with Our Team
            </h1>

            <p className="text-neutral-300 text-lg sm:text-xl font-light leading-relaxed">
              Connect with our trade offices in Saluda, South Carolina and Addis Ababa, Ethiopia for commodity contracts, cupping samples, and retail partnership inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Offices Summary Strip ────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SITE_CONFIG.contact.offices.map((office) => (
              <div
                key={office.label}
                className="border border-neutral-200 rounded-xs p-6 sm:p-8 flex items-start gap-5 hover:border-neutral-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xs border border-primary-500/30 bg-primary-50 flex items-center justify-center text-primary-700 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs uppercase tracking-widest text-primary-700 font-semibold">
                    {office.country}
                  </p>
                  <h2 className="text-xl font-serif font-normal text-neutral-950">
                    {office.label}
                  </h2>
                  <p className="text-neutral-600 text-sm font-light">{office.address}</p>
                  <a
                    href={`tel:${office.phone.replace(/\s/g, '')}`}
                    className="text-xs uppercase tracking-wider font-semibold text-primary-700 hover:text-primary-800 pt-1 block transition-colors"
                  >
                    {office.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Contact Form & Communications Split ──────────────────────────── */}
      <section className="py-20 sm:py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left: Communication Channels — 5 cols */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
                  Direct Communications
                </p>
                <h2 className="text-3xl font-serif font-normal text-neutral-950">
                  Connect Directly
                </h2>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  Our international trade representatives respond within 1–2 business days. For urgent shipment inquiries, contact our regional phone numbers directly.
                </p>
              </div>

              {/* Phones List */}
              <div className="border border-neutral-200 bg-white rounded-xs p-6 space-y-4">
                <p className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Telephone Lines
                </p>
                <ul className="space-y-3 text-sm">
                  {SITE_CONFIG.contact.phones.map((phone) => (
                    <li key={phone.number} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xs bg-neutral-100 flex items-center justify-center text-neutral-700 flex-shrink-0">
                        <Phone size={14} />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 block font-medium">{phone.label}</span>
                        <a
                          href={`tel:${phone.number.replace(/\s/g, '')}`}
                          className="font-medium text-neutral-900 hover:text-primary-700 transition-colors"
                        >
                          {phone.number}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emails List */}
              <div className="border border-neutral-200 bg-white rounded-xs p-6 space-y-4">
                <p className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Email Correspondence
                </p>
                <ul className="space-y-3 text-sm">
                  {SITE_CONFIG.contact.emails.map((email) => (
                    <li key={email} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xs bg-neutral-100 flex items-center justify-center text-neutral-700 flex-shrink-0">
                        <Mail size={14} />
                      </div>
                      <a
                        href={`mailto:${email}`}
                        className="font-medium text-neutral-900 hover:text-primary-700 transition-colors truncate"
                      >
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Channels */}
              <div className="border border-neutral-200 bg-white rounded-xs p-6 space-y-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Corporate Channels
                </p>
                <div className="flex gap-2.5">
                  <a
                    href={SITE_CONFIG.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-9 h-9 rounded-xs border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-primary-700 hover:border-primary-500 transition-colors"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a
                    href={SITE_CONFIG.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter / X"
                    className="w-9 h-9 rounded-xs border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-primary-700 hover:border-primary-500 transition-colors"
                  >
                    <Twitter size={16} />
                  </a>
                  <a
                    href={SITE_CONFIG.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-xs border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-primary-700 hover:border-primary-500 transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Clean Inquiry Form — 7 cols */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-neutral-200 rounded-xs p-8 sm:p-12 shadow-subtle space-y-8">
                <div className="space-y-2 border-b border-neutral-150 pb-5">
                  <h2 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-950">
                    Send Us an Inquiry
                  </h2>
                  <p className="text-neutral-500 text-sm font-light">
                    For sample requests, commercial volume orders, or general inquiries.
                  </p>
                </div>

                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
