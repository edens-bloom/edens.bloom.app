import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <>
      <section className="footer-cta" id="bespoke-creations">
        <div className="footer-cta__inner">
          <div className="footer-cta__copy">
            <span className="footer-cta__eyebrow">Bespoke Creations</span>
            <h2 className="footer-cta__title">
              Bring Your Vision to <em className="footer-cta__title-accent">Bloom</em>
            </h2>
            <p className="footer-cta__text">
              Have a specific bouquet in mind? Send us your inspiration, and our master makers will twist it into reality.
            </p>
            <div className="footer-cta__highlight">
              <span className="material-symbols-outlined">auto_awesome</span>
              <p>Unique pieces crafted just for you</p>
            </div>
          </div>
          <div className="footer-cta__form-wrap ambient-shadow">
            <form className="footer-form">
              <div className="footer-form__row">
                <div className="footer-form__field">
                  <label className="footer-form__label" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="footer-form__input"
                    id="name"
                    placeholder="Alex Rivers"
                    required
                    type="text"
                  />
                </div>
                <div className="footer-form__field">
                  <label className="footer-form__label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="footer-form__input"
                    id="email"
                    placeholder="alex@example.com"
                    required
                    type="email"
                  />
                </div>
              </div>
              <div className="footer-form__field">
                <label className="footer-form__label" htmlFor="description">
                  Design Description
                </label>
                <textarea
                  className="footer-form__textarea"
                  id="description"
                  placeholder="Tell us about the colors, shapes, or occasion..."
                  rows={4}
                />
              </div>
              <div className="footer-form__field">
                <span className="footer-form__label">Upload Inspiration Image</span>
                <label className="footer-form__upload">
                  <div className="footer-form__upload-inner">
                    <span className="material-symbols-outlined">cloud_upload</span>
                    <p className="footer-form__upload-hint">Click to upload or drag and drop</p>
                    <p className="footer-form__upload-meta">PNG, JPG or PDF (max. 5MB)</p>
                  </div>
                  <input className="footer-form__file" type="file" />
                </label>
              </div>
              <button className="footer-form__submit ambient-shadow ambient-shadow-hover press-effect" type="submit">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__brand-block">
          <div className="site-footer__brand">Edens Bloom</div>
          <p className="site-footer__desc">
            Handcrafted bouquets and artisan floral décor, sourced from sustainable farms and delivered with love. Everlasting handcrafted artistry for your home.
          </p>
          <div className="site-footer__social">
            <a className="site-footer__social-link" href="#">
              ig
            </a>
            <a className="site-footer__social-link" href="#">
              pt
            </a>
            <a className="site-footer__social-link" href="#">
              fb
            </a>
          </div>
        </div>
        <div className="site-footer__nav">
          <div>
            <h4 className="site-footer__col-title">Shop</h4>
            <ul className="site-footer__links">
              <li>
                <Link to="/">Fresh Bouquets</Link>
              </li>
              <li>
                <Link to="/">Seasonal</Link>
              </li>
              <li>
                <Link to="/">Home Décor</Link>
              </li>
              <li>
                <Link to="/">DIY Kits</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="site-footer__col-title">Help</h4>
            <ul className="site-footer__links">
              <li>
                <Link to="/">Delivery Info</Link>
              </li>
              <li>
                <Link to="/">Care Guide</Link>
              </li>
              <li>
                <Link to="/">Returns</Link>
              </li>
              <li>
                <Link to="/">FAQs</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="site-footer__col-title">Company</h4>
            <ul className="site-footer__links">
              <li>
                <Link to="/">About Us</Link>
              </li>
              <li>
                <Link to="/">Sustainability</Link>
              </li>
              <li>
                <Link to="/">Terms</Link>
              </li>
              <li>
                <Link to="/">Privacy</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="site-footer__bar">
        <span>© 2026 Edens Bloom. Everlasting Handcrafted Artistry.</span>
        <span>Designed with ♡ for Makers</span>
      </div>
    </>
  );
};

export default Footer;
