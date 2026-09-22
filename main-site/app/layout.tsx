import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: `${SITE_CONFIG.companyName} — Specialty Coffee & Premium Leather`,
    template: `%s | ${SITE_CONFIG.companyName}`,
  },
  description:
    'KIJIJ International LLC delivers the finest Ethiopian specialty coffees and premium handcrafted leather goods to clients worldwide — selling products, not just opportunities.',
  openGraph: {
    type: 'website',
    siteName: SITE_CONFIG.companyName,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans bg-white text-neutral-900 antialiased">
        <LanguageProvider>
          <Header />
          <div className="flex flex-col flex-1">{children}</div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
