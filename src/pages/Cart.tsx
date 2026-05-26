import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { useStore } from "../store/useStore";
import { formatRs } from "../utils/formatRs";
import "./Cart.scss";
import { OrderConfirmation } from "../components";
import type { SelectedProduct } from "../models/types";

interface UserInfo {
  name: string;
  phone: string;
  address: string;
}

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, updateCart } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckout = () => setIsModalOpen(true);

  const handleConfirmOrder = (userInfo: UserInfo) => {
    console.log("Order confirmed with user info:", userInfo);
    // TODO: Send order to backend with userInfo
    clearCart();
    setIsModalOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Cart";
  }, []);

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={64} />
        <h2>Your cart is empty</h2>
        <p>Looks like you have not added any handcrafted blooms yet.</p>
        <Link to="/" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const getLabelAndPrice = (item: SelectedProduct) => {
    if (item.selectedAddOnId) {
      const addOn = item.addOns?.find((a) => a.id === item.selectedAddOnId);
      return `${addOn?.label || "Default"} (${formatRs(addOn?.price || 0)})`;
    }
    return ` (${formatRs(item.price)})`;
  };

  const selectedPrice = (item: SelectedProduct) => {
    if (item.selectedAddOnId) {
      const addOn = item.addOns?.find((a) => a.id === item.selectedAddOnId);
      return addOn?.price || item.price;
    }
    return item.price;
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-main">
          <div className="cart-heading">
            <h1>
              Shopping Cart{" "}
              <span>
                ({cart.length} {cart.length > 1 ? "items" : "item"})
              </span>
            </h1>
          </div>

          <div className="cart-grid">
            <section className="cart-items">
              {cart.map((item) => {
                return (
                  <article key={item.id} className="cart-item">
                    <div className="item-image-carousel">
                      <img
                        src={item.selectedImageUrl}
                        alt={item.name}
                        className="carousel-image fade-in"
                        key={`${item.id}-${item.selectedAddOnId}`}
                      />
                    </div>

                    <div className="item-content">
                      <div className="item-top">
                        <div>
                          <h3>{item.name}</h3>
                          <p className="item-category">{item.category}</p>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>

                      <div className="packaging-selector">
                        {item.selectedAddOnId && (
                          <p className="selector-label">Package Options</p>
                        )}
                        <div className="radio-group">
                          <label className="radio-item active">
                            <input
                              type="radio"
                              name={`tier-${item.id}`}
                              value="tier1"
                              checked
                              disabled
                              // onChange={() =>
                              //   setSelectedTierByItem((prev) => ({
                              //     ...prev,
                              //     [item.id]: "tier1",
                              //   }))
                              // }
                            />
                            <span>{getLabelAndPrice(item)}</span>
                          </label>
                        </div>
                      </div>

                      <div className="item-footer">
                        <div className="item-quantity">
                          <button
                            onClick={() =>
                              updateCart({
                                ...item,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCart({
                                ...item,
                                quantity: Math.min(10, item.quantity + 1),
                              })
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="item-price">
                          <p>
                            {item.name}: {item.quantity} x{" "}
                            {formatRs(selectedPrice(item))}
                            {/* {formatRs(
                              item.subTotal || item.price * item.quantity,
                            )} */}
                          </p>
                          <p className="item-total-row">
                            <span>Item Total:</span>{" "}
                            <strong>{formatRs(item.subTotal ?? 0)}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="cart-summary">
              <div className="summary-card">
                <h2>Order Summary</h2>
                {/* <div className="summary-row">
                  <span>Subtotal</span>
                  <span>
                    {formatRs(
                      cart.reduce(
                        (total, item) => total + (item.subTotal ?? 0),
                        0,
                      ),
                    )}
                  </span>
                </div> */}
                {/* <div className="summary-row">
                  <span>Shipping</span>
                  <span>{cart.length === 0 ? "FREE" : formatRs(200)}</span>
                </div> */}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>
                    {formatRs(
                      cart.reduce(
                        (total, item) => total + (item.subTotal ?? 0),
                        0,
                      ),
                    )}
                  </span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                {/* <p className="shipping-note">
                  {cart.length === 0
                    ? "Shipping will be calculated at checkout."
                    : `Shipping calculated at checkout. Free shipping over ${formatRs(15000)}.`}
                </p> */}

                <div className="sustainability-note">
                  <span className="material-symbols-outlined">eco</span>
                  <p>
                    Your handcrafted stems support sustainable artistry and
                    reduction of floral waste.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <OrderConfirmation
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmOrder}
          total={300}
        />
      )}
    </div>
  );
};

export default Cart;
