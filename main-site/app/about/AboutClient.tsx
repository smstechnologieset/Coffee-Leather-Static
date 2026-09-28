'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutClient() {
  const { t, isAmharic } = useLanguage();

  const aboutParagraphs = isAmharic
    ? [
        'ኪጂጅ ኢንተርናሽናል ኤልኤልሲ መቀመጫውን በአሜሪካ ያደረገ እና የስራ መነሻውን በኢትዮጵያ ያደረገ ኩባንያ ሲሆን፣ አሰራሩም በአንድ ጽኑ እምነት ላይ የተገነባ ነው፡ ዓለም እውነተኛ ጥራት ያላቸው ምርቶች ይፈልጋል። እውነተኛ፣ ከፍተኛ ጥራት ያላቸው የአፍሪካ ምርቶች ራሳቸውን መግለጽ እና በአቅርቦት ሰንሰለቱ ውስጥ ዘላቂ እሴት መፍጠር ይችላሉ።',
        'ዋናው የንግድ ዘርፋችን የኢትዮጵያ ልዩ ቡና ነው — በዓለም አቀፍ ደረጃ እውቅና ካላቸው ይርጋጨፌ፣ ሲዳማ እና ጉጂ የመሳሰሉ አካባቢዎች በቀጥታ የሚሰበሰብ። ከቡና አርሶ አደሮች ህብረት ስራ ማህበራት ጋር ተባብረን በመስራት አስተማማኝ የግዢ ውሎችን፣ የግብርና ድጋፍን እና ተገቢ የዋጋ ተመን ዋስትናን እናረጋግጣለን።',
        'በተጨማሪም የኢትዮጵያን ሰፊ የእንስሳት ሀብት እና የዘመናት የእጅ ጥበብ ቅርስ በመጠቀም ጥራት ያላቸውን የቆዳ ውጤቶች ለዓለም አቀፍ ገበያ የምናቀርብበት የቆዳ ዘርፍ አለን።',
        'በሳሉዳ፣ ደቡብ ካሮላይና ባለው ዋና መሥሪያ ቤታችን እና በአዲስ አበባ ባለው የስራ ማዕከላችን አማካኝነት ኪጂጅ ኢንተርናሽናል ሁለቱን አህጉራት በማስተሳሰር የአፍሪካን ምርጥነት በቀጥታ ለአለም አቀፍ ገዢዎች ያደርሳል።',
      ]
    : [
        "KIJIJ International LLC is a USA-registered company with operational roots in Ethiopia. We were founded on a simple but powerful belief: the world doesn't just need more opportunities — it needs more products. Real, high-quality African goods that speak for themselves and create lasting value across the supply chain.",
        "Our flagship business is Ethiopian specialty coffee — sourced from the world's most celebrated growing regions including Yirgacheffe, Sidamo, and Guji. We work with smallholder farmers organized into certified producer groups, providing advance purchase agreements, agronomic support, and fair floor prices regardless of commodity market fluctuations.",
        "We also operate a premium leather goods division, drawing on Ethiopia's exceptional livestock sector and deep craft heritage to bring export-quality leather products to the international market.",
        "With headquarters in Saluda, South Carolina and operations based in Addis Ababa, Ethiopia, KIJIJ International bridges two continents and a world of opportunity — delivering African excellence directly to global buyers.",
      ];

  const foundingStoryBody = isAmharic
    ? 'ኪጂጅ ኢንተርናሽናል የተመሰረተው የአፍሪካ ታላላቅ ኤክስፖርቶች ረቂቅ ሀሳቦች ወይም ባዶ አቅሞች ሳይሆኑ እውነተኛና ተጨባጭ ምርቶች ናቸው በሚል ጽኑ እምነት ነው። ለአሜሪካ የቡና ቆዪዎች የተላከው 1 ቶን የታጠበ ይርጋጨፌ ደረጃ 1 ቡና የመጀመሪያው ማረጋገጫችን ነበር። የ87.5 የቅምሻ ውጤት በማስመዝገብ፣ ከመቀጣዩ የመከር ወቅት በፊት ተጨማሪ የሶስት ኮንቴይነሮች ትዕዛዝ አስገኝቷል። ያ የመጀመሪያው ግንኙነት ሁሉንም አስተምሮናል፡ ጥራት ራሱን ይገልጻል፣ ወጥነት እምነትን ይገነባል፣ እና ዓለም አፍሪካ የምታመርተውን እውነተኛ ምርት ይፈልጋል።'
    : 'KIJIJ International was founded on the conviction that Africa\'s greatest exports aren\'t ideas or potential — they\'re real products. A 1-ton trial shipment of washed Yirgacheffe Grade 1 coffee to a US roastery was the first proof of concept. It landed with a cupping score of 87.5, and three more container orders followed before the next harvest season. That first relationship taught our founders everything: quality speaks, consistency builds trust, and the world wants what Africa grows.';

  const missionText = isAmharic
    ? 'ከፍተኛ ጥራት ያላቸውን ምርቶች በግልጽነት፣ በታማኝነት እና በጥንቃቄ በማቅረብ ለአፍሪካ አምራቾች እና ለዓለም አቀፍ ገዢዎች ዘላቂ እና የረጅም ጊዜ እሴት መፍጠር።'
    : 'To create sustainable, long-term value for African producers and international buyers by delivering the highest-quality commodities with transparency, integrity, and care.';

  const visionText = isAmharic
    ? 'በስነ-ምግባር አሰራር፣ ወጥ በሆነ ጥራት እና የጋራ ተጠቃሚነት ላይ የተመሰረተ ግንኙነትን በመገንባት የአፍሪካ በጣም ታማኝ የንግድ አጋር መሆን።'
    : 'To be Africa\'s most trusted trade partner — a company that sets the standard for ethical sourcing, consistent quality, and mutually beneficial relationships.';

  const coreValues = isAmharic
    ? [
        {
          title: 'ምርቶች ቅድሚያ',
          description:
            'እውነተኛ ተጨባጭ ምርቶችን እንሸጣለን። ከልዩ ቡና እስከ ፕሪሚየም ቆዳ ድረስ ለምንሰራቸው ምርቶች ሙሉ ዋስትና እንሰጣለን።',
        },
        {
          title: 'ታማኝነት',
          description:
            'ከአርሶ አደሮች ማህበራት እስከ ዓለም አቀፍ ገዢዎች ድረስ ግልጽነት ባለው መልኩ እንሰራለን። ቃላችንን በተግባር እናረጋግጣለን።',
        },
        {
          title: 'ዘላቂ አጋርነት',
          description:
            'ከአምራቾች ጋር የረጅም ጊዜ ግንኙነት መፍጠር የተሻለ የኑሮ ደረጃን እና አስተማማኝ አቅርቦትን ያረጋግጣል። ከእያንዳንዱ ምርት ጀርባ ባሉ ማህበረሰቦች ላይ ኢንቨስት እናደርጋለን።',
        },
        {
          title: 'የአፍሪካ ቅርስ',
          description:
            'የአፍሪካን ታላቅ የግብርና እና የእጅ ጥበብ ቅርስ በመጠበቅ እና ለዓለም በማስተዋወቅ እንኮራለን።',
        },
      ]
    : [
        {
          title: 'Products First',
          description:
            'We deal in real, tangible goods. From specialty coffee to premium leather — every product we trade is something we stand fully behind.',
        },
        {
          title: 'Integrity',
          description:
            'We operate transparently with every stakeholder — from the cooperatives we source from to the buyers we serve. What we say is what we deliver.',
        },
        {
          title: 'Sustainable Partnership',
          description:
            'Long-term relationships with producers mean better livelihoods and more consistent supply. We invest in the communities behind every shipment.',
        },
        {
          title: 'African Heritage',
          description:
            'We are proud custodians of Africa\'s extraordinary agricultural and craft heritage. Every product we export tells a story worth sharing.',
        },
      ];

  return (
    <main className="flex flex-col bg-white">
      {/* ── 1. Editorial Page Header ────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-neutral-950 text-white relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=85"
            alt="KIJIJ International — Global maritime export logistics and container shipping"
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
                {t('about.hero.eyebrow')}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-serif font-normal text-white leading-tight tracking-tight">
              {t('about.hero.title')}
            </h1>

            <p className="text-neutral-300 text-lg sm:text-xl font-light leading-relaxed">
              {t('about.hero.sub')}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Company Narrative & Founding Milestone ───────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Narrative Column — 7 cols */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
                  {t('about.story.eyebrow')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950 leading-snug">
                  {t('about.story.title')}
                </h2>
              </div>

              <div className="space-y-5 text-neutral-600 text-base sm:text-lg font-light leading-relaxed">
                {aboutParagraphs.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-neutral-700">
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                    {isAmharic ? 'የአሜሪካ ዋና መሥሪያ ቤት' : 'USA Headquarters'}
                  </p>
                  <p className="font-medium text-neutral-900">Saluda, South Carolina</p>
                  <p className="text-neutral-500 text-xs">
                    {isAmharic ? 'ዓለም አቀፍ የገዢ ግንኙነቶች እና የንግድ ውሎች' : 'International trade governance & buyer accounts'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                    {isAmharic ? 'የኢትዮጵያ ሥራ ማዕከል' : 'Ethiopian Operations'}
                  </p>
                  <p className="font-medium text-neutral-900">Addis Ababa, Ethiopia</p>
                  <p className="text-neutral-500 text-xs">
                    {isAmharic ? 'የመነሻ ምርት አቅርቦት፣ የጥራት ምዘና እና ኤክስፖርት' : 'Direct origin sourcing, cupping & export dispatch'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Editorial Pillar: Founding Story & Visual — 5 cols */}
            <div className="lg:col-span-5 space-y-8">
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-neutral-200 shadow-lift">
                <Image
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80"
                  alt="Staged export shipping containers and global freight logistics"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Founding Story Callout */}
              <div className="border border-neutral-200 bg-neutral-50 rounded-xs p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <p className="text-primary-700 text-xs uppercase tracking-[0.2em] font-semibold">
                    {isAmharic ? 'የመሰረተ-እምነት ምዕራፍ' : 'Founding Milestone'}
                  </p>
                  <span className="text-xs font-serif text-neutral-500 font-medium">
                    {isAmharic ? 'የተመሰረተበት 2019' : 'Est. 2019'}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-normal text-neutral-950">
                  {t('about.hero.title')}
                </h3>

                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  {foundingStoryBody}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Direct Export & Product Divisions: Editorial Sequence ─────────── */}
      <section className="py-20 bg-neutral-50 border-t border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-3">
            <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
              {t('about.deliver.eyebrow')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
              {t('about.deliver.title')}
            </h2>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {t('about.deliver.sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Division 1: Coffee (Correct Coffee Image) */}
            <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-4 shadow-subtle flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800&q=80"
                    alt="Ethiopian specialty roasted arabica coffee beans ready for export"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    {t('about.coffee.tag')}
                  </span>
                  <h3 className="font-serif font-normal text-xl text-neutral-950">
                    {t('about.coffee.title')}
                  </h3>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  {t('about.coffee.desc')}
                </p>
              </div>
              <a
                href={SITE_CONFIG.urls.coffeeSite}
                className="inline-flex items-center gap-1.5 text-primary-700 text-xs uppercase tracking-wider font-semibold hover:text-primary-800 pt-3 border-t border-neutral-100"
              >
                <span>{t('about.coffee.link')}</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Division 2: Leather (Correct Handcrafted Leather Product Image) */}
            <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-4 shadow-subtle flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
                    alt="Handcrafted Ethiopian luxury leather travel bag and accessories"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    {t('about.leather.tag')}
                  </span>
                  <h3 className="font-serif font-normal text-xl text-neutral-950">
                    {t('about.leather.title')}
                  </h3>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  {t('about.leather.desc')}
                </p>
              </div>
              <a
                href={SITE_CONFIG.urls.leatherSite}
                className="inline-flex items-center gap-1.5 text-primary-700 text-xs uppercase tracking-wider font-semibold hover:text-primary-800 pt-3 border-t border-neutral-100"
              >
                <span>{t('about.leather.link')}</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Division 3: Direct Delivery to Clients (Correct Courier / Delivery Person Image) */}
            <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-4 shadow-subtle flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
                  <Image
                    src="https://media.istockphoto.com/id/1287632115/photo/were-the-best-when-it-comes-to-fast-delivery.jpg?s=612x612&w=0&k=20&c=lEkFNmAApPthHuV1RlrmYGtAyA5fA0e2Za93ssGSGG8="
                    alt="Courier delivering orders directly to clients and businesses"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    {t('about.delivery.tag')}
                  </span>
                  <h3 className="font-serif font-normal text-xl text-neutral-950">
                    {t('about.delivery.title')}
                  </h3>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  {t('about.delivery.desc')}
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-primary-700 text-xs uppercase tracking-wider font-semibold hover:text-primary-800 pt-3 border-t border-neutral-100"
              >
                <span>{t('about.delivery.link')}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Mission, Vision & Core Values ────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-primary-700 text-xs uppercase tracking-[0.25em] font-semibold">
              {t('about.values.eyebrow')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950">
              {t('about.values.title')}
            </h2>
          </div>

          {/* Mission & Vision Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="border border-neutral-200 rounded-xs p-8 sm:p-10 space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary-700">
                {t('about.mission.title')}
              </span>
              <p className="text-2xl font-serif font-normal text-neutral-950 leading-relaxed">
                &ldquo;{missionText}&rdquo;
              </p>
            </div>

            <div className="border border-neutral-200 rounded-xs p-8 sm:p-10 space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary-700">
                {t('about.vision.title')}
              </span>
              <p className="text-2xl font-serif font-normal text-neutral-950 leading-relaxed">
                &ldquo;{visionText}&rdquo;
              </p>
            </div>
          </div>

          {/* Values Grid with Hairline Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-neutral-200">
            {coreValues.map((value) => (
              <div key={value.title} className="space-y-3">
                <div className="w-8 h-8 rounded-xs border border-primary-500/30 bg-primary-50 flex items-center justify-center text-primary-700">
                  <Check size={16} />
                </div>
                <h3 className="font-serif font-normal text-xl text-neutral-950">{value.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
