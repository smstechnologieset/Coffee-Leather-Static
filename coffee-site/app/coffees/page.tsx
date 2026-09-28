'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  CoffeeProduct,
  INITIAL_COFFEES,
  getStoredProducts,
} from '@/lib/products-data';

const PriceChart = dynamic(() => import('@/components/coffees/PriceChart'), { ssr: false });

const INITIAL_COFFEES_LIST = Object.values(INITIAL_COFFEES);

const BASE_REGIONS = ['Yirgacheffe', 'Sidamo', 'Harar', 'Limu', 'Guji', 'Jimma'];
const BASE_PROCESSES = ['Washed', 'Natural', 'Honey'];
const BASE_GRADES = ['Grade 1', 'Grade 2', 'Grade 3'];

export default function CoffeesPage() {
  const [coffees, setCoffees] = useState<CoffeeProduct[]>(INITIAL_COFFEES_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [priceSort, setPriceSort] = useState('');
  const [itemsToShow, setItemsToShow] = useState(6);
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeProduct | null>(null);

  // Sync with persistent store and listen for admin additions/edits
  useEffect(() => {
    const syncProducts = () => {
      const stored = getStoredProducts();
      if (stored && stored.length > 0) {
        setCoffees(stored);
      }
    };

    syncProducts();

    window.addEventListener('kijij_products_updated', syncProducts);
    window.addEventListener('storage', syncProducts);
    return () => {
      window.removeEventListener('kijij_products_updated', syncProducts);
      window.removeEventListener('storage', syncProducts);
    };
  }, []);

  // Dynamically compute filters based on all existing and newly added products
  const dynamicRegions = Array.from(
    new Set([
      ...BASE_REGIONS,
      ...coffees.map((c) => c.region?.trim()).filter(Boolean as any),
    ])
  );

  const dynamicProcesses = Array.from(
    new Set([
      ...BASE_PROCESSES,
      ...coffees.map((c) => c.process?.trim()).filter(Boolean as any),
    ])
  );

  const dynamicGrades = Array.from(
    new Set([
      ...BASE_GRADES,
      ...coffees.map((c) => c.grade?.trim()).filter(Boolean as any),
    ])
  );

  const FILTER_OPTIONS: Record<string, string[]> = {
    Region: dynamicRegions,
    Process: dynamicProcesses,
    Grade: dynamicGrades,
    Availability: ['In Stock', 'Limited', 'Out of Stock'],
    Price: ['High to Low', 'Low to High'],
  };

  const filteredCoffees = coffees
    .filter((c) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesRegion = c.region?.toLowerCase().includes(q);
        const matchesProcess = c.process?.toLowerCase().includes(q);
        const matchesProfile = c.profile?.toLowerCase().includes(q);
        if (!matchesName && !matchesRegion && !matchesProcess && !matchesProfile) return false;
      }
      if (activeFilters.Region?.length && !activeFilters.Region.includes(c.region)) return false;
      if (activeFilters.Process?.length && !activeFilters.Process.includes(c.process)) return false;
      if (activeFilters.Grade?.length && !activeFilters.Grade.includes(c.grade)) return false;
      if (activeFilters.Availability?.length && !activeFilters.Availability.includes(c.availability))
        return false;
      return true;
    })
    .sort((a, b) => {
      const priceA = a.currentPrice || a.pricePerQuintal || 0;
      const priceB = b.currentPrice || b.pricePerQuintal || 0;
      if (priceSort === 'High to Low') return priceB - priceA;
      if (priceSort === 'Low to High') return priceA - priceB;
      return 0;
    });

  const displayedCoffees = filteredCoffees.slice(0, itemsToShow);

  const toggleFilter = (group: string, value: string) => {
    if (group === 'Price') {
      setPriceSort(priceSort === value ? '' : value);
      return;
    }
    setActiveFilters((prev) => {
      const cur = prev[group] || [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      if (!next.length) {
        const { [group]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [group]: next };
    });
    setItemsToShow(6);
  };

  const clearAll = () => {
    setActiveFilters({});
    setPriceSort('');
    setSearchQuery('');
    setItemsToShow(6);
  };

  const hasFilters = Object.keys(activeFilters).length > 0 || priceSort || searchQuery;

  const priceChange = (current: number, previous: number) => {
    if (!previous || previous === current) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <main className="pt-20 pb-16 bg-neutral-50 min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Our Coffee Catalog</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Browse and filter our selection of premium Ethiopian specialty coffees. Click any
            product to view detailed specs and price trends.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar Filters ── */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-neutral-900">Filters</h2>
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search coffees, regions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setItemsToShow(6);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-3.5 w-3.5 text-neutral-400" />
                  </button>
                )}
              </div>

              {/* Dynamic Filter groups */}
              {Object.entries(FILTER_OPTIONS).map(([group, options]) => (
                <div key={group} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      {group}
                    </h3>
                    {group === 'Region' && (
                      <span className="text-[10px] text-primary-600 font-semibold">
                        {options.length} regions
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {options.map((option) => {
                      const isActive =
                        group === 'Price'
                          ? priceSort === option
                          : activeFilters[group]?.includes(option);
                      const isRadio = group === 'Price';
                      return (
                        <button
                          key={option}
                          onClick={() => toggleFilter(group, option)}
                          className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                            isActive
                              ? 'bg-primary-50 text-primary-700 font-bold'
                              : 'text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{option}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                              isRadio ? 'rounded-full' : ''
                            } ${
                              isActive
                                ? 'bg-primary-600 border-primary-600 text-white'
                                : 'border-neutral-300'
                            }`}
                          >
                            {isActive && (
                              <span
                                className={`block ${
                                  isRadio ? 'w-1.5 h-1.5 bg-white rounded-full' : 'text-[9px]'
                                }`}
                              >
                                {!isRadio && '✓'}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-neutral-500">
                Showing{' '}
                <span className="font-semibold text-neutral-900">{displayedCoffees.length}</span> of{' '}
                <span className="font-semibold text-neutral-900">{filteredCoffees.length}</span>{' '}
                products
              </p>
            </div>

            {filteredCoffees.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100 p-8">
                <p className="text-2xl font-serif text-neutral-400 mb-3">No coffees match filters</p>
                <p className="text-neutral-500 mb-6 text-sm">
                  Try adjusting your search terms or clearing region filters.
                </p>
                <button
                  onClick={clearAll}
                  className="bg-primary-700 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-primary-800 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedCoffees.map((coffee) => {
                    const price = coffee.currentPrice || coffee.pricePerQuintal || 400;
                    const prevPrice = coffee.previousPrice || price;
                    const pct = priceChange(price, prevPrice);
                    const rising = pct > 0;
                    const flat = pct === 0;
                    const minOrderText =
                      coffee.minOrder ||
                      `${coffee.minOrderQuintals || 10} Quintals (${(
                        (coffee.minOrderQuintals || 10) * 100
                      ).toLocaleString()} kg)`;

                    return (
                      <div
                        key={coffee.id}
                        onClick={() => setSelectedCoffee(coffee)}
                        className="bg-white rounded-2xl shadow-brand hover:shadow-brand-lg border border-neutral-100 overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-48 overflow-hidden bg-neutral-100">
                            <Image
                              src={coffee.image}
                              alt={coffee.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            />
                            <div className="absolute top-3 left-3">
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded-full ${
                                  coffee.availability === 'In Stock'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {coffee.availability || 'In Stock'}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              {coffee.isTopProduct && (
                                <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                                  ★ Featured
                                </span>
                              )}
                              <span className="bg-white/90 backdrop-blur-xs text-neutral-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                                {coffee.process}
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <p className="text-xs text-primary-600 font-bold uppercase tracking-wide">
                              {coffee.region}
                            </p>
                            <h3 className="font-serif font-bold text-neutral-900 mt-1 group-hover:text-primary-700 transition-colors leading-snug">
                              {coffee.name}
                            </h3>
                            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                              {coffee.profile}
                            </p>

                            <div className="flex items-center justify-between mt-3">
                              <div>
                                <p className="text-xl font-bold text-primary-700">
                                  ${price.toLocaleString()}
                                  <span className="text-sm font-normal text-neutral-400">
                                    {coffee.unit || '/Quintal'}
                                  </span>
                                </p>
                                <p className="text-[11px] text-neutral-500 font-medium">
                                  (${(price / 100).toFixed(2)}/kg)
                                </p>
                              </div>
                              <div
                                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                                  flat
                                    ? 'bg-neutral-100 text-neutral-500'
                                    : rising
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-red-50 text-red-500'
                                }`}
                              >
                                {flat ? (
                                  <Minus className="h-3 w-3" />
                                ) : rising ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {Math.abs(pct).toFixed(1)}%
                              </div>
                            </div>

                            <p className="text-xs text-neutral-400 mt-1">
                              Min. Order: {minOrderText}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 pt-0">
                          <div
                            className="flex gap-2 pt-2 border-t border-neutral-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`/coffees/${coffee.id}/request-sample`}
                              className="flex-1 text-center text-xs border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white py-2 rounded-full font-bold transition-all duration-200"
                            >
                              Request Sample
                            </Link>
                            <Link
                              href={`/coffees/${coffee.id}/request-contract`}
                              className="flex-1 text-center text-xs border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white py-2 rounded-full font-bold transition-all duration-200"
                            >
                              Request Contract
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load more */}
                {filteredCoffees.length > itemsToShow && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setItemsToShow((prev) => prev + 6)}
                      className="bg-primary-700 text-white hover:bg-primary-800 px-8 py-3 rounded-full font-bold transition-all duration-200"
                    >
                      Load More ({filteredCoffees.length - itemsToShow} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Product Detail Popup ── */}
      {selectedCoffee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedCoffee(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image */}
            <div className="relative h-56 rounded-t-2xl overflow-hidden bg-neutral-900">
              <Image
                src={selectedCoffee.image}
                alt={selectedCoffee.name}
                fill
                unoptimized
                className="object-cover"
                sizes="672px"
              />
              <button
                onClick={() => setSelectedCoffee(null)}
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full mr-2 ${
                    selectedCoffee.availability === 'In Stock'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {selectedCoffee.availability || 'In Stock'}
                </span>
                <span className="bg-white/90 text-neutral-700 text-xs font-bold px-2 py-1 rounded-full">
                  {selectedCoffee.process}
                </span>
              </div>
            </div>

            <div className="p-6">
              <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">
                {selectedCoffee.region}
              </p>
              <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                {selectedCoffee.name}
              </h2>
              <p className="text-neutral-500 text-sm mt-1 italic">{selectedCoffee.profile}</p>

              {/* Price */}
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <p className="text-3xl font-bold text-primary-700">
                    ${(selectedCoffee.currentPrice || selectedCoffee.pricePerQuintal || 400).toLocaleString()}
                    <span className="text-base font-normal text-neutral-400">
                      {selectedCoffee.unit || '/Quintal'}
                    </span>
                  </p>
                  <p className="text-xs text-neutral-500 font-medium">
                    ${((selectedCoffee.currentPrice || selectedCoffee.pricePerQuintal || 400) / 100).toFixed(2)} per kg
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full ${
                    priceChange(
                      selectedCoffee.currentPrice || selectedCoffee.pricePerQuintal || 400,
                      selectedCoffee.previousPrice || selectedCoffee.pricePerQuintal || 400
                    ) >= 0
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-500'
                  }`}
                >
                  {priceChange(
                    selectedCoffee.currentPrice || selectedCoffee.pricePerQuintal || 400,
                    selectedCoffee.previousPrice || selectedCoffee.pricePerQuintal || 400
                  ) >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(
                    priceChange(
                      selectedCoffee.currentPrice || selectedCoffee.pricePerQuintal || 400,
                      selectedCoffee.previousPrice || selectedCoffee.pricePerQuintal || 400
                    )
                  ).toFixed(1)}
                  %
                </div>
              </div>

              {/* Spec table */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                {[
                  ['Supplier', selectedCoffee.owner || 'Highland Cooperative Union'],
                  ['Grade', selectedCoffee.grade],
                  ['Process', selectedCoffee.process],
                  ['Altitude', selectedCoffee.altitude || '1,800–2,200 masl'],
                  ['Harvest', selectedCoffee.harvest || 'Oct–Jan'],
                  [
                    'Min. Order',
                    selectedCoffee.minOrder ||
                      `${selectedCoffee.minOrderQuintals || 10} Quintals (${(
                        (selectedCoffee.minOrderQuintals || 10) * 100
                      ).toLocaleString()} kg)`,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-sm text-neutral-500">{label}</span>
                    <span className="text-sm font-semibold text-neutral-800">{value}</span>
                  </div>
                ))}
              </div>

              {/* Sample tiers preview */}
              {selectedCoffee.sampleTiers && selectedCoffee.sampleTiers.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                    Available Sample Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCoffee.sampleTiers.map((tier) => (
                      <span
                        key={tier.id || tier.size}
                        className="text-xs px-2.5 py-1 rounded-lg border border-neutral-200 bg-neutral-50 font-medium"
                      >
                        <strong>{tier.size}</strong>: {tier.isFree || tier.price === 0 ? 'Free' : `$${tier.price}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price chart */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-neutral-700 mb-3">Price Trend ($/Quintal)</h3>
                <div className="h-40">
                  <PriceChart
                    data={
                      selectedCoffee.priceHistory || [
                        { date: 'May', price: 380 },
                        { date: 'Jun', price: 390 },
                        { date: 'Jul', price: 400 },
                        { date: 'Aug', price: 410 },
                        { date: 'Sep', price: selectedCoffee.pricePerQuintal || 420 },
                      ]
                    }
                  />
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 mt-6">
                <Link
                  href={`/coffees/${selectedCoffee.id}/request-sample`}
                  className="flex-1 text-center border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white py-3 rounded-full font-bold transition-all duration-200"
                >
                  Request Sample
                </Link>
                <Link
                  href={`/coffees/${selectedCoffee.id}/request-contract`}
                  className="flex-1 text-center bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-full font-bold transition-all duration-200"
                >
                  Request Contract
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
