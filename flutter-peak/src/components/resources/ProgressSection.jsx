import React from 'react';
import { useProgress } from '../../hooks/useProgress';
import { resources } from '../../data/resources';
import '../../styles/components/ProgressSection.css';

export default function ProgressSection() {
  const { completedResources } = useProgress();
  const totalResources = resources.length;
  const completedCount = completedResources.size;
  const progressPercentage = (completedCount / totalResources) * 100;

  return (
    <div className="progress-section">
      <h3>Your Learning Progress</h3>
      <p>Completed: <span id="progress-text">{completedCount}/{totalResources}</span> resources</p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
