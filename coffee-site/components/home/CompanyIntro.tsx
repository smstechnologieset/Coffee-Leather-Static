import Image from 'next/image';
import { Zap, ShieldCheck, Users, DollarSign } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Direct Sourcing',
    desc: 'We work directly with smallholder farmers and cooperatives — no middlemen, full traceability.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Certified',
    desc: 'All lots undergo rigorous cupping, moisture analysis, and international grading before export.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    desc: 'Our experienced cuppers, agronomists, and logistics specialists ensure seamless delivery.',
  },
  {
    icon: DollarSign,
    title: 'Competitive Pricing',
    desc: 'Direct producer relationships allow us to offer world-class Ethiopian coffee at fair prices.',
  },
];

export default function CompanyIntro() {
  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-base text-primary-600 font-semibold tracking-widest uppercase mb-2">About Our Company</h2>
          <p className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
            Welcome to Highland Roots Trading PLC
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-brand-lg">
            <Image
              src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=900&q=85"
              alt="Ethiopian coffee cooperative"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent" />
            <div className="absolute bottom-5 left-5 glass-card rounded-xl px-4 py-3">
              <p className="text-white text-sm font-bold">🌍 15+ Countries Served</p>
              <p className="text-white/80 text-xs">Europe · Middle East · Asia · Americas</p>
            </div>
          </div>

          {/* Text + features */}
          <div>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Established with a vision to bridge global markets, Highland Roots Trading PLC has emerged 
              as a trusted partner in Ethiopian specialty coffee export. With deep roots in the Ethiopian 
              highlands, we specialize in connecting smallholder cooperatives with premium international buyers.
            </p>
            <p className="mt-5 text-lg text-neutral-600 leading-relaxed">
              Our commitment to quality, traceability, and ethical sourcing has earned us recognition 
              among specialty roasters worldwide. We provide fully documented, cupped, and graded lots 
              with complete farm-level transparency.
            </p>

            <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-primary-700 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <dt className="font-bold text-neutral-900">{title}</dt>
                    <dd className="text-sm text-neutral-500 mt-1">{desc}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
