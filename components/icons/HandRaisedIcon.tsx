import React from 'react';

export const HandRaisedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3A2.25 2.25 0 0 0 8.25 5.25v3.75m6 0h-6M12 15.75v3m-3-3v3M15 15.75v3M12 12.75v-1.5M12 9.75V12m0 0H9.75M12 12h2.25M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z"
    />
  </svg>
);