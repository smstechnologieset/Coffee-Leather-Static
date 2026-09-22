import type { Metadata } from 'next';
import { SITE_CONFIG } from '@highland/shared/site-config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import './globals.css';

export const metadata: Metadata = {
  title: `Leather Goods — ${SITE_CONFIG.companyName}`,
  description: 'Premium Ethiopian leather goods crafted from the finest East African hides.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col pt-16 lg:pt-20">
        <Header />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
