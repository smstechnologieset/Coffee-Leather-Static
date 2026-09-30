'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { getLeatherProducts, LeatherProduct, LeatherCategory } from '@/lib/leather-data';
import WishlistButton from '@/components/WishlistButton';

// ── Types ─────────────────────────────────────────────────────────────────────
type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'bestseller';

const CATEGORIES: LeatherCategory[] = [
  'Bags',
  'Jackets',
  'Small Leather Goods',
  'Wallets',
  'Belts & Accessories',
];

const MATERIALS = [
  'Full-grain Ethiopian cowhide',
  'Vegetable-tanned Ethiopian cowhide',
  'Ethiopian highland sheepskin',
  'Top-grain Ethiopian cowhide',
  'Soft-tumbled Ethiopian cowhide',
];

// ── Collapsible filter section ────────────────────────────────────────────────
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-neutral-900 uppercase tracking-wider"
      >
        {title}
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

// ── Product Card (Prada-style) ─────────────────────────────────────────────────
function ProductCard({ product }: { product: LeatherProduct }) {
  const [hovered, setHovered] = useState(false);
  const showSecond = hovered && product.images.length > 1;

  const stars = product.rating ? Math.round(product.rating) : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container — sharp edges, neutral background, like Prada */}
      <div className="relative bg-[#F2EDE8] overflow-hidden mb-3" style={{ aspectRatio: '4/5' }}>
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
              New In
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#7A4F2E] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
              Bestseller
            </span>
          )}
          {product.isOnSale && (
            <span className="bg-[#8B1A2F] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist heart — top right */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton
            productId={product.id}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          />
        </div>

        {/* Primary image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-500 ${showSecond ? 'opacity-0' : 'opacity-100'}`}
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Secondary image (cross-fade on hover) */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} — alternate view`}
            fill
            className={`object-cover transition-opacity duration-500 ${showSecond ? 'opacity-100' : 'opacity-0'}`}
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}

        {/* Stock warning */}
        {product.stockCount !== undefined && product.stockCount <= 5 && product.stockCount > 0 && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <span className="block text-center bg-white/90 backdrop-blur-sm text-neutral-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1">
              Only {product.stockCount} left
            </span>
          </div>
        )}
      </div>

      {/* Info below image */}
      <div>
        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="flex gap-1.5 mb-2">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-neutral-500 leading-3.5 self-center">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        <h3 className="text-sm font-semibold text-neutral-900 leading-tight tracking-tight group-hover:underline underline-offset-2">
          {product.name}
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5 mb-1.5">{product.tagline}</p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-2.5 w-2.5 ${s <= stars ? 'fill-[#8B4513] text-[#8B4513]' : 'fill-neutral-200 text-neutral-200'}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-neutral-500">({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<LeatherProduct[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<LeatherCategory[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showBestsellersOnly, setShowBestsellersOnly] = useState(false);
  const [showSaleOnly, setShowSaleOnly] = useState(false);

  // Sort
  const [sort, setSort] = useState<SortOption>('recommended');

  useEffect(() => {
    setAllProducts(getLeatherProducts());
    const handler = () => setAllProducts(getLeatherProducts());
    window.addEventListener('kijij_leather_products_updated', handler);
    return () => window.removeEventListener('kijij_leather_products_updated', handler);
  }, []);

  // Derive all unique colors across products for the color filter
  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    allProducts.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [allProducts]);

  // Max price in catalog
  const maxPrice = useMemo(
    () => Math.ceil(Math.max(...allProducts.map((p) => p.price), 1500) / 50) * 50,
    [allProducts]
  );

  // Filtered + sorted products
  const products = useMemo(() => {
    let result = [...allProducts];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));
    }
    if (selectedMaterials.length > 0) {
      result = result.filter((p) => selectedMaterials.includes(p.material));
    }
    if (showNewOnly) result = result.filter((p) => p.isNew);
    if (showBestsellersOnly) result = result.filter((p) => p.isBestseller);
    if (showSaleOnly) result = result.filter((p) => p.isOnSale);

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'bestseller':
        result.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        break;
    }

    return result;
  }, [
    allProducts, selectedCategories, priceRange, selectedColors,
    selectedMaterials, showNewOnly, showBestsellersOnly, showSaleOnly, sort,
  ]);

  const activeFilterCount =
    selectedCategories.length +
    selectedColors.length +
    selectedMaterials.length +
    (showNewOnly ? 1 : 0) +
    (showBestsellersOnly ? 1 : 0) +
    (showSaleOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setShowNewOnly(false);
    setShowBestsellersOnly(false);
    setShowSaleOnly(false);
  };

  const toggleCategory = (cat: LeatherCategory) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const toggleColor = (name: string) =>
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  const toggleMaterial = (mat: string) =>
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );

  // ── Filter Sidebar Content ─────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="space-y-0">
      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedCategories.length === 0}
              onChange={clearAllFilters}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-0 h-3.5 w-3.5"
            />
            <span className={`text-sm ${selectedCategories.length === 0 ? 'font-semibold text-neutral-900' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
              All ({allProducts.length})
            </span>
          </label>
          {CATEGORIES.map((cat) => {
            const count = allProducts.filter((p) => p.category === cat).length;
            if (count === 0) return null;
            return (
              <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0 h-3.5 w-3.5"
                />
                <span className={`text-sm flex-1 ${selectedCategories.includes(cat) ? 'font-semibold text-neutral-900' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                  {cat}
                </span>
                <span className="text-xs text-neutral-400">({count})</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price">
        <div className="px-1">
          <div className="flex justify-between text-xs text-neutral-600 mb-3">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}{priceRange[1] >= maxPrice ? '+' : ''}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={25}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full h-0.5 bg-neutral-200 rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900"
          />
        </div>
      </FilterSection>

      {/* Color */}
      {allColors.length > 0 && (
        <FilterSection title="Colour">
          <div className="flex flex-wrap gap-2">
            {allColors.map(({ name, hex }) => (
              <button
                key={name}
                title={name}
                onClick={() => toggleColor(name)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColors.includes(name)
                    ? 'border-neutral-900 scale-110 shadow-md'
                    : 'border-transparent hover:border-neutral-400'
                }`}
                style={{ backgroundColor: hex, boxShadow: selectedColors.includes(name) ? undefined : 'inset 0 0 0 1px rgba(0,0,0,0.12)' }}
              />
            ))}
          </div>
          {selectedColors.length > 0 && (
            <p className="text-xs text-neutral-500 mt-1.5">{selectedColors.join(', ')}</p>
          )}
        </FilterSection>
      )}

      {/* Material */}
      <FilterSection title="Material" defaultOpen={false}>
        <div className="space-y-2">
          {MATERIALS.map((mat) => {
            const count = allProducts.filter((p) => p.material === mat).length;
            if (count === 0) return null;
            return (
              <label key={mat} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(mat)}
                  onChange={() => toggleMaterial(mat)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0 h-3.5 w-3.5"
                />
                <span className={`text-xs flex-1 leading-snug ${selectedMaterials.includes(mat) ? 'font-semibold text-neutral-900' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                  {mat}
                </span>
                <span className="text-xs text-neutral-400">({count})</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Tags / Badges */}
      <FilterSection title="Shop By">
        <div className="space-y-2">
          {[
            { label: 'New In', value: showNewOnly, set: setShowNewOnly },
            { label: 'Bestsellers', value: showBestsellersOnly, set: setShowBestsellersOnly },
            { label: 'On Sale', value: showSaleOnly, set: setShowSaleOnly },
          ].map(({ label, value, set }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => set(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-0 h-3.5 w-3.5"
              />
              <span className={`text-sm ${value ? 'font-semibold text-neutral-900' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">

      {/* ── Campaign Banner ─────────────────────────────────────────────────── */}
      <div className="relative h-40 sm:h-52 bg-neutral-950 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=80"
          alt="KIJIJ Leather Collection"
          fill
          className="object-cover opacity-50"
          unoptimized
          priority
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <p className="text-neutral-400 text-xs uppercase tracking-[0.25em] mb-2 font-medium">
            Handcrafted in Ethiopia
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            The Collection
          </h1>
          <p className="text-neutral-300 text-sm mt-2">
            Full-grain Ethiopian leather, master-crafted for generations.
          </p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top bar ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between py-4 border-b border-neutral-100">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-neutral-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <span className="hidden lg:block text-xs text-neutral-500 uppercase tracking-wider">
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </span>

          {/* Active filter chips — desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            {selectedCategories.map((c) => (
              <button
                key={c}
                onClick={() => toggleCategory(c)}
                className="flex items-center gap-1 text-xs border border-neutral-300 px-2.5 py-1 text-neutral-700 hover:border-neutral-900 transition-colors"
              >
                {c} <X className="h-2.5 w-2.5" />
              </button>
            ))}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-500 hidden sm:block">Sort:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="text-xs font-medium text-neutral-900 border-0 bg-transparent focus:outline-none focus:ring-0 cursor-pointer pr-4"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest First</option>
              <option value="bestseller">Bestseller</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ── Layout: Sidebar + Grid ─────────────────────────────────────────── */}
        <div className="flex gap-8 pt-6 pb-16">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-[10px] text-neutral-500 underline hover:text-neutral-900">
                    Clear ({activeFilterCount})
                  </button>
                )}
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-neutral-400 text-sm mb-4">No products match your current filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-neutral-900 border border-neutral-900 px-4 py-2 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="w-72 bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h2 className="font-semibold text-neutral-900 text-sm uppercase tracking-wider">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5 text-neutral-500" />
              </button>
            </div>
            <div className="px-5 flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
            <div className="px-5 py-4 border-t border-neutral-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-neutral-900 text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                View {products.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

