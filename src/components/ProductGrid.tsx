import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Heart, Loader2 } from 'lucide-react';
import heroImg from '../assets/images/hero.png';
import './ProductGrid.scss';

const ProductGrid: React.FC = () => {
  const { 
    products, 
    fetchProducts, 
    isLoading, 
    error, 
    addToCart, 
    toggleWishlist, 
    wishlist 
  } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <div className="products-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading our beautiful collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <p>Oops! {error}</p>
        <button onClick={() => fetchProducts()}>Try Again</button>
      </div>
    );
  }

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
                  {product.oldPrice && <s>${Number(product.oldPrice).toFixed(2)}</s>} ${Number(product.price).toFixed(2)}
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
