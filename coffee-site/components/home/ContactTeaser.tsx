import Link from 'next/link';
import { Mail, Phone, Clock } from 'lucide-react';

export default function ContactTeaser() {
  return (
    <section className="py-16 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">Ready to Start Trading?</h2>
            <p className="text-neutral-400">Our trade specialists are here to help you find the right coffee for your needs.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <a href="mailto:coffee@highlandroots.et" className="flex items-center gap-3 text-sm hover:text-amber-300 transition-colors group">
              <div className="h-10 w-10 bg-primary-700 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Email us</p>
                <p className="font-medium">coffee@highlandroots.et</p>
              </div>
            </a>
            <a href="tel:+251111234567" className="flex items-center gap-3 text-sm hover:text-amber-300 transition-colors group">
              <div className="h-10 w-10 bg-primary-700 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Call us</p>
                <p className="font-medium">+251 11 123 4567</p>
              </div>
            </a>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-10 w-10 bg-primary-700 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Hours (EAT)</p>
                <p className="font-medium">Mon–Fri 8am–6pm</p>
              </div>
            </div>
          </div>
          <Link
            href="/contact"
            className="bg-amber-400 text-neutral-900 hover:bg-amber-300 px-7 py-3 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 whitespace-nowrap"
          >
            Send a Message
          </Link>
        </div>
      </div>
    </section>
  );
}
