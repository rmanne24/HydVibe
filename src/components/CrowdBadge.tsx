import React from 'react';
import type { CrowdLevel } from '../types';

interface CrowdBadgeProps {
  level: CrowdLevel;
  lastReportedMinutesAgo?: number;
  confidence?: 'High' | 'Medium' | 'Low';
  size?: 'sm' | 'md' | 'lg';
  showRecency?: boolean;
  className?: string;
}

export const CROWD_CONFIG: Record<
  CrowdLevel,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
    ring: string;
    description: string;
  }
> = {
  empty: {
    label: 'Empty',
    bg: 'bg-emerald-50 text-emerald-800',
    text: 'text-emerald-700',
    border: 'border-emerald-200/80',
    dot: 'bg-emerald-500',
    ring: 'bg-emerald-400',
    description: 'Plenty of seats open',
  },
  comfortable: {
    label: 'Comfortable',
    bg: 'bg-amber-50 text-amber-900',
    text: 'text-amber-800',
    border: 'border-amber-200/80',
    dot: 'bg-amber-500',
    ring: 'bg-amber-400',
    description: 'Good vibe, tables available',
  },
  busy: {
    label: 'Busy',
    bg: 'bg-orange-50 text-orange-900',
    text: 'text-orange-800',
    border: 'border-orange-200/80',
    dot: 'bg-orange-500',
    ring: 'bg-orange-400',
    description: 'Filling up fast',
  },
  packed: {
    label: 'Packed',
    bg: 'bg-rose-50 text-rose-900',
    text: 'text-rose-800',
    border: 'border-rose-200/80',
    dot: 'bg-rose-600',
    ring: 'bg-rose-400',
    description: 'Full capacity / waitlist',
  },
};

export const CrowdBadge: React.FC<CrowdBadgeProps> = ({
  level,
  lastReportedMinutesAgo,
  size = 'md',
  showRecency = true,
  className = '',
}) => {
  const config = CROWD_CONFIG[level] || CROWD_CONFIG.comfortable;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs md:text-sm px-3 py-1.5 gap-2',
    lg: 'text-sm md:text-base px-4 py-2 gap-2.5',
  }[size];

  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  }[size];

  return (
    <div
      className={`inline-flex items-center font-medium rounded-full border shadow-xs transition-colors backdrop-blur-xs ${config.bg} ${config.border} ${sizeClasses} ${className}`}
    >
      <span className="relative flex items-center justify-center">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.ring}`}
        />
        <span className={`relative inline-flex rounded-full ${config.dot} ${dotSize}`} />
      </span>
      <span className="font-semibold tracking-tight">{config.label}</span>
      {showRecency && typeof lastReportedMinutesAgo === 'number' && (
        <span className="opacity-60 text-[11px] font-normal border-l border-current/20 pl-1.5 ml-0.5">
          {lastReportedMinutesAgo <= 1 ? 'Just now' : `${lastReportedMinutesAgo}m ago`}
        </span>
      )}
    </div>
  );
};
