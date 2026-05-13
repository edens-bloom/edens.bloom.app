import React, { useEffect } from "react";
import { useStore } from "../store/useStore";
import {
  CategorySection,
  FeatureStrip,
  Hero,
  Newsletter,
  ProductGrid,
  WhyPipeCleaners,
} from "../components";

const Home: React.FC = () => {
  const { fetchProducts } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
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
