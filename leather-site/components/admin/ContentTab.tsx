'use client';

import { useState, useEffect } from 'react';
import { Check, RefreshCcw } from 'lucide-react';

const STORAGE_KEY = 'kijij_leather_content_v1';

export interface LeatherSiteContent {
  // Announcement bar
  announcementEnabled: boolean;
  announcementText: string;

  // Homepage hero
  heroHeadline: string;
  heroSubheadline: string;
  heroCta1Label: string;
  heroCta2Label: string;

  // About / craft section
  craftHeadline: string;
  craftBody: string;

  // Products page banner
  collectionBannerHeadline: string;
  collectionBannerSubheadline: string;
  collectionBannerTag: string;

  // Footer
  footerTagline: string;
  footerAddress: string;
  footerEmail: string;
  footerPhone: string;
  footerInstagram: string;
  footerFacebook: string;
}

const DEFAULTS: LeatherSiteContent = {
  announcementEnabled: false,
  announcementText: '',

  heroHeadline: 'Timeless Craft. Ethiopian Heritage.',
  heroSubheadline: 'Discover our collection of premium, sustainably sourced leather bags, jackets, and accessories crafted by master artisans.',
  heroCta1Label: 'Shop Collection',
  heroCta2Label: 'Explore Outerwear',

  craftHeadline: 'Artisan Quality, Rooted in Tradition.',
  craftBody: 'Every KIJIJ piece is hand-crafted in Addis Ababa using ethically sourced hides. We partner with local tanneries to ensure exceptional quality and sustainable practices that empower our community.',

  collectionBannerHeadline: 'The Collection',
  collectionBannerSubheadline: 'Full-grain Ethiopian leather, master-crafted for generations.',
  collectionBannerTag: 'Handcrafted in Ethiopia',

  footerTagline: 'Premium Ethiopian leather goods, crafted by hand.',
  footerAddress: 'Addis Ababa, Ethiopia',
  footerEmail: 'info@kijijleather.com',
  footerPhone: '+251 911 000 000',
  footerInstagram: 'https://instagram.com/kijijleather',
  footerFacebook: '',
};

function loadContent(): LeatherSiteContent {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function saveContent(content: LeatherSiteContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent('kijij_leather_content_updated', { detail: content }));
}

const inputCls = 'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900';
const textareaCls = inputCls + ' resize-none';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-600">{title}</h3>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function getLeatherContent(): LeatherSiteContent {
  return loadContent();
}

export default function ContentTab() {
  const [content, setContent] = useState<LeatherSiteContent>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setContent(loadContent());
  }, []);

  const set = <K extends keyof LeatherSiteContent>(key: K, val: LeatherSiteContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
  };

  const handleSave = () => {
    saveContent(content);
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all content to defaults?')) {
      setContent(DEFAULTS);
      saveContent(DEFAULTS);
      setDirty(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* Save bar */}
      <div className={`bg-white border rounded-xl px-5 py-3 flex items-center justify-between transition-all ${dirty ? 'border-amber-300 bg-amber-50' : 'border-neutral-200'}`}>
        <p className="text-sm text-neutral-700">
          {dirty ? '⚠️ You have unsaved changes' : 'All changes saved'}
        </p>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors">
            <RefreshCcw className="h-3 w-3" /> Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
              saved ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white hover:bg-neutral-700'
            }`}
          >
            {saved ? <><Check className="h-3 w-3" /> Saved!</> : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Announcement Bar */}
      <Section title="Announcement Bar">
        <div className="flex items-center gap-3">
          <button
            onClick={() => set('announcementEnabled', !content.announcementEnabled)}
            className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${content.announcementEnabled ? 'bg-neutral-900' : 'bg-neutral-200'}`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${content.announcementEnabled ? 'left-4' : 'left-0.5'}`} />
          </button>
          <span className="text-sm text-neutral-700">Show announcement bar</span>
        </div>
        <Field label="Announcement Text">
          <input value={content.announcementText} onChange={(e) => set('announcementText', e.target.value)} className={inputCls} />
        </Field>
        {content.announcementEnabled && (
          <div className="bg-neutral-900 text-white text-xs text-center py-2 px-4 rounded-lg font-medium">
            Preview: {content.announcementText}
          </div>
        )}
      </Section>

      {/* Homepage Hero */}
      <Section title="Homepage Hero">
        <Field label="Main Headline">
          <input value={content.heroHeadline} onChange={(e) => set('heroHeadline', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Subheadline">
          <textarea rows={2} value={content.heroSubheadline} onChange={(e) => set('heroSubheadline', e.target.value)} className={textareaCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="CTA Button 1 Label">
            <input value={content.heroCta1Label} onChange={(e) => set('heroCta1Label', e.target.value)} className={inputCls} />
          </Field>
          <Field label="CTA Button 2 Label">
            <input value={content.heroCta2Label} onChange={(e) => set('heroCta2Label', e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      {/* Craft Section */}
      <Section title="Craftsmanship / Brand Story Section">
        <Field label="Section Headline">
          <input value={content.craftHeadline} onChange={(e) => set('craftHeadline', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Body Paragraph">
          <textarea rows={3} value={content.craftBody} onChange={(e) => set('craftBody', e.target.value)} className={textareaCls} />
        </Field>
      </Section>

      {/* Products Page Banner */}
      <Section title="Collection Page Banner">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tag / Eyebrow">
            <input value={content.collectionBannerTag} onChange={(e) => set('collectionBannerTag', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Headline">
            <input value={content.collectionBannerHeadline} onChange={(e) => set('collectionBannerHeadline', e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Subheadline">
          <input value={content.collectionBannerSubheadline} onChange={(e) => set('collectionBannerSubheadline', e.target.value)} className={inputCls} />
        </Field>
      </Section>

      {/* Footer */}
      <Section title="Footer Information">
        <Field label="Footer Tagline">
          <input value={content.footerTagline} onChange={(e) => set('footerTagline', e.target.value)} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Address">
            <input value={content.footerAddress} onChange={(e) => set('footerAddress', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email">
            <input type="email" value={content.footerEmail} onChange={(e) => set('footerEmail', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Phone">
            <input value={content.footerPhone} onChange={(e) => set('footerPhone', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Instagram URL">
            <input value={content.footerInstagram} onChange={(e) => set('footerInstagram', e.target.value)} className={inputCls} placeholder="https://instagram.com/..." />
          </Field>
        </div>
      </Section>
    </div>
  );
}
