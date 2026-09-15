import HeroSection from '@/components/home/HeroSection';
import ProductsStrip from '@/components/home/ProductsStrip';
import CompanyIntro from '@/components/home/CompanyIntro';
import PurposeSection from '@/components/home/PurposeSection';
import ContractCTA from '@/components/home/ContractCTA';
import NewsPreview from '@/components/home/NewsPreview';
import ContactTeaser from '@/components/home/ContactTeaser';

export const metadata = {
  title: 'Highland Roots Coffee Trading — Premium Ethiopian Specialty Coffee',
  description:
    'Source premium specialty coffee direct from Ethiopia\'s highland farms. Request samples, negotiate contracts, and build lasting supply-chain partnerships.',
};

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <ProductsStrip />
      <CompanyIntro />
      <PurposeSection />
      <ContractCTA />
      <NewsPreview />
      <ContactTeaser />
    </main>
  );
}
