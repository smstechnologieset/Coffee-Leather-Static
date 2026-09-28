'use client';

import Image from 'next/image';
import { ArrowRight, Coffee, Package, Check } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { useLanguage } from '@/context/LanguageContext';

export default function BusinessesClient() {
  const { t, isAmharic } = useLanguage();

  const coffeeHighlights = isAmharic
    ? [
        '6 የኢትዮጵያ የቡና መነሻዎች (ይርጋጨፌ፣ ሲዳማ፣ ጉጂ፣ ሐረር፣ ሊሙ፣ ጅማ)',
        '3 የማዘጋጀት ዘዴዎች፡ የታጠበ (Washed)፣ ተፈጥሯዊ (Natural)፣ ማር (Honey)',
        'ደረጃ 1–4 ሙሉ በሙሉ የመነሻ ታሪካቸው የታወቀ',
        'ናሙናዎች፣ 60 ኪ.ግ ከረጢቶች፣ 1 ቶን እና ሙሉ ኮንቴይነሮች',
        'ቀጥታ የኤክስፖርት መላኪያ በ FOB / CIF የንግድ ውሎች',
      ]
    : [
        '6 Ethiopian coffee origins (Yirgacheffe, Sidamo, Guji, Harar, Limu, Jimma)',
        '3 process methods: Washed, Natural, Honey',
        'Grades 1–4 available with full lot traceability',
        'Samples, 60kg bags, 1-ton lots, and full containers',
        'Direct export shipping under FOB / CIF trade terms',
      ];

  const leatherHighlights = isAmharic
    ? [
        'ምርጥ የኢትዮጵያ የደጋ ቆዳ',
        'በእጅ የተሰሩ የጉዞ እቃዎች እና መገልገያዎች',
        'በእጅ የተሰፉ ቦርሳዎች፣ የቢሮ ሻንጣዎች እና አልባሳት',
        'በጥንቃቄ የተሰበሰቡ የምስራቅ አፍሪካ ቆዳዎች',
        'ቀጥታ ለዓለም አቀፍ ደንበኞች ማድረስ እና ኤክስፖርት',
      ]
    : [
        'Premium Ethiopian highland leather',
        'Artisan-crafted travel goods and accessories',
        'Handcrafted bags, executive briefcases, garments',
        'Responsibly sourced East African hides',
        'Direct worldwide customer delivery and export',
      ];

  const fulfillmentSteps = [
    {
      num: '01',
      title: t('businesses.step1.title'),
      desc: t('businesses.step1.desc'),
    },
    {
      num: '02',
      title: t('businesses.step2.title'),
      desc: t('businesses.step2.desc'),
    },
    {
      num: '03',
      title: t('businesses.step3.title'),
      desc: t('businesses.step3.desc'),
    },
    {
      num: '04',
      title: t('businesses.step4.title'),
      desc: t('businesses.step4.desc'),
    },
  ];

  return (
    <main className="flex flex-col bg-white">
      {/* ── 1. Page Header ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-neutral-950 text-white relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=85"
            alt="Export vessel shipping products to international buyers"
            fill
            className="object-cover opacity-15 filter brightness-75"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary-500/30 bg-primary-950/60 rounded-xs">
              <span className="text-primary-300 text-xs uppercase tracking-[0.2em] font-medium">
                {t('businesses.hero.eyebrow')}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-serif font-normal text-white leading-tight tracking-tight">
              {t('businesses.hero.title')}
            </h1>

            <p className="text-neutral-300 text-lg sm:text-xl font-light leading-relaxed">
              {t('businesses.hero.sub')}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Coffee Trading Showcase ───────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Content — 6 cols */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-primary-700">
                <Coffee size={22} />
                <span className="text-xs uppercase tracking-[0.22em] font-semibold">
                  {t('businesses.coffee.div')}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
                  {t('businesses.coffee.name')}
                </h2>
                <p className="text-primary-700 text-sm font-medium">
                  {t('businesses.coffee.tagline')}
                </p>
              </div>

              <p className="text-neutral-600 text-base leading-relaxed font-light">
                {t('businesses.coffee.desc')}
              </p>

              <div className="pt-2 border-t border-neutral-150">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                  {isAmharic ? 'ዋና ዋና ነጥቦች' : 'Key Highlights'}
                </p>
                <ul className="space-y-2.5">
                  {coffeeHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-700 font-light">
                      <Check size={16} className="text-primary-700 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <a
                  href={SITE_CONFIG.urls.coffeeSite}
                  id="businesses-coffee-cta"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold tracking-wide rounded-xs transition-colors"
                >
                  <span>{t('businesses.coffee.cta')}</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Right Large Image — 6 cols (AUTHENTIC COFFEE IMAGE, NO LAPTOP) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-neutral-200 shadow-lift">
                <Image
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1100&q=80"
                  alt="Specialty grade roasted and raw green Ethiopian arabica coffee"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Leather Goods Showcase ────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Large Image — 6 cols */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-neutral-200 shadow-lift">
                <Image
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1100&q=80"
                  alt="Handcrafted Ethiopian leather duffel bag and accessories"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Right Content — 6 cols */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="flex items-center gap-2 text-primary-700">
                <Package size={22} />
                <span className="text-xs uppercase tracking-[0.22em] font-semibold">
                  {t('businesses.leather.div')}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
                  {t('businesses.leather.name')}
                </h2>
                <p className="text-primary-700 text-sm font-medium">
                  {t('businesses.leather.tagline')}
                </p>
              </div>

              <p className="text-neutral-600 text-base leading-relaxed font-light">
                {t('businesses.leather.desc')}
              </p>

              <div className="pt-2 border-t border-neutral-200">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                  {isAmharic ? 'ዋና ዋና ነጥቦች' : 'Key Highlights'}
                </p>
                <ul className="space-y-2.5">
                  {leatherHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-700 font-light">
                      <Check size={16} className="text-primary-700 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <a
                  href={SITE_CONFIG.urls.leatherSite}
                  id="businesses-leather-cta"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold tracking-wide rounded-xs transition-colors"
                >
                  <span>{t('businesses.leather.cta')}</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Direct Export Fulfillment Sequence ───────────────────────────── */}
      <section className="py-24 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-3">
            <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
              {t('businesses.fulfillment.eyebrow')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
              {t('businesses.fulfillment.title')}
            </h2>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {t('businesses.fulfillment.sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fulfillmentSteps.map((step) => (
              <div key={step.num} className="border-t-2 border-primary-700/60 pt-6 space-y-3">
                <span className="text-primary-700 text-xs font-mono font-bold tracking-widest">{step.num}</span>
                <h3 className="text-lg font-serif font-normal text-neutral-950">{step.title}</h3>
                <p className="text-neutral-600 text-xs leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
