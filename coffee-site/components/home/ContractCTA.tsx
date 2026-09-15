import Link from 'next/link';

const ORIGINS = [
  { name: 'Yirgacheffe', emoji: '🌿', desc: 'Floral & Citrus' },
  { name: 'Sidamo', emoji: '☕', desc: 'Berry & Wine' },
  { name: 'Guji', emoji: '🫐', desc: 'Tropical Fruit' },
  { name: 'Harar', emoji: '🍫', desc: 'Mocha & Spice' },
  { name: 'Limu', emoji: '🌱', desc: 'Balanced & Sweet' },
  { name: 'Jimma', emoji: '🏔️', desc: 'Earthy & Full' },
];

export default function ContractCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            Secure Your Coffee Supply Today
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Flexible contracting options tailored to your business needs — 
            from spot orders to annual supply agreements with price-fixing.
          </p>
        </div>

        {/* Origin grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-14">
          {ORIGINS.map((origin) => (
            <div
              key={origin.name}
              className="group bg-white/10 backdrop-blur-sm rounded-xl p-5 flex flex-col items-center text-center hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default"
            >
              <div className="text-3xl mb-2">{origin.emoji}</div>
              <h3 className="font-bold text-sm">{origin.name}</h3>
              <p className="text-xs text-primary-200 mt-0.5">{origin.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/coffees"
            className="inline-flex items-center gap-2 bg-amber-400 text-neutral-900 hover:bg-amber-300 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Request a Contract Now →
          </Link>
          <p className="mt-4 text-primary-200 text-sm max-w-xl mx-auto">
            Our contract specialists are ready to help you secure the best deals for your procurement needs.
          </p>
        </div>
      </div>
    </section>
  );
}
