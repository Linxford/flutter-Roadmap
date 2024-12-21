import React from 'react';
import { Layout } from './components/layout/Layout';
import { ProgressProvider } from './context/ProgressContext';
import { ModalProvider } from './context/ModalContext';
import DevModal from './components/modals/DevModal';
import InstallModal from './components/modals/InstallModal';
import WelcomeModal from './components/modals/WelcomeModal';
import SupportModal from './components/modals/SupportModal';
import FeedbackModal from './components/modals/FeedbackModal';
import PaystackModal from './components/modals/PaystackModal';
import AdminLayout from './components/admin/AdminLayout';
import './styles/global.css';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <NotificationProvider>
        <ProgressProvider>
          <ModalProvider>
            {window.location.pathname === '/admin' ? (
              <AdminLayout />
            ) : (
              <>
                <Layout />
                <DevModal />
                <InstallModal />
                <WelcomeModal />
                <SupportModal />
                <FeedbackModal />
                <PaystackModal />
              </>
            )}
          </ModalProvider>
        </ProgressProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
