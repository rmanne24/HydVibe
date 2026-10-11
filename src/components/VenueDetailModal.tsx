import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Compass, 
  Wifi, 
  Zap, 
  Volume2, 
  IndianRupee, 
  Star, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Sparkles,
  Phone,
  Check,
  Share2
} from 'lucide-react';
import type { VenueWithLiveStatus } from '../types';
import { CrowdBadge } from './CrowdBadge';

interface VenueDetailModalProps {
  venue: VenueWithLiveStatus | null;
  allVenues: VenueWithLiveStatus[];
  isOpen: boolean;
  onClose: () => void;
  onOpenReport: (venue: VenueWithLiveStatus) => void;
  onSelectAlternative: (venue: VenueWithLiveStatus) => void;
}

export const VenueDetailModal: React.FC<VenueDetailModalProps> = ({
  venue,
  allVenues,
  isOpen,
  onClose,
  onOpenReport,
  onSelectAlternative,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !venue) return null;

  const alternativeVenue = venue.shouldGoNowRecommendation.alternativeVenueId
    ? allVenues.find((v) => v.id === venue.shouldGoNowRecommendation.alternativeVenueId)
    : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-[#1F2421]/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#F7F3EB] md:rounded-3xl shadow-elevated border border-[#E2D9C5] max-h-[100vh] md:max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Actions on Top */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/85 text-forest hover:bg-white shadow-sm transition-all"
            title="Share venue"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/85 text-forest hover:bg-white shadow-sm transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Main Photo Gallery */}
          <div className="relative aspect-16/10 w-full bg-forest-dark overflow-hidden">
            <img
              src={venue.images[activePhotoIdx] || venue.images[0]}
              alt={venue.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Thumbnail Carousel */}
            {venue.images.length > 1 && (
              <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {venue.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === idx ? 'border-caramel scale-105' : 'border-white/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Crowd Badge floating top-left */}
            <div className="absolute top-4 left-4 z-10">
              <CrowdBadge 
                level={venue.currentCrowdLevel} 
                lastReportedMinutesAgo={venue.lastReportedMinutesAgo}
                size="md"
              />
            </div>
          </div>

          {/* Venue Content Information */}
          <div className="p-6">
            {/* Title & Metadata */}
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2 text-caramel-dark text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                {venue.area}
                <span className="text-[#A39E93]">•</span>
                <span>{venue.address}</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-forest leading-tight">
                {venue.name}
              </h1>
              <p className="text-sm text-charcoal-muted mt-1 italic">
                "{venue.tagline}"
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-white/70 rounded-2xl border border-[#E2D9C5] mb-5">
              <div className="text-center border-r border-[#E2D9C5] pr-2">
                <div className="flex items-center justify-center gap-1 text-forest font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{venue.rating}</span>
                </div>
                <span className="text-[11px] text-charcoal-muted">{venue.reviewCount} reviews</span>
              </div>
              <div className="text-center border-r border-[#E2D9C5] pr-2">
                <div className="flex items-center justify-center gap-0.5 text-forest font-bold text-sm">
                  <IndianRupee className="w-3.5 h-3.5 text-caramel-dark" />
                  <span>{venue.costForTwo}</span>
                </div>
                <span className="text-[11px] text-charcoal-muted">For two people</span>
              </div>
              <div className="text-center">
                <div className="text-forest font-bold text-xs truncate">
                  {venue.noiseLevel}
                </div>
                <span className="text-[11px] text-charcoal-muted">Noise level</span>
              </div>
            </div>

            {/* "SHOULD I GO NOW?" DECISION INTELLIGENCE RECOMMENDATION */}
            <div className={`p-4 rounded-2xl border mb-6 ${
              venue.shouldGoNowRecommendation.badgeColor === 'emerald'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : venue.shouldGoNowRecommendation.badgeColor === 'amber'
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : venue.shouldGoNowRecommendation.badgeColor === 'orange'
                ? 'bg-orange-50/80 border-orange-200 text-orange-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Should I Go Now?
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-white/90 shadow-2xs">
                  {venue.shouldGoNowRecommendation.verdict}
                </span>
              </div>
              <h4 className="font-semibold text-sm mb-1">
                {venue.shouldGoNowRecommendation.headline}
              </h4>
              <p className="text-xs leading-relaxed opacity-85">
                {venue.shouldGoNowRecommendation.description}
              </p>
            </div>

            {/* RECOMMENDED ALTERNATIVE IF CROWDED */}
            {alternativeVenue && (
              <div className="mb-6 p-4 bg-[#E3E9DD]/60 border border-sage-dark rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-forest uppercase tracking-wider">
                    Nearby Chill Alternative
                  </span>
                  <CrowdBadge 
                    level={alternativeVenue.currentCrowdLevel} 
                    lastReportedMinutesAgo={alternativeVenue.lastReportedMinutesAgo}
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-serif font-bold text-base text-forest">
                      {alternativeVenue.name}
                    </h5>
                    <p className="text-xs text-charcoal-muted">
                      {alternativeVenue.area} • {alternativeVenue.noiseLevel} • ₹{alternativeVenue.costForTwo} for two
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectAlternative(alternativeVenue)}
                    className="shrink-0 px-3 py-2 bg-forest text-white rounded-xl text-xs font-medium hover:bg-forest-light flex items-center gap-1 transition-colors"
                  >
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Crowd Intelligence & Confidence Indicators */}
            <div className="p-4 bg-white/80 rounded-2xl border border-[#E2D9C5] mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-forest flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-caramel-dark" />
                  Community Crowd Intel
                </span>
                <span className="text-xs text-charcoal-muted flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {venue.confidence} Confidence ({venue.recentReportCount} recent reports)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-charcoal-muted border-t border-[#E2D9C5]/60 pt-2.5">
                <span>Last live community update:</span>
                <strong className="text-forest font-medium">
                  {venue.lastReportedMinutesAgo <= 1 ? 'Just now' : `${venue.lastReportedMinutesAgo} minutes ago`}
                </strong>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between">
                <span className="text-xs text-charcoal-muted">Are you there right now?</span>
                <button
                  onClick={() => onOpenReport(venue)}
                  className="px-3.5 py-1.5 bg-caramel-dark text-white rounded-lg text-xs font-medium hover:bg-caramel transition-colors"
                >
                  Submit Live Status
                </button>
              </div>
            </div>

            {/* Vibes & Curated Note */}
            <div className="mb-6">
              <h3 className="font-serif text-lg font-semibold text-forest mb-2">Curator's Note</h3>
              <p className="text-sm text-charcoal leading-relaxed bg-white/60 p-3.5 rounded-xl border border-[#E2D9C5]">
                {venue.curatorNote}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="mb-6">
              <h3 className="font-serif text-lg font-semibold text-forest mb-3">Space Amenities</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 bg-white/60 rounded-xl border border-[#E2D9C5]">
                  <Wifi className="w-4 h-4 text-forest shrink-0" />
                  <span className="truncate">{venue.amenities.wifiSpeed}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-white/60 rounded-xl border border-[#E2D9C5]">
                  <Zap className="w-4 h-4 text-caramel-dark shrink-0" />
                  <span className="truncate">{venue.amenities.powerSockets}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-white/60 rounded-xl border border-[#E2D9C5]">
                  <Volume2 className="w-4 h-4 text-forest shrink-0" />
                  <span>Noise: {venue.noiseLevel}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-white/60 rounded-xl border border-[#E2D9C5]">
                  <Compass className="w-4 h-4 text-forest shrink-0" />
                  <span>{venue.amenities.outdoorSeating ? 'Outdoor seating' : 'Indoor seating only'}</span>
                </div>
              </div>
            </div>

            {/* Signature Items */}
            <div className="mb-6">
              <h3 className="font-serif text-lg font-semibold text-forest mb-2">Signature Items</h3>
              <div className="flex flex-wrap gap-2">
                {venue.signatureItems.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-3 py-1.5 bg-[#FAF7F0] border border-[#E2D9C5] rounded-full text-charcoal font-medium"
                  >
                    ☕ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Opening Hours & Contact */}
            <div className="p-3.5 bg-white/60 rounded-xl border border-[#E2D9C5] text-xs text-charcoal-muted flex flex-col gap-1.5 mb-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-forest" />
                  Hours:
                </span>
                <span className="font-medium text-forest">{venue.openingHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-forest" />
                  Contact:
                </span>
                <a href={`tel:${venue.phone}`} className="font-medium text-forest hover:underline">
                  {venue.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div className="p-4 bg-white border-t border-[#E2D9C5] flex items-center gap-3">
          <a
            href={venue.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-forest hover:bg-forest-light text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Compass className="w-4 h-4 text-caramel-light" />
            Get Directions
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
          <button
            onClick={() => onOpenReport(venue)}
            className="py-3 px-4 bg-[#E3E9DD] hover:bg-[#D5DFCEx] text-forest font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Users className="w-4 h-4" />
            Report Crowd
          </button>
        </div>
      </div>
    </div>
  );
};
