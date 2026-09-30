'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  ArrowLeft, Star, Check,
  ChevronLeft, ChevronRight, ShoppingBag,
} from 'lucide-react';
import { getLeatherProducts, getLeatherProductBySlug, LeatherProduct } from '@/lib/leather-data';
import { useCartStore } from '@/store/cartStore';
import WishlistButton from '@/components/WishlistButton';

type Tab = 'description' | 'crafting' | 'care';

// Slim related product card
function RelatedCard({ product }: { product: LeatherProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block flex-shrink-0 w-44 sm:w-52">
      <div className="relative bg-[#F2EDE8] overflow-hidden mb-2" style={{ aspectRatio: '4/5' }}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
          sizes="220px"
        />
      </div>
      <p className="text-xs font-semibold text-neutral-900 leading-tight group-hover:underline underline-offset-2">
        {product.name}
      </p>
      <p className="text-xs text-neutral-500 mt-0.5">${product.price.toFixed(2)}</p>
    </Link>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<LeatherProduct | null>(null);
  const [related, setRelated] = useState<LeatherProduct[]>([]);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCartStore();

  useEffect(() => {
    const p = getLeatherProductBySlug(slug);
    if (!p) {
      setNotFoundFlag(true);
      return;
    }
    setProduct(p);
    const all = getLeatherProducts();
    setRelated(all.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 6));

    const handler = () => {
      const updated = getLeatherProductBySlug(slug);
      if (updated) setProduct(updated);
    };
    window.addEventListener('kijij_leather_products_updated', handler);
    return () => window.removeEventListener('kijij_leather_products_updated', handler);
  }, [slug]);

  if (notFoundFlag) notFound();
  if (!product) return null;

  const color = product.colors[selectedColor];
  const size = product.sizes?.[selectedSize];
  const stars = product.rating ? Math.round(product.rating) : 0;

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${color.name}${size ? `-${size}` : ''}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: color.name,
      size,
      quantity: 1,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'description', label: 'Description' },
    ...(product.craftingNote ? [{ id: 'crafting' as Tab, label: 'Crafting Notes' }] : []),
    ...(product.careInstructions ? [{ id: 'care' as Tab, label: 'Care' }] : []),
  ];

  return (
    <div className="bg-white">

      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Collection
        </Link>
      </div>

      {/* Main layout */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] lg:gap-12 xl:gap-20">

          {/* LEFT: Image Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">

            {/* Thumbnail strip */}
            <div className="flex sm:flex-col gap-2 sm:w-20 overflow-x-auto sm:overflow-x-visible scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden transition-all ${
                    activeImage === i
                      ? 'ring-2 ring-neutral-900 ring-offset-1'
                      : 'ring-1 ring-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative bg-[#F2EDE8] overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <Image
                key={activeImage}
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover animate-fadeIn"
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              {/* Prev / Next arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((activeImage - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4 text-neutral-700" />
                  </button>
                  <button
                    onClick={() => setActiveImage((activeImage + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4 text-neutral-700" />
                  </button>
                  {/* Dot indicator */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`h-1 rounded-full transition-all ${i === activeImage ? 'bg-neutral-900 w-5' : 'bg-white/70 w-1.5'}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isNew && (
                  <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                    New In
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-[#7A4F2E] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                    Bestseller
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="mt-8 lg:mt-0">

            {/* Sub-breadcrumb */}
            <p className="text-[10px] text-neutral-400 uppercase tracking-[0.22em] font-medium mb-3">
              {product.category}{product.subCategory ? ` / ${product.subCategory}` : ''}
            </p>

            {/* Product name + wishlist */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-3xl sm:text-[2.25rem] font-serif font-bold text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <WishlistButton
                productId={product.id}
                className="flex-shrink-0 mt-1 p-2 rounded-full border border-neutral-200 hover:border-neutral-400 transition-colors"
              />
            </div>

            {/* Tagline */}
            <p className="text-sm text-neutral-500 mb-4">{product.tagline}</p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${s <= stars ? 'fill-[#8B4513] text-[#8B4513]' : 'fill-neutral-200 text-neutral-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-500">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-neutral-100">
              <span className="text-2xl font-bold text-neutral-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-base text-neutral-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.isOnSale && product.originalPrice && (
                <span className="text-xs font-bold text-[#8B1A2F] uppercase tracking-wide">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Colour picker */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-3">
                Colour: <span className="font-normal normal-case tracking-normal text-neutral-900">{color.name}</span>
              </p>
              <div className="flex items-center gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      selectedColor === i
                        ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110'
                        : 'ring-1 ring-neutral-300 hover:ring-neutral-500'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size picker */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Size: <span className="font-normal normal-case tracking-normal text-neutral-900">{size}</span>
                  </p>
                  <button className="text-[11px] text-neutral-500 underline underline-offset-2 hover:text-neutral-900">
                    Size guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(i)}
                      className={`min-w-[44px] px-3 py-2 text-xs font-semibold border transition-colors ${
                        selectedSize === i
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Low stock warning */}
            {product.stockCount !== undefined && product.stockCount <= 5 && product.stockCount > 0 && (
              <p className="text-xs font-semibold text-[#8B1A2F] mb-4">
                Only {product.stockCount} remaining in this colour
              </p>
            )}

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center gap-2.5 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 mb-3 ${
                !product.inStock
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : addedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 text-white hover:bg-neutral-700 active:scale-[0.99]'
              }`}
            >
              {addedToCart ? (
                <><Check className="h-4 w-4" /> Added to Cart</>
              ) : product.inStock ? (
                <><ShoppingBag className="h-4 w-4" /> Add to Cart</>
              ) : (
                'Out of Stock'
              )}
            </button>


            {/* Material / origin quick-facts */}
            <div className="bg-[#F9F6F1] px-5 py-4 space-y-2.5">
              {product.material && (
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-neutral-500 font-medium flex-shrink-0">Material</span>
                  <span className="text-neutral-900 text-right">{product.material}</span>
                </div>
              )}
              {product.origin && (
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-neutral-500 font-medium flex-shrink-0">Origin</span>
                  <span className="text-neutral-900 text-right">{product.origin}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-neutral-500 font-medium flex-shrink-0">Weight</span>
                  <span className="text-neutral-900">{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-neutral-500 font-medium flex-shrink-0">Dimensions</span>
                  <span className="text-neutral-900">{product.dimensions}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Section */}
        <div className="mt-16 border-t border-neutral-100 pt-10">
          <div className="flex border-b border-neutral-200 mb-8 gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-xs font-semibold uppercase tracking-widest whitespace-nowrap transition-colors -mb-px ${
                  activeTab === tab.id
                    ? 'border-b-2 border-neutral-900 text-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-2xl animate-fadeIn">
            {activeTab === 'description' && (
              <div>
                <p className="text-neutral-700 leading-relaxed text-sm mb-7">{product.description}</p>
                {product.features.length > 0 && (
                  <ul className="space-y-3">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                        <Check className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === 'crafting' && product.craftingNote && (
              <div>
                <p className="text-neutral-700 leading-relaxed text-sm mb-6">{product.craftingNote}</p>
                <div className="bg-[#F9F6F1] border-l-2 border-[#8B4513] pl-5 py-4 pr-4">
                  <p className="text-xs font-semibold text-[#8B4513] uppercase tracking-wider mb-1">
                    Handcrafted in Ethiopia
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Every piece in the KIJIJ collection is individually crafted by master artisans in Addis Ababa,
                    using hides sourced exclusively from Ethiopian tanneries. Full traceability, from the highland pasture to your hands.
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'care' && product.careInstructions && (
              <p className="text-neutral-700 leading-relaxed text-sm">{product.careInstructions}</p>
            )}
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-neutral-100 pt-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400 mb-6">
              You May Also Like
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Back CTA */}
        <div className="mt-16 pt-8 border-t border-neutral-100 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-900 border border-neutral-900 px-8 py-3.5 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
