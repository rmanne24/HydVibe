import React, { useState, useEffect } from 'react';
import { CrowdProvider, useCrowd } from './context/CrowdContext';
import { Navbar } from './components/Navbar';
import type { ActiveTab } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DiscoverPage } from './pages/DiscoverPage';
import { HydVibeMap } from './components/HydVibeMap';
import { LiveCrowdFeed } from './components/LiveCrowdFeed';
import { DemoPage } from './pages/DemoPage';
import { VenueDetailModal } from './components/VenueDetailModal';
import { CrowdReportModal } from './components/CrowdReportModal';
import type { VenueWithLiveStatus } from './types';
import { Sparkles, MapPin, Coffee, ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { venues, reports, totalReportCount } = useCrowd();

  // Tab routing with URL hash support (e.g. #/demo or #demo)
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (hash.includes('demo') || pathname.includes('demo')) return 'demo';
      if (hash.includes('map')) return 'map';
      if (hash.includes('live')) return 'live';
    }
    return 'discover';
  });

  // Modal states
  const [selectedVenueForDetail, setSelectedVenueForDetail] = useState<VenueWithLiveStatus | null>(null);
  const [selectedVenueForReport, setSelectedVenueForReport] = useState<VenueWithLiveStatus | null>(null);

  // Sync tab with URL hash
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab === 'discover' ? '' : `#${tab}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen to hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('demo')) setActiveTab('demo');
      else if (hash.includes('map')) setActiveTab('map');
      else if (hash.includes('live')) setActiveTab('live');
      else if (!hash || hash === '#') setActiveTab('discover');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectVenueById = (venueId: string) => {
    const target = venues.find((v) => v.id === venueId);
    if (target) {
      setSelectedVenueForDetail(target);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EB] text-[#1F2421]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        reportCount={totalReportCount}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'discover' && (
          <DiscoverPage
            venues={venues}
            onSelectVenue={(v) => setSelectedVenueForDetail(v)}
            onOpenReportModal={(v) => setSelectedVenueForReport(v)}
            onSwitchToMap={() => handleTabChange('map')}
          />
        )}

        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-caramel-dark text-xs font-semibold uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Cartography & Neighborhood Intel
                </div>
                <h1 className="font-serif text-3xl font-bold text-forest">
                  Hyderabad Interactive Vibe Map
                </h1>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Realtime crowd levels mapped across Jubilee Hills, Banjara Hills, Madhapur, & HITEC City.
                </p>
              </div>
            </div>

            <HydVibeMap
              venues={venues}
              onSelectVenue={(v) => setSelectedVenueForDetail(v)}
              onReportVenue={(v) => setSelectedVenueForReport(v)}
            />
          </div>
        )}

        {activeTab === 'live' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-caramel-dark text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Community Intel Stream
              </div>
              <h1 className="font-serif text-3xl font-bold text-forest">
                Live Crowd Intelligence
              </h1>
              <p className="text-xs text-charcoal-muted mt-1">
                Community-sourced reports updating every minute. Help fellow Hyderabadis by reporting your current café vibe.
              </p>
            </div>

            <LiveCrowdFeed
              reports={reports}
              venues={venues}
              onSelectVenueById={handleSelectVenueById}
              onOpenReportForVenue={(v) => setSelectedVenueForReport(v)}
            />
          </div>
        )}

        {activeTab === 'demo' && (
          <DemoPage
            venues={venues}
            onSelectVenue={(v) => setSelectedVenueForDetail(v)}
            onOpenReportModal={(v) => setSelectedVenueForReport(v)}
          />
        )}
      </main>

      {/* Editorial Lifestyle Footer */}
      <footer className="bg-forest text-[#F7F3EB] pt-12 pb-24 md:pb-12 border-t border-forest-light mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-forest-light/60">
            {/* Column 1: Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-caramel text-forest flex items-center justify-center font-bold">
                  <Coffee className="w-4 h-4" />
                </div>
                <span className="font-serif font-black text-2xl text-white">HydVibe</span>
              </div>
              <p className="text-xs text-sage/80 max-w-md leading-relaxed mb-4">
                HydVibe is Hyderabad’s AI-powered discovery and live crowd intelligence platform. We combine mood-based café curation with community-sourced telemetry so you never arrive at a crowded café unawares.
              </p>
              <div className="text-[11px] text-sage/60 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Recency-weighted confidence algorithm • No mandatory login barriers
              </div>
            </div>

            {/* Column 2: Hubs */}
            <div>
              <h4 className="font-serif font-bold text-white text-sm mb-3">Featured Hubs</h4>
              <ul className="space-y-1.5 text-xs text-sage/80">
                <li>• Road No. 36 & 45, Jubilee Hills</li>
                <li>• Road No. 10 & 14, Banjara Hills</li>
                <li>• Mindspace & Knowledge City, HITEC</li>
                <li>• Telecom Nagar, Gachibowli</li>
                <li>• Ayyappa Society, Madhapur</li>
              </ul>
            </div>

            {/* Column 3: Quick Navigation */}
            <div>
              <h4 className="font-serif font-bold text-white text-sm mb-3">Experience</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => handleTabChange('discover')} className="hover:text-caramel transition-colors">
                    Natural Language Discovery
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('map')} className="hover:text-caramel transition-colors">
                    Interactive Crowd Map
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('live')} className="hover:text-caramel transition-colors">
                    Live Crowd Stream
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('demo')} className="hover:text-caramel text-caramel-light font-semibold transition-colors">
                    Hackathon Demo & QR Code
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sage/60">
            <div>
              © 2026 HydVibe. Built for Hyderabad's café community.
            </div>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>for city explorers</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Venue Detail Modal */}
      <VenueDetailModal
        venue={selectedVenueForDetail}
        allVenues={venues}
        isOpen={Boolean(selectedVenueForDetail)}
        onClose={() => setSelectedVenueForDetail(null)}
        onOpenReport={(v) => setSelectedVenueForReport(v)}
        onSelectAlternative={(altVenue) => setSelectedVenueForDetail(altVenue)}
      />

      {/* Live Crowd Reporting Modal */}
      {selectedVenueForReport && (
        <CrowdReportModal
          venue={selectedVenueForReport}
          isOpen={Boolean(selectedVenueForReport)}
          onClose={() => setSelectedVenueForReport(null)}
        />
      )}

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        reportCount={totalReportCount}
      />
    </div>
  );
};

export default function App() {
  return (
    <CrowdProvider>
      <AppContent />
    </CrowdProvider>
  );
}
