'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { RefreshCw, ArrowRightLeft, TrendingUp } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar',        flag: '🇺🇸' },
  { code: 'ETB', name: 'Ethiopian Birr',   flag: '🇪🇹' },
  { code: 'EUR', name: 'Euro',             flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound',    flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen',     flag: '🇯🇵' },
  { code: 'AED', name: 'UAE Dirham',       flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal',      flag: '🇸🇦' },
  { code: 'CNY', name: 'Chinese Yuan',     flag: '🇨🇳' },
  { code: 'CAD', name: 'Canadian Dollar',  flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc',      flag: '🇨🇭' },
];

export default function CurrencyClient() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('ETB');

  const fetchRates = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/rates');
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      setError('Could not fetch live rates. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  const convertedAmount = (): string => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return '—';
    const inUSD = parseFloat(amount || '0') / rates[fromCurrency];
    const result = inUSD * rates[toCurrency];
    return result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getCurrencyInfo = (code: string) =>
    CURRENCIES.find(c => c.code === code) ?? { code, name: code, flag: '🌍' };

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* ── 1. Page Header (Fluid Responsive) ───────────────────────────────── */}
      <section className="pt-28 pb-14 sm:pt-32 sm:pb-20 bg-neutral-950 text-white relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=85"
            alt="International maritime shipping and global currency trade"
            fill
            className="object-cover opacity-15 filter brightness-75"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-primary-500/30 bg-primary-950/60 rounded-xs">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-primary-300 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium">
                Live Trade Corridor Rates
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-white leading-tight tracking-tight">
              Trade Currency Exchange
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed">
              Foreign exchange rates for key agricultural and artisan trade corridors. Synchronized for export contracts and international settlement.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Currency Converter (Mobile-First Stacked Layout) ──────────────── */}
      <section className="py-10 sm:py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-3 sm:px-6">
          <div className="bg-white rounded-xs border border-neutral-200 shadow-lift p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">

            {/* Title & Update Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-5 border-b border-neutral-150 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xs border border-primary-500/30 bg-primary-50 flex items-center justify-center text-primary-700 flex-shrink-0">
                  <TrendingUp size={16} />
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-normal text-neutral-950">
                  Trade Rate Calculator
                </h2>
              </div>

              {lastUpdated && (
                <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-neutral-400 pl-10 sm:pl-0">
                  <span>Updated: {lastUpdated}</span>
                  <button
                    onClick={fetchRates}
                    disabled={loading}
                    className="p-1 text-primary-700 hover:text-primary-800 transition-colors"
                    aria-label="Refresh rates"
                  >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  </button>
                </div>
              )}
            </div>

            {/* Converter Form Fields */}
            <div className="space-y-4">
              {/* "From" Row */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Amount & Origin Currency
                </label>
                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    min="0"
                    placeholder="0.00"
                    className="flex-1 min-w-0 border border-neutral-300 rounded-xs px-3 sm:px-4 py-2.5 sm:py-3.5 text-base sm:text-lg font-medium text-neutral-950 focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700 bg-white"
                  />
                  <select
                    value={fromCurrency}
                    onChange={e => setFromCurrency(e.target.value)}
                    className="w-28 sm:w-36 border border-neutral-300 rounded-xs px-2.5 sm:px-3 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-neutral-900 bg-neutral-50 focus:outline-none focus:border-primary-700 flex-shrink-0 cursor-pointer"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center py-1">
                <button
                  onClick={swapCurrencies}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-neutral-200 hover:border-neutral-400 bg-neutral-50 text-neutral-700 hover:text-neutral-950 rounded-xs text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors"
                  aria-label="Swap currencies"
                >
                  <ArrowRightLeft size={13} />
                  <span>Swap</span>
                </button>
              </div>

              {/* "To" Result Row */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Converted Result
                </label>
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0 border border-neutral-200 bg-neutral-50 rounded-xs px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center overflow-hidden">
                    {loading ? (
                      <span className="text-neutral-400 text-xs sm:text-sm">Calculating...</span>
                    ) : (
                      <span className="text-lg sm:text-xl lg:text-2xl font-serif font-normal text-neutral-950 break-all truncate">
                        {convertedAmount()}
                      </span>
                    )}
                  </div>
                  <select
                    value={toCurrency}
                    onChange={e => setToCurrency(e.target.value)}
                    className="w-28 sm:w-36 border border-neutral-300 rounded-xs px-2.5 sm:px-3 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-neutral-900 bg-neutral-50 focus:outline-none focus:border-primary-700 flex-shrink-0 cursor-pointer"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Rate Summary Strip (Responsive wrapping) */}
            {!loading && rates[fromCurrency] && rates[toCurrency] && (
              <div className="pt-3 sm:pt-4 border-t border-neutral-150 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-neutral-500">
                <span className="truncate">
                  1 {getCurrencyInfo(fromCurrency).flag} {fromCurrency} ={' '}
                  <strong className="text-neutral-900 font-semibold">
                    {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
                  </strong>
                </span>
                <span className="text-neutral-400 text-[11px]">Interbank benchmark</span>
              </div>
            )}

            {error && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-xs">
                ⚠️ {error}
              </p>
            )}

          </div>
        </div>
      </section>

      {/* ── 3. Foreign Exchange Rates Table (Mobile Optimized) ───────────────── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-neutral-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-neutral-950">
                Key Trade Currencies vs. USD
              </h2>
              <p className="text-neutral-500 text-xs mt-0.5">Indicative market rates for commodity and trade settlements</p>
            </div>

            <button
              onClick={fetchRates}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-primary-700 hover:text-primary-800 disabled:opacity-50 transition-colors self-start sm:self-auto"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Rates</span>
            </button>
          </div>

          {/* Table with responsive horizontal scroll and compact padding */}
          <div className="border border-neutral-200 rounded-xs overflow-x-auto bg-white">
            <table className="w-full text-left min-w-[340px] sm:min-w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-neutral-500">
                <tr>
                  <th className="px-3 sm:px-6 py-3">Currency</th>
                  <th className="px-3 sm:px-6 py-3">Code</th>
                  <th className="px-3 sm:px-6 py-3 text-right">1 USD =</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
                {CURRENCIES.filter(c => c.code !== 'USD').map(currency => (
                  <tr key={currency.code} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3.5">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-lg sm:text-xl flex-shrink-0">{currency.flag}</span>
                        <span className="font-medium text-neutral-900 truncate">{currency.name}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3.5">
                      <span className="text-[10px] sm:text-xs font-mono font-medium text-neutral-600 bg-neutral-100 px-1.5 sm:px-2 py-0.5 rounded-xs">
                        {currency.code}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3.5 text-right">
                      {loading ? (
                        <span className="inline-block w-16 sm:w-20 h-4 bg-neutral-100 rounded-xs animate-pulse" />
                      ) : rates[currency.code] ? (
                        <span className="font-medium text-neutral-900 font-mono text-xs sm:text-base">
                          {rates[currency.code].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                          <span className="text-neutral-400 text-[10px] sm:text-xs ml-1 font-normal">{currency.code}</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-neutral-400 mt-6 font-light">
            Rates sourced via global exchange rate feeds. For informational and commercial planning purposes only.
          </p>
        </div>
      </section>

    </main>
  );
}
