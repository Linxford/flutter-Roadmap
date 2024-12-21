import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ResourceGrid from '../resources/ResourceGrid';
import ProgressSection from '../resources/ProgressSection';
import WelcomeModal from '../modals/WelcomeModal';
import MusicPlayer from '../common/MusicPlayer';
import SupportNotification from '../common/SupportNotification';
import { useProgress } from '../../hooks/useProgress';
import '../../styles/components/Layout.css';
import { useModal } from '../../context/ModalContext';

export function Layout() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { filterType, setFilterType, searchTerm, setSearchTerm } = useProgress();
  const { showModal } = useModal();

  useEffect(() => {
    window.showModal = showModal;

    const welcomeShown = localStorage.getItem('welcomeShown');
    if (!welcomeShown) {
      showModal('welcome');
      localStorage.setItem('welcomeShown', 'true');
    }

    return () => {
      delete window.showModal;
    };
  }, [showModal]);

  const filterButtons = [
    { id: 'all', label: 'All Resources' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'tutorial', label: 'Tutorials' },
    { id: 'course', label: 'Courses' }
  ];

  return (
    <>
      <div className="container">
        <Header />

        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          {filterButtons.map(button => (
            <button
              key={button.id}
              className={`filter-btn ${filterType === button.id ? 'active' : ''}`}
              onClick={() => setFilterType(button.id)}
            >
              {button.label}
            </button>
          ))}
        </div>

        <ProgressSection />
        <ResourceGrid />
      </div>

      <Footer />
      <MusicPlayer />
      <SupportNotification />

      {showWelcome && (
        <WelcomeModal onClose={() => {
          setShowWelcome(false);
          localStorage.setItem('welcomeShown', 'true');
        }} />
      )}
    </>
  );
}
