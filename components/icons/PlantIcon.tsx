
import React from 'react';

export const PlantIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 22a7 7 0 0 0 7-7h-4a3 3 0 0 0-3-3v-2a3 3 0 0 0-3 3H5a7 7 0 0 0 7 7z"/>
    <path d="M12 10V3"/>
    <path d="M12 3l3 3"/>
    <path d="M12 3l-3 3"/>
  </svg>
);
