'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Your Cart
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-neutral-200" />
              <p className="text-neutral-500">Your cart is currently empty.</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-accent-700 font-medium hover:underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-24 w-20 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-neutral-900 line-clamp-2 pr-4">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-neutral-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {(item.color || item.size) && (
                      <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">
                        {item.color} {item.size ? ` / ${item.size}` : ''}
                      </p>
                    )}
                    <p className="text-sm font-medium text-neutral-900 mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-neutral-200 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 text-neutral-500 hover:text-neutral-900"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-neutral-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-neutral-500 hover:text-neutral-900"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-100 p-4 bg-neutral-50">
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-neutral-500 font-medium">Subtotal</span>
              <span className="text-neutral-900 font-bold text-lg">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-neutral-500 mb-4 text-center">Shipping & taxes calculated at checkout</p>
            <Link 
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-accent-700 text-white text-center py-3 rounded-md font-bold hover:bg-accent-800 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
