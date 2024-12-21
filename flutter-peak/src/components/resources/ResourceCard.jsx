import React from 'react';
import { useProgress } from '../../hooks/useProgress';
import { createConfetti } from '../../utils/storage';
import '../../styles/components/ResourceCard.css';

export function ResourceCard({ resource, index }) {
  const { updateProgress, isCompleted } = useProgress();

  const handleComplete = (e) => {
    updateProgress(resource.id, e.target.checked);
    if (e.target.checked) {
      createConfetti(e.target.getBoundingClientRect());
    }
  };

  return (
    <div
      className="resource-card"
      data-type={resource.type}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span className="resource-type">{resource.type}</span>
      <h3 className="resource-title">
        {resource.title}
        <span className={`difficulty ${resource.difficulty}`}>
          {resource.difficulty}
        </span>
      </h3>
      <p className="resource-description">{resource.description}</p>
      <a
        href={resource.link}
        className="resource-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (resource.onClick) {
            e.preventDefault();
            resource.onClick();
          }
        }}
      >
        Learn More →
      </a>
      <div className="completion-toggle">
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={isCompleted(resource.id)}
            onChange={handleComplete}
          />
          Mark as completed
        </label>
      </div>
    </div>
  );
}
