import React from 'react';

export const KBCLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M64 128c35.346 0 64-28.654 64-64S99.346 0 64 0 0 28.654 0 64s28.654 64 64 64zm-8.25-34.667h16.5v-16.5h-16.5v16.5zm-33-33h16.5v16.5h-16.5v-16.5zm33 0h16.5v16.5h-16.5v-16.5zm-16.5-16.5a16.5 16.5 0 1033 0 16.5 16.5 0 00-33 0z"
      fill="currentColor"
    />
  </svg>
);