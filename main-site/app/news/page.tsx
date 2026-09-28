import type { Metadata } from 'next';
import { SITE_CONFIG } from '@highland/shared/site-config';
import NewsClient from './NewsClient';

export const metadata: Metadata = {
  title: 'News & Trade Dispatches',
  description: `The latest trade partnerships, harvest reports, and announcements from ${SITE_CONFIG.companyName}.`,
};

export default function NewsPage() {
  return <NewsClient />;
}
