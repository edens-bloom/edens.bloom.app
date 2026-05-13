import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { useStore } from "../store/useStore";
import type { Product } from "../models/types";
import { formatRs } from "../utils/formatRs";
import "./Cart.scss";
import { OrderConfirmation } from "../components";

type TierKey = "tier1" | "tier2" | "tier3";

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTierByItem, setSelectedTierByItem] = useState<
    Record<number, TierKey>
  >({});

  const getTierData = (item: Product, tier: TierKey) => {
    const tierData = item.packages?.[tier];
    const fallbackLabels: Record<TierKey, string> = {
      tier1: "Basic",
      tier2: "Standard",
      tier3: "Premium",
    };

    const titleValue = tierData?.label;
    const priceValue = tierData?.price;
    const imageValue = tierData?.image;

    return {
      title:
        typeof titleValue === "string" && titleValue.trim()
          ? titleValue
          : `${item.name} ${fallbackLabels[tier]}`,
      label: fallbackLabels[tier],
      price: Number(priceValue ?? item.price),
      imageUrl: typeof imageValue === "string" ? imageValue : item.image,
    };
  };

  const subtotal = cart.reduce((total, item) => {
    const selectedTier = selectedTierByItem[item.id] || "tier1";
    const selectedTierPrice = getTierData(item, selectedTier).price;
    return total + selectedTierPrice * item.quantity;
  }, 0);

  const shipping = subtotal > 15000 ? 0 : 300;
  const total = subtotal + shipping;

  const handleCheckout = () => setIsModalOpen(true);

  const handleConfirmOrder = () => {
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
                const selectedTier = selectedTierByItem[item.id] || "tier1";
                const selectedTierData = getTierData(item, selectedTier);
                const tier1 = getTierData(item, "tier1");
                const tier2 = getTierData(item, "tier2");
                const tier3 = getTierData(item, "tier3");
                const itemTotal = selectedTierData.price * item.quantity;

                return (
                  <article key={item.id} className="cart-item">
                    <div className="item-image-carousel">
                      <img
                        src={selectedTierData.imageUrl}
                        alt={item.name}
                        className="carousel-image fade-in"
                        key={`${item.id}-${selectedTier}`}
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
                        <p className="selector-label">Package Options</p>
                        <div className="radio-group">
                          <label
                            className={`radio-item ${selectedTier === "tier1" ? "active" : ""}`}
                          >
                            <input
                              type="radio"
                              name={`tier-${item.id}`}
                              value="tier1"
                              checked={selectedTier === "tier1"}
                              onChange={() =>
                                setSelectedTierByItem((prev) => ({
                                  ...prev,
                                  [item.id]: "tier1",
                                }))
                              }
                            />
                            <span>
                              {tier1.label} ({formatRs(tier1.price)})
                            </span>
                          </label>

                          <label
                            className={`radio-item ${selectedTier === "tier2" ? "active" : ""}`}
                          >
                            <input
                              type="radio"
                              name={`tier-${item.id}`}
                              value="tier2"
                              checked={selectedTier === "tier2"}
                              onChange={() =>
                                setSelectedTierByItem((prev) => ({
                                  ...prev,
                                  [item.id]: "tier2",
                                }))
                              }
                            />
                            <span>
                              {tier2.label} ({formatRs(tier2.price)})
                            </span>
                          </label>

                          <label
                            className={`radio-item ${selectedTier === "tier3" ? "active" : ""}`}
                          >
                            <input
                              type="radio"
                              name={`tier-${item.id}`}
                              value="tier3"
                              checked={selectedTier === "tier3"}
                              onChange={() =>
                                setSelectedTierByItem((prev) => ({
                                  ...prev,
                                  [item.id]: "tier3",
                                }))
                              }
                            />
                            <span>
                              {tier3.label} ({formatRs(tier3.price)})
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="item-footer">
                        <div className="item-quantity">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="item-price">
                          <p>
                            {selectedTierData.title}: {item.quantity} x{" "}
                            {formatRs(selectedTierData.price)} ={" "}
                            {formatRs(itemTotal)}
                          </p>
                          <p className="item-total-row">
                            <span>Item Total:</span>{" "}
                            <strong>{formatRs(itemTotal)}</strong>
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
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatRs(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : formatRs(shipping)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatRs(total)}</span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <p className="shipping-note">
                  {shipping === 0
                    ? "Shipping will be calculated at checkout."
                    : `Shipping calculated at checkout. Free shipping over ${formatRs(15000)}.`}
                </p>

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
          total={total}
        />
      )}
    </div>
  );
};

export default Cart;
