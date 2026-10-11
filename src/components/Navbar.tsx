import React from 'react';
import { Map, Radio, QrCode, Compass } from 'lucide-react';

export type ActiveTab = 'discover' | 'map' | 'live' | 'demo';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  reportCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  reportCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F3EB]/90 backdrop-blur-md border-b border-[#E2D9C5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onTabChange('discover')}
        >
          <div className="w-11 h-11 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C5] shadow-xs flex items-center justify-center p-1 overflow-hidden group-hover:scale-105 transition-transform">
            <img
              src="/hydvibe-logo.png"
              alt="HydVibe"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-2xl tracking-tight text-forest">
                HydVibe
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-forest text-[#F7F3EB]">
                Hyderabad
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted tracking-tight hidden sm:block">
              Find your place. Catch the right vibe.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 p-1.5 rounded-2xl border border-[#E2D9C5] shadow-xs">
          <button
            onClick={() => onTabChange('discover')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-forest text-white shadow-2xs'
                : 'text-charcoal hover:bg-[#FAF7F0]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Discover
          </button>
          <button
            onClick={() => onTabChange('map')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-forest text-white shadow-2xs'
                : 'text-charcoal hover:bg-[#FAF7F0]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Interactive Map
          </button>
          <button
            onClick={() => onTabChange('live')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'live'
                ? 'bg-forest text-white shadow-2xs'
                : 'text-charcoal hover:bg-[#FAF7F0]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            Live Intel
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {reportCount}
            </span>
          </button>
          <button
            onClick={() => onTabChange('demo')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'demo'
                ? 'bg-caramel-dark text-white shadow-2xs'
                : 'text-caramel-dark hover:bg-caramel/10'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Demo Mode
          </button>
        </nav>

        {/* Realtime Live Indicator Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-900 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-[11px] hidden sm:inline">Live Syncing</span>
          </div>
        </div>
      </div>
    </header>
  );
};
