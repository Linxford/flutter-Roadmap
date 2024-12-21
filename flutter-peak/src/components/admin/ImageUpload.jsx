import React, { useRef, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/components/admin/ImageUpload.css';

export default function ImageUpload({ currentImage, onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const notify = useNotification();
  const storage = getStorage();

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
      const storageRef = ref(storage, `avatars/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      onImageUpload(downloadURL);
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
          alt="profile"
          className={`preview-image ${uploading ? 'uploading' : ''}`}
        />
        <div className="upload-overlay">
          {uploading ? (
            <div className="upload-spinner" />
          ) : (
            <>
              <img
                src="https://img.icons8.com/fluency/48/upload-to-cloud.png"
                width="24"
                alt="upload"
              />
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
