'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';

const PriceChart = dynamic(() => import('@/components/coffees/PriceChart'), { ssr: false });

/* ── Static product data (replace with Supabase fetch in production) ── */
const ALL_COFFEES = [
  {
    id: '1', name: 'Yirgacheffe Grade 1 Washed', category: 'Washed', region: 'Yirgacheffe',
    process: 'Washed', grade: 'Grade 1', availability: 'In Stock', minOrder: '1 MT',
    currentPrice: 4200, previousPrice: 3950, unit: '/MT',
    owner: 'Kochere Farmers Cooperative',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    profile: 'Jasmine, bergamot, lemon zest, clean finish',
    altitude: '1,800–2,200 masl', harvest: 'Oct–Dec',
    priceHistory: [
      { date: 'May', price: 3700 }, { date: 'Jun', price: 3800 }, { date: 'Jul', price: 3750 },
      { date: 'Aug', price: 3950 }, { date: 'Sep', price: 4200 },
    ],
  },
  {
    id: '2', name: 'Sidamo Natural G1', category: 'Natural', region: 'Sidamo',
    process: 'Natural', grade: 'Grade 1', availability: 'In Stock', minOrder: '1 MT',
    currentPrice: 3800, previousPrice: 3600, unit: '/MT',
    owner: 'Daye Bensa Cooperative',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    profile: 'Blueberry, red wine, dark chocolate',
    altitude: '1,700–2,000 masl', harvest: 'Nov–Jan',
    priceHistory: [
      { date: 'May', price: 3400 }, { date: 'Jun', price: 3500 }, { date: 'Jul', price: 3600 },
      { date: 'Aug', price: 3600 }, { date: 'Sep', price: 3800 },
    ],
  },
  {
    id: '3', name: 'Harar Longberry Natural', category: 'Natural', region: 'Harar',
    process: 'Natural', grade: 'Grade 1', availability: 'In Stock', minOrder: '500 KG',
    currentPrice: 4600, previousPrice: 4400, unit: '/MT',
    owner: 'Harar Coffee Farmers Union',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    profile: 'Mocha, dark fruit, cardamom spice',
    altitude: '1,500–2,100 masl', harvest: 'Oct–Jan',
    priceHistory: [
      { date: 'May', price: 4100 }, { date: 'Jun', price: 4200 }, { date: 'Jul', price: 4300 },
      { date: 'Aug', price: 4400 }, { date: 'Sep', price: 4600 },
    ],
  },
  {
    id: '4', name: 'Limu Washed G2', category: 'Washed', region: 'Limu',
    process: 'Washed', grade: 'Grade 2', availability: 'Limited', minOrder: '1 MT',
    currentPrice: 3400, previousPrice: 3500, unit: '/MT',
    owner: 'Limu Producers Cooperative',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
    profile: 'Brown sugar, orange peel, medium body',
    altitude: '1,400–1,800 masl', harvest: 'Nov–Feb',
    priceHistory: [
      { date: 'May', price: 3600 }, { date: 'Jun', price: 3600 }, { date: 'Jul', price: 3500 },
      { date: 'Aug', price: 3500 }, { date: 'Sep', price: 3400 },
    ],
  },
  {
    id: '5', name: 'Guji Zone Natural G1', category: 'Natural', region: 'Guji',
    process: 'Natural', grade: 'Grade 1', availability: 'In Stock', minOrder: '1 MT',
    currentPrice: 4900, previousPrice: 4600, unit: '/MT',
    owner: 'Shakiso Farmers Cooperative',
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=80',
    profile: 'Mango, pineapple, tropical punch',
    altitude: '1,900–2,300 masl', harvest: 'Oct–Dec',
    priceHistory: [
      { date: 'May', price: 4200 }, { date: 'Jun', price: 4400 }, { date: 'Jul', price: 4500 },
      { date: 'Aug', price: 4600 }, { date: 'Sep', price: 4900 },
    ],
  },
  {
    id: '6', name: 'Jimma Honey Process', category: 'Honey', region: 'Jimma',
    process: 'Honey', grade: 'Grade 2', availability: 'In Stock', minOrder: '500 KG',
    currentPrice: 4100, previousPrice: 3900, unit: '/MT',
    owner: 'Gera Agro Forestry',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    profile: 'Honey, stone fruit, creamy mouthfeel',
    altitude: '1,500–1,900 masl', harvest: 'Nov–Jan',
    priceHistory: [
      { date: 'May', price: 3700 }, { date: 'Jun', price: 3800 }, { date: 'Jul', price: 3900 },
      { date: 'Aug', price: 3900 }, { date: 'Sep', price: 4100 },
    ],
  },
];

