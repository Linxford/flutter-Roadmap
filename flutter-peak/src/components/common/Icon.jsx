import React from 'react';
import { getIcon } from '../../constants/icons';
import '../../styles/components/common/Icon.css';

const Icon = ({ name, color, size = 24, className = '' }) => {
  const iconSvg = getIcon(name, color);
  if (!iconSvg) return null;

  return (
    <div
      className={`icon ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
    />
  );
};

export default Icon;
