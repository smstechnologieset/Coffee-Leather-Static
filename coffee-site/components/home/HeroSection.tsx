'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1920&q=85', // coffee farm
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=85', // roasting
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=85', // beans
];

export default function HeroSection() {
  const [currentImg, setCurrentImg] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length);
        setFading(false);
      }, 700);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end text-white overflow-hidden">
      {/* Background image with crossfade */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Ethiopian coffee farm"
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-700 ${
              i === currentImg && !fading ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="100vw"
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="hero-overlay absolute inset-0 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 pt-40">
        <div className="text-center">
          {/* Eyebrow */}
          <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fadeIn">
            🌿 Ethiopian Specialty Coffee — Direct Trade
          </span>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fadeIn">
            From Highland Farms{' '}
            <span className="block text-amber-300">to Global Markets</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fadeIn">
            Highland Roots Trading PLC connects premium Ethiopian coffee producers
            with international buyers through transparent, traceable supply chains.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn">
            <Link
              href="/coffees"
              className="inline-block bg-amber-400 text-neutral-900 hover:bg-amber-300 px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Browse Our Coffees
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-white/70 text-white hover:bg-white hover:text-neutral-900 px-8 py-4 rounded-full font-bold text-base transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-10">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentImg ? 'bg-amber-400 w-6' : 'bg-white/40 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/60" />
      </div>
    </section>
  );
}
