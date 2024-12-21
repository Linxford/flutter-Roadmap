import React, { useCallback } from 'react';
import '../../styles/components/modals/Modal.css';

export function Modal({ children, onClose }) {
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {children}
    </div>
  );
}
