import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../../styles/components/admin/UserStats.css';
import { toast } from 'react-hot-toast';

export default function UserStats() {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completedResources: [],
    progressStats: {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProgressLevel = useCallback((completedCount) => {
    if (completedCount < 5) return 'beginner';
    if (completedCount < 15) return 'intermediate';
    return 'advanced';
  }, []);

  const fetchUserStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const progressQuery = await getDocs(collection(db, 'progress'));
      const progressData = progressQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const stats = progressData.reduce((acc, progress) => {
        const completed = progress.completed || [];
        acc.totalCompleted += completed.length;
        const progressLevel = getProgressLevel(completed.length);
        acc.progressStats[progressLevel]++;
        return acc;
      }, {
        totalCompleted: 0,
        progressStats: { beginner: 0, intermediate: 0, advanced: 0 }
      });

      setUserStats({
        totalUsers: progressData.length,
        activeUsers: progressData.filter(p => p.lastActive > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
        ...stats
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
      setError('Failed to load user statistics');
      toast.error('Failed to load user statistics');
    } finally {
      setIsLoading(false);
    }
  }, [getProgressLevel]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  if (isLoading) {
    return <div className="user-stats loading">Loading user statistics...</div>;
  }

  if (error) {
    return (
      <div className="user-stats error">
        <p>{error}</p>
        <button onClick={fetchUserStats}>Retry</button>
      </div>
    );
  }

  return (
    <div className="user-stats">
      <h2>User Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{userStats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Active Users (7 days)</h3>
          <p className="stat-number">{userStats.activeUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Completions</h3>
          <p className="stat-number">{userStats.totalCompleted}</p>
        </div>

        <div className="stat-card">
          <h3>User Progress Levels</h3>
          <div className="progress-bars">
            {Object.entries(userStats.progressStats).map(([level, count]) => (
              <div key={level} className="progress-item">
                <div className="progress-label">
                  <span>{level}</span>
                  <span>{count} users</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${level}`}
                    style={{
                      width: `${(count / userStats.totalUsers) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
