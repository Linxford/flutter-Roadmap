import React, { useState, useRef, useEffect } from 'react';
import { exportToExcel, exportToCSV, exportToPDF, exportToWord } from '../../services/exportService';
import Icon from './Icon';
import '../../styles/components/common/ExportButton.css';
import { useNotification } from '../../context/NotificationContext';

export default function ExportButton({ data, columns, filename, includeCharts = false }) {
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef(null);
  const notify = useNotification();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format) => {
    setLoading(true);
    try {
      switch (format) {
        case 'excel':
          await exportToExcel(data, filename);
          notify.success('Exported to Excel successfully');
          break;
        case 'csv':
          await exportToCSV(data, filename);
          notify.success('Exported to CSV successfully');
          break;
        case 'pdf':
          await exportToPDF(data, columns, filename);
          notify.success('Exported to PDF successfully');
          break;
        case 'word':
          await exportToWord(data, columns, filename);
          notify.success('Exported to Word successfully');
          break;
        default:
          notify.error('Unsupported format');
      }
    } catch (error) {
      console.error('Export error:', error);
      notify.error('Failed to export file');
    } finally {
      setLoading(false);
    }
    setShowOptions(false);
  };

  return (
    <div className="export-button-container" ref={containerRef}>
      <button
        className="export-button"
        onClick={() => setShowOptions(!showOptions)}
        disabled={loading}
      >
        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            <Icon name="export" size={20} />
            Export
          </>
        )}
      </button>

      {showOptions && (
        <div className="export-options">
          <button onClick={() => handleExport('excel')}>
            <Icon name="excel" size={16} />
            Excel
          </button>
          <button onClick={() => handleExport('csv')}>
            <Icon name="csv" size={16} />
            CSV
          </button>
          <button onClick={() => handleExport('pdf')}>
            <Icon name="pdf" size={16} />
            PDF
          </button>
          <button onClick={() => handleExport('word')}>
            <Icon name="word" size={16} />
            Word
          </button>
        </div>
      )}
    </div>
  );
}
