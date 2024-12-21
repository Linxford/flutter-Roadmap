import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import '../../styles/components/SupportNotification.css';

export default function SupportNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const { showModal } = useModal();

  useEffect(() => {
    // Check if user has already supported or explicitly closed
    const hasSupported = localStorage.getItem('hasSupported');
    if (hasSupported) return;

    // Show notification initially after 40 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 40000);

    // Set up recurring notification every 40 seconds
    const recurringTimer = setInterval(() => {
      const hasSupported = localStorage.getItem('hasSupported');
      if (!hasSupported) {
        setIsVisible(true);
      }
    }, 40000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringTimer);
    };
  }, []);

  const handleSupport = () => {
    setIsVisible(false);
    localStorage.setItem('hasSupported', 'true');
    showModal('support');
  };

  const handleClose = () => {
    setIsVisible(false);
    // Don't set permanent storage, allow notification to show again
  };

  if (!isVisible) return null;

  return (
    <div className="support-notification">
      <div className="notification-content">
        <h4>Enjoying FlutterPeak? Consider supporting the project! 💙</h4>
        <div className="notification-buttons">
          <button
            className="notify-btn support"
            onClick={handleSupport}
          >
            Support Now
          </button>
          <button className="notify-btn close" onClick={handleClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
