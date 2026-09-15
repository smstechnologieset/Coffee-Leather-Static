'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, GripVertical } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Yirgacheffe Grade 1 Washed', region: 'Yirgacheffe', isTopProduct: true, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80' },
  { id: 'p2', name: 'Sidamo Natural G1', region: 'Sidamo', isTopProduct: true, image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&q=80' },
  { id: 'p5', name: 'Guji Zone Natural G1', region: 'Guji', isTopProduct: true, image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=200&q=80' },
  { id: 'p3', name: 'Harar Longberry Natural', region: 'Harar', isTopProduct: false, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80' },
  { id: 'p4', name: 'Limu Washed G2', region: 'Limu', isTopProduct: false, image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=200&q=80' },
  { id: 'p6', name: 'Jimma Honey Process', region: 'Jimma', isTopProduct: false, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&q=80' },
];

export default function TopProductsSection() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const toggleTopProduct = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isTopProduct: !p.isTopProduct } : p));
  };

  const topProducts = products.filter(p => p.isTopProduct);
  const otherProducts = products.filter(p => !p.isTopProduct);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-neutral-900">Featured Products</h2>
          <p className="text-neutral-500 text-sm">Select products to feature on the homepage strip</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured list */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-neutral-900">Currently Featured ({topProducts.length})</h3>
          </div>
          
          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-4">
                <GripVertical className="h-5 w-5 text-neutral-300 cursor-move" />
                <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-neutral-900 truncate">{p.name}</p>
                  <p className="text-xs text-neutral-500">{p.region}</p>
                </div>
                <button
                  onClick={() => toggleTopProduct(p.id)}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-6">No products featured.</p>
            )}
          </div>
        </div>

        {/* Available list */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
          <h3 className="font-bold text-neutral-900 mb-4">Available Products</h3>
          
          <div className="space-y-3">
            {otherProducts.map((p) => (
              <div key={p.id} className="border border-neutral-100 p-3 rounded-xl flex items-center gap-4 hover:bg-neutral-50 transition-colors">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-neutral-900 truncate">{p.name}</p>
                  <p className="text-xs text-neutral-500">{p.region}</p>
                </div>
                <button
                  onClick={() => toggleTopProduct(p.id)}
                  className="px-3 py-1.5 text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-full transition-colors"
                >
                  Feature
                </button>
              </div>
            ))}
            {otherProducts.length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-6">All products are featured.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
