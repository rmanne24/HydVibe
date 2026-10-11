import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Map, 
  X, 
  Check, 
  RotateCcw
} from 'lucide-react';
import type { VenueWithLiveStatus, VibeCategory, Area, CrowdLevel } from '../types';
import { EXAMPLE_PROMPTS, rankVenues, parseNaturalLanguageQuery } from '../utils/aiRanking';
import { VenueCard } from '../components/VenueCard';

interface DiscoverPageProps {
  venues: VenueWithLiveStatus[];
  onSelectVenue: (venue: VenueWithLiveStatus) => void;
  onOpenReportModal: (venue: VenueWithLiveStatus) => void;
  onSwitchToMap: () => void;
}

const QUICK_VIBES: VibeCategory[] = [
  'Quiet',
  'Aesthetic',
  'Work-friendly',
  'Budget',
  'Date',
  'Social',
  'Specialty Coffee',
  'Outdoor',
  'Pet-friendly',
];

const AREAS: (Area | 'all')[] = [
  'all',
  'Jubilee Hills',
  'Banjara Hills',
  'Madhapur',
  'Gachibowli',
  'HITEC City',
];

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  venues,
  onSelectVenue,
  onOpenReportModal,
  onSwitchToMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<VibeCategory[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | 'all'>('all');
  const [selectedCrowd, setSelectedCrowd] = useState<CrowdLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'vibe-match' | 'crowd-chill' | 'rating' | 'price-asc'>('vibe-match');

  // Analysis of current query
  const queryAnalysis = useMemo(() => {
    return parseNaturalLanguageQuery(searchQuery);
  }, [searchQuery]);

  // Ranked venues calculation
  const rankedVenues = useMemo(() => {
    return rankVenues(venues, searchQuery, {
      activeVibeFilters: selectedVibes,
      activeAreaFilter: selectedArea,
      activeCrowdFilter: selectedCrowd,
      activeSort: sortBy,
    });
  }, [venues, searchQuery, selectedVibes, selectedArea, selectedCrowd, sortBy]);

  // Featured Curated Venues (Top 3 rated with distinctive vibes)
  const featuredVenues = useMemo(() => {
    return [...venues].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [venues]);

  // Live crowd status snapshot across key hubs
  const hubCrowdSnapshot = useMemo(() => {
    const hubs: { name: Area; emptyCount: number; busyCount: number }[] = [
      { name: 'Jubilee Hills', emptyCount: 0, busyCount: 0 },
      { name: 'Banjara Hills', emptyCount: 0, busyCount: 0 },
      { name: 'HITEC City', emptyCount: 0, busyCount: 0 },
      { name: 'Gachibowli', emptyCount: 0, busyCount: 0 },
    ];

    hubs.forEach((hub) => {
      const areaVenues = venues.filter((v) => v.area === hub.name);
      hub.emptyCount = areaVenues.filter((v) => v.currentCrowdLevel === 'empty' || v.currentCrowdLevel === 'comfortable').length;
      hub.busyCount = areaVenues.filter((v) => v.currentCrowdLevel === 'busy' || v.currentCrowdLevel === 'packed').length;
    });

    return hubs;
  }, [venues]);

  const toggleVibeFilter = (vibe: VibeCategory) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleApplyPrompt = (prompt: string) => {
    setSearchQuery(prompt);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedVibes([]);
    setSelectedArea('all');
    setSelectedCrowd('all');
    setSortBy('vibe-match');
  };

  return (
    <div className="space-y-12 pb-24 md:pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-6 md:pt-12 pb-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3E9DD] border border-sage-dark text-forest text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-caramel-dark" />
            <span>AI Discovery & Live Crowd Intelligence for Hyderabad</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-forest leading-[1.15] mb-5 text-balance">
            Your next favorite place is waiting.
          </h1>

          <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto leading-relaxed mb-8">
            Describe the mood, work requirements, or crowd level you want. HydVibe scores Hyderabad’s finest cafés with live community reports.
          </p>

          {/* NATURAL LANGUAGE AI SEARCH BAR */}
          <div className="relative max-w-2xl mx-auto mb-5">
            <div className="relative flex items-center bg-white rounded-2xl md:rounded-3xl border-2 border-[#E2D9C5] focus-within:border-forest shadow-card p-2 md:p-2.5 transition-all">
              <div className="pl-3 pr-2 text-forest">
                <Search className="w-5 h-5 text-caramel-dark" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your vibe (e.g. Quiet café in Jubilee Hills with fast Wi-Fi for coding)..."
                className="w-full text-sm sm:text-base text-charcoal placeholder:text-charcoal-faint bg-transparent focus:outline-none px-2"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F0] mr-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {}}
                className="px-4 py-2.5 rounded-xl md:rounded-2xl bg-forest hover:bg-forest-light text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-caramel-light" />
                <span className="hidden sm:inline">AI Match</span>
              </button>
            </div>

            {/* AI Extracted Tags Hint */}
            {queryAnalysis.isNaturalLanguage && (queryAnalysis.extractedVibes.length > 0 || queryAnalysis.extractedArea) && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 px-3 text-xs text-charcoal-muted">
                <span className="font-semibold text-forest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-caramel-dark" />
                  Interpreted:
                </span>
                {queryAnalysis.extractedArea && (
                  <span className="px-2 py-0.5 rounded-md bg-forest/10 text-forest font-medium">
                    Area: {queryAnalysis.extractedArea}
                  </span>
                )}
                {queryAnalysis.extractedVibes.map((v) => (
                  <span key={v} className="px-2 py-0.5 rounded-md bg-[#E3E9DD] text-forest font-medium">
                    {v}
                  </span>
                ))}
                {queryAnalysis.requiresWifi && (
                  <span className="px-2 py-0.5 rounded-md bg-caramel/20 text-caramel-dark font-medium">
                    High-speed Wi-Fi
                  </span>
                )}
                {queryAnalysis.requiresSockets && (
                  <span className="px-2 py-0.5 rounded-md bg-caramel/20 text-caramel-dark font-medium">
                    Power sockets
                  </span>
                )}
              </div>
            )}
          </div>

          {/* EXAMPLE PROMPTS CHIPS */}
          <div className="max-w-2xl mx-auto flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <span className="text-[11px] font-semibold text-charcoal-muted uppercase shrink-0">
              Try:
            </span>
            {EXAMPLE_PROMPTS.slice(0, 4).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPrompt(prompt)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-forest border border-[#E2D9C5] whitespace-nowrap transition-all shadow-2xs hover:border-caramel shrink-0"
              >
                "{prompt.length > 38 ? prompt.slice(0, 36) + '...' : prompt}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE CROWD SNAPSHOT TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2D9C5] shadow-soft">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="font-serif font-bold text-base text-forest">
                Hyderabad Live Crowd Snapshot
              </h3>
            </div>
            <span className="text-xs text-charcoal-muted">
              Calculated across verified community submissions
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {hubCrowdSnapshot.map((hub) => (
              <div
                key={hub.name}
                onClick={() => setSelectedArea(selectedArea === hub.name ? 'all' : hub.name)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedArea === hub.name
                    ? 'bg-forest text-white border-forest'
                    : 'bg-[#FAF7F0] border-[#E2D9C5] hover:border-caramel/60 text-charcoal'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-bold text-sm">{hub.name}</span>
                  <MapPin className="w-3.5 h-3.5 opacity-60" />
                </div>
                <div className="flex items-center gap-2 text-xs opacity-85">
                  <span className="text-emerald-600 font-semibold">{hub.emptyCount} chill</span>
                  <span>•</span>
                  <span className="text-orange-600 font-semibold">{hub.busyCount} busy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK VIBE FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-forest">
            Explore by Atmosphere
          </h2>
          {selectedVibes.length > 0 && (
            <button
              onClick={() => setSelectedVibes([])}
              className="text-xs text-caramel-dark hover:underline font-semibold"
            >
              Clear vibes ({selectedVibes.length})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {QUICK_VIBES.map((vibe) => {
            const isSelected = selectedVibes.includes(vibe);
            return (
              <button
                key={vibe}
                onClick={() => toggleVibeFilter(vibe)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-forest text-white border-forest shadow-xs'
                    : 'bg-white text-forest border-[#E2D9C5] hover:bg-[#FAF7F0]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {vibe}
              </button>
            );
          })}
        </div>
      </section>

      {/* CURATOR'S FEATURED HIGHLIGHTS (When no search query is active) */}
      {!searchQuery && selectedVibes.length === 0 && selectedArea === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caramel-dark text-xs font-bold uppercase tracking-wider">
                Editor's Choice
              </div>
              <h2 className="font-serif text-2xl font-bold text-forest">
                Trending in Hyderabad
              </h2>
            </div>
            <button
              onClick={onSwitchToMap}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-forest hover:text-forest-light bg-white px-3 py-1.5 rounded-xl border border-[#E2D9C5]"
            >
              <Map className="w-3.5 h-3.5" />
              View on Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVenues.map((v) => (
              <VenueCard
                key={v.id}
                venue={v}
                onSelect={onSelectVenue}
                onReport={onOpenReportModal}
              />
            ))}
          </div>
        </section>
      )}

      {/* DISCOVER RESULTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls Bar: Sort, Area, List/Map toggle */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#E2D9C5] mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-forest flex items-center gap-2">
              <span>{searchQuery ? 'AI Ranked Results' : 'All Hyderabad Cafés'}</span>
              <span className="text-sm font-sans font-normal text-charcoal-muted">
                ({rankedVenues.length})
              </span>
            </h2>
            {searchQuery && (
              <p className="text-xs text-charcoal-muted mt-0.5">
                Ranked by vibe alignment, crowd recency, budget & amenities
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Area Filter Dropdown */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value as Area | 'all')}
              className="px-3 py-2 bg-white rounded-xl border border-[#E2D9C5] text-xs font-medium text-forest focus:outline-none focus:ring-1 focus:ring-forest"
            >
              <option value="all">All Hyderabad Areas</option>
              {AREAS.filter((a) => a !== 'all').map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-xl border border-[#E2D9C5] text-xs font-medium text-forest focus:outline-none focus:ring-1 focus:ring-forest"
            >
              <option value="vibe-match">Sort: Best Vibe Match</option>
              <option value="crowd-chill">Sort: Chillest Crowd First</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-asc">Sort: Price: Low to High</option>
            </select>

            {/* Map Switcher Button */}
            <button
              onClick={onSwitchToMap}
              className="px-3.5 py-2 bg-[#E3E9DD] hover:bg-sage-dark text-forest rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* RESULTS GRID */}
        {rankedVenues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankedVenues.map((venue, idx) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                rank={idx + 1}
                onSelect={onSelectVenue}
                onReport={onOpenReportModal}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E2D9C5] shadow-soft max-w-lg mx-auto">
            <div className="w-16 h-16 bg-[#FAF7F0] rounded-full flex items-center justify-center mx-auto mb-4 text-caramel-dark border border-[#E2D9C5]">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest mb-2">
              No matching cafés found
            </h3>
            <p className="text-xs text-charcoal-muted mb-6 leading-relaxed">
              We couldn't find venues matching all your selected filters. Try broadening your vibe filters or clearing the search prompt.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-forest text-white rounded-xl text-xs font-medium hover:bg-forest-light inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
