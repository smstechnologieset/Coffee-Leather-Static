import type { Metadata } from 'next';
import CurrencyClient from './CurrencyClient';

export const metadata: Metadata = {
  title: 'Exchange Rates',
  description: 'Live foreign currency exchange rates for key trade corridors — USD, ETB, EUR, GBP, JPY, AED and more. Auto-updates every 60 seconds.',
};

export const dynamic = 'force-dynamic';

export default function CurrencyPage() {
  return <CurrencyClient />;
}
