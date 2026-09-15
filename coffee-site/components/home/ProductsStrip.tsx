'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Static coffee products for the homepage strip
const STRIP_PRODUCTS = [
  { id: '1', name: 'Yirgacheffe Grade 1', category: 'Washed', price: '$4,200/MT', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80', availability: 'In Stock' },
  { id: '2', name: 'Sidamo Guji Natural', category: 'Natural', price: '$3,800/MT', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80', availability: 'In Stock' },
  { id: '3', name: 'Harar Longberry', category: 'Natural', price: '$4,600/MT', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', availability: 'In Stock' },
  { id: '4', name: 'Limu Washed G2', category: 'Washed', price: '$3,400/MT', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80', availability: 'Limited' },
  { id: '5', name: 'Guji Natural G1', category: 'Natural', price: '$4,900/MT', image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400&q=80', availability: 'In Stock' },
  { id: '6', name: 'Jimma Honey Process', category: 'Honey', price: '$4,100/MT', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', availability: 'In Stock' },
];

// Duplicate for infinite scroll
const ALL_PRODUCTS = [...STRIP_PRODUCTS, ...STRIP_PRODUCTS];

export default function ProductsStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const autoScrollPaused = useRef(false);
  const animFrameId = useRef<number>(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scroll = () => {
      if (!autoScrollPaused.current && !isDragging.current) {
        container.scrollLeft += 0.8;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animFrameId.current = requestAnimationFrame(scroll);
    };
    animFrameId.current = requestAnimationFrame(scroll);

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - container.offsetLeft;
      scrollLeftStart.current = container.scrollLeft;
      container.style.cursor = 'grabbing';
      autoScrollPaused.current = true;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      container.scrollLeft = scrollLeftStart.current - (x - startX.current) * 2;
    };
    const onMouseUp = () => {
      isDragging.current = false;
      container.style.cursor = 'grab';
      setTimeout(() => { if (!isDragging.current) autoScrollPaused.current = false; }, 1000);
    };
    const onMouseEnter = () => { autoScrollPaused.current = true; };
    const onMouseLeave = () => { if (isDragging.current) onMouseUp(); autoScrollPaused.current = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-widest uppercase mb-2">Our Catalog</h2>
          <p className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">Premium Coffee Selection</p>
          <p className="mt-4 text-lg text-neutral-500 max-w-xl mx-auto">
            Carefully curated from Ethiopia&apos;s finest growing regions — drag to explore
          </p>
        </div>
      </div>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-8 cursor-grab select-none"
        style={{ scrollBehavior: 'auto' }}
      >
        {ALL_PRODUCTS.map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-brand hover:shadow-brand-lg border border-neutral-100 overflow-hidden group transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-44 overflow-hidden relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="256px"
              />
              <div className="absolute top-3 right-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  product.availability === 'In Stock'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {product.availability}
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">{product.category}</p>
              <h3 className="text-sm font-bold text-neutral-900 mt-1 group-hover:text-primary-700 transition-colors">{product.name}</h3>
              <p className="text-primary-700 font-bold text-sm mt-1">{product.price}</p>
              <div className="flex gap-2 mt-3">
                <Link
                  href={`/coffees/${product.id}/request-sample`}
                  className="flex-1 text-center text-xs border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white py-1.5 rounded-full font-medium transition-all duration-200"
                >
                  Sample
                </Link>
                <Link
                  href={`/coffees/${product.id}/request-contract`}
                  className="flex-1 text-center text-xs border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white py-1.5 rounded-full font-medium transition-all duration-200"
                >
                  Contract
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/coffees"
          className="inline-block border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white px-8 py-3 rounded-full font-bold transition-all duration-300"
        >
          Explore Full Catalog →
        </Link>
      </div>
    </section>
  );
}
