import React from 'react';
import './Hero.scss';
import heroImg from '../assets/images/hero.png';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <div className="hero-eyebrow">New Season Collection</div>
        <h1>Fresh <em>flowers</em><br />for every<br />moment</h1>
        <p className="hero-desc">Handcrafted bouquets & artisan décor, sourced from sustainable farms. Delivered to your door with care.</p>
        <div className="hero-actions">
          <a href="#shop" className="btn-primary">Shop Now</a>
          <a href="#occasions" className="btn-outline">Browse Occasions</a>
        </div>
        <div className="hero-badges">
          <div className="badge-item">
            <span className="badge-num">200+</span>
            <span className="badge-label">Varieties</span>
          </div>
          <div className="badge-item">
            <span className="badge-num">4.9★</span>
            <span className="badge-label">Rating</span>
          </div>
          <div className="badge-item">
            <span className="badge-num">Same</span>
            <span className="badge-label">Day Delivery</span>
          </div>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroImg} alt="Fresh bouquet" className="hero-image-main" />
        <div className="hero-image-overlay"></div>
        <div className="hero-float-card">
          <div className="float-label">Best Seller</div>
          <div className="float-title">Garden Rose Bliss</div>
          <div className="float-price">$58.00</div>
          <div className="float-stars">★★★★★ 142 reviews</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
