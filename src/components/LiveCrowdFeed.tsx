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
    <div className="bg-[#191D19] text-[#F7F3EB] rounded-3xl border border-[#2D322E] shadow-card p-6 sm:p-8 transition-all">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-[#2D322E] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold tracking-tight text-white">
              Live Crowd Telemetry
            </h3>
            <p className="text-xs text-[#9EA19A]">
              Decentralized crowd updates from verified visits across Hyderabad
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{reports.length} Reports Logged</span>
          </div>
        </div>
      </div>

      {/* Reports Timeline */}
      <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
        {reports.map((report) => {
          const venue = getVenue(report.venueId);
          const minutesAgo = Math.max(1, Math.round((Date.now() - report.timestamp) / (1000 * 60)));

          return (
            <div
              key={report.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#222722] border border-[#2D322E] hover:border-emerald-500/40 transition-all flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <button
                    onClick={() => onSelectVenueById(report.venueId)}
                    className="font-serif font-bold text-base text-white hover:text-caramel-light text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{report.venueName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-caramel opacity-70" />
                  </button>
                  <div className="flex items-center gap-2 text-xs text-[#9EA19A] mt-0.5">
                    {venue && <span>{venue.area}</span>}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {minutesAgo <= 1 ? 'Just now' : `${minutesAgo}m ago`}
                    </span>
                  </div>
                </div>

                <CrowdBadge level={report.level} size="sm" showRecency={false} />
              </div>

              {/* Note if provided */}
              {report.note && (
                <div className="text-xs text-[#E3E9DD] bg-[#191D19]/90 p-3 rounded-xl border border-[#2D322E] flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-caramel shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{report.note}</span>
                </div>
              )}

              {/* Footer info: attribution & quick report */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2D322E]/60">
                <span className="text-[#9EA19A] flex items-center gap-1.5 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {report.userBadge || 'Community Member'}
                </span>

                <div className="flex items-center gap-2">
                  {report.isSimulated ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#2D322E] text-[#9EA19A] font-mono text-[10px]">
                      Simulated Demo
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium text-[10px] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Live Verified
                    </span>
                  )}

                  {venue && onOpenReportForVenue && (
                    <button
                      onClick={() => onOpenReportForVenue(venue)}
                      className="text-caramel-light hover:underline font-semibold text-[11px] cursor-pointer ml-1"
                    >
                      Report update
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
