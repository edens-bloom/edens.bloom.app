import React from 'react';
import Hero from '../components/Hero';
import FeatureStrip from '../components/FeatureStrip';
import CategorySection from '../components/CategorySection';
import ProductGrid from '../components/ProductGrid';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <FeatureStrip />
      <CategorySection />
      <ProductGrid />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
