import React, { useState } from "react";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { formatRs } from "../../utils/formatRs";
import "./OrderConfirmation.scss";

interface OrderConfirmationProps {
  onClose: () => void;
  onConfirm: (userInfo: UserInfo) => void;
  total: number;
}

interface UserInfo {
  name: string;
  phone: string;
  address: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  onClose,
  onConfirm,
  total,
}) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.phone && userInfo.address) {
      setIsFormSubmitted(true);
    }
  };

  const isFormValid = userInfo.name && userInfo.phone && userInfo.address;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!isFormSubmitted ? (
          <>
            <div className="modal-header">
              <h2>Confirm Your Information</h2>
              <p>Please provide your details to proceed with the order</p>
            </div>

            <form className="modal-body" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  placeholder="Enter your delivery address"
                  rows={3}
                  required
                />
              </div>

              <div className="order-summary">
                <div className="detail-row">
                  <span>Total Amount</span>
                  <span className="amount">{formatRs(total)}</span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={onClose}
                >
                  <ShoppingBag size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={!isFormValid}
                >
                  Proceed to Order
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="modal-header">
              <div className="success-icon">
                <CheckCircle size={48} strokeWidth={1.5} />
              </div>
              <h2>Thank You for Your Order!</h2>
              <p>Order #BLOOM-{Math.floor(Math.random() * 1000000)}</p>
            </div>

            <div className="modal-body">
              <div className="order-details">
                <div className="detail-row">
                  <span>Status</span>
                  <span className="status-badge">Confirmed</span>
                </div>
                <div className="detail-row">
                  <span>Total Amount</span>
                  <span className="amount">{formatRs(total)}</span>
                </div>
              </div>

              <div className="confirmation-message">
                <p>
                  We've received your order and we're getting it ready for
                  shipment. You'll receive a confirmation email shortly with
                  tracking details.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={onClose}>
                <ShoppingBag size={18} /> View Details
              </button>
              <button
                className="primary-btn"
                onClick={() => onConfirm(userInfo)}
              >
                <Home size={18} /> Return to Shop
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
