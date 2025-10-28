import React from 'react';

export const HashtagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M5.25 8.25h15m-16.5 7.5h15m-1.875-13.5-3.75 16.5M17.625 4.5l-3.75 16.5" 
    />
  </svg>
);
