import React from 'react';
import { useModal } from '../../context/ModalContext';
import '../../styles/components/Footer.css';

export default function Footer() {
  const { showModal } = useModal();
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <img
                src="/assets/fpeak.png"
                width="24"
                alt="flutter"
              />
              FlutterPeak
            </h3>
            <p>
              Your interactive guide to mastering Flutter development. Track
              your progress and learn at your own pace.
            </p>
            <div className="footer-social">
              <SocialIcon href="https://github.com/linxford" icon="github" />
              <SocialIcon href="https://linkedin.com/in/linxford" icon="linkedin" />
              <SocialIcon href="https://twitter.com/linxford" icon="twitter" />
            </div>
          </div>

          <div className="footer-section">
            <h3>
              <img
                src="https://img.icons8.com/fluency/48/conference-call.png"
                width="24"
                alt="community"
              />
              Community
            </h3>
            <FooterLink
              href="https://discord.gg/FlutterPeak"
              icon="discord"
              text="Discord Server"
            />
            <FooterLink
              href="https://t.me/FlutterPeak"
              icon="telegram-app"
              text="Telegram Group"
            />
            <FooterLink
              href="https://whatsapp.com/channel/0029Vb0TGBKL2ATxfJdA2R41"
              icon="whatsapp"
              text="WhatsApp Channel"
            />
            <FooterLink
              href="https://twitter.com/FlutterPeak"
              icon="twitter"
              text="Twitter Updates"
            />
          </div>

          <div className="footer-section">
            <h3>
              <img
                src="https://img.icons8.com/fluency/48/link.png"
                width="24"
                alt="link"
              />
              Quick Links
            </h3>
            <FooterLink
              href="https://flutter.dev"
              icon="flutter"
              text="Flutter Official"
            />
            <FooterLink
              href="https://dart.dev"
              icon="dart"
              text="Dart Documentation"
            />
            <button
              className="footer-button"
              onClick={() => showModal('welcome')}
            >
              <img
                src="https://img.icons8.com/fluency/48/info.png"
                width="24"
                alt="info"
              />
              How It Works
            </button>
            <button
              className="footer-button"
              onClick={() => showModal('dev')}
            >
              <img
                src="https://img.icons8.com/fluency/48/code.png"
                width="24"
                alt="user"
              />
              About Developer
            </button>
            <button
              className="footer-button"
              onClick={() => showModal('feedback')}
            >
              <img
                src="https://img.icons8.com/fluency/48/comments.png"
                width="24"
                alt="feedback"
              />
              Give Feedback
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {currentYear} FlutterPeak • Built with 🩵 by Linxford Kwabena
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <img
        src={`https://img.icons8.com/color/48/${icon}.png`}
        width="24"
        alt={icon}
      />
    </a>
  );
}

function FooterLink({ href, icon, text }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <img
        src={`https://img.icons8.com/color/48/${icon}.png`}
        width="24"
        alt={icon}
      />
      {text}
    </a>
  );
}
