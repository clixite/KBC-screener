import React from 'react';

export const ThumbUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75A2.25 2.25 0 0 1 16.5 3v1.5a5.25 5.25 0 0 1-5.25 5.25H3.75m8.25-9v9"
    />
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12c0-5.03 4.495-9 9.975-9s9.975 3.97 9.975 9c0 4.51-3.52 8.224-8.055 8.872A.75.75 0 0 1 12 21v-1.5a.75.75 0 0 0-.75-.75H3.75a.75.75 0 0 1-.75-.75V12Z"
    />
  </svg>
);