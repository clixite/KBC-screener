import React from 'react';

export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21.75c2.422 0 4.68-.84 6.42-2.259.866-.677 1.63-1.455 2.259-2.321V5.539a2.25 2.25 0 0 0-1.25-2.071l-6-3.333a2.25 2.25 0 0 0-2.418 0l-6 3.333A2.25 2.25 0 0 0 3 5.539v8.632c.629.866 1.393 1.644 2.259 2.321C7.32 20.91 9.578 21.75 12 21.75Z"
    />
  </svg>
);