import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import OrderConfirmation from '../components/OrderConfirmation';
import './Cart.scss';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [packaging, setPackaging] = useState<Record<number, 'plastic' | 'paper' | 'none'>>({});

  const getPackagingPrice = (type: string) => {
    switch (type) {
      case 'plastic': return 1.50; // $1.50
      case 'paper': return 0.75;   // $0.75
      default: return 0;
    }
  };

  const subtotal = cart.reduce((total, item) => {
    const pkgPrice = getPackagingPrice(packaging[item.id] || 'none');
    return total + (Number(item.price) * item.quantity) + pkgPrice;
  }, 0);

  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleConfirmOrder = () => {
    clearCart();
    setIsModalOpen(false);
  };

  const getPackagingImage = (item: any, type: string) => {
    switch (type) {
      case 'plastic':
        return 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=400';
      case 'paper':
        return 'https://images.unsplash.com/photo-1544816153-12ad58fd3f5a?auto=format&fit=crop&q=80&w=400';
      default:
        return item.image;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={64} />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any bouquets yet.</p>
        <Link to="/" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-main">
          <h1>Shopping Cart ({cart.length})</h1>
          <div className="cart-items">
            {cart.map((item) => {
              const selectedType = packaging[item.id] || 'none';
              return (
                <div key={item.id} className="cart-item">
                  <div className="item-image-carousel">
                    <img 
                      src={getPackagingImage(item, selectedType)} 
                      alt={item.name} 
                      className="carousel-image fade-in"
                      key={`${item.id}-${selectedType}`}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      
                      <div className="packaging-selector">
                        <p className="selector-label">Packaging Options:</p>
                        <div className="radio-group">
                          <label className={`radio-item ${selectedType === 'plastic' ? 'active' : ''}`}>
                            <input 
                              type="radio" 
                              name={`packaging-${item.id}`} 
                              value="plastic"
                              checked={selectedType === 'plastic'}
                              onChange={() => setPackaging(prev => ({ ...prev, [item.id]: 'plastic' }))}
                            />
                            <span>Plastic Bag (+$1.50)</span>
                          </label>
                          <label className={`radio-item ${selectedType === 'paper' ? 'active' : ''}`}>
                            <input 
                              type="radio" 
                              name={`packaging-${item.id}`} 
                              value="paper"
                              checked={selectedType === 'paper'}
                              onChange={() => setPackaging(prev => ({ ...prev, [item.id]: 'paper' }))}
                            />
                            <span>Paper Bag (+$0.75)</span>
                          </label>
                          <label className={`radio-item ${selectedType === 'none' ? 'active' : ''}`}>
                            <input 
                              type="radio" 
                              name={`packaging-${item.id}`} 
                              value="none"
                              checked={selectedType === 'none'}
                              onChange={() => setPackaging(prev => ({ ...prev, [item.id]: 'none' }))}
                            />
                            <span>No Bag</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="item-quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="item-price">
                      <div className="price-row">
                        <span className="price-label">Product:</span>
                        <span className="price-value">{item.quantity} × ${Number(item.price).toFixed(2)} = ${(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                      {selectedType !== 'none' && (
                        <div className="price-row packaging-row">
                          <span className="price-label">Packaging Fee:</span>
                          <span className="price-value">+${getPackagingPrice(selectedType).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="price-row item-total-row">
                        <span className="price-label">Item Total:</span>
                        <span className="price-total-value">${((Number(item.price) * item.quantity) + getPackagingPrice(selectedType)).toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="shipping-notice">
                {shipping === 0 ? (
                  <p className="free-shipping">You've unlocked FREE shipping!</p>
                ) : (
                  <p>Add ${(150 - subtotal).toFixed(2)} more for FREE shipping.</p>
                )}
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="secure-checkout">
                <p>Secure SSL Encrypted Checkout</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isModalOpen && (
        <OrderConfirmation 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleConfirmOrder}
          total={total}
        />
      )}
    </div>
  );
};

export default Cart;
