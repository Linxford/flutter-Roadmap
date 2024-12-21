import React from 'react';
import { useModal } from '../../context/ModalContext';
import '../../styles/components/modals/Modal.css';
import '../../styles/components/modals/WelcomeModal.css';
import { Modal } from './Modal';

export default function WelcomeModal() {
  const { activeModal, hideModal } = useModal();

  if (activeModal !== 'welcome') return null;

  return (
    <Modal onClose={hideModal}>
      <div className="modal-content">
        <h2>
          <img
            src="https://img.icons8.com/fluency/48/hand.png"
            width="24"
            alt="welcome"
          />
          Welcome to FlutterPeak!
        </h2>
        <p>Here's how to use this interactive learning tracker:</p>
        <ul className="welcome-features">
          <li>
            <img
              src="https://img.icons8.com/fluency/48/folder-tree.png"
              width="20"
              alt="browse"
            />
            Browse through curated Flutter learning resources
          </li>
          <li>
            <img
              src="https://img.icons8.com/fluency/48/filter.png"
              width="20"
              alt="filter"
            />
            Filter resources by type and search for specific topics
          </li>
          <li>
            <img
              src="https://img.icons8.com/fluency/48/checked-checkbox.png"
              width="20"
              alt="complete"
            />
            Mark resources as completed to track your progress
          </li>
          <li>
            <img
              src="https://img.icons8.com/fluency/48/save.png"
              width="20"
              alt="save"
            />
            Your progress is automatically saved
          </li>
        </ul>

        <div className="community-section">
          <h3>
            <img
              src="https://img.icons8.com/fluency/48/conference-call.png"
              width="24"
              alt="community"
            />
            Join Our Community
          </h3>
          <p>Connect with fellow Flutter developers and stay updated!</p>
          <div className="social-links">
            <SocialButton
              href="https://discord.gg/FlutterPeak"
              icon="discord"
              text="Join Discord"
              className="discord"
            />
            <SocialButton
              href="https://t.me/FlutterPeak"
              icon="telegram-app"
              text="Join Telegram"
              className="telegram"
            />
            <SocialButton
              href="https://whatsapp.com/channel/0029Vb0TGBKL2ATxfJdA2R41"
              icon="whatsapp"
              text="Join Channel"
              className="whatsapp"
            />
            <SocialButton
              href="https://twitter.com/FlutterPeak"
              icon="twitter"
              text="Follow Updates"
              className="twitter"
            />
          </div>
        </div>

        <button className="modal-btn" onClick={hideModal}>
          Get Started!
        </button>
      </div>
    </Modal>
  );
}

function SocialButton({ href, icon, text, className }) {
  return (
    <a
      href={href}
      title={text}
      target="_blank"
      rel="noopener noreferrer"
      className={`social-btn ${className}`}
    >
      <img
        src={`https://img.icons8.com/fluency/48/${icon}.png`}
        width="24"
        alt={icon}
      />
      {text}
    </a>
  );
}
