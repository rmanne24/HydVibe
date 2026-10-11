import React from 'react';
import { Compass, Map, Radio, Sparkles } from 'lucide-react';

export type ActiveTab = 'discover' | 'map' | 'live' | 'demo';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  reportCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F3EB]/95 backdrop-blur-md border-b border-[#E2D9C5]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Compact HydVibe Logo + Wordmark */}
        <button
          onClick={() => onTabChange('discover')}
          className="flex items-center gap-2.5 shrink-0 group focus:outline-none text-left cursor-pointer"
          aria-label="HydVibe Home"
        >
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E2D9C5] shadow-2xs flex items-center justify-center p-1 overflow-hidden group-hover:border-forest/40 transition-colors">
            <img
              src="/hydvibe-logo.png"
              alt="HydVibe"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-black tracking-tight text-forest">
              HydVibe
            </span>
            <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-caramel-dark opacity-90 hidden sm:inline">
              Hyd
            </span>
          </div>
        </button>

        {/* Center: Clean Primary Navigation (Max 1 row, no clutter) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onTabChange('discover')}
            className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'discover'
                ? 'text-forest font-semibold bg-white/80 shadow-2xs border border-[#E2D9C5]/60'
                : 'text-charcoal hover:text-forest hover:bg-white/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5 opacity-70" />
            <span>Discover</span>
          </button>

          <button
            onClick={() => onTabChange('map')}
            className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'text-forest font-semibold bg-white/80 shadow-2xs border border-[#E2D9C5]/60'
                : 'text-charcoal hover:text-forest hover:bg-white/40'
            }`}
          >
            <Map className="w-3.5 h-3.5 opacity-70" />
            <span>Explore Map</span>
          </button>

          <button
            onClick={() => onTabChange('live')}
            className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'live'
                ? 'text-forest font-semibold bg-white/80 shadow-2xs border border-[#E2D9C5]/60'
                : 'text-charcoal hover:text-forest hover:bg-white/40'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Intelligence</span>
          </button>
        </nav>

        {/* Right: Secondary Demo Action + Subtle Live Indicator */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Distinct Demo Mode Action (Secondary style) */}
          <button
            onClick={() => onTabChange('demo')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'demo'
                ? 'bg-caramel-dark text-white border-caramel-dark shadow-2xs'
                : 'bg-transparent border-[#D9A777]/60 text-caramel-dark hover:bg-caramel/10'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Presentation</span> Demo
          </button>

          {/* Subtle Live Sync Indicator */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 border border-[#E2D9C5]/70 text-[11px] font-medium text-charcoal select-none"
            title="Real-time crowd intelligence synchronized"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-sans text-[11px] text-charcoal-muted hidden xs:inline">Live Sync</span>
          </div>
        </div>
      </div>
    </header>
  );
};
