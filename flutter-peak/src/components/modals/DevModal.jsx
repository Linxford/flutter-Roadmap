import React from 'react';
import { useModal } from '../../context/ModalContext';
import { Modal } from './Modal';
import '../../styles/components/modals/Modal.css';
import '../../styles/components/modals/DevModal.css';

export default function DevModal() {
  const { activeModal, hideModal, showModal } = useModal();

  if (activeModal !== 'dev') return null;

  return (
    <Modal onClose={hideModal}>
      <div className="modal-content">
        <h2>
          <img
            src="https://img.icons8.com/fluency/48/code.png"
            width="24"
            alt="developer"
          />
          About the Developer
        </h2>
        <div className="dev-info">
          <img
            src="/assets/linxford.png"
            alt="Linxford Kwabena"
            className="dev-avatar"
          />
          <h3>Linxford Kwabena</h3>
          <p className="dev-title">Flutter Developer & Educator</p>
          <p className="dev-bio">
            Passionate about Flutter development and helping others learn. With
            over 5 years of experience in mobile development, I create tools and
            resources to make learning Flutter easier and more enjoyable.
          </p>
          <div className="dev-social">
            <SocialLink
              href="https://github.com/linxford"
              icon="github"
              text="GitHub"
            />
            <SocialLink
              href="https://linkedin.com/in/linxford"
              icon="linkedin"
              text="LinkedIn"
            />
            <SocialLink
              href="https://twitter.com/linxford"
              icon="twitter"
              text="Twitter"
            />
            <button
              className="social-link"
              onClick={() => {
                hideModal();
                showModal('support');
              }}
            >
              <img
                src="https://img.icons8.com/fluency/48/donate.png"
                width="24"
                alt="donate"
              />
              Support
            </button>
          </div>
        </div>
        <button className="modal-btn" onClick={hideModal}>Close</button>
      </div>
    </Modal>
  );
}

function SocialLink({ href, icon, text }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
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
