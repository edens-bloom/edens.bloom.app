import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Navbar: React.FC = () => {
  const { getCartCount, user, logout } = useStore();

  return (
    <nav className="site-nav">
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">
          Edens Bloom
        </Link>
        <div className="site-nav__links">
          <Link to="/" className="site-nav__link site-nav__link--active">
            Shop
          </Link>
          <Link to="/#occasions" className="site-nav__link">
            Occasions
          </Link>
          <Link to="/" className="site-nav__link">
            About
          </Link>
          {user?.role === 'admin' && (
            <Link to="/product" className="site-nav__link site-nav__link--danger">
              Manage
            </Link>
          )}
        </div>
        <div className="site-nav__actions">
          <button type="button" className="site-nav__icon-btn site-nav__icon-btn--search material-symbols-outlined press-effect" aria-label="Search">
            search
          </button>

          <Link to="/cart" className="site-nav__cart press-effect" aria-label="Cart">
            <span className="material-symbols-outlined">shopping_cart</span>
            {getCartCount() > 0 && (
              <span className="site-nav__cart-badge">{getCartCount()}</span>
            )}
          </Link>

          {user ? (
            <div className="site-nav__user">
              <span className="site-nav__username">{user.username}</span>
              <button type="button" onClick={logout} className="site-nav__logout">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="site-nav__icon-btn material-symbols-outlined press-effect" title="Admin Login">
              person
            </Link>
          )}
          <button type="button" className="site-nav__icon-btn site-nav__icon-btn--menu material-symbols-outlined" aria-label="Open menu">
            menu
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
