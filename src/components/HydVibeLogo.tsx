import React from 'react';

interface HydVibeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'image' | 'vector';
  dark?: boolean;
}

/**
 * HydVibe Official Brand Logo
 * Featuring the iconic Hyderabad Charminar & Vibe Waves architectural emblem
 */
export const HydVibeLogo: React.FC<HydVibeLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  variant = 'image',
  dark = false,
}) => {
  const sizeMap = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  if (variant === 'image') {
    return (
      <div className={`inline-flex flex-col items-center justify-center ${className}`}>
        <img
          src="/hydvibe-logo.png"
          alt="HydVibe Logo"
          className={`${sizeMap[size]} w-auto object-contain select-none`}
        />
        {showText && (
          <span className={`font-sans font-extrabold tracking-wider text-xs mt-1 ${dark ? 'text-white' : 'text-[#153E35]'}`}>
            HYDVIBE
          </span>
        )}
      </div>
    );
  }

  // Pixel-perfect vector recreation of the official HydVibe Charminar & Waves emblem
  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 160 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeMap[size]} w-auto select-none`}
      >
        {/* Left Minaret Finial */}
        <path d="M42 12V22" stroke="#B87B4C" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 22L30 38H54L42 22Z" fill="#1B4D3E" stroke="#1B4D3E" strokeWidth="2" strokeLinejoin="round"/>
        
        {/* Right Minaret Finial */}
        <path d="M118 12V22" stroke="#B87B4C" strokeWidth="3" strokeLinecap="round"/>
        <path d="M118 22L106 38H130L118 22Z" fill="#1B4D3E" stroke="#1B4D3E" strokeWidth="2" strokeLinejoin="round"/>

        {/* Central Dome Finial Ring */}
        <circle cx="80" cy="26" r="6.5" stroke="#B87B4C" strokeWidth="3.5" fill="none"/>

        {/* Central Grand Arch / Dome */}
        <path
          d="M51 68C51 46 64 33 80 33C96 33 109 46 109 68"
          stroke="#1B4D3E"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner Sage Archway */}
        <path
          d="M60 92V65C60 52 69 44 80 44C91 44 100 52 100 65V92"
          stroke="#9EB6A2"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left Tower Body */}
        <rect x="31" y="46" width="22" height="46" rx="2" stroke="#1B4D3E" strokeWidth="6" fill="none"/>
        <path d="M37 66V56C37 53 39 51 42 51C45 51 47 53 47 56V66" stroke="#1B4D3E" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="26" y1="48" x2="58" y2="48" stroke="#B87B4C" strokeWidth="4" strokeLinecap="round"/>

        {/* Right Tower Body */}
        <rect x="107" y="46" width="22" height="46" rx="2" stroke="#1B4D3E" strokeWidth="6" fill="none"/>
        <path d="M113 66V56C113 53 115 51 118 51C121 51 123 53 123 56V66" stroke="#1B4D3E" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="102" y1="48" x2="134" y2="48" stroke="#B87B4C" strokeWidth="4" strokeLinecap="round"/>

        {/* Primary Vibe Wave (Forest Green) */}
        <path
          d="M18 97C34 85 52 92 80 102C108 111 126 95 142 90"
          stroke="#1B4D3E"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Secondary Vibe Wave (Caramel) */}
        <path
          d="M30 115C50 104 68 112 86 119C104 125 120 114 135 110"
          stroke="#B87B4C"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Text HYDVIBE */}
        {showText && (
          <text
            x="80"
            y="152"
            textAnchor="middle"
            fill={dark ? "#F7F3EB" : "#153E35"}
            fontSize="21"
            fontWeight="800"
            letterSpacing="2.5"
            fontFamily="'DM Sans', system-ui, sans-serif"
          >
            HYDVIBE
          </text>
        )}
      </svg>
    </div>
  );
};
