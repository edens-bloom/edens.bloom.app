import React from "react";
import {
  CategorySection,
  FeatureStrip,
  Hero,
  ProductGrid,
  WhyPipeCleaners,
} from "../components";

const Home: React.FC = () => {
  return (
    <div className="space-y-24">
      <div
        className="alert-banner"
        style={{
          background: "#fff4e5",
          color: "#663c00",
          border: "1px solid #f5c26b",
          borderRadius: 8,
          padding: "12px 16px",
          textAlign: "center",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: "20px",
        }}
      >
        Contact 9861476014 now — the website is still in development and may not
        be fully working.
      </div>
      <Hero />
      <FeatureStrip />
      <CategorySection />
      <ProductGrid />
      <WhyPipeCleaners />
    </div>
  );
};

export default Home;
