import React from "react";
import { formatRs } from "../../utils/formatRs";

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__eyebrow-row">
          <span className="hero__eyebrow-line" aria-hidden />
          <span className="hero__eyebrow">New Season Collection</span>
        </div>
        <h1 className="hero__title">
          Flowers that last <span className="hero__title-accent">forever</span>
        </h1>
        <p className="hero__lead">
          Handcrafted pipe cleaner bouquets and artisan decor, reimagined for
          the modern maker. Vibrant, flexible, and forever in bloom.
        </p>
        <div className="hero__actions">
          <a
            href="#occasions"
            className="btn-primary-solid ambient-shadow ambient-shadow-hover press-effect"
          >
            Shop Now
          </a>
          <a href="#category" className="btn-outline-round press-effect">
            Browse Occasions
          </a>
        </div>
        <div className="hero__stats">
          <div>
            <div className="hero__stat-value">15+</div>
            <div className="hero__stat-label">Vibrant Hues</div>
          </div>
          {/* Rating in Future */}
          <div>
            <div className="hero__stat-value">4.9★</div>
            <div className="hero__stat-label">Maker Rating</div>
          </div>
          {/* <div>
            <div className="hero__stat-value">Same Day or Next Day</div>
            <div className="hero__stat-label">Shipping</div>
          </div> */}
        </div>
      </div>
      <div className="hero__visual">
        <div className="hero__glow" aria-hidden />
        <div className="hero__frame ambient-shadow felt-texture">
          <img
            alt="Handcrafted Pipe Cleaner Bouquet"
            className="hero__img"
            src="https://res.cloudinary.com/dkjqlvdxx/image/upload/v1778751222/WhatsApp_Image_2026-05-14_at_3.17.53_PM_dwpvhb.jpg"
          />
          <div className="hero__float-card">
            <p className="hero__float-title">Artisan Rose Blush</p>
            <p className="hero__float-price">{formatRs(6299)}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
