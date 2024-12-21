import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import '../../styles/components/admin/ResourceManager.css';
import ExportButton from '../common/ExportButton';
import { seedResources } from '../../utils/seedResources';
import Icon from '../common/Icon';

export default function ResourceManager() {
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedResources, setSelectedResources] = useState(new Set());
  const [stats, setStats] = useState({
    total: 0,
    byType: {},
    byDifficulty: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateStats = useCallback((resourceList) => {
    const stats = resourceList.reduce((acc, resource) => {
      acc.total++;
      acc.byType[resource.type] = (acc.byType[resource.type] || 0) + 1;
      acc.byDifficulty[resource.difficulty] = (acc.byDifficulty[resource.difficulty] || 0) + 1;
      return acc;
    }, { total: 0, byType: {}, byDifficulty: {} });

    setStats(stats);
  }, []);

  const fetchResources = useCallback(async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, 'resources'));
      const resourceList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setResources(resourceList);
      calculateStats(resourceList);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSave = async (resource) => {
    try {
      const resourceData = {
        ...resource,
        updatedAt: serverTimestamp(),
        createdAt: resource.id ? resource.createdAt : serverTimestamp()
      };

      if (resource.id) {
        await updateDoc(doc(db, 'resources', resource.id), resourceData);
        toast.success('Resource updated successfully');
      } else {
        await addDoc(collection(db, 'resources'), resourceData);
        toast.success('Resource added successfully');
      }
      await fetchResources();
      setEditingResource(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Error saving resource');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteDoc(doc(db, 'resources', id));
        toast.success('Resource deleted successfully');
        await fetchResources();
      } catch (error) {
        toast.error('Error deleting resource');
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (!selectedResources.size) return;

    try {
      switch (action) {
        case 'delete':
          if (window.confirm(`Delete ${selectedResources.size} resources?`)) {
            await Promise.all(
              Array.from(selectedResources).map(id =>
                deleteDoc(doc(db, 'resources', id))
              )
            );
            toast.success('Resources deleted successfully');
          }
          break;
        case 'export':
          const selectedData = resources.filter(r => selectedResources.has(r.id));
          const blob = new Blob([JSON.stringify(selectedData, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'resources.json';
          a.click();
          break;
        default:
          toast.error('Invalid action');
          return;
      }
      setSelectedResources(new Set());
      await fetchResources();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const filteredResources = useMemo(() => {
    return resources
      .filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || resource.type === filter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
  }, [resources, searchTerm, filter, sortBy]);

  const handleSeedResources = async () => {
    if (window.confirm('Are you sure you want to seed the database with initial resources?')) {
      setIsLoading(true);
      try {
        await seedResources();
        toast.success('Resources seeded successfully');
        await fetchResources();
      } catch (error) {
        console.error('Error seeding resources:', error);
        toast.error('Failed to seed resources');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`resource-manager ${isLoading ? 'loading' : ''}`}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}
      <div className="manager-header">
        <h2>Resource Manager</h2>
        <div className="header-actions">
          <button
            className="seed-btn"
            onClick={handleSeedResources}
            disabled={isLoading}
          >
            <Icon name="seed" size={20} className="action-icon" />
            Seed Resources
          </button>
          <button
            className="add-btn"
            onClick={() => setIsAdding(true)}
            disabled={isLoading}
          >
            <Icon name="add" size={20} className="action-icon" />
            Add Resource
          </button>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Resources</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>By Type</h3>
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="stat-item">
              <span>{type}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
        <div className="stat-card">
          <h3>By Difficulty</h3>
          {Object.entries(stats.byDifficulty).map(([level, count]) => (
            <div key={level} className="stat-item">
              <span>{level}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="resource-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Icon name="search" size={20} className="search-icon" />
        </div>

        <div className="filter-controls">
          <div className="select-wrapper">
            <Icon name="filter" size={16} className="select-icon" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="documentation">Documentation</option>
              <option value="tutorial">Tutorial</option>
              <option value="course">Course</option>
            </select>
          </div>

          <div className="select-wrapper">
            <Icon name="sort" size={16} className="select-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
            </select>
          </div>
        </div>

        {selectedResources.size > 0 && (
          <div className="bulk-actions">
            <span>{selectedResources.size} selected</span>
            <ExportButton
              data={selectedResources.size ? resources.filter(r => selectedResources.has(r.id)) : resources}
              columns={[
                { key: 'title', header: 'Title' },
                { key: 'description', header: 'Description' },
                { key: 'type', header: 'Type' },
                { key: 'difficulty', header: 'Difficulty' },
                { key: 'createdAt', header: 'Created At' }
              ]}
              filename="resources"
            />
            <button onClick={() => handleBulkAction('delete')}>
              Delete Selected
            </button>
            <button onClick={() => setSelectedResources(new Set())}>
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {(isAdding || editingResource) && (
        <ResourceForm
          resource={editingResource}
          onSave={handleSave}
          onCancel={() => {
            setEditingResource(null);
            setIsAdding(false);
          }}
        />
      )}

      <div className="resource-list">
        {filteredResources.map(resource => (
          <div key={resource.id} className="resource-item">
            <div className="resource-select">
              <input
                type="checkbox"
                checked={selectedResources.has(resource.id)}
                onChange={(e) => {
                  const newSelected = new Set(selectedResources);
                  if (e.target.checked) {
                    newSelected.add(resource.id);
                  } else {
                    newSelected.delete(resource.id);
                  }
                  setSelectedResources(newSelected);
                }}
              />
            </div>
            <div className="resource-info">
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <div className="resource-meta">
                <span className="type">{resource.type}</span>
                <span className="difficulty">{resource.difficulty}</span>
              </div>
            </div>
            <div className="resource-actions">
              <button
                onClick={() => setEditingResource(resource)}
                className="edit-btn"
              >
                <Icon name="edit" size={16} className="action-icon" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(resource.id)}
                className="delete-btn"
              >
                <Icon name="delete" size={16} className="action-icon" />
                Delete
              </button>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                <Icon name="link" size={16} className="action-icon" />
                Visit
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourceForm({ resource, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    resource || {
      title: '',
      description: '',
      type: 'documentation',
      difficulty: 'beginner',
      link: ''
    }
  );

  return (
    <form
      className="resource-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
    >
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        >
          <option value="documentation">Documentation</option>
          <option value="tutorial">Tutorial</option>
          <option value="course">Course</option>
        </select>
      </div>

      <div className="form-group">
        <label>Difficulty</label>
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="form-group">
        <label>Link</label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          required
          placeholder="https://"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
