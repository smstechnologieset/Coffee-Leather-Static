'use client';

import { createContext, useContext, useState } from 'react';

type Language = 'en' | 'am';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === 'en' ? 'am' : 'en'));

  const t = (key: string): string => {
    const dict = language === 'en' ? en : am;
    return (dict as Record<string, string>)[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
  'nav.home':      'Home',
  'nav.about':     'About Us',
  'nav.businesses':'Our Businesses',
  'nav.gallery':   'Gallery',
  'nav.news':      'News',
  'nav.currency':  'Exchange Rates',
  'nav.contact':   'Contact',

  // Hero
  'hero.eyebrow':  'Specialty Coffee & Premium Leather',
  'hero.headline': 'Products, Not Just Opportunities',
  'hero.sub':      'KIJIJ International connects African excellence with the global market — from Ethiopian specialty coffee to premium leather goods.',
  'hero.cta1':     'Explore Our Businesses',
  'hero.cta2':     'Get in Touch',

  // About section
  'about.eyebrow': 'Who We Are',
  'about.headline':'About KIJIJ International',
  'about.sub':     'An African company built on the belief that the world deserves better access to what Africa produces.',

  // Footer
  'footer.tagline': "Ethiopian specialty coffee and premium leather — we sell products, not just opportunities.",
  'footer.nav':     'Navigation',
  'footer.businesses': 'Our Businesses',
  'footer.contact': 'Contact',
  'footer.rights':  'All rights reserved.',

  // Contact page
  'contact.title':   'Get in Touch',
  'contact.sub':     "Whether you're a buyer, a partner, or a journalist — we'd love to hear from you.",
  'contact.usa':     'USA Headquarters',
  'contact.ethiopia':'Ethiopia Operations',
  'contact.email':   'Email',
  'contact.phone':   'Phone',
  'contact.address': 'Address',
  'contact.send':    'Send Us a Message',
  'contact.respond': 'We typically respond within 1–2 business days.',
};

// ── Amharic strings ──────────────────────────────────────────────────────────
// ⚠️ PLACEHOLDER — awaiting official translations from client
const am: Record<string, string> = {
  // Nav
  'nav.home':      'መነሻ',
  'nav.about':     'ስለ እኛ',
  'nav.businesses':'ንግዶቻችን',
  'nav.gallery':   'ጋለሪ',
  'nav.news':      'ዜና',
  'nav.currency':  'የምንዛሪ ተመን',
  'nav.contact':   'ያግኙን',

  // Hero
  'hero.eyebrow':  'ልዩ ቡና እና ፕሪሚየም የቆዳ ውጤቶች',
  'hero.headline': 'ምርቶች፣ ዕድሎች ብቻ አይደለም',
  'hero.sub':      'KIJIJ International የአፍሪካን ምርጥነት ከዓለም ገበያ ጋር ያገናኛል — ከኢትዮጵያ ቡና እስከ ፕሪሚየም የቆዳ እቃዎች።',
  'hero.cta1':     'ንግዶቻችንን ያስሱ',
  'hero.cta2':     'ያግኙን',

  // About
  'about.eyebrow': 'እነማን ነን',
  'about.headline':'ስለ KIJIJ International',
  'about.sub':     'ዓለም አፍሪካ የምታቀርበውን የበለጠ ተደራሽ ማድረግ ይገባዋል ብሎ በሚያምን የአፍሪካ ኩባንያ።',

  // Footer
  'footer.tagline': 'ልዩ ቡና እና ፕሪሚየም የቆዳ ውጤቶች — ምርቶችን እንሸጣለን፣ ዕድሎችን ብቻ አይደለም።',
  'footer.nav':     'ናቪጌሽን',
  'footer.businesses': 'ንግዶቻችን',
  'footer.contact': 'ያግኙን',
  'footer.rights':  'መብቱ በሕግ የተጠበቀ ነው።',

  // Contact
  'contact.title':   'ያግኙን',
  'contact.sub':     'ገዢ፣ አጋር ወይም ጋዜጠኛ ከሆኑ — ከእርስዎ ለመስማት ደስተኞች ነን።',
  'contact.usa':     'የአሜሪካ ዋና መሥሪያ ቤት',
  'contact.ethiopia':'የኢትዮጵያ ሥራ ማዕከል',
  'contact.email':   'ኢሜይል',
  'contact.phone':   'ስልክ',
  'contact.address': 'አድራሻ',
  'contact.send':    'መልዕክት ይላኩልን',
  'contact.respond': 'ብዙውን ጊዜ በ1–2 የሥራ ቀናት ውስጥ ምላሽ እንሰጣለን።',
};
