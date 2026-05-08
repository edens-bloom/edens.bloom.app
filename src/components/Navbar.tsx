import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const { getCartCount, wishlist, user, logout } = useStore();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Bloom<span>&</span>Co
      </Link>
      <ul className="nav-links">
        <li><Link to="/">Shop</Link></li>
        <li><Link to="/">Occasions</Link></li>
        {user?.role === 'admin' && <li><Link to="/product" style={{ color: '#c53030', fontWeight: '600' }}>Manage</Link></li>}
        <li><Link to="/">About</Link></li>
      </ul>
      <div className="nav-icons">
        <button aria-label="Search">
          <Search size={18} />
        </button>
        <button aria-label="Wishlist" className="wishlist-btn">
          <Heart size={18} fill={wishlist.length > 0 ? 'currentColor' : 'none'} />
          {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
        </button>
        <Link to="/cart" className="cart-btn" aria-label="Cart">
          <ShoppingBag size={18} />
          <span className="cart-text">Cart ({getCartCount()})</span>
        </Link>
        
        {user ? (
          <div className="user-menu">
            <span className="username">{user.username}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-btn" title="Admin Login">
            <User size={18} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
