import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Linkedin, Twitter, Instagram } from '@/components/SocialIcons';
import { SITE_CONFIG } from '@highland/shared/site-config';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${SITE_CONFIG.companyName}. We welcome enquiries from buyers, partners, and press.`,
};

export default function ContactPage() {
  return (
    <main className="flex flex-col">

      {/* ── Page hero ──────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold">
            Contact
          </p>
          <h1 className="text-5xl font-serif font-bold text-white">Get in Touch</h1>
          <p className="text-neutral-300 text-xl leading-relaxed">
            Whether you&apos;re a buyer, a prospective partner, or a journalist, we&apos;d love
            to hear from you.
          </p>
        </div>
      </section>

      {/* ── Contact content ────────────────────────────────────────────────── */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact details sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-neutral-900">
                  Contact Details
                </h2>
                <p className="text-neutral-500 text-sm">
                  ⚠️ All details below are placeholder — see MOCK_DATA.md
                </p>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary-50 flex-shrink-0">
                      <Mail size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide mb-0.5">
                        Email
                      </p>
                      <a
                        href={`mailto:${SITE_CONFIG.contact.email}`}
                        className="text-neutral-800 hover:text-primary-600 transition-colors font-medium"
                      >
                        {SITE_CONFIG.contact.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary-50 flex-shrink-0">
                      <Phone size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide mb-0.5">
                        Phone
                      </p>
                      <a
                        href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, '')}`}
                        className="text-neutral-800 hover:text-primary-600 transition-colors font-medium"
                      >
                        {SITE_CONFIG.contact.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary-50 flex-shrink-0">
                      <MapPin size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide mb-0.5">
                        Address
                      </p>
                      <p className="text-neutral-800 font-medium">
                        {SITE_CONFIG.contact.address}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Social links */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 space-y-4">
                <h3 className="text-lg font-serif font-semibold text-neutral-900">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { href: SITE_CONFIG.social.linkedin, Icon: Linkedin, label: 'LinkedIn' },
                    { href: SITE_CONFIG.social.twitter,  Icon: Twitter,  label: 'Twitter' },
                    { href: SITE_CONFIG.social.instagram, Icon: Instagram, label: 'Instagram' },
                  ].map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-200
                                 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600
                                 transition-colors duration-150"
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
                <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-neutral-500 text-sm mb-8">
                  We typically respond within 1–2 business days.
                </p>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
