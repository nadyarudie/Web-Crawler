// src/components/SpiderAnimation.tsx
import React from 'react';

const SpiderAnimation = () => (
  <div className="spider-wrapper">
    <div className="spider-thread"></div>
    <svg className="spider-svg" viewBox="0 0 100 100">
      <circle cx="50" cy="55" r="25" />
      <circle cx="50" cy="30" r="15" />
      <path d="M50 55 L 10 20" stroke="#1a1a1a" strokeWidth="8" />
      <path d="M50 55 L 90 20" stroke="#1a1a1a" strokeWidth="8" />
      <path d="M50 55 L 20 85" stroke="#1a1a1a" strokeWidth="8" />
      <path d="M50 55 L 80 85" stroke="#1a1a1a" strokeWidth="8" />
    </svg>
  </div>
);

export default SpiderAnimation;
