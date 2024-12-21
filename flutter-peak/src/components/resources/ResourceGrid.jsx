import React from 'react';
import { ResourceCard } from './ResourceCard';
import { useProgress } from '../../hooks/useProgress';
import { resources } from '../../data/resources';
import '../../styles/components/ResourceGrid.css';

export default function ResourceGrid() {
  const { filterType, searchTerm } = useProgress();

  const filteredResources = resources.filter(resource => {
    const matchesFilter = filterType === 'all' || resource.type === filterType;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="resources-grid">
      {filteredResources.map((resource, index) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          index={index}
        />
      ))}
    </div>
  );
}
