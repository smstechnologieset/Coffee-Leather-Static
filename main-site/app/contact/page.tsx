import type { Metadata } from 'next';
import { SITE_CONFIG } from '@highland/shared/site-config';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Trade Offices',
  description: `Get in touch with ${SITE_CONFIG.companyName}. We welcome enquiries from buyers, roasters, commercial partners, and press.`,
};

export default function ContactPage() {
  return <ContactClient />;
}
