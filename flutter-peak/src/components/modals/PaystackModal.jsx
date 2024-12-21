import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { Modal } from './Modal';
import '../../styles/components/modals/Modal.css';
import '../../styles/components/modals/PaystackModal.css';

export default function PaystackModal() {
  const { activeModal, hideModal } = useModal();
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: ''
  });

  useEffect(() => {
    // Check if Paystack is already loaded
    if (window.PaystackPop) {
      setIsPaystackLoaded(true);
      return;
    }

    // Load Paystack script if not already loaded
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setIsPaystackLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup script if modal is unmounted during loading
      if (!window.PaystackPop) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (activeModal !== 'paystack') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPaystackLoaded) {
      alert('Payment system is still loading. Please try again in a moment.');
      return;
    }

    try {
      const handler = window.PaystackPop.setup({
        key: 'pk_live_fb79c505bc33c72dd606410314e10d954cadee64',
        email: formData.email,
        amount: parseFloat(formData.amount) * 100,
        currency: 'GHS',
        ref: 'flutter_' + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
          name: formData.name,
          phone: formData.phone
        },
        callback: (response) => {
          hideModal();
          alert('Thanks for your support! Transaction reference: ' + response.reference);
        },
        onClose: () => {
          console.log('Payment window closed');
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Unable to initialize payment. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <Modal onClose={hideModal}>
      <div className="modal-content">
        <h2>🎯 Support This Project</h2>
        <p>Your support helps keep this resource free and updated!</p>

        <form id="paystack-form" className="payment-form" onSubmit={handleSubmit}>
          <FormField
            id="name"
            label="Name"
            type="text"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <FormField
            id="phone"
            label="Phone (Optional)"
            type="tel"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <FormField
            id="amount"
            label="Amount (GHS)"
            type="number"
            placeholder="Enter amount"
            required
            min="1"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
          />

          <div className="button-group">
            <button type="submit" className="modal-btn">
              Proceed to Payment
            </button>
            <button
              type="button"
              className="modal-btn cancel"
              onClick={hideModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function FormField({ id, label, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  );
}
