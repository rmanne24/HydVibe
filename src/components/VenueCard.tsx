import React from 'react';
import { 
  Wifi, 
  Zap, 
  MapPin, 
  Star, 
  Volume2, 
  IndianRupee, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import type { VenueWithLiveStatus } from '../types';
import { CrowdBadge } from './CrowdBadge';

interface VenueCardProps {
  venue: VenueWithLiveStatus;
  rank?: number;
  onSelect: (venue: VenueWithLiveStatus) => void;
  onReport: (venue: VenueWithLiveStatus) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  rank,
  onSelect,
  onReport,
}) => {
  return (
    <div 
      className="group bg-white rounded-3xl border border-[#E2D9C5] shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
      onClick={() => onSelect(venue)}
    >
      {/* Photo Header */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-forest-dark">
        <img
          src={venue.images[0]}
          alt={venue.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <CrowdBadge 
              level={venue.currentCrowdLevel} 
              lastReportedMinutesAgo={venue.lastReportedMinutesAgo}
              size="sm"
            />
          </div>

          {/* Vibe Match Score Badge */}
          {venue.vibeMatchScore && (
            <div className="pointer-events-auto flex items-center gap-1 px-2.5 py-1 bg-forest/90 text-[#F7F3EB] backdrop-blur-xs rounded-full text-xs font-semibold shadow-xs">
              <Sparkles className="w-3 h-3 text-caramel-light" />
              <span>{venue.vibeMatchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Bottom Image Overlay: Area & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
          <div className="flex items-center gap-1 font-medium drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-caramel-light" />
            <span>{venue.area}</span>
          </div>
          <div className="flex items-center gap-1 font-bold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{venue.rating}</span>
            <span className="opacity-70 text-[10px]">({venue.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rank & Title */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif text-xl font-bold text-forest group-hover:text-forest-light transition-colors line-clamp-1">
              {venue.name}
            </h3>
            {rank && (
              <span className="text-[11px] font-mono text-caramel-dark font-semibold px-1.5 py-0.5 bg-[#FAF7F0] border border-[#E2D9C5] rounded-md shrink-0">
                #{rank}
              </span>
            )}
          </div>

          {/* Tagline */}
          <p className="text-xs text-charcoal-muted line-clamp-2 mb-3 leading-relaxed">
            {venue.tagline}
          </p>

          {/* Transparent Match Breakdown if generated */}
          {venue.matchReasons && venue.matchReasons.length > 0 && (
            <div className="mb-3.5 px-3 py-2 bg-[#FAF7F0] rounded-xl border border-[#E2D9C5]/80 text-[11px] text-forest font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-caramel-dark shrink-0" />
              <span className="truncate">{venue.matchReasons.join(' • ')}</span>
            </div>
          )}

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {venue.vibes.slice(0, 3).map((vibe) => (
              <span
                key={vibe}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#E3E9DD]/70 text-forest border border-sage-dark/50"
              >
                {vibe}
              </span>
            ))}
            {venue.vibes.length > 3 && (
              <span className="text-[11px] font-normal text-charcoal-muted px-1.5 py-0.5">
                +{venue.vibes.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Amenities & Price Snapshot */}
        <div>
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#FAF7F0] rounded-xl border border-[#E2D9C5]/60 text-xs text-charcoal mb-4">
            <div className="flex items-center gap-1.5 truncate" title={venue.amenities.wifiSpeed}>
              <Wifi className="w-3.5 h-3.5 text-forest shrink-0" />
              <span className="truncate text-[11px]">{venue.amenities.hasWifi ? 'Wi-Fi' : 'No Wi-Fi'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate" title={venue.amenities.powerSockets}>
              <Zap className="w-3.5 h-3.5 text-caramel-dark shrink-0" />
              <span className="truncate text-[11px]">{venue.amenities.hasSockets ? 'Sockets' : 'Few Plugs'}</span>
            </div>
            <div className="flex items-center justify-end gap-1 font-semibold text-forest">
              <IndianRupee className="w-3 h-3 text-caramel-dark" />
              <span className="text-[11px]">{venue.costForTwo}</span>
            </div>
          </div>

          {/* Noise & Decision Hint */}
          <div className="flex items-center justify-between text-xs text-charcoal-muted mb-4 px-1">
            <span className="flex items-center gap-1 text-[11px]">
              <Volume2 className="w-3.5 h-3.5 text-forest" />
              {venue.noiseLevel}
            </span>
            <span className="text-[11px] font-medium text-forest truncate max-w-[140px]">
              {venue.shouldGoNowRecommendation.verdict}
            </span>
          </div>

          {/* Card Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#E2D9C5]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReport(venue);
              }}
              className="py-2 px-3 rounded-xl border border-[#E2D9C5] bg-white hover:bg-[#FAF7F0] text-xs font-medium text-forest transition-colors"
            >
              Report Crowd
            </button>
            <button
              type="button"
              onClick={() => onSelect(venue)}
              className="flex-1 py-2 px-3 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              Explore Vibe
              <ArrowUpRight className="w-3.5 h-3.5 text-caramel-light" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
