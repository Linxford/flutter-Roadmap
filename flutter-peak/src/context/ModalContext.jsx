import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null);

  const showModal = (modalName) => setActiveModal(modalName);
  const hideModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, showModal, hideModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
