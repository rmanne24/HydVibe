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
  isFeatured?: boolean;
  onSelect: (venue: VenueWithLiveStatus) => void;
  onReport: (venue: VenueWithLiveStatus) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  rank,
  isFeatured = false,
  onSelect,
  onReport,
}) => {
  return (
    <article 
      className={`group bg-white rounded-3xl border border-[#E2D9C5] shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer ${
        isFeatured ? 'md:col-span-2 md:flex-row' : ''
      }`}
      onClick={() => onSelect(venue)}
    >
      {/* Photo Header */}
      <div className={`relative overflow-hidden bg-forest-dark ${
        isFeatured 
          ? 'md:w-1/2 aspect-16/10 md:aspect-auto h-64 md:h-full' 
          : 'aspect-16/10 w-full'
      }`}>
        <img
          src={venue.images[0]}
          alt={venue.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <CrowdBadge 
              level={venue.currentCrowdLevel} 
              lastReportedMinutesAgo={venue.lastReportedMinutesAgo}
              size="sm"
            />
          </div>

          {/* Vibe Match Score Badge */}
          {venue.vibeMatchScore ? (
            <div className="pointer-events-auto flex items-center gap-1 px-2.5 py-1 bg-forest/90 text-[#F7F3EB] backdrop-blur-xs rounded-full text-xs font-semibold shadow-xs">
              <Sparkles className="w-3 h-3 text-caramel-light" />
              <span>{venue.vibeMatchScore}% Match</span>
            </div>
          ) : isFeatured ? (
            <div className="pointer-events-auto px-2.5 py-1 bg-caramel-dark text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Top Pick
            </div>
          ) : null}
        </div>

        {/* Bottom Image Overlay: Area & Rating */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs z-10">
          <div className="flex items-center gap-1 font-medium drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-caramel-light" />
            <span>{venue.area}</span>
          </div>
          <div className="flex items-center gap-1 font-bold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{venue.rating}</span>
            <span className="opacity-70 text-[10px]">({venue.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between ${
        isFeatured ? 'md:w-1/2' : ''
      }`}>
        <div>
          {/* Header Row: Rank & Title */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest group-hover:text-forest-light transition-colors line-clamp-1">
              {venue.name}
            </h3>
            {rank && !isFeatured && (
              <span className="text-[11px] font-mono text-charcoal-muted font-semibold px-2 py-0.5 bg-[#FAF7F0] border border-[#E2D9C5] rounded-md shrink-0">
                #{rank}
              </span>
            )}
            {isFeatured && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-caramel-dark px-2 py-0.5 bg-caramel/15 rounded-full shrink-0">
                Spotlight
              </span>
            )}
          </div>

          {/* Tagline / Curator Insight */}
          <p className="text-xs text-charcoal-muted line-clamp-2 mb-3.5 leading-relaxed">
            {isFeatured ? venue.curatorNote : venue.tagline}
          </p>

          {/* Transparent Match Reason / Why Visit */}
          {venue.matchReasons && venue.matchReasons.length > 0 ? (
            <div className="mb-3.5 px-3 py-2 bg-[#FAF7F0] rounded-xl border border-[#E2D9C5]/80 text-[11px] text-forest font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-caramel-dark shrink-0" />
              <span className="truncate">{venue.matchReasons.join(' • ')}</span>
            </div>
          ) : (
            <div className="mb-3.5 text-[11px] text-charcoal-muted flex items-center gap-1 italic">
              <span className="text-caramel-dark font-semibold">Specialty:</span>
              <span className="truncate">{venue.signatureItems.slice(0, 2).join(', ')}</span>
            </div>
          )}

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {venue.vibes.slice(0, 3).map((vibe) => (
              <span
                key={vibe}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#E3E9DD]/70 text-forest border border-sage-dark/40"
              >
                {vibe}
              </span>
            ))}
            {venue.vibes.length > 3 && (
              <span className="text-[11px] font-normal text-charcoal-muted px-1.5 py-0.5">
                +{venue.vibes.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Snapshot & Actions */}
        <div>
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[#FAF7F0] rounded-xl border border-[#E2D9C5]/60 text-xs text-charcoal mb-4">
            <div className="flex items-center gap-1.5 truncate" title={venue.amenities.wifiSpeed}>
              <Wifi className="w-3.5 h-3.5 text-forest shrink-0" />
              <span className="truncate text-[11px]">{venue.amenities.hasWifi ? 'Wi-Fi' : 'No Wi-Fi'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate" title={venue.amenities.powerSockets}>
              <Zap className="w-3.5 h-3.5 text-caramel-dark shrink-0" />
              <span className="truncate text-[11px]">{venue.amenities.hasSockets ? 'Sockets' : 'Few Plugs'}</span>
            </div>
            <div className="flex items-center justify-end gap-0.5 font-semibold text-forest">
              <IndianRupee className="w-3 h-3 text-caramel-dark" />
              <span className="text-[11px]">{venue.costForTwo} for 2</span>
            </div>
          </div>

          {/* Noise rating & Should Go Now recommendation summary */}
          <div className="flex items-center justify-between text-xs text-charcoal-muted mb-3.5 px-0.5">
            <span className="flex items-center gap-1 text-[11px]">
              <Volume2 className="w-3.5 h-3.5 text-forest/70" />
              {venue.noiseLevel}
            </span>
            <span className="text-[11px] font-semibold text-forest truncate max-w-[150px]">
              {venue.shouldGoNowRecommendation.verdict}
            </span>
          </div>

          {/* Card Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#E2D9C5]/80">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReport(venue);
              }}
              className="py-2.5 px-3.5 rounded-xl border border-[#E2D9C5] bg-white hover:bg-[#FAF7F0] text-xs font-semibold text-forest transition-colors cursor-pointer"
            >
              Report Crowd
            </button>
            <button
              type="button"
              onClick={() => onSelect(venue)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Explore Vibe</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-caramel-light" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
