import React from 'react';
import '../../styles/components/Header.css';

export default function Header() {
  return (
    <header>
      <h1>🚀 Flutter Learning Journey</h1>
      <p>Your interactive guide to mastering Flutter development</p>
      <div className="product-hunt-badge">
        <a
          href="https://www.producthunt.com/posts/flutter-peak"
          target="_blank"
          rel="noopener noreferrer"
          className="ph-badge"
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
    </header>
  );
}
