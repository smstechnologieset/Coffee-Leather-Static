import type { Metadata } from 'next';
import Image from 'next/image';
import { Mail, Phone, MapPin, Coffee, Clock, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — KIJIJ Coffee Export Desk',
  description:
    'Contact KIJIJ Coffee for green coffee samples, container spot offers, and seasonal supply agreements direct from Ethiopian smallholder cooperatives.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-50 pt-20">
      {/* ── 1. Page Header ────────────────────────────────────────────────── */}
      <section className="relative bg-neutral-950 text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=85"
            alt="Ethiopian coffee harvest and logistics"
            fill
            className="object-cover opacity-20 filter brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Coffee className="h-3.5 w-3.5" />
              Specialty Coffee Export Desk
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              Connect with Our <br />
              <span className="text-amber-300">Coffee Trade Specialists</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
              Connect directly with our coffee desks in Saluda, South Carolina and Addis Ababa, Ethiopia. Whether you require cupping samples, spot container pricing, or annual supply contracting, our export team is here to assist.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Regional Trade Offices Strip ───────────────────────────────── */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SITE_CONFIG.contact.offices.map((office) => (
              <div
                key={office.label}
                className="border border-neutral-200 rounded-2xl p-7 flex items-start gap-5 hover:border-amber-400/60 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="text-xs uppercase tracking-widest text-primary-700 font-bold">
                    {office.country}
                  </span>
                  <h2 className="text-xl font-serif font-bold text-neutral-900">
                    {office.label}
                  </h2>
                  <p className="text-neutral-600 text-sm">{office.address}</p>
                  <a
                    href={`tel:${office.phone.replace(/\s/g, '')}`}
                    className="inline-block text-xs font-bold text-amber-700 hover:text-amber-800 pt-1 tracking-wide"
                  >
                    {office.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Contact Form & Communications Split ────────────────────────── */}
      <section className="py-16 sm:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Direct Communication Details (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-primary-700 font-bold">
                  Direct Communications
                </span>
                <h2 className="text-3xl font-serif font-bold text-neutral-900">
                  Reach Our Trade Desks
                </h2>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Our international trade representatives respond within 24 business hours. For urgent shipment tracking or prompt container booking, feel free to call our regional lines directly.
                </p>
              </div>

              {/* Telephone Lines */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <p className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                    Telephone & WhatsApp Lines
                  </p>
                  <span className="text-[11px] text-primary-700 font-medium bg-primary-50 px-2 py-0.5 rounded-full">
                    Direct Voice
                  </span>
                </div>
                <ul className="space-y-3">
                  {SITE_CONFIG.contact.phones.map((phone) => (
                    <li key={phone.number} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-500 block font-medium">{phone.label}</span>
                        <a
                          href={`tel:${phone.number.replace(/\s/g, '')}`}
                          className="font-semibold text-neutral-900 hover:text-primary-700 transition-colors text-sm"
                        >
                          {phone.number}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email Addresses */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <p className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                    Email Correspondence
                  </p>
                  <span className="text-[11px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                    24h Response
                  </span>
                </div>
                <ul className="space-y-3">
                  {SITE_CONFIG.contact.emails.map((email) => (
                    <li key={email} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4" />
                      </div>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm font-semibold text-neutral-900 hover:text-primary-700 transition-colors truncate"
                      >
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Corporate Division Note */}
              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Building2 className="h-4 w-4 text-amber-700" />
                  KIJIJ International LLC
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  KIJIJ Coffee is a specialized operating subsidiary. For corporate governance, institutional partnership, or inquiries regarding our handcrafted leather goods division, visit our corporate portal.
                </p>
                <a
                  href={SITE_CONFIG.urls.mainSite}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 pt-1"
                >
                  Visit Corporate Portal <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Right: Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
                <div className="border-b border-neutral-100 pb-5">
                  <span className="text-xs uppercase tracking-widest text-primary-700 font-bold">
                    Inquiry Form
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
                    Send Us a Trade Inquiry
                  </h2>
                  <p className="text-neutral-500 text-sm mt-1">
                    Complete the form below to request cupping samples, spot quotes, or schedule a consultation with our export team.
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
