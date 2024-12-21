import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FeedbackDashboard from './FeedbackDashboard';
import ResourceManager from './ResourceManager';
import Analytics from './Analytics';
import UserStats from './UserStats';
import AuthPage from './AuthPage';
import { logAnalyticsEvent } from '../../config/firebase';
import '../../styles/components/admin/AdminLayout.css';
import ErrorBoundary from '../ErrorBoundary';
import { useNotification } from '../../context/NotificationContext';
import ProfileSettings from './ProfileSettings';
import { imageUrls, preloadImages } from '../../services/imageService';
import Icon from '../common/Icon';

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feedback');
  const notify = useNotification();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        logAnalyticsEvent('admin_login', {
          admin_email: user.email
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    preloadImages();
  }, []);

  const handleLogout = () => {
    logAnalyticsEvent('admin_logout');
    getAuth().signOut();
    notify.info('Logged out successfully');
  };

  const tabs = [
    {
      id: 'feedback',
      label: 'Feedback',
      icon: 'feedback',
      description: 'Manage user feedback and suggestions'
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: 'resources',
      description: 'Manage learning resources and materials'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'analytics',
      description: 'View site statistics and user engagement'
    },
    {
      id: 'users',
      label: 'User Stats',
      icon: 'users',
      description: 'Monitor user progress and activity'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'profile',
      description: 'Manage your profile settings'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'feedback':
        return <FeedbackDashboard />;
      case 'resources':
        return <ResourceManager />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UserStats />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <FeedbackDashboard />;
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!user) return <AuthPage />;

  return (
    <ErrorBoundary>
      <div className="admin-layout">
        <header className="admin-header">
          <div className="header-content">
            <div className="header-left">
              <img
                src="/assets/fpeak.png"
                alt="FlutterPeak"
                className="admin-logo"
              />
              <h1>
                <img
                  src={imageUrls.dashboard}
                  width="24"
                  alt="dashboard"
                  className="header-icon"
                />
                Admin Dashboard
              </h1>
            </div>
            <div className="header-right">
              <div className="admin-info">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || '')}&background=0D47A1&color=fff`}
                  alt="admin"
                  className="admin-avatar"
                  crossOrigin="anonymous"
                />
                <span>{user?.email}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <img
                  src={imageUrls.logout}
                  width="20"
                  alt="logout"
                />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="admin-container">
          <nav className="admin-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon
                  name={tab.icon}
                  size={24}
                  className="nav-icon"
                />
                <div className="nav-btn-content">
                  <span className="nav-btn-label">{tab.label}</span>
                  <span className="nav-btn-description">{tab.description}</span>
                </div>
              </button>
            ))}
          </nav>

          <main className="admin-content">
            {renderContent()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
