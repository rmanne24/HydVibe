import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Radio, 
  Activity, 
  TrendingUp, 
  RotateCcw, 
  SunMedium, 
  Flame, 
  QrCode, 
  ArrowRight,
  MonitorPlay,
  Layers,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useCrowd } from '../context/CrowdContext';
import type { VenueWithLiveStatus, CrowdLevel } from '../types';
import { CrowdBadge } from '../components/CrowdBadge';

interface DemoPageProps {
  venues: VenueWithLiveStatus[];
  onSelectVenue: (venue: VenueWithLiveStatus) => void;
  onOpenReportModal: (venue: VenueWithLiveStatus) => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({
  venues,
  onSelectVenue,
  onOpenReportModal,
}) => {
  const { 
    reports, 
    totalReportCount, 
    activeContributorsCount, 
    simulateCrowdSpike, 
    simulateMorningCalm, 
    resetToDefaults,
    submitReport 
  } = useCrowd();

  const [selectedDemoVenueId, setSelectedDemoVenueId] = useState<string>(venues[0]?.id || '');
  const [projectorHighContrast, setProjectorHighContrast] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  const selectedVenue = venues.find((v) => v.id === selectedDemoVenueId) || venues[0];

  // URL for the QR Code
  const qrTargetUrl = typeof window !== 'undefined' ? window.location.origin : 'https://hydvibe.app';

  const handleTriggerSimulatedReport = async (level: CrowdLevel) => {
    if (!selectedVenue) return;
    const noteMap: Record<CrowdLevel, string> = {
      empty: 'Audience demo report: tranquil and wide open seating!',
      comfortable: 'Audience demo report: pleasant atmosphere, few tables free.',
      busy: 'Audience demo report: lively afternoon energy, tables filling up.',
      packed: 'Audience demo report: peak hackathon rush! Huge queue.',
    };

    await submitReport(selectedVenue.id, level, noteMap[level]);
    setLastActionMessage(`Simulated live "${level}" report sent for ${selectedVenue.name}`);
    setTimeout(() => setLastActionMessage(null), 3000);
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      projectorHighContrast 
        ? 'bg-[#121A16] text-[#F7F3EB]' 
        : 'bg-[#F7F3EB] text-[#1F2421]'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Projector Header Bar */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          projectorHighContrast 
            ? 'bg-[#1B2E26] border-[#325243]' 
            : 'bg-white border-[#E2D9C5]'
        }`}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C5] shadow-xs p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img src="/hydvibe-logo.png" alt="HydVibe" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-caramel text-xs font-bold uppercase tracking-wider mb-1">
                <MonitorPlay className="w-4 h-4" />
                Live Stage & Hackathon Mode
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                HydVibe Realtime Command Center
              </h1>
              <p className={`text-sm mt-1 max-w-2xl ${projectorHighContrast ? 'text-gray-300' : 'text-charcoal-muted'}`}>
                Interactive crowd intelligence platform for Hyderabad. Scan the QR code with any mobile device to participate in the live crowd sync test.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setProjectorHighContrast((prev) => !prev)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                projectorHighContrast
                  ? 'bg-caramel text-forest-dark border-caramel'
                  : 'bg-forest text-white border-forest hover:bg-forest-light'
              }`}
            >
              <Layers className="w-4 h-4" />
              {projectorHighContrast ? 'Standard Ivory Mode' : 'Projector Night Mode'}
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-5 rounded-3xl border shadow-soft ${
            projectorHighContrast ? 'bg-[#1B2E26] border-[#325243]' : 'bg-white border-[#E2D9C5]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-caramel uppercase">Total Reports</span>
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
            <div className="text-3xl font-serif font-bold text-emerald-500">
              {totalReportCount}
            </div>
            <p className="text-[11px] opacity-70 mt-1">Stored & synced across clients</p>
          </div>

          <div className={`p-5 rounded-3xl border shadow-soft ${
            projectorHighContrast ? 'bg-[#1B2E26] border-[#325243]' : 'bg-white border-[#E2D9C5]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-caramel uppercase">Hyderabad Hubs</span>
              <TrendingUp className="w-4 h-4 text-caramel-dark" />
            </div>
            <div className="text-3xl font-serif font-bold">14</div>
            <p className="text-[11px] opacity-70 mt-1">Jubilee, Banjara, HITEC, Gachibowli</p>
          </div>

          <div className={`p-5 rounded-3xl border shadow-soft ${
            projectorHighContrast ? 'bg-[#1B2E26] border-[#325243]' : 'bg-white border-[#E2D9C5]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-caramel uppercase">Contributors</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-serif font-bold">
              {activeContributorsCount}
            </div>
            <p className="text-[11px] opacity-70 mt-1">Active community nodes</p>
          </div>

          <div className={`p-5 rounded-3xl border shadow-soft ${
            projectorHighContrast ? 'bg-[#1B2E26] border-[#325243]' : 'bg-white border-[#E2D9C5]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-caramel uppercase">Broadcast Channel</span>
              <Radio className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              Connected
            </div>
            <p className="text-[11px] opacity-70 mt-1">Zero latency local bus</p>
          </div>
        </div>

        {/* Action feedback banner */}
        {lastActionMessage && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center gap-2 text-sm text-emerald-300 font-medium animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{lastActionMessage}</span>
          </div>
        )}

        {/* Central Demo Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: QR Code Scanner for Audience */}
          <div className={`p-6 sm:p-7 rounded-3xl border shadow-card flex flex-col items-center text-center justify-between ${
            projectorHighContrast ? 'bg-[#1B2E26] border-[#325243]' : 'bg-white border-[#E2D9C5]'
          }`}>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel/20 text-caramel text-xs font-semibold mb-3">
                <QrCode className="w-3.5 h-3.5" />
                Audience Interactive Scan
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2">
                Scan & Report Live
              </h3>
              <p className={`text-xs mb-6 max-w-xs ${projectorHighContrast ? 'text-gray-300' : 'text-charcoal-muted'}`}>
                Open camera on your phone. Any crowd report submitted instantly updates this projector screen without reload.
              </p>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl shadow-elevated border border-[#E2D9C5] inline-block mb-5">
                <QRCodeSVG
                  value={qrTargetUrl}
                  size={190}
                  level="H"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#243D32"
                />
              </div>
            </div>

            <div className="w-full pt-4 border-t border-current/10 text-xs opacity-75">
              <span>Pointing to: </span>
              <strong className="underline break-all">{qrTargetUrl}</strong>
            </div>
          </div>

          {/* Column 2: Live Simulator Controls */}
          <div className={`p-6 sm:p-7 rounded-3xl border shadow-card flex flex-col justify-between ${
            projectorHighContrast ? 'bg-[#1B2E26] border-[#325243]' : 'bg-white border-[#E2D9C5]'
          }`}>
            <div>
              <div className="flex items-center gap-2 text-caramel text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Live Demo Scenarios
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2">
                Simulated Crowd Triggers
              </h3>
              <p className={`text-xs mb-5 ${projectorHighContrast ? 'text-gray-300' : 'text-charcoal-muted'}`}>
                Trigger realistic Hyderabad crowd patterns to showcase the decision intelligence engine in action.
              </p>

              {/* Macro Simulator Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    simulateCrowdSpike('Jubilee Hills');
                    setLastActionMessage('Triggered Jubilee Hills Evening Rush Hour!');
                    setTimeout(() => setLastActionMessage(null), 3000);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-orange-500/15 border border-orange-500/40 hover:bg-orange-500/25 text-left transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      Simulate Jubilee Hills Evening Rush
                    </div>
                    <p className="text-[11px] opacity-75 mt-0.5">Spikes Road 45 cafés to Busy & Packed with waitlists</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    simulateMorningCalm();
                    setLastActionMessage('Simulated Sunday Morning Serenity!');
                    setTimeout(() => setLastActionMessage(null), 3000);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-left transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <SunMedium className="w-3.5 h-3.5" />
                      Simulate Sunday Morning Serenity
                    </div>
                    <p className="text-[11px] opacity-75 mt-0.5">Resets heritage cafés to Empty with prime focus windows</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    resetToDefaults();
                    setLastActionMessage('Reset all simulated and live data to defaults.');
                    setTimeout(() => setLastActionMessage(null), 3000);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-charcoal/10 border border-current/20 hover:bg-charcoal/20 text-left transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Data to Default Seed State
                  </div>
                </button>
              </div>

              {/* Single Venue Live Tweak */}
              <div className="pt-4 border-t border-current/10">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                  Target Specific Café:
                </label>
                <select
                  value={selectedDemoVenueId}
                  onChange={(e) => setSelectedDemoVenueId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                    projectorHighContrast 
                      ? 'bg-[#121A16] border-[#325243] text-white' 
                      : 'bg-white border-[#E2D9C5] text-charcoal'
                  }`}
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.area}) — Currently {v.currentCrowdLevel}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-4 gap-1.5 mt-3">
                  {(['empty', 'comfortable', 'busy', 'packed'] as CrowdLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleTriggerSimulatedReport(lvl)}
                      className="py-2 text-[11px] font-bold rounded-xl border capitalize transition-all hover:scale-105 active:scale-95"
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Venue Spotlight & Intelligence Response */}
          <div className={`p-6 sm:p-7 rounded-3xl border shadow-card flex flex-col justify-between ${
            projectorHighContrast ? 'bg-[#1B2E26] border-[#325243]' : 'bg-white border-[#E2D9C5]'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-caramel uppercase tracking-wider">
                  Live Venue Spotlight
                </span>
                <CrowdBadge 
                  level={selectedVenue.currentCrowdLevel} 
                  lastReportedMinutesAgo={selectedVenue.lastReportedMinutesAgo}
                  size="sm"
                />
              </div>

              <div className="relative aspect-16/9 rounded-2xl overflow-hidden mb-4 border border-current/15">
                <img
                  src={selectedVenue.images[0]}
                  alt={selectedVenue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="font-serif font-bold text-lg leading-tight">{selectedVenue.name}</h4>
                  <p className="text-xs opacity-80">{selectedVenue.area} • ₹{selectedVenue.costForTwo} for two</p>
                </div>
              </div>

              {/* Decision Intelligence Recommendation Card */}
              <div className={`p-4 rounded-2xl border mb-4 ${
                selectedVenue.shouldGoNowRecommendation.badgeColor === 'emerald'
                  ? 'bg-emerald-500/15 border-emerald-500/30'
                  : selectedVenue.shouldGoNowRecommendation.badgeColor === 'amber'
                  ? 'bg-amber-500/15 border-amber-500/30'
                  : selectedVenue.shouldGoNowRecommendation.badgeColor === 'orange'
                  ? 'bg-orange-500/15 border-orange-500/30'
                  : 'bg-rose-500/15 border-rose-500/30'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Recommendation Engine:</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20">
                    {selectedVenue.shouldGoNowRecommendation.verdict}
                  </span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {selectedVenue.shouldGoNowRecommendation.description}
                </p>
              </div>

              {/* Confidence Metrics */}
              <div className="text-xs space-y-1.5 opacity-80 border-t border-current/10 pt-3">
                <div className="flex justify-between">
                  <span>Confidence Score:</span>
                  <strong>{selectedVenue.confidence} ({selectedVenue.recentReportCount} recent reports)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Trend Direction:</span>
                  <strong className="capitalize">{selectedVenue.trend.replace('_', ' ')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Noise Rating:</span>
                  <strong>{selectedVenue.noiseLevel}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-current/10 flex gap-2">
              <button
                onClick={() => onSelectVenue(selectedVenue)}
                className="flex-1 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                Inspect Venue Details
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenReportModal(selectedVenue)}
                className="py-2.5 px-3.5 rounded-xl border border-current/20 hover:bg-current/10 text-xs font-semibold transition-all cursor-pointer"
              >
                Report
              </button>
            </div>
          </div>
        </div>

        {/* Live Feed Ticker across the bottom */}
        <div className={`p-6 rounded-3xl border shadow-card ${
          projectorHighContrast ? 'bg-[#1B2E26] border-[#325243]' : 'bg-white border-[#E2D9C5]'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h4 className="font-serif font-bold text-lg">Realtime Incoming Stream</h4>
            </div>
            <span className="text-xs opacity-70">
              Showing latest {Math.min(6, reports.length)} updates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reports.slice(0, 6).map((rep) => (
              <div
                key={rep.id}
                className="p-3.5 rounded-2xl bg-current/5 border border-current/10 flex flex-col justify-between gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs truncate max-w-[150px]">
                    {rep.venueName}
                  </span>
                  <CrowdBadge level={rep.level} size="sm" showRecency={false} />
                </div>
                {rep.note && (
                  <p className="text-[11px] opacity-80 line-clamp-1 italic">
                    "{rep.note}"
                  </p>
                )}
                <div className="flex items-center justify-between text-[10px] opacity-60 pt-1">
                  <span>{rep.isSimulated ? 'Demo Simulated' : 'Live User'}</span>
                  <span>{Math.round((Date.now() - rep.timestamp) / 60000)}m ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
