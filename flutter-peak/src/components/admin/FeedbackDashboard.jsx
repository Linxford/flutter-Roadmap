import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/components/admin/FeedbackDashboard.css';

export default function FeedbackDashboard() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const notify = useNotification();

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        const feedbackQuery = query(
          collection(db, 'feedback'),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(feedbackQuery);
        const feedbackList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp instanceof Timestamp ?
              data.timestamp.toDate() :
              new Date(data.timestamp)
          };
        });
        setFeedback(feedbackList);
      } catch (error) {
        console.error('Error loading feedback:', error);
        notify.error('Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [notify]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  if (loading) {
    return (
      <div className="feedback-loading">
        <div className="loading-spinner"></div>
        <p>Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="feedback-dashboard">
      <div className="dashboard-header">
        <h2>User Feedback</h2>
        <div className="feedback-stats">
          <span>Total: {feedback.length}</span>
          <span>New: {feedback.filter(f => !f.read).length}</span>
        </div>
      </div>

      <div className="feedback-list">
        {feedback.length === 0 ? (
          <div className="no-feedback">
            <p>No feedback yet</p>
            <small>Feedback from users will appear here</small>
          </div>
        ) : (
          feedback.map(item => (
            <div key={item.id} className={`feedback-item ${!item.read ? 'unread' : ''}`}>
              <div className="feedback-header">
                <div className="feedback-info">
                  <span className={`feedback-type ${item.type}`}>
                    {item.type}
                  </span>
                  {!item.read && <span className="unread-badge">New</span>}
                </div>
                <span className="feedback-time">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
              <p className="feedback-message">{item.message}</p>
              {item.email && (
                <div className="feedback-contact">
                  <img
                    src="/assets/icons/email.png"
                    alt="email"
                    width="16"
                    height="16"
                  />
                  <a href={`mailto:${item.email}`}>{item.email}</a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
