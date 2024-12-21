import React, { createContext, useContext, useState } from 'react';
import '../styles/components/admin/Notification.css';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const notify = {
    success: (message) => addNotification({ type: 'success', message }),
    error: (message) => addNotification({ type: 'error', message }),
    warning: (message) => addNotification({ type: 'warning', message }),
    info: (message) => addNotification({ type: 'info', message })
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}
            onClick={() => removeNotification(notification.id)}
          >
            <img
              src={`https://img.icons8.com/fluency/48/${
                notification.type === 'success' ? 'checkmark' :
                notification.type === 'error' ? 'error' :
                notification.type === 'warning' ? 'warning' :
                'info'
              }.png`}
              width="20"
              alt={notification.type}
            />
            <p>{notification.message}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
