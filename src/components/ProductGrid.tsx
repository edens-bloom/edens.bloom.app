import React from 'react';
import { useStore } from '../store/useStore';
import { Heart } from 'lucide-react';
import heroImg from '../assets/images/hero.png';
import './ProductGrid.scss';

const products = [
  {
    id: 1,
    name: 'Garden Rose Bliss',
    price: 58,
    oldPrice: 72,
    category: 'Roses',
    image: heroImg,
    badge: 'Sale',
    rating: 5,
    reviews: 142,
    description: '12 premium garden roses in blush & cream with eucalyptus sprigs.',
    icon: '🌹'
  },
  {
    id: 2,
    name: 'Spring Meadow Mix',
    price: 48,
    category: 'Mixed',
    image: heroImg,
    badge: 'New',
    rating: 5,
    reviews: 89,
    description: 'A joyful mix of tulips, ranunculus & wildflowers in pastel tones.',
    icon: '💐'
  },
  {
    id: 3,
    name: 'Peony Paradise',
    price: 76,
    category: 'Seasonal',
    image: heroImg,
    badge: 'Popular',
    rating: 4,
    reviews: 67,
    description: 'Lush pink peonies wrapped in soft kraft paper & satin ribbon.',
    icon: '🌸'
  },
  {
    id: 4,
    name: 'Golden Hour',
    price: 44,
    category: 'Sunflowers',
    image: heroImg,
    rating: 5,
    reviews: 203,
    description: 'Bold sunflowers with lush greenery — sunshine for any room.',
    icon: '🌻'
  },
  {
    id: 5,
    name: 'Dried Pampas Bundle',
    price: 62,
    category: 'Décor',
    image: heroImg,
    badge: 'New',
    rating: 5,
    reviews: 55,
    description: 'Minimalist dried botanicals — forever beautiful, zero maintenance.',
    icon: '💮'
  },
  {
    id: 6,
    name: 'Country Garden',
    price: 38,
    oldPrice: 52,
    category: 'Wildflowers',
    image: heroImg,
    badge: 'Sale',
    rating: 4,
    reviews: 91,
    description: 'Cheerful daisies, chamomile & lavender in a rustic wrap.',
    icon: '🌼'
  }
];

const ProductGrid: React.FC = () => {
  const { addToCart, toggleWishlist, wishlist } = useStore();

  return (
    <section className="section" id="occasions" style={{ background: 'white' }}>
      <div className="section-header">
        <div className="section-eyebrow">Bestsellers</div>
        <h2 className="section-title">Most <em>loved</em> bouquets</h2>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card fade-up visible">
            <div className="product-image" style={{ background: '#f5f5f5' }}>
              <img src={product.image} alt={product.name} />
              <div className="product-icon-overlay">{product.icon}</div>
              {product.badge && <div className={`product-badge ${product.badge.toLowerCase()}`}>{product.badge}</div>}
              <button 
                className={`product-wishlist ${wishlist.includes(product.id) ? 'active' : ''}`} 
                onClick={() => toggleWishlist(product.id)}
                title="Add to wishlist"
              >
                <Heart size={16} fill={wishlist.includes(product.id) ? 'white' : 'none'} />
              </button>
            </div>
            <div className="product-body">
              <div className="product-category">{product.category}</div>
              <div className="product-stars">
                {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
                <span>({product.reviews})</span>
              </div>
              <div className="product-name">{product.name}</div>
              <div className="product-desc">{product.description}</div>
              <div className="product-footer">
                <div className="product-price">
                  {product.oldPrice && <s>${product.oldPrice}</s>} ${product.price}
                </div>
                <button 
                  className="add-to-cart" 
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const originalText = btn.textContent;
                    btn.textContent = 'Added ✓';
                    btn.classList.add('added');
                    addToCart(product);
                    setTimeout(() => {
                      btn.textContent = originalText;
                      btn.classList.remove('added');
                    }, 1500);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <a href="#" className="btn-outline">View All Products</a>
      </div>
    </section>
  );
};

export default ProductGrid;
