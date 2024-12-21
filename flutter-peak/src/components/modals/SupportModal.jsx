import React from 'react';
import { useModal } from '../../context/ModalContext';
import { Modal } from './Modal';
import '../../styles/components/modals/Modal.css';
import '../../styles/components/modals/SupportModal.css';

export default function SupportModal() {
  const { activeModal, hideModal, showModal } = useModal();

  if (activeModal !== 'support') return null;

  const handlePaystackClick = () => {
    hideModal();
    showModal('paystack');
  };

  return (
    <Modal onClose={hideModal}>
      <div className="modal-content support-content">
        <h2>
          <img
            src="https://img.icons8.com/color/48/coffee.png"
            width="24"
            alt="support"
          />
          Support the Project
        </h2>
        <p>
          If you find this resource helpful, consider supporting its
          development!
        </p>

        <div className="support-options">
          <SupportOption
            title="GitHub Sponsors"
            description="Support through GitHub Sponsors"
            icon="github"
            buttonText="Sponsor on GitHub"
            buttonClass="github-btn"
            href="https://github.com/sponsors/linxford"
          />

          <SupportOption
            title="Mobile Money / Card"
            description="Support any amount via Paystack"
            icon="card-in-use"
            buttonText="Donate via Paystack"
            buttonClass="paystack-btn"
            onClick={handlePaystackClick}
          />

          <SupportOption
            title="Need Help?"
            description="Chat with me directly on WhatsApp"
            icon="whatsapp--v1"
            buttonText="WhatsApp Chat"
            buttonClass="whatsapp-btn"
            href="https://wa.me/message/TFNN3Q6QRNYKJ1"
          />
        </div>

        <button className="modal-btn" onClick={hideModal}>
          Maybe Later
        </button>
      </div>
    </Modal>
  );
}

function SupportOption({ title, description, icon, buttonText, buttonClass, href, onClick }) {
  const ButtonContent = () => (
    <>
      <img
        src={`https://img.icons8.com/color/48/${icon}.png`}
        width="20"
        alt={icon}
      />
      {buttonText}
    </>
  );

  return (
    <div className="support-option">
      <h3>
        <img
          src={`https://img.icons8.com/color/48/${icon}.png`}
          width="24"
          alt={icon}
        />
        {title}
      </h3>
      <p>{description}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`support-btn ${buttonClass}`}
        >
          <ButtonContent />
        </a>
      ) : (
        <button
          onClick={onClick}
          className={`support-btn ${buttonClass}`}
        >
          <ButtonContent />
        </button>
      )}
    </div>
  );
}
