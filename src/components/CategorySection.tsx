import React, { useEffect, useRef } from 'react';
import './CategorySection.scss';
import heroImg from '../assets/images/hero.png';

const categories = [
  { name: 'Classic Roses', count: '48 arrangements', icon: '🌹', class: 'cat-roses' },
  { name: 'Seasonal', count: '32 arrangements', icon: '🌸', class: 'cat-seasonal' },
  { name: 'Home Décor', count: '24 pieces', icon: '🪴', class: 'cat-decor' },
  { name: 'Wedding', count: '18 collections', icon: '💍', class: 'cat-wedding' },
  { name: 'Tropical', count: '16 arrangements', icon: '🌺', class: 'cat-tropical' },
];

const CategorySection: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="shop">
      <div className="section-header">
        <div className="section-eyebrow">Browse By Category</div>
        <h2 className="section-title">Find your perfect <em>arrangement</em></h2>
      </div>
      <div className="categories-grid fade-up" ref={gridRef}>
        {categories.map((cat, index) => (
          <div key={index} className={`category-card ${cat.class}`}>
            <div className="cat-bg-img" style={{ backgroundImage: `url(${heroImg})` }}></div>
            <div className="cat-bg-overlay-icon">{cat.icon}</div>
            <div className="cat-overlay"></div>
            <div className="cat-info">
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.count}</div>
              <div className="cat-arrow">→</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
