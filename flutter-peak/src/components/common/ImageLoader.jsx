import React, { useState } from 'react';
import '../../styles/components/common/ImageLoader.css';

export default function ImageLoader({ src, alt, className, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    if (props.onError) {
      props.onError();
    }
  };

  return (
    <div className={`image-container ${className || ''}`}>
      {!loaded && !error && <div className="image-placeholder" />}
      <img
        src={error ? '/assets/icons/default.png' : src}
        alt={alt}
        className={`image ${loaded ? 'loaded' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}
