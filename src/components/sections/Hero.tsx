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
          Everlasting artistry in{" "}
          <span className="hero__title-accent">every twist</span>
        </h1>
        <p className="hero__lead">
          Handcrafted pipe cleaner bouquets and artisan décor, reimagined for
          the modern maker. Vibrant, flexible, and forever in bloom.
        </p>
        <div className="hero__actions">
          <a
            href="#occasions"
            className="btn-primary-solid ambient-shadow ambient-shadow-hover press-effect"
          >
            Shop Now
          </a>
          <a href="#occasions" className="btn-outline-round press-effect">
            Browse Occasions
          </a>
        </div>
        <div className="hero__stats">
          <div>
            <div className="hero__stat-value">50+</div>
            <div className="hero__stat-label">Vibrant Hues</div>
          </div>
          <div>
            <div className="hero__stat-value">4.9★</div>
            <div className="hero__stat-label">Maker Rating</div>
          </div>
          <div>
            <div className="hero__stat-value">Next</div>
            <div className="hero__stat-label">Day Shipping</div>
          </div>
        </div>
      </div>
      <div className="hero__visual">
        <div className="hero__glow" aria-hidden />
        <div className="hero__frame ambient-shadow felt-texture">
          <img
            alt="Handcrafted Pipe Cleaner Bouquet"
            className="hero__img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP0mvFTbVi6Upy8OAYpCFacAG3zuu6ZcldgydnB7A-jkeZ5Z1uU_wMGbElPyhP4NvXX9zXTMcIeRSI-apSvSdzJ1TtBypQ7S4vJBBWnRLVopWhcZlWB4rvJDH7Q-Kr7P8kpRMFLlTj00K3dBfRVSQmBjblE_1h6qDFYd73ty6iQHayqfgt0MH2wPx9LiuHAS70TWSHUgVNE7TEDuOcqEhX1GQH7QZ-15GWhxzRdwx4L8YcCd9_4kk2QKdgv_eleYGTzN1JLu1z5Bk"
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
