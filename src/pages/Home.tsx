import React from "react";
import {
  CategorySection,
  FeatureStrip,
  Hero,
  Newsletter,
  ProductGrid,
  WhyPipeCleaners,
} from "../components";

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
