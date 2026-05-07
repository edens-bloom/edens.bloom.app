import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import OrderConfirmation from '../components/OrderConfirmation';
import './Cart.scss';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleConfirmOrder = () => {
    clearCart();
    setIsModalOpen(false);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={64} strokeWidth={1} />
        <h2>Your cart is empty</h2>
        <p>It looks like you haven't added anything to your cart yet.</p>
        <a href="/" className="btn btn-primary">Start Shopping</a>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <header className="cart-header">
          <h1>Shopping Bag</h1>
          <span>({cart.length} items)</span>
        </header>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category}</p>
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
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
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
