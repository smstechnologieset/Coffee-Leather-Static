import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const VALUES = [
  'Integrity in every transaction',
  'Sustainability from farm to export',
  'Mutually beneficial producer partnerships',
  'Continuous quality improvement',
  'Transparent pricing & traceable supply chains',
];

export default function PurposeSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-base text-primary-600 font-semibold tracking-widest uppercase mb-2">Our Mission</h2>
          <p className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">Our Purpose</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Text (order-2 on lg) */}
          <div className="lg:order-1">
            <p className="text-lg text-neutral-600 leading-relaxed">
              At Highland Roots Trading PLC, our purpose transcends commerce. We are committed to 
              fostering sustainable economic growth by facilitating coffee trade that benefits all 
              stakeholders — from smallholder farmers in the Ethiopian highlands to specialty roasters 
              across the globe.
            </p>
            <p className="mt-5 text-lg text-neutral-600 leading-relaxed">
              We believe in creating value through responsible trading practices that respect both 
              people and planet. Every lot we export represents a direct investment in the communities 
              and ecosystems where it was grown.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-serif font-bold text-neutral-900 mb-4">Core Values</h3>
              <ul className="space-y-3">
                {VALUES.map((value) => (
                  <li key={value} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    <span className="text-neutral-600">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image (order-1 on lg) */}
          <div className="lg:order-2 relative h-96 rounded-2xl overflow-hidden shadow-brand-lg">
            <Image
              src="https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=900&q=85"
              alt="Ethiopian coffee farmers harvesting"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
