import React from 'react';
import { Radio, Clock, Sparkles, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import type { CrowdReport, VenueWithLiveStatus } from '../types';
import { CrowdBadge } from './CrowdBadge';

interface LiveCrowdFeedProps {
  reports: CrowdReport[];
  venues: VenueWithLiveStatus[];
  onSelectVenueById: (venueId: string) => void;
  onOpenReportForVenue?: (venue: VenueWithLiveStatus) => void;
}

export const LiveCrowdFeed: React.FC<LiveCrowdFeedProps> = ({
  reports,
  venues,
  onSelectVenueById,
  onOpenReportForVenue,
}) => {
  const getVenue = (venueId: string) => venues.find((v) => v.id === venueId);

  return (
    <div className="bg-white rounded-3xl border border-[#E2D9C5] shadow-soft p-6">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2D9C5] mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
            <Radio className="w-5 h-5 text-forest animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-forest">Live Crowd Stream</h3>
            <p className="text-xs text-charcoal-muted">Real-time reports from Hyderabad cafés</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Realtime Sync</span>
        </div>
      </div>

      {/* Reports Timeline */}
      <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
        {reports.map((report) => {
          const venue = getVenue(report.venueId);
          const minutesAgo = Math.max(1, Math.round((Date.now() - report.timestamp) / (1000 * 60)));

          return (
            <div
              key={report.id}
              className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C5]/80 hover:border-caramel/50 transition-all flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button
                    onClick={() => onSelectVenueById(report.venueId)}
                    className="font-serif font-bold text-sm text-forest hover:text-forest-light text-left flex items-center gap-1"
                  >
                    <span>{report.venueName}</span>
                    <ArrowRight className="w-3 h-3 text-caramel-dark opacity-60" />
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-charcoal-muted mt-0.5">
                    {venue && <span>{venue.area}</span>}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {minutesAgo <= 1 ? 'Just now' : `${minutesAgo}m ago`}
                    </span>
                  </div>
                </div>

                <CrowdBadge level={report.level} size="sm" showRecency={false} />
              </div>

              {/* Note if present */}
              {report.note && (
                <div className="text-xs text-charcoal bg-white/80 p-2.5 rounded-xl border border-[#E2D9C5]/60 flex items-start gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-caramel-dark shrink-0 mt-0.5" />
                  <span>{report.note}</span>
                </div>
              )}

              {/* Attribution & badges */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-charcoal-muted flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3 text-forest" />
                  {report.userBadge || 'Community Member'}
                </span>

                {report.isSimulated ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#EBE4D5] text-charcoal-muted font-mono text-[10px]">
                      Simulated Demo Data
                    </span>
                    {venue && onOpenReportForVenue && (
                      <button
                        onClick={() => onOpenReportForVenue(venue)}
                        className="text-forest hover:text-caramel-dark font-semibold text-[10px] underline cursor-pointer"
                      >
                        Report now
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium text-[10px] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Verified Live
                    </span>
                    {venue && onOpenReportForVenue && (
                      <button
                        onClick={() => onOpenReportForVenue(venue)}
                        className="text-forest hover:text-caramel-dark font-semibold text-[10px] underline cursor-pointer"
                      >
                        Report now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
