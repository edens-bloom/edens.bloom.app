import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="#" className="nav-logo">Bloom<span>&</span>Co</a>
          <p>Handcrafted bouquets and artisan floral décor, sourced from sustainable farms and delivered with love.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="#">Fresh Bouquets</a></li>
            <li><a href="#">Seasonal</a></li>
            <li><a href="#">Home Décor</a></li>
            <li><a href="#">Wedding</a></li>
            <li><a href="#">Dried Flowers</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><a href="#">Delivery Info</a></li>
            <li><a href="#">Care Guide</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Our Farms</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Bloom & Co. All rights reserved.</p>
        <div className="footer-social">
          <a href="#" className="social-link" aria-label="Instagram">ig</a>
          <a href="#" className="social-link" aria-label="Pinterest">pt</a>
          <a href="#" className="social-link" aria-label="Facebook">fb</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
