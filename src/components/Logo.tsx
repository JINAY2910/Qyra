import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8" }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qyra-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      
      {/* Outer ring */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="url(#qyra-gradient)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Q shape */}
      <path
        d="M11 12c0-2.5 2-4.5 5-4.5s5 2 5 4.5v6c0 2.5-2 4.5-5 4.5s-5-2-5-4.5v-6z"
        stroke="url(#qyra-gradient)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Q tail */}
      <path
        d="M18 19l4 4"
        stroke="url(#qyra-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Inner dot for modern touch */}
      <circle
        cx="16"
        cy="15"
        r="2"
        fill="url(#qyra-gradient)"
      />
    </svg>
  );
};

export default Logo;