'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isAmharic: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load from localStorage on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kijij_lang') as Language;
      if (saved === 'en' || saved === 'am') {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('kijij_lang', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'am' : 'en';
    setLanguage(next);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = language === 'am' ? am : en;
    if (dict[key]) return dict[key];
    if (en[key]) return en[key];
    return fallback ?? key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        setLanguage,
        t,
        isAmharic: language === 'am',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}

// ── English strings ──────────────────────────────────────────────────────────
const en: Record<string, string> = {
  // Nav
  'nav.home': 'Home',
  'nav.about': 'About Us',
  'nav.businesses': 'Our Businesses',
  'nav.news': 'News',
  'nav.currency': 'Exchange Rates',
  'nav.contact': 'Contact',
  'nav.tagline': 'Specialty Coffee & Leather',

  // Footer
  'footer.subtitle': 'Specialty Coffee & Leather',
  'footer.tagline':
    'Ethiopian specialty coffee and premium leather — we sell products, not just opportunities. Connecting African agricultural excellence and artisan craft directly with international buyers.',
  'footer.nav': 'Navigation',
  'footer.direct_sites': 'Direct Sites',
  'footer.coffee_link': 'Coffee Trading Platform →',
  'footer.leather_link': 'Leather Goods Store →',
  'footer.offices': 'Global Offices & Inquiries',
  'footer.phones': 'Telephone Lines',
  'footer.emails': 'Email Inquiries',
  'footer.rights': 'All rights reserved.',
  'footer.powered_by': 'Powered by',

  // Home: Hero
  'home.hero.eyebrow': 'Specialty Coffee & Premium Leather',
  'home.hero.title': 'Products, Not Just Opportunities',
  'home.hero.sub':
    "KIJIJ International connects African excellence with the global market — delivering Ethiopia's world-renowned specialty coffees and premium handcrafted leather goods to clients across North America, Europe, and the Gulf.",
  'home.hero.cta_products': 'Browse Our Products',
  'home.hero.cta_contact': 'Contact Export Desk',

  // Home: Badges
  'home.badges.direct_trade': 'Direct Trade',
  'home.badges.export_ready': 'Export Ready',
  'home.badges.traceable': 'Traceable Origin',
  'home.badges.b2b': 'B2B Wholesale',

  // Home: Who We Are
  'home.who.eyebrow': 'Agricultural & Artisanal Heritage',
  'home.who.title': 'Exporting What Africa Truly Produces',
  'home.who.p1':
    'KIJIJ International LLC is an American-registered company with operational roots in Ethiopia, built on a simple conviction: the world needs real products. We work directly with certified coffee farmer cooperatives across Yirgacheffe, Sidamo, and Guji, and partner with master leather artisans in Addis Ababa to bring exceptional African goods directly to international buyers.',
  'home.who.p2':
    'We sell products, not just opportunities. Every coffee container dispatched and every leather item produced embodies verified origin, strict grade standards, and dependable export documentation.',
  'home.who.link': 'Learn more about our heritage & mission',
  'home.stats.markets': 'Export Markets',
  'home.stats.commodities': 'Direct Commodities',
  'home.stats.commodities_val': 'Coffee & Leather',
  'home.stats.bases': 'Operational Bases',
  'home.stats.bases_val': 'USA & Ethiopia',

  // Home: Divisions
  'home.divisions.eyebrow': 'Our Divisions',
  'home.divisions.title': 'Two Pillars of Direct Trade',
  'home.divisions.sub':
    "Direct access to Ethiopia's two most revered exports — specialty agricultural commodities and luxury artisanal craftsmanship.",
  'home.divisions.coffee_tag': 'Agricultural Division',
  'home.divisions.coffee_title': 'Coffee Trading Platform',
  'home.divisions.coffee_desc':
    'Specialty-grade Ethiopian arabicas — Yirgacheffe, Sidamo, Guji, Harar, Limu, and Jimma — for wholesale buyers and roasters worldwide.',
  'home.divisions.coffee_link': 'Explore coffees & origin lots',
  'home.divisions.coffee_grades': 'Grades 1–4',
  'home.divisions.leather_tag': 'Artisan Division',
  'home.divisions.leather_title': 'Leather Goods Store',
  'home.divisions.leather_desc':
    'Premium Ethiopian leather goods — bags, accessories, and garments — crafted from the finest East African hides by experienced local artisans.',
  'home.divisions.leather_b1': 'Centuries of Ethiopian tanning heritage',
  'home.divisions.leather_b2': 'Handstitched travel bags, briefcases & totes',
  'home.divisions.leather_b3': 'Export-grade finishing for overseas clients',
  'home.divisions.leather_link': 'View catalogue',

  // Home: Direct Export Trade
  'home.direct_trade.eyebrow': 'Supply Chain & Delivery',
  'home.direct_trade.title': 'Direct Export Trade',
  'home.direct_trade.sub':
    'From origin harvesting to destination port dispatch, we oversee rigorous quality control and container logistics.',
  'home.direct_trade.c1_tag': 'Logistics & Dispatch',
  'home.direct_trade.c1_title': 'Global Delivery',
  'home.direct_trade.c1_desc':
    'Direct vessel routing from port departure through customs clearance straight to client facilities.',
  'home.direct_trade.c1_link': 'Track shipment capabilities',
  'home.direct_trade.c2_tag': 'Single Origin Traceability',
  'home.direct_trade.c2_title': 'Specialty Origins',
  'home.direct_trade.c2_desc':
    'Traceable lots from high-altitude microclimates with verified moisture levels and screen size uniformity.',
  'home.direct_trade.c2_link': 'Browse origin profiles',
  'home.direct_trade.c3_tag': 'Premium Leather',
  'home.direct_trade.c3_title': 'Handcrafted Goods & Accessories',
  'home.direct_trade.c3_desc':
    'Centuries of Ethiopian tanning heritage and highland hides fashioned into weekend bags, executive briefcases, totes, and accessories designed for international markets.',
  'home.direct_trade.c3_link': 'Discover leather goods',

  // Home: News
  'home.news.eyebrow': 'Trade Journal',
  'home.news.title': 'Dispatches from KIJIJ International',
  'home.news.view_all': 'View all dispatches',

  // Home: Bottom CTA
  'home.cta.eyebrow': 'Direct African Commodity Sourcing',
  'home.cta.title': 'Partner with KIJIJ International',
  'home.cta.desc':
    'Whether seeking container volumes of specialty green coffee or artisanal leather goods, our team provides reliable supply contracts and seamless trade logistics.',
  'home.cta.button': 'Initiate Trade Inquiry',

  // About Page
  'about.hero.eyebrow': 'The KIJIJ Story',
  'about.hero.title': 'Products, Not Just Opportunities',
  'about.hero.sub':
    "KIJIJ International was founded to connect Ethiopia's extraordinary agricultural and artisanal heritage with discerning global buyers.",
  'about.story.eyebrow': 'Founding Conviction',
  'about.story.title': 'The Genesis of KIJIJ International',
  'about.deliver.eyebrow': 'What We Deliver',
  'about.deliver.title': 'Tangible Goods, Direct Relationships',
  'about.deliver.sub':
    'We focus on two distinct product sectors where Ethiopia holds unmatched natural advantages and centuries of artisanal mastery.',
  'about.coffee.tag': 'Product Division',
  'about.coffee.title': 'Specialty Coffee Supply',
  'about.coffee.desc':
    'Direct sourcing with Ethiopian farmer cooperatives across Yirgacheffe, Sidamo, and Guji for certified Grade 1 green coffees.',
  'about.coffee.link': 'Browse Coffee Sourcing',
  'about.leather.tag': 'Product Division',
  'about.leather.title': 'Artisan Leather Goods',
  'about.leather.desc':
    'Export-ready bags, travel gear, and accessories fashioned by skilled Ethiopian leather artisans from premium highland hides.',
  'about.leather.link': 'View Leather Catalog',
  'about.delivery.tag': 'Fulfillment',
  'about.delivery.title': 'Direct Delivery to Clients',
  'about.delivery.desc':
    'When clients place orders, we take care of all export certifications and container shipping directly to your port or business worldwide.',
  'about.delivery.link': 'Inquire About Export Terms',
  'about.values.eyebrow': 'Guiding Principles',
  'about.values.title': 'Mission, Vision & Core Values',
  'about.mission.title': 'Our Mission',
  'about.vision.title': 'Our Vision',
  'about.reach.eyebrow': 'Bilateral Reach',
  'about.reach.title': 'Dual Headquarters & Operational Footprint',
  'about.reach.p1':
    'KIJIJ International operates with a bilateral structure designed to remove distance between African production and international commerce.',
  'about.reach.p2':
    'Our United States headquarters in Saluda, South Carolina manages international buyer relations, commercial contracts, customer service, and distribution partnerships across North America.',
  'about.reach.p3':
    'Our Ethiopia operations in Addis Ababa oversee cooperative relationships, harvest tracking, quality grading, processing oversight, and export logistics at origin.',
  'about.reach.contact_btn': 'Connect with Our Export Desk',

  // Businesses Page
  'businesses.hero.eyebrow': 'Our Divisions',
  'businesses.hero.title': 'Two Pillars of Ethiopian Excellence',
  'businesses.hero.sub':
    'KIJIJ International operates two dedicated product lines — specialty Ethiopian coffee and handcrafted leather goods — exporting and delivering real products directly to customers across the world.',
  'businesses.coffee.div': 'Division 01 · Active',
  'businesses.coffee.name': 'Coffee Trading Platform',
  'businesses.coffee.tagline': 'Specialty Ethiopian Arabicas for the World',
  'businesses.coffee.desc':
    'Our flagship business connects smallholder Ethiopian coffee producers with wholesale buyers across North America, Europe, and Asia. We offer six distinct origins — Yirgacheffe, Sidamo, Guji, Harar, Limu, and Jimma — across all major process methods. When buyers place sample requests or container orders, we manage quality grading and export shipments directly to their destination.',
  'businesses.coffee.cta': 'Browse Coffee Catalog',
  'businesses.leather.div': 'Division 02 · Active',
  'businesses.leather.name': 'Leather Goods Store',
  'businesses.leather.tagline': 'Premium Ethiopian Leather Goods & Accessories',
  'businesses.leather.desc':
    "Ethiopia is home to one of Africa's largest livestock populations and a centuries-old tradition of leather craftsmanship. Our leather goods line offers a curated collection of premium bags, accessories, and travel gear produced by skilled Ethiopian artisans using responsibly sourced highland hides, exported directly to retail and wholesale customers worldwide.",
  'businesses.leather.cta': 'View catalogue',
  'businesses.fulfillment.eyebrow': 'Supply Chain & Fulfillment',
  'businesses.fulfillment.title': 'How We Deliver Our Products',
  'businesses.fulfillment.sub':
    'Every container of coffee and shipment of leather goods follows an unbroken chain of custody from Ethiopian origin to final delivery destination.',
  'businesses.step1.title': '01. Sourcing & Origin Selection',
  'businesses.step1.desc':
    'Direct relationship with smallholder cooperatives and artisan workshops across Ethiopia.',
  'businesses.step2.title': '02. Quality Verification',
  'businesses.step2.desc':
    'Physical inspection, moisture testing, cupping assessment, and export-grade standardization.',
  'businesses.step3.title': '03. Export Logistics',
  'businesses.step3.desc':
    'FOB Djibouti or CIF destination port options with verified Phytosanitary and customs documentation.',
  'businesses.step4.title': '04. Destination Delivery',
  'businesses.step4.desc':
    'Direct handover to buyer roasteries, retail warehouses, or commercial distribution centers globally.',

  // News Page
  'news.hero.eyebrow': 'Trade Journal & Dispatches',
  'news.hero.title': 'Announcements & Field Reports',
  'news.hero.sub':
    'Updates on coffee harvest conditions, international trade agreements, export logistics, and organizational milestones from KIJIJ International.',
  'news.lead.badge': 'Featured Dispatch',
  'news.secondary.title': 'Recent Dispatches',

  // Currency Page
  'currency.hero.eyebrow': 'Commercial Forex',
  'currency.hero.title': 'Foreign Exchange Rates',
  'currency.hero.sub':
    'Live indicative exchange rates for major currencies against the Ethiopian Birr (ETB). Rates refreshed automatically.',
  'currency.calc.title': 'Currency Calculator',
  'currency.calc.amount': 'Amount',
  'currency.calc.from': 'From Currency',
  'currency.calc.to': 'To Currency',
  'currency.table.title': 'Commercial Bank Indicative Rates',
  'currency.table.col_currency': 'Currency',
  'currency.table.col_buy': 'Buying Rate',
  'currency.table.col_sell': 'Selling Rate',
  'currency.table.col_updated': 'Last Updated',

  // Contact Page
  'contact.hero.eyebrow': 'Direct Inquiries',
  'contact.hero.title': 'Get in Touch',
  'contact.hero.sub':
    "Whether you're a coffee importer, commercial roaster, retailer seeking artisan leather goods, or prospective partner — we'd love to connect.",
  'contact.offices.title': 'Global Headquarters & Operations',
  'contact.form.title': 'Send an Inquiry',
  'contact.form.name': 'Full Name',
  'contact.form.email': 'Business Email',
  'contact.form.subject': 'Subject / Product of Interest',
  'contact.form.message': 'Message',
  'contact.form.submit': 'Send Trade Inquiry',
  'contact.form.response': 'Our trade desk typically responds within 1 business day.',
};

// ── Amharic strings ──────────────────────────────────────────────────────────
const am: Record<string, string> = {
  // Nav
  'nav.home': 'መነሻ',
  'nav.about': 'ስለ እኛ',
  'nav.businesses': 'ንግዶቻችን',
  'nav.news': 'ዜና እና መግለጫዎች',
  'nav.currency': 'የምንዛሪ ተመን',
  'nav.contact': 'ያግኙን',
  'nav.tagline': 'ልዩ ቡና እና ጥራት ያለው ቆዳ',

  // Footer
  'footer.subtitle': 'ልዩ ቡና እና ፕሪሚየም ቆዳ',
  'footer.tagline':
    'የኢትዮጵያ ልዩ ቡና እና ጥራት ያለው ቆዳ — ምርቶችን እናቀርባለን፣ ባዶ ዕድሎችን ብቻ አይደለም። የአፍሪካን የግብርና ምርጥነት እና የእጅ ጥበብ በቀጥታ ከዓለም አቀፍ ገዢዎች ጋር እናገናኛለን።',
  'footer.nav': 'ዳሰሳ',
  'footer.direct_sites': 'ቀጥታ ድረ-ገጾች',
  'footer.coffee_link': 'የቡና መገበያያ መድረክ →',
  'footer.leather_link': 'የቆዳ ውጤቶች መደብር →',
  'footer.offices': 'ዓለም አቀፍ ቢሮዎች እና ጥያቄዎች',
  'footer.phones': 'የስልክ መስመሮች',
  'footer.emails': 'የኢሜይል አድራሻዎች',
  'footer.rights': 'መብቱ በሕግ የተጠበቀ ነው።',
  'footer.powered_by': 'የተሰራው በ',

  // Home: Hero
  'home.hero.eyebrow': 'ልዩ ቡና እና ፕሪሚየም የቆዳ ውጤቶች',
  'home.hero.title': 'ምርቶች፣ ባዶ ዕድሎች ብቻ አይደሉም',
  'home.hero.sub':
    'ኪጂጅ ኢንተርናሽናል የአፍሪካን ምርጥነት ከዓለም ገበያ ጋር ያገናኛል — በዓለም አቀፍ ደረጃ እውቅና ያገኙ የኢትዮጵያ ልዩ ቡናዎችን እና በእጅ የተሰሩ ምርጥ የቆዳ ውጤቶችን ለሰሜን አሜሪካ፣ አውሮፓ እና የመካከለኛው ምስራቅ ደንበኞች ያቀርባል።',
  'home.hero.cta_products': 'ምርቶቻችንን ያስሱ',
  'home.hero.cta_contact': 'የኤክስፖርት ክፍልን ያነጋግሩ',

  // Home: Badges
  'home.badges.direct_trade': 'ቀጥታ ንግድ',
  'home.badges.export_ready': 'ለኤክስፖርት የተዘጋጀ',
  'home.badges.traceable': 'መነሻው የታወቀ',
  'home.badges.b2b': 'የጅምላ አቅርቦት',

  // Home: Who We Are
  'home.who.eyebrow': 'የግብርና እና የእጅ ጥበብ ቅርስ',
  'home.who.title': 'አፍሪካ በእውነት የምታመርተውን ወደ ውጭ መላክ',
  'home.who.p1':
    'ኪጂጅ ኢንተርናሽናል ኤልኤልሲ መቀመጫውን በአሜሪካ ያደረገ እና የስራ መነሻውን በኢትዮጵያ ያደረገ ኩባንያ ሲሆን፣ አሰራሩም በአንድ ጽኑ እምነት ላይ የተገነባ ነው፡ ዓለም እውነተኛ ጥራት ያላቸው ምርቶች ይፈልጋል። በይርጋጨፌ፣ ሲዳማ እና ጉጂ ካሉ የቡና አርሶ አደሮች ማህበራት ጋር በቀጥታ እንሰራለን፤ እንዲሁም በአዲስ አበባ ካሉ የተካኑ የቆዳ ባለሙያዎች ጋር በመተባበር ምርጥ የአፍሪካ ምርቶችን ለአለም አቀፍ ገዢዎች እናቀርባለን።',
  'home.who.p2':
    'ምርቶችን እንሸጣለን፣ ባዶ ዕድሎችን ብቻ አይደለም። እያንዳንዱ የሚላከው የቡና ኮንቴይነር እና የሚመረተው የቆዳ ውጤት የተረጋገጠ መነሻ፣ ጥብቅ የጥራት ደረጃ እና አስተማማኝ የኤክስፖርት ሰነድ አለው።',
  'home.who.link': 'ስለ ቅርሳችን እና ተልእኳችን የበለጠ ይወቁ',
  'home.stats.markets': 'የውጭ ገበያዎች',
  'home.stats.commodities': 'ቀጥታ ምርቶች',
  'home.stats.commodities_val': 'ቡና እና ቆዳ',
  'home.stats.bases': 'የስራ ማዕከላት',
  'home.stats.bases_val': 'አሜሪካ እና ኢትዮጵያ',

  // Home: Divisions
  'home.divisions.eyebrow': 'የስራ ክፍሎቻችን',
  'home.divisions.title': 'የቀጥታ ንግድ ሁለት መሰረቶች',
  'home.divisions.sub':
    'ወደ ኢትዮጵያ ሁለቱ ታላላቅ የኤክስፖርት ዘርፎች ቀጥተኛ ተደራሽነት — ልዩ የግብርና ምርቶች እና የላቀ የእጅ ጥበብ።',
  'home.divisions.coffee_tag': 'የግብርና ዘርፍ',
  'home.divisions.coffee_title': 'የቡና መገበያያ መድረክ',
  'home.divisions.coffee_desc':
    'ደረጃቸውን የጠበቁ የኢትዮጵያ አረቢካ ቡናዎች — ይርጋጨፌ፣ ሲዳማ፣ ጉጂ፣ ሐረር፣ ሊሙ እና ጅማ — በዓለም ዙሪያ ላሉ የጅምላ ገዢዎች እና ቆዪዎች።',
  'home.divisions.coffee_link': 'ቡናዎችን እና መነሻዎችን ያስሱ',
  'home.divisions.coffee_grades': 'ደረጃ 1–4',
  'home.divisions.leather_tag': 'የእጅ ጥበብ ዘርፍ',
  'home.divisions.leather_title': 'የቆዳ ውጤቶች መደብር',
  'home.divisions.leather_desc':
    'ጥራት ያላቸው የኢትዮጵያ የቆዳ ውጤቶች — ቦርሳዎች፣ መገልገያዎች እና አልባሳት — ከተመረጡ የምስራቅ አፍሪካ ቆዳዎች በተካኑ የአገር ውስጥ ባለሙያዎች የተሰሩ።',
  'home.divisions.leather_b1': 'የዘመናት የኢትዮጵያ የቆዳ ማለስለስ ቅርስ',
  'home.divisions.leather_b2': 'በእጅ የተሰፉ የጉዞ፣ የቢሮ እና የእጅ ቦርሳዎች',
  'home.divisions.leather_b3': 'ለዓለም አቀፍ ደንበኞች ደረጃውን የጠበቀ አጨራረስ',
  'home.divisions.leather_link': 'ካታሎግ ይመልከቱ',

  // Home: Direct Export Trade
  'home.direct_trade.eyebrow': 'የአቅርቦት ሰንሰለት እና ርክክብ',
  'home.direct_trade.title': 'ቀጥታ የኤክስፖርት ንግድ',
  'home.direct_trade.sub':
    'ከአዝመራ ምርት ጀምሮ እስከ መዳረሻ ወደብ ድረስ ጥብቅ የጥራት ቁጥጥር እና የኮንቴይነር ሎጂስቲክስን እንከታተላለን።',
  'home.direct_trade.c1_tag': 'ሎጂስቲክስ እና መላኪያ',
  'home.direct_trade.c1_title': 'ዓለም አቀፍ ርክክብ',
  'home.direct_trade.c1_desc':
    'ከወደብ መነሻ ጀምሮ የጉምሩክ ክሊራንስ ተጠናቆ በቀጥታ ወደ ደንበኞች መጋዘን የሚደርስ ቀጥተኛ የመርከብ ጉዞ።',
  'home.direct_trade.c1_link': 'የመላክ አቅማችንን ይመልከቱ',
  'home.direct_trade.c2_tag': 'የአንድ መነሻ ተከታታይነት',
  'home.direct_trade.c2_title': 'ልዩ መነሻዎች',
  'home.direct_trade.c2_desc':
    'ከከፍተኛ ቦታዎች የተገኙ፣ የእርጥበት መጠን እና የጥራት ደረጃቸው የተረጋገጠ ምርጥ ምርቶች።',
  'home.direct_trade.c2_link': 'የመነሻ መገለጫዎችን ይመልከቱ',
  'home.direct_trade.c3_tag': 'ፕሪሚየም ቆዳ',
  'home.direct_trade.c3_title': 'በእጅ የተሰሩ እቃዎች እና መገልገያዎች',
  'home.direct_trade.c3_desc':
    'የዘመናት የኢትዮጵያ የቆዳ ስራ ቅርስ እና የደጋ ቆዳዎች ተጣምረው የተሰሩ የጉዞ ቦርሳዎች፣ የቢሮ ሻንጣዎች እና መገልገያዎች።',
  'home.direct_trade.c3_link': 'የቆዳ ውጤቶችን ይመልከቱ',

  // Home: News
  'home.news.eyebrow': 'የንግድ ጆርናል',
  'home.news.title': 'ከኪጂጅ ኢንተርናሽናል የተላኩ ዜናዎች',
  'home.news.view_all': 'ሁሉንም ዜናዎች ይመልከቱ',

  // Home: Bottom CTA
  'home.cta.eyebrow': 'ቀጥታ የአፍሪካ ምርቶች አቅርቦት',
  'home.cta.title': 'ከኪጂጅ ኢንተርናሽናል ጋር ይስሩ',
  'home.cta.desc':
    'ልዩ የቡና ኮንቴይነሮችን ወይም በእጅ የተሰሩ የቆዳ ውጤቶችን ቢፈልጉ፣ ቡድናችን አስተማማኝ የአቅርቦት ውሎችን እና ቀልጣፋ የንግድ ሎጂስቲክስን ያቀርባል።',
  'home.cta.button': 'የንግድ ጥያቄ ያቅርቡ',

  // About Page
  'about.hero.eyebrow': 'የኪጂጅ ታሪክ',
  'about.hero.title': 'ምርቶች፣ ባዶ ዕድሎች ብቻ አይደሉም',
  'about.hero.sub':
    'ኪጂጅ ኢንተርናሽናል የተመሰረተው የኢትዮጵያን ልዩ የግብርና እና የእጅ ጥበብ ቅርስ ከዓለም አቀፍ ገዢዎች ጋር ለማገናኘት ነው።',
  'about.story.eyebrow': 'የመሰረተ-እምነት',
  'about.story.title': 'የኪጂጅ ኢንተርናሽናል አጀማመር',
  'about.deliver.eyebrow': 'የምናቀርባቸው ምርቶች',
  'about.deliver.title': 'እውነተኛ ምርቶች፣ ቀጥተኛ ግንኙነቶች',
  'about.deliver.sub':
    'ኢትዮጵያ ወደር የለሽ የተፈጥሮ በረከት እና የዘመናት የእጅ ጥበብ ባላት በሁለት ልዩ የምርት ዘርፎች ላይ እናተኩራለን።',
  'about.coffee.tag': 'የምርት ዘርፍ',
  'about.coffee.title': 'የልዩ ቡና አቅርቦት',
  'about.coffee.desc':
    'ከይርጋጨፌ፣ ሲዳማ እና ጉጂ የአርሶ አደሮች ማህበራት ጋር ደረጃ 1 የሆኑ ጥሬ ቡናዎችን በቀጥታ እናቀርባለን።',
  'about.coffee.link': 'የቡና አቅርቦትን ይመልከቱ',
  'about.leather.tag': 'የምርት ዘርፍ',
  'about.leather.title': 'የእጅ ጥበብ የቆዳ ውጤቶች',
  'about.leather.desc':
    'ከተመረጡ የደጋ ቆዳዎች በተካኑ የኢትዮጵያ ባለሙያዎች የተሰሩ ቦርሳዎች፣ የጉዞ እቃዎች እና መገልገያዎች።',
  'about.leather.link': 'የቆዳ ካታሎግ ይመልከቱ',
  'about.delivery.tag': 'ርክክብ',
  'about.delivery.title': 'ቀጥታ ለደንበኞች ማድረስ',
  'about.delivery.desc':
    'ደንበኞች ትዕዛዝ ሲሰጡ፣ የኤክስፖርት ማረጋገጫዎችን እና የኮንቴይነር መርከብ ጉዞዎችን በቀጥታ ወደ ወደብዎ እናከናውናለን።',
  'about.delivery.link': 'ስለ ኤክስፖርት ሁኔታዎች ይጠይቁ',
  'about.values.eyebrow': 'መሪ መርሆዎች',
  'about.values.title': 'ተልዕኮ፣ ራዕይ እና ዋና እሴቶች',
  'about.mission.title': 'ተልዕኳችን',
  'about.vision.title': 'ራዕያችን',
  'about.reach.eyebrow': 'የሁለትዮሽ ተደራሽነት',
  'about.reach.title': 'ባለሁለት ዋና መሥሪያ ቤት እና የስራ አሻራ',
  'about.reach.p1':
    'ኪጂጅ ኢንተርናሽናል በአፍሪካ ምርት እና በዓለም አቀፍ ንግድ መካከል ያለውን ርቀት ለማጥበብ በተዘጋጀ ባለሁለት ማዕከል መዋቅር ይሰራል።',
  'about.reach.p2':
    'በሳሉዳ፣ ደቡብ ካሮላይና የሚገኘው የአሜሪካ ዋና መሥሪያ ቤታችን ዓለም አቀፍ የገዢ ግንኙነቶችን፣ የንግድ ውሎችን፣ የደንበኞች አገልግሎትን እና የስርጭት አጋርነቶችን ያስተዳድራል።',
  'about.reach.p3':
    'በአዲስ አበባ የሚገኘው የኢትዮጵያ የስራ ማዕከላችን የአርሶ አደሮች ህብረት ስራ ማህበራት ግንኙነትን፣ የመከር ክትትልን፣ የጥራት ደረጃን እና የኤክስፖርት ሎጂስቲክስን በቅርበት ይቆጣጠራል።',
  'about.reach.contact_btn': 'የኤክስፖርት ክፍላችንን ያነጋግሩ',

  // Businesses Page
  'businesses.hero.eyebrow': 'የስራ ክፍሎቻችን',
  'businesses.hero.title': 'የኢትዮጵያ የላቀ ጥራት ሁለት ምሰሶዎች',
  'businesses.hero.sub':
    'ኪጂጅ ኢንተርናሽናል ሁለት ዋና የምርት ዘርፎችን ያካሂዳል — ልዩ የኢትዮጵያ ቡና እና በእጅ የተሰሩ የቆዳ ውጤቶች — እውነተኛ ምርቶችን በቀጥታ በመላክ ለዓለም አቀፍ ደንበኞች ያደርሳል።',
  'businesses.coffee.div': 'ክፍል 01 · ንቁ',
  'businesses.coffee.name': 'የቡና መገበያያ መድረክ',
  'businesses.coffee.tagline': 'ልዩ የኢትዮጵያ አረቢካ ቡናዎች ለዓለም',
  'businesses.coffee.desc':
    'ዋናው የንግድ ዘርፋችን አነስተኛ የኢትዮጵያ ቡና አምራቾችን በሰሜን አሜሪካ፣ አውሮፓ እና እስያ ከሚገኙ የጅምላ ገዢዎች ጋር ያገናኛል። ስድስት ልዩ መነሻዎችን — ይርጋጨፌ፣ ሲዳማ፣ ጉጂ፣ ሐረር፣ ሊሙ እና ጅማ — በሁሉም ዋና የማዘጋጀት ዘዴዎች እናቀርባለን። ገዢዎች ናሙናዎችን ወይም የኮንቴይነር ትዕዛዞችን ሲሰጡ፣ የጥራት ደረጃውን እና የኤክስፖርት መላኪያውን በቀጥታ ወደ መዳረሻቸው እናስተናግዳለን።',
  'businesses.coffee.cta': 'የቡና ካታሎግ ይመልከቱ',
  'businesses.leather.div': 'ክፍል 02 · ንቁ',
  'businesses.leather.name': 'የቆዳ ውጤቶች መደብር',
  'businesses.leather.tagline': 'ጥራት ያላቸው የኢትዮጵያ የቆዳ ውጤቶች እና መገልገያዎች',
  'businesses.leather.desc':
    'ኢትዮጵያ ከአፍሪካ ትልቁን የእንስሳት ሀብት እና የዘመናት የቆዳ ስራ ጥበብን በውስጧ የያዘች ነች። የቆዳ ውጤቶች ዘርፋችን ከተመረጡ የደጋ ቆዳዎች በተካኑ የኢትዮጵያ ባለሙያዎች የተሰሩ ቦርሳዎችን፣ የጉዞ እቃዎችን እና መገልገያዎችን በቀጥታ ለአለም አቀፍ ቸርቻሪ እና የጅምላ ደንበኞች ያቀርባል።',
  'businesses.leather.cta': 'ካታሎግ ይመልከቱ',
  'businesses.fulfillment.eyebrow': 'የአቅርቦት ሰንሰለት እና ርክክብ',
  'businesses.fulfillment.title': 'ምርቶቻችንን እንዴት እንደምናደርስ',
  'businesses.fulfillment.sub':
    'እያንዳንዱ የቡና ኮንቴይነር እና የቆዳ ጭነት ከኢትዮጵያ መነሻ ጀምሮ እስከ መጨረሻው መዳረሻ ድረስ ጥብቅ ቁጥጥር ይደረግበታል።',
  'businesses.step1.title': '01. አቅርቦት እና ምርጫ',
  'businesses.step1.desc':
    'በኢትዮጵያ ውስጥ ካሉ የአነስተኛ አርሶ አደሮች ማህበራት እና የእጅ ጥበብ አውደ ጥናቶች ጋር ቀጥተኛ ግንኙነት።',
  'businesses.step2.title': '02. የጥራት ማረጋገጫ',
  'businesses.step2.desc':
    'አካላዊ ፍተሻ፣ የእርጥበት ምርመራ፣ የቅምሻ ምዘና እና የኤክስፖርት ደረጃ ማረጋገጫ።',
  'businesses.step3.title': '03. የኤክስፖርት ሎጂስቲክስ',
  'businesses.step3.desc':
    'በጂቡቲ ወደብ (FOB) ወይም መዳረሻ ወደብ (CIF) ከተሟሉ የጉምሩክ እና የጤና ሰነዶች ጋር።',
  'businesses.step4.title': '04. መዳረሻ ርክክብ',
  'businesses.step4.desc':
    'በዓለም ዙሪያ ለገዢዎች የቡና መቁያ ፋብሪካዎች፣ መጋዘኖች ወይም ማከፋፈያ ማዕከላት ቀጥተኛ ርክክብ።',

  // News Page
  'news.hero.eyebrow': 'የንግድ ጆርናል እና መግለጫዎች',
  'news.hero.title': 'ማስታወቂያዎች እና የመስክ ሪፖርቶች',
  'news.hero.sub':
    'የቡና መከር ሁኔታዎች፣ ዓለም አቀፍ የንግድ ስምምነቶች፣ የኤክስፖርት ሎጂስቲክስ እና የኩባንያው አበይት ክንውኖች ከኪጂጅ ኢንተርናሽናል።',
  'news.lead.badge': 'ተለይቶ የቀረበ ዜና',
  'news.secondary.title': 'የቅርብ ጊዜ መግለጫዎች',

  // Currency Page
  'currency.hero.eyebrow': 'የውጭ ምንዛሪ ተመን',
  'currency.hero.title': 'የውጭ ሀገር ገንዘብ የምንዛሬ ተመን',
  'currency.hero.sub':
    'የዋና ዋና ገንዘቦች ከኢትዮጵያ ብር (ETB) አንጻር ያለው የቀጥታ ምንዛሪ ተመን። ተመኖች በየጊዜው በራስ-ሰር ይታደሳሉ።',
  'currency.calc.title': 'የምንዛሬ ማስያ',
  'currency.calc.amount': 'መጠን',
  'currency.calc.from': 'ከገንዘብ',
  'currency.calc.to': 'ወደ ገንዘብ',
  'currency.table.title': 'የንግድ ባንኮች አመላካች የምንዛሬ ተመን',
  'currency.table.col_currency': 'ገንዘብ',
  'currency.table.col_buy': 'የመግዣ ተመን',
  'currency.table.col_sell': 'የመሸጫ ተመን',
  'currency.table.col_updated': 'የመጨረሻ ዝመና',

  // Contact Page
  'contact.hero.eyebrow': 'ቀጥታ ጥያቄዎች',
  'contact.hero.title': 'ያግኙን',
  'contact.hero.sub':
    'የቡና አስመጪ፣ ቆዪ፣ የእጅ ጥበብ የቆዳ ውጤቶችን የሚፈልጉ ነጋዴ ወይም ሊሆኑ የሚችሉ አጋር ከሆኑ — ከእርስዎ ጋር ለመገናኘት ደስተኞች ነን።',
  'contact.offices.title': 'ዓለም አቀፍ ዋና መሥሪያ ቤት እና ቢሮዎች',
  'contact.form.title': 'ጥያቄ ወይም መልዕክት ይላኩ',
  'contact.form.name': 'ሙሉ ስም',
  'contact.form.email': 'የስራ ኢሜይል',
  'contact.form.subject': 'ጉዳዩ / የሚፈልጉት ምርት',
  'contact.form.message': 'መልዕክት',
  'contact.form.submit': 'የንግድ ጥያቄውን ላክ',
  'contact.form.response': 'የንግድ ክፍላችን በአብዛኛው በ1 የስራ ቀን ውስጥ ምላሽ ይሰጣል።',
};
