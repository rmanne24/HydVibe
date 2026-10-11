import React from 'react';
import { Compass, Map, Radio, QrCode } from 'lucide-react';
import type { ActiveTab } from './Navbar';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  reportCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  reportCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F3EB]/95 backdrop-blur-lg border-t border-[#E2D9C5] px-2 py-1.5 shadow-elevated">
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        <button
          onClick={() => onTabChange('discover')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'discover'
              ? 'text-forest font-bold bg-[#E3E9DD]/70'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Discover</span>
        </button>

        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'text-forest font-bold bg-[#E3E9DD]/70'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Map</span>
        </button>

        <button
          onClick={() => onTabChange('live')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'live'
              ? 'text-forest font-bold bg-[#E3E9DD]/70'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Live Intel</span>
          {reportCount > 0 && (
            <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
              {reportCount > 9 ? '9+' : reportCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('demo')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'demo'
              ? 'text-caramel-dark font-bold bg-caramel/15'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <QrCode className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Demo</span>
        </button>
      </div>
    </div>
  );
};
