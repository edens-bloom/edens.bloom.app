import React from 'react';
import Hero from '../components/Hero';
import FeatureStrip from '../components/FeatureStrip';
import CategorySection from '../components/CategorySection';
import ProductGrid from '../components/ProductGrid';
import WhyPipeCleaners from '../components/WhyPipeCleaners';
import Newsletter from '../components/Newsletter';

const Home: React.FC = () => {
  return (
    <div className="space-y-24">
      <Hero />
      <FeatureStrip />
      <CategorySection />
      <ProductGrid />
      <WhyPipeCleaners />
      <Newsletter />
    </div>
  );
};

export default Home;
