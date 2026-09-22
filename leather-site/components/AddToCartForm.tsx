'use client';

import { useState } from 'react';
import { ShoppingBag, Truck, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { LeatherProduct } from '@/lib/leather-data';

export default function AddToCartForm({ product }: { product: LeatherProduct }) {
  const { addItem } = useCartStore();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedColor}${selectedSize ? `-${selectedSize}` : ''}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    });
  };

  return (
    <div className="mt-6">
      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm text-neutral-900 font-medium mb-3">Color</h3>
          <div className="flex items-center gap-3">
            {product.colors.map((color) => (
              <label key={color} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="color"
                  value={color}
                  className="peer sr-only"
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                />
                <span className="block px-4 py-2 text-sm font-medium border border-neutral-200 rounded-md peer-checked:border-accent-700 peer-checked:bg-accent-50 transition-colors">
                  {color}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm text-neutral-900 font-medium">Size</h3>
            <button type="button" className="text-sm text-accent-700 hover:underline">
              Size guide
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.sizes.map((size) => (
              <label key={size} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={size}
                  className="peer sr-only"
                  checked={selectedSize === size}
                  onChange={() => setSelectedSize(size)}
                />
                <span className="block text-center px-4 py-3 text-sm font-medium border border-neutral-200 rounded-md peer-checked:border-accent-700 peer-checked:bg-accent-50 transition-colors uppercase">
                  {size}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="w-full bg-accent-700 text-white py-4 px-8 rounded-lg font-bold hover:bg-accent-800 transition-colors mb-4 flex items-center justify-center gap-2"
      >
        <ShoppingBag className="h-5 w-5" /> Add to Cart
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-8">
        <Truck className="h-4 w-4" /> Free worldwide shipping
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <h3 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-wider">
          Features & Materials
        </h3>
        <ul className="space-y-3">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-neutral-600">
              <Check className="h-4 w-4 text-accent-600 mt-0.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
