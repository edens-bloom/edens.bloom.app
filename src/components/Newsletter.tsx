import React, { useState } from 'react';
import './Newsletter.scss';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter">
      {subscribed ? (
        <div className="subscribed-msg">
          <h2>Thank you for <em>subscribing!</em></h2>
          <p>Check your inbox for your 15% discount code.</p>
        </div>
      ) : (
        <>
          <h2>Get 15% off your<br /><em>first order</em></h2>
          <p>Join our community for seasonal inspiration, exclusive offers & floral tips.</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              className="newsletter-input" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </>
      )}
    </section>
  );
};

export default Newsletter;
