import type { Metadata } from 'next';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { COMPANY_COPY } from '@/lib/mock-content';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.companyName} — Ethiopia's Finest, Delivered to the World`,
  description: COMPANY_COPY.mission,
  openGraph: {
    title: SITE_CONFIG.companyName,
    description: COMPANY_COPY.mission,
    images: [{ url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
