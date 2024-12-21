import React, { useState, useRef } from 'react';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { useNotification } from '../../context/NotificationContext';
import './ImageUpload.css';

export default function ImageUpload({ currentImage, onImageUpload, folder = 'general' }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const notify = useNotification();

  const handleUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notify.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      notify.error('Image size should be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      const { url, publicId } = await uploadToCloudinary(file);
      onImageUpload({ url, publicId });
      notify.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      notify.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="image-upload">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <img
          src={currentImage || `https://ui-avatars.com/api/?background=0D47A1&color=fff`}
          alt="preview"
          className={`preview-image ${uploading ? 'uploading' : ''}`}
        />
        <div className="upload-overlay">
          {uploading ? (
            <div className="upload-spinner" />
          ) : (
            <>
              <Icon name="upload" size={24} />
              <span>Click or drag image to upload</span>
            </>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        style={{ display: 'none' }}
      />
    </div>
  );
}
