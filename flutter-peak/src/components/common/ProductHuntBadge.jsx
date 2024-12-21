import React from 'react';
import '../../styles/components/ProductHuntBadge.css';

export default function ProductHuntBadge() {
  return (
    <div className="product-hunt-badge">
      <a
        href="https://www.producthunt.com/posts/flutter-peak?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-flutter&#0045;peak"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=724304&theme=light"
          alt="Flutter Peak - Learn flutter with us | Product Hunt"
          style={{ width: '250px', height: '54px' }}
          width="250"
          height="54"
        />
      </a>
    </div>
  );
}
