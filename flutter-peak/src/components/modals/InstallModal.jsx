import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { Modal } from './Modal';
import '../../styles/components/modals/Modal.css';
import '../../styles/components/modals/InstallModal.css';

const osData = {
  windows: {
    title: '🪟 Windows Installation',
    icon: 'windows-10',
    steps: [
      {
        title: '📥 Download Flutter SDK',
        description: 'Get the latest Flutter SDK from the official website',
        code: 'C:\\src\\flutter',
        link: 'https://docs.flutter.dev/get-started/install/windows/desktop?tab=download'
      },
      {
        title: '🔄 Update Path',
        description: 'Add Flutter to your PATH environment variable',
        code: 'setx PATH "%PATH%;C:\\src\\flutter\\bin"'
      },
      {
        title: '⚡ Run flutter doctor',
        code: 'flutter doctor'
      }
    ]
  },
  mac: {
    title: '🍎 macOS Installation',
    icon: 'mac-os',
    steps: [
      {
        title: '📥 Install with Homebrew',
        code: 'brew install --cask flutter'
      },
      {
        title: '⚡ Verify Installation',
        code: 'flutter doctor'
      }
    ]
  },
  arch: {
    title: '🐧 Arch Linux Installation',
    iconUrl: 'https://img.icons8.com/color/48/arch-linux.png',
    steps: [
      {
        title: '📥 Install from AUR',
        description: 'Using your preferred AUR helper (e.g., yay)',
        code: 'yay -S flutter'
      },
      {
        title: '🔄 Add to PATH',
        code: 'export PATH="$PATH:/opt/flutter/bin"'
      },
      {
        title: '⚡ Verify Installation',
        code: 'flutter doctor'
      }
    ]
  },
  ubuntu: {
    title: '🐧 Ubuntu Installation',
    icon: 'ubuntu--v1',
    steps: [
      {
        title: '📥 Install using Snap',
        code: 'sudo snap install flutter --classic'
      },
      {
        title: '⚡ Verify Installation',
        code: 'flutter doctor'
      }
    ]
  },
  fedora: {
    title: '🐧 Fedora Installation',
    icon: 'fedora',
    steps: [
      {
        title: '📥 Download Flutter SDK',
        code: 'sudo dnf install flutter'
      },
      {
        title: '🔄 Add to PATH',
        code: 'export PATH="$PATH:$HOME/flutter/bin"'
      },
      {
        title: '⚡ Verify Installation',
        code: 'flutter doctor'
      }
    ]
  }
};

export default function InstallModal() {
  const { activeModal, hideModal } = useModal();
  const [activeOS, setActiveOS] = useState('windows');

  if (activeModal !== 'install') return null;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    // Optional: Add a toast notification here
  };

  return (
    <Modal onClose={hideModal}>
      <div className="modal-content install-guide">
        <h2>
          <img
            src="https://img.icons8.com/fluency/48/maintenance.png"
            width="24"
            alt="install"
          />
          Flutter Installation Guide
        </h2>

        <div className="os-tabs">
          {Object.entries(osData).map(([os, data]) => (
            <button
              key={os}
              className={`os-tab ${activeOS === os ? 'active' : ''}`}
              onClick={() => setActiveOS(os)}
            >
              <img
                src={data.iconUrl || `https://img.icons8.com/fluency/48/${data.icon}.png`}
                onError={(e) => {
                  e.target.onerror = null;
                  if (!data.iconUrl) {
                    e.target.src = `https://img.icons8.com/color/48/${data.icon}.png`;
                  }
                }}
                width="24"
                alt={os}
              />
              {os.charAt(0).toUpperCase() + os.slice(1)}
            </button>
          ))}
        </div>

        <div className="installation-steps">
          <h3>{osData[activeOS].title}</h3>
          <ol>
            {osData[activeOS].steps.map((step, index) => (
              <li key={index}>
                <span className="step-title">{step.title}</span>
                {step.description && (
                  <p>
                    {step.description}
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="install-link"
                      >
                        Download here →
                      </a>
                    )}
                  </p>
                )}
                {step.code && (
                  <div className="code-block">
                    <code>{step.code}</code>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopyCode(step.code)}
                      title="Copy to clipboard"
                    >
                      <img
                        src="https://img.icons8.com/fluency/48/copy.png"
                        width="16"
                        alt="copy"
                      />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <button className="modal-btn" onClick={hideModal}>
          Close
        </button>
      </div>
    </Modal>
  );
}
