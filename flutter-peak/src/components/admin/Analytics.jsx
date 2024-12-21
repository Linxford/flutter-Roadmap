import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { useNotification } from '../../context/NotificationContext';
import { imageUrls } from '../../services/imageService';
import Icon from '../common/Icon';
import '../../styles/components/admin/Analytics.css';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    feedbackByType: {},
    completedResources: 0,
    activeUsers: 0,
    dailyStats: [],
    userGrowth: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const notify = useNotification();

  const calculateDailyStats = useCallback((feedbackList, progressList) => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setDate(dayEnd.getDate() + 1);

      return {
        date,
        feedback: feedbackList.filter(f => {
          const timestamp = f.timestamp instanceof Timestamp ?
            f.timestamp.toDate() : new Date(f.timestamp);
          return timestamp >= dayStart && timestamp < dayEnd;
        }).length,
        activeUsers: progressList.filter(p => {
          const lastActive = p.lastActive instanceof Timestamp ?
            p.lastActive.toDate() : new Date(p.lastActive);
          return lastActive >= dayStart && lastActive < dayEnd;
        }).length
      };
    });
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);

        // Load feedback
        const feedbackQuery = await getDocs(collection(db, 'feedback'));
        const feedbackStats = feedbackQuery.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc.totalFeedback++;
          acc.feedbackByType[data.type] = (acc.feedbackByType[data.type] || 0) + 1;
          return acc;
        }, { totalFeedback: 0, feedbackByType: {} });

        // Load progress
        const progressQuery = await getDocs(collection(db, 'progress'));
        const progressData = progressQuery.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        const completedCount = progressData.reduce((acc, doc) => {
          const completed = doc.completed || [];
          return acc + completed.length;
        }, 0);

        // Calculate daily stats
        const dailyStats = calculateDailyStats(
          feedbackQuery.docs.map(doc => ({ ...doc.data(), id: doc.id })),
          progressData
        );

        setStats({
          ...feedbackStats,
          completedResources: completedCount,
          activeUsers: progressData.length,
          dailyStats
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        notify.error('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [notify, calculateDailyStats]);

  if (isLoading) {
    return (
      <div className="analytics loading">
        <div className="loading-spinner" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <div className="date-range">Last 7 Days</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name={imageUrls.users} size={24} color="var(--primary)" />
          </div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-number">{stats.activeUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name={imageUrls.feedback} size={24} color="var(--primary)" />
          </div>
          <div className="stat-content">
            <h3>Total Feedback</h3>
            <p className="stat-number">{stats.totalFeedback}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Icon name={imageUrls.resources} size={24} color="var(--primary)" />
          </div>
          <div className="stat-content">
            <h3>Completed Resources</h3>
            <p className="stat-number">{stats.completedResources}</p>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Feedback by Type</h3>
          <div className="feedback-types">
            {Object.entries(stats.feedbackByType).map(([type, count]) => (
              <div key={type} className="feedback-type-item">
                <div className="type-label">
                  <span className={`type-dot ${type}`} />
                  <span>{type}</span>
                </div>
                <span className="type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Daily Activity</h3>
          <div className="daily-stats">
            {stats.dailyStats.map(day => (
              <div key={day.date} className="daily-stat-item">
                <div className="stat-date">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="stat-bars">
                  <div
                    className="stat-bar feedback"
                    style={{ height: `${(day.feedback / Math.max(...stats.dailyStats.map(d => d.feedback))) * 100}%` }}
                  >
                    <span className="stat-value">{day.feedback}</span>
                  </div>
                  <div
                    className="stat-bar users"
                    style={{ height: `${(day.activeUsers / Math.max(...stats.dailyStats.map(d => d.activeUsers))) * 100}%` }}
                  >
                    <span className="stat-value">{day.activeUsers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot feedback" />
              <span>Feedback</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot users" />
              <span>Active Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