const FILTER_OPTIONS = {
  Region: ['Yirgacheffe', 'Sidamo', 'Harar', 'Limu', 'Guji', 'Jimma'],
  Process: ['Washed', 'Natural', 'Honey'],
  Grade: ['Grade 1', 'Grade 2'],
  Availability: ['In Stock', 'Limited'],
  Price: ['High to Low', 'Low to High'],
};

type Coffee = typeof ALL_COFFEES[0];

export default function CoffeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [priceSort, setPriceSort] = useState('');
  const [itemsToShow, setItemsToShow] = useState(6);
  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null);

  const filteredCoffees = ALL_COFFEES.filter((c) => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.region.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilters.Region?.length && !activeFilters.Region.includes(c.region)) return false;
    if (activeFilters.Process?.length && !activeFilters.Process.includes(c.process)) return false;
    if (activeFilters.Grade?.length && !activeFilters.Grade.includes(c.grade)) return false;
    if (activeFilters.Availability?.length && !activeFilters.Availability.includes(c.availability)) return false;
    return true;
  }).sort((a, b) => {
    if (priceSort === 'High to Low') return b.currentPrice - a.currentPrice;
    if (priceSort === 'Low to High') return a.currentPrice - b.currentPrice;
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
      if (!next.length) { const { [group]: _, ...rest } = prev; return rest; }
      return { ...prev, [group]: next };
    });
    setItemsToShow(6);
  };

  const clearAll = () => { setActiveFilters({}); setPriceSort(''); setSearchQuery(''); setItemsToShow(6); };

  const hasFilters = Object.keys(activeFilters).length > 0 || priceSort || searchQuery;

  const priceChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return (((current - previous) / previous) * 100);
  };

  return (
    <main className="pt-20 pb-16 bg-neutral-50 min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Our Coffee Catalog</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Browse and filter our selection of premium Ethiopian specialty coffees. 
            Click any product to view detailed specs and price trends.
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
                  <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search coffees..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setItemsToShow(6); }}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="h-3.5 w-3.5 text-neutral-400" />
                  </button>
                )}
              </div>

              {/* Filter groups */}
              {Object.entries(FILTER_OPTIONS).map(([group, options]) => (
                <div key={group} className="mb-5">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">{group}</h3>
                  <div className="space-y-1.5">
                    {options.map((option) => {
                      const isActive = group === 'Price' ? priceSort === option : activeFilters[group]?.includes(option);
                      const isRadio = group === 'Price';
                      return (
                        <label key={option} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type={isRadio ? 'radio' : 'checkbox'}
                            name={isRadio ? 'price-sort' : undefined}
                            checked={!!isActive}
                            onChange={() => toggleFilter(group, option)}
                            className="accent-primary-600 h-4 w-4 rounded"
                          />
                          <span className={`text-sm transition-colors ${isActive ? 'text-primary-700 font-semibold' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                            {option}
                          </span>
                        </label>
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
                Showing <span className="font-semibold text-neutral-900">{displayedCoffees.length}</span> of{' '}
                <span className="font-semibold text-neutral-900">{filteredCoffees.length}</span> products
              </p>
            </div>

            {filteredCoffees.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl font-serif text-neutral-400 mb-3">No coffees found</p>
                <p className="text-neutral-500 mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearAll} className="bg-primary-700 text-white px-6 py-2 rounded-full font-medium">Reset Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedCoffees.map((coffee) => {
                    const pct = priceChange(coffee.currentPrice, coffee.previousPrice);
                    const rising = pct > 0;
                    const flat = pct === 0;
                    return (
                      <div
                        key={coffee.id}
                        onClick={() => setSelectedCoffee(coffee)}
                        className="bg-white rounded-2xl shadow-brand hover:shadow-brand-lg border border-neutral-100 overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={coffee.image}
                            alt={coffee.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                          <div className="absolute top-3 left-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              coffee.availability === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>{coffee.availability}</span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 text-neutral-700 text-xs font-bold px-2 py-1 rounded-full">{coffee.process}</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">{coffee.region}</p>
                          <h3 className="font-serif font-bold text-neutral-900 mt-1 group-hover:text-primary-700 transition-colors leading-snug">{coffee.name}</h3>
                          <p className="text-xs text-neutral-400 mt-1">{coffee.profile}</p>

                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <p className="text-xl font-bold text-primary-700">${coffee.currentPrice.toLocaleString()}<span className="text-sm font-normal text-neutral-400">{coffee.unit}</span></p>
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                              flat ? 'bg-neutral-100 text-neutral-500' : rising ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                            }`}>
                              {flat ? <Minus className="h-3 w-3" /> : rising ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {Math.abs(pct).toFixed(1)}%
                            </div>
                          </div>

                          <p className="text-xs text-neutral-400 mt-1">Min. Order: {coffee.minOrder}</p>

                          <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
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
            <div className="relative h-56 rounded-t-2xl overflow-hidden">
              <Image src={selectedCoffee.image} alt={selectedCoffee.name} fill className="object-cover" sizes="672px" />
              <button
                onClick={() => setSelectedCoffee(null)}
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full mr-2 ${
                  selectedCoffee.availability === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>{selectedCoffee.availability}</span>
                <span className="bg-white/90 text-neutral-700 text-xs font-bold px-2 py-1 rounded-full">{selectedCoffee.process}</span>
              </div>
            </div>

            <div className="p-6">
              <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">{selectedCoffee.region}</p>
              <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-1">{selectedCoffee.name}</h2>
              <p className="text-neutral-500 text-sm mt-1 italic">{selectedCoffee.profile}</p>

              {/* Price */}
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <p className="text-3xl font-bold text-primary-700">
                    ${selectedCoffee.currentPrice.toLocaleString()}
                    <span className="text-base font-normal text-neutral-400">{selectedCoffee.unit}</span>
                  </p>
                  <p className="text-xs text-neutral-400">Prev: ${selectedCoffee.previousPrice.toLocaleString()}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full ${
                  priceChange(selectedCoffee.currentPrice, selectedCoffee.previousPrice) >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {priceChange(selectedCoffee.currentPrice, selectedCoffee.previousPrice) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(priceChange(selectedCoffee.currentPrice, selectedCoffee.previousPrice)).toFixed(1)}% vs prev
                </div>
              </div>

              {/* Spec table */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                {[
                  ['Supplier', selectedCoffee.owner],
                  ['Grade', selectedCoffee.grade],
                  ['Process', selectedCoffee.process],
                  ['Altitude', selectedCoffee.altitude],
                  ['Harvest', selectedCoffee.harvest],
                  ['Min. Order', selectedCoffee.minOrder],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-sm text-neutral-500">{label}</span>
                    <span className="text-sm font-semibold text-neutral-800">{value}</span>
                  </div>
                ))}
              </div>

              {/* Price chart */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-neutral-700 mb-3">Price Trend ($/MT)</h3>
                <div className="h-40">
                  <PriceChart data={selectedCoffee.priceHistory} />
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
