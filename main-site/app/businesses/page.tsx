import type { Metadata } from 'next';
import { SITE_CONFIG } from '@highland/shared/site-config';
import BusinessesClient from './BusinessesClient';

export const metadata: Metadata = {
  title: 'Our Businesses',
  description: `Explore the two business lines of ${SITE_CONFIG.companyName}: specialty Ethiopian coffee trading and premium handcrafted leather goods.`,
};

export default function BusinessesPage() {
  return <BusinessesClient />;
}
