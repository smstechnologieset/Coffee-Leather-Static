import React from 'react';
import SEO from './SEO';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import PartnersSection from './PartnersSection';
import ProductsSection from './ProductsSection';
import CompanyIntro from './CompanyIntro';
import PurposeSection from './PurposeSection';
import ContractSection from './ContractSection';
import BlogSection from './BlogSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <SEO />
      <Navbar />
      <HeroSection />
      <PartnersSection />
      <ProductsSection />
      <CompanyIntro />
      <PurposeSection />
      <ContractSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Homepage;