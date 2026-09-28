import type { Metadata } from 'next';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { COMPANY_COPY } from '@/lib/mock-content';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_CONFIG.companyName} — our mission, vision, values, and the story of an African company selling products, not just opportunities.`,
  openGraph: {
    title: `About Us | ${SITE_CONFIG.companyName}`,
    description: COMPANY_COPY.mission,
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
