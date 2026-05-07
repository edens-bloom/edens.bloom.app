import React from 'react';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import './OrderConfirmation.scss';

interface OrderConfirmationProps {
  onClose: () => void;
  onConfirm: () => void;
  total: number;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onClose, onConfirm, total }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
              <span className="amount">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="confirmation-message">
            <p>We've received your order and we're getting it ready for shipment. You'll receive a confirmation email shortly with tracking details.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>
            <ShoppingBag size={18} /> View Details
          </button>
          <button className="primary-btn" onClick={onConfirm}>
            <Home size={18} /> Return to Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
