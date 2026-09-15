import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@highland/shared/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.urls.mainSite;
  const now = new Date();

  return [
    { url: base,                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/about`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/businesses`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gallery`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/news`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/contact`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
  ];
}
