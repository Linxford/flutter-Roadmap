import React, { createContext, useState, useEffect } from 'react';
import { loadProgress, saveProgress } from '../utils/storage';

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [completedResources, setCompletedResources] = useState(new Set());
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setCompletedResources(new Set(saved));
    }
  }, []);

  const updateProgress = (resourceId, completed) => {
    setCompletedResources(prev => {
      const updated = new Set(prev);
      if (completed) {
        updated.add(resourceId);
      } else {
        updated.delete(resourceId);
      }
      saveProgress(Array.from(updated));
      return updated;
    });
  };

  const isCompleted = (resourceId) => completedResources.has(resourceId);

  return (
    <ProgressContext.Provider value={{
      completedResources,
      updateProgress,
      isCompleted,
      filterType,
      setFilterType,
      searchTerm,
      setSearchTerm
    }}>
      {children}
    </ProgressContext.Provider>
  );
}
