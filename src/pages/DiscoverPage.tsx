import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Map, 
  X, 
  ArrowRight,
  Laptop,
  Heart,
  Users,
  BookOpen,
  Wallet,
  Compass,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import type { VenueWithLiveStatus, MoodCategory, Area, CrowdLevel } from '../types';
import { EXAMPLE_PROMPTS, MOOD_CONFIG, rankVenues, parseNaturalLanguageQuery } from '../utils/aiRanking';
import { VenueCard } from '../components/VenueCard';
import { CrowdBadge } from '../components/CrowdBadge';

interface DiscoverPageProps {
  venues: VenueWithLiveStatus[];
  onSelectVenue: (venue: VenueWithLiveStatus) => void;
  onOpenReportModal: (venue: VenueWithLiveStatus) => void;
  onSwitchToMap: () => void;
}

const AREAS: (Area | 'all')[] = [
  'all',
  'Jubilee Hills',
  'Banjara Hills',
  'Madhapur',
  'Gachibowli',
  'HITEC City',
];

const MOODS: MoodCategory[] = [
  'Deep Work',
  'Coffee Date',
  'Social Hangout',
  'Solo Reset',
  'Study Session',
  'Budget Friendly',
  'Aesthetic Spots',
];

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  venues,
  onSelectVenue,
  onOpenReportModal,
  onSwitchToMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMood, setActiveMood] = useState<MoodCategory | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | 'all'>('all');
  const [selectedCrowd, setSelectedCrowd] = useState<CrowdLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'vibe-match' | 'crowd-chill' | 'rating' | 'price-asc'>('vibe-match');

  // Interpret natural language query
  const queryAnalysis = useMemo(() => {
    return parseNaturalLanguageQuery(searchQuery);
  }, [searchQuery]);

  // Combined vibe filters from active mood
  const activeVibes = useMemo(() => {
    if (activeMood) {
      return MOOD_CONFIG[activeMood].vibes;
    }
    return [];
  }, [activeMood]);

  // Ranked venues calculation
  const rankedVenues = useMemo(() => {
    return rankVenues(venues, searchQuery, {
      activeVibeFilters: activeVibes,
      activeAreaFilter: selectedArea,
      activeCrowdFilter: selectedCrowd,
      activeSort: sortBy,
    });
  }, [venues, searchQuery, activeVibes, selectedArea, selectedCrowd, sortBy]);

  // Locality summaries for Section A (Live Crowd Pulse)
  const localitySummaries = useMemo(() => {
    const localityList: {
      name: Area;
      description: string;
      status: 'chill' | 'balanced' | 'busy';
      venuesCount: number;
    }[] = [
      {
        name: 'Jubilee Hills',
        description: 'Breezy courtyard tables & steady focus pods',
        status: 'balanced',
        venuesCount: venues.filter((v) => v.area === 'Jubilee Hills').length,
      },
      {
        name: 'Banjara Hills',
        description: 'Tranquil heritage verandas with low crowd',
        status: 'chill',
        venuesCount: venues.filter((v) => v.area === 'Banjara Hills').length,
      },
      {
        name: 'HITEC City',
        description: 'Brisk corporate turnover, fast counter flow',
        status: 'busy',
        venuesCount: venues.filter((v) => v.area === 'HITEC City').length,
      },
      {
        name: 'Gachibowli',
        description: 'Peaceful garden pergolas & study seating',
        status: 'chill',
        venuesCount: venues.filter((v) => v.area === 'Gachibowli').length,
      },
    ];

    return localityList;
  }, [venues]);

  // Spotlight venue for hero right column
  const heroSpotlightVenue = useMemo(() => {
    return venues.find((v) => v.id === 'roastery-coffee-house') || venues[0];
  }, [venues]);

  const handleApplyPrompt = (prompt: string) => {
    setSearchQuery(prompt);
    setActiveMood(null);
  };

  const handleSelectMood = (mood: MoodCategory) => {
    if (activeMood === mood) {
      setActiveMood(null);
      setSearchQuery('');
    } else {
      setActiveMood(mood);
      setSearchQuery(MOOD_CONFIG[mood].searchQuery);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveMood(null);
    setSelectedArea('all');
    setSelectedCrowd('all');
    setSortBy('vibe-match');
  };

  const getMoodIcon = (mood: MoodCategory) => {
    switch (mood) {
      case 'Deep Work': return <Laptop className="w-4 h-4" />;
      case 'Coffee Date': return <Heart className="w-4 h-4" />;
      case 'Social Hangout': return <Users className="w-4 h-4" />;
      case 'Solo Reset': return <Sparkles className="w-4 h-4" />;
      case 'Study Session': return <BookOpen className="w-4 h-4" />;
      case 'Budget Friendly': return <Wallet className="w-4 h-4" />;
      case 'Aesthetic Spots': return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-28 md:pb-20">
      {/* =========================================================
          HERO SECTION — SPACIOUS ASYMMETRICAL EDITORIAL COMPOSITION
      ========================================================= */}
      <section className="relative pt-8 md:pt-16 pb-6 md:pb-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Expressive Copy & Wide Search */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/70 border border-sage-dark/60 text-forest text-[11px] font-semibold tracking-wide uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Hyderabad City Discovery • Realtime Intel</span>
              </div>

              {/* Expressive Left-Aligned Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-forest leading-[1.1] mb-5">
                Find your kind <br className="hidden sm:inline" />of place.
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-base sm:text-lg text-charcoal-muted max-w-xl leading-relaxed mb-8">
                Discover the right vibe. Know the crowd. Make every outing count across Hyderabad’s finest cafés and lifestyle destinations.
              </p>

              {/* Large, Wide Natural-Language Search Field */}
              <div className="w-full max-w-2xl">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="relative flex items-center bg-white rounded-2xl border-2 border-[#E2D9C5] focus-within:border-forest focus-within:ring-3 focus-within:ring-forest/10 shadow-card p-2 transition-all"
                >
                  <div className="pl-3 pr-2 text-forest shrink-0">
                    <Search className="w-5 h-5 text-caramel-dark" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeMood) setActiveMood(null);
                    }}
                    placeholder="Describe your ideal place in Hyderabad..."
                    className="w-full text-sm sm:text-base text-charcoal placeholder:text-charcoal-faint bg-transparent focus:outline-none px-2 font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveMood(null);
                      }}
                      className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F0] mr-1 shrink-0 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-caramel-light" />
                    <span>AI Match</span>
                  </button>
                </form>

                {/* AI Interpreted Intent Pills (when active) */}
                {queryAnalysis.isNaturalLanguage && (queryAnalysis.extractedVibes.length > 0 || queryAnalysis.extractedArea || queryAnalysis.preferredCrowd) && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs text-charcoal-muted">
                    <span className="font-semibold text-forest flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      Interpreted:
                    </span>
                    {queryAnalysis.extractedArea && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-forest/10 text-forest font-medium">
                        Area: {queryAnalysis.extractedArea}
                      </span>
                    )}
                    {queryAnalysis.extractedVibes.map((v) => (
                      <span key={v} className="px-2.5 py-0.5 rounded-lg bg-[#E3E9DD] text-forest font-medium">
                        {v}
                      </span>
                    ))}
                    {queryAnalysis.preferredCrowd && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                        Low crowd preferred
                      </span>
                    )}
                  </div>
                )}

                {/* Example Prompts as Clean, Horizontal Chips (Not clipped, comfortable spacing) */}
                <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  <span className="text-[11px] font-bold text-caramel-dark uppercase tracking-wider shrink-0">
                    Try:
                  </span>
                  {EXAMPLE_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPrompt(prompt)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-forest border border-[#E2D9C5] whitespace-nowrap transition-all shadow-2xs hover:border-caramel shrink-0 cursor-pointer"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Visual Showcase (Intentional Asymmetry) */}
            <div className="lg:col-span-5 hidden lg:block">
              <div 
                className="relative bg-white rounded-3xl p-3 border border-[#E2D9C5] shadow-card group cursor-pointer"
                onClick={() => onSelectVenue(heroSpotlightVenue)}
              >
                {/* Large Editorial Photo */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-forest-dark">
                  <img
                    src={heroSpotlightVenue.images[0]}
                    alt={heroSpotlightVenue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none" />

                  {/* Floating Live Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <CrowdBadge 
                      level={heroSpotlightVenue.currentCrowdLevel} 
                      lastReportedMinutesAgo={heroSpotlightVenue.lastReportedMinutesAgo}
                      size="sm"
                    />
                  </div>

                  {/* Curated Venue Title Overlay */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-caramel-light font-medium mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{heroSpotlightVenue.area}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold leading-tight">
                      {heroSpotlightVenue.name}
                    </h3>
                  </div>
                </div>

                {/* Subtitle Card & Action */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <p className="text-xs text-charcoal-muted line-clamp-2 italic leading-relaxed">
                    "{heroSpotlightVenue.tagline}"
                  </p>
                  <button
                    type="button"
                    className="px-3.5 py-2 rounded-xl bg-forest text-white text-xs font-semibold shrink-0 flex items-center gap-1 group-hover:bg-forest-light transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5 text-caramel-light" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION A — LIVE CROWD PULSE
          Informative, clean locality summaries with crowd indicators
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="text-caramel-dark text-[11px] font-bold uppercase tracking-wider mb-1">
              Locality Telemetry
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Live Crowd Pulse
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Recent crowd distribution across Hyderabad’s prime neighborhood hubs.
            </p>
          </div>
          <div className="text-[11px] text-charcoal-muted bg-white px-3 py-1.5 rounded-full border border-[#E2D9C5] shadow-2xs">
            Community-sourced & simulated demo telemetry
          </div>
        </div>

        {/* 4 Compact Locality Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {localitySummaries.map((loc) => {
            const isSelected = selectedArea === loc.name;
            return (
              <div
                key={loc.name}
                onClick={() => setSelectedArea(isSelected ? 'all' : loc.name)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-forest text-white border-forest shadow-card'
                    : 'bg-white border-[#E2D9C5] hover:border-caramel/70 text-charcoal shadow-soft'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-lg font-bold">{loc.name}</span>
                    <span className="flex items-center gap-1 text-[11px] font-medium opacity-80">
                      <span className={`w-2 h-2 rounded-full ${
                        loc.status === 'chill' ? 'bg-emerald-500' : loc.status === 'balanced' ? 'bg-amber-500' : 'bg-orange-500'
                      }`} />
                      <span className="capitalize">{loc.status}</span>
                    </span>
                  </div>
                  <p className={`text-xs mb-4 leading-relaxed ${isSelected ? 'text-sage/90' : 'text-charcoal-muted'}`}>
                    {loc.description}
                  </p>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                  isSelected ? 'border-white/20 text-caramel-light font-medium' : 'border-[#E2D9C5]/80 text-forest font-semibold'
                }`}>
                  <span>{loc.venuesCount} cafés tracked</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION B — EXPLORE BY ATMOSPHERE (MOOD SELECTOR)
          Carefully styled mood selector buttons with editorial descriptions
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-caramel-dark text-[11px] font-bold uppercase tracking-wider mb-1">
              Curated Moods
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Explore by Atmosphere
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Select an outing intention to instantly filter matching spaces.
            </p>
          </div>
          {activeMood && (
            <button
              onClick={() => {
                setActiveMood(null);
                setSearchQuery('');
              }}
              className="text-xs text-caramel-dark hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Mood
            </button>
          )}
        </div>

        {/* 7 Styled Editorial Mood Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {MOODS.map((mood) => {
            const isSelected = activeMood === mood;
            const config = MOOD_CONFIG[mood];

            return (
              <button
                key={mood}
                type="button"
                onClick={() => handleSelectMood(mood)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[105px] ${
                  isSelected
                    ? 'bg-forest text-white border-forest shadow-card scale-[1.02]'
                    : 'bg-white border-[#E2D9C5] hover:border-caramel/70 text-charcoal shadow-soft'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/15 text-caramel-light' : 'bg-[#FAF7F0] text-forest'}`}>
                    {getMoodIcon(mood)}
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-caramel animate-ping" />}
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold leading-tight mb-1">
                    {config.label}
                  </h3>
                  <p className={`text-[10px] line-clamp-2 leading-snug ${isSelected ? 'text-sage/80' : 'text-charcoal-muted'}`}>
                    {config.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION C — GOOD PLACES RIGHT NOW (CURATED VENUE GRID)
          Visual-first venue cards with hierarchy and deliberate weight
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Controls Toolbar: Area selector, Sort dropdown, and Map toggle */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#E2D9C5] mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest flex items-center gap-2">
              <span>Good Places Right Now</span>
              <span className="text-sm font-sans font-normal text-charcoal-muted">
                ({rankedVenues.length})
              </span>
            </h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Handpicked venues ranked by vibe alignment, noise comfort, and recent crowd telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Area Filter Dropdown */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value as Area | 'all')}
              className="px-3.5 py-2 bg-white rounded-xl border border-[#E2D9C5] text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 cursor-pointer shadow-2xs"
            >
              <option value="all">All Hyderabad Hubs</option>
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
              className="px-3.5 py-2 bg-white rounded-xl border border-[#E2D9C5] text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 cursor-pointer shadow-2xs"
            >
              <option value="vibe-match">Sort: Best Vibe Match</option>
              <option value="crowd-chill">Sort: Chillest Crowd First</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-asc">Sort: Price: Low to High</option>
            </select>

            {/* Map Switcher Button */}
            <button
              onClick={onSwitchToMap}
              className="px-4 py-2 bg-[#E3E9DD] hover:bg-sage-dark text-forest rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Results Grid with Deliberate Hierarchy */}
        {rankedVenues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankedVenues.map((venue, idx) => {
              // Top result receives visual prominence when no area restriction is selected
              const isFirstFeatured = idx === 0 && selectedArea === 'all';
              return (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  rank={idx + 1}
                  isFeatured={isFirstFeatured}
                  onSelect={onSelectVenue}
                  onReport={onOpenReportModal}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E2D9C5] shadow-soft max-w-lg mx-auto">
            <div className="w-16 h-16 bg-[#FAF7F0] rounded-full flex items-center justify-center mx-auto mb-4 text-caramel-dark border border-[#E2D9C5]">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest mb-2">
              No matching spaces found
            </h3>
            <p className="text-xs text-charcoal-muted mb-6 leading-relaxed">
              We couldn't find cafés matching all your specific preferences. Try broadening your vibe or resetting your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-forest text-white rounded-xl text-xs font-semibold hover:bg-forest-light inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* =========================================================
          SECTION D — DISCOVER ON THE MAP (INTERACTIVE PREVIEW)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-forest text-white rounded-3xl p-8 sm:p-10 border border-forest-light shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl z-10">
            <div className="flex items-center gap-2 text-caramel-light text-xs font-bold uppercase tracking-wider mb-2">
              <Map className="w-4 h-4" />
              Cartographic Intelligence
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-2">
              Explore Hyderabad by Geography
            </h2>
            <p className="text-xs sm:text-sm text-sage/80 leading-relaxed">
              Navigate real-time crowd status pins across Jubilee Hills, Banjara Hills, Madhapur, and the Financial District on our interactive vector map.
            </p>
          </div>

          <button
            onClick={onSwitchToMap}
            className="px-6 py-3.5 bg-caramel hover:bg-caramel-light text-forest-dark rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-card cursor-pointer shrink-0 z-10"
          >
            <Compass className="w-4 h-4" />
            <span>Open Interactive Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Decorative Subtle Background Compass */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-5 pointer-events-none flex items-center justify-center">
            <Compass className="w-80 h-80 text-white" />
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION E — HOW HYDVIBE WORKS (3 SIMPLE STEPS)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-caramel-dark text-[11px] font-bold uppercase tracking-wider mb-1">
            Product Philosophy
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            How HydVibe Works
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Three simple steps to guarantee a seamless city outing every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-[#E2D9C5] shadow-soft">
            <div className="font-serif text-3xl font-bold text-caramel-dark mb-3">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-forest mb-2">
              Describe your vibe
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Tell our natural-language engine whether you need quiet booths for deep coding, an aesthetic garden date, or specialty pour-overs.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E2D9C5] shadow-soft">
            <div className="font-serif text-3xl font-bold text-caramel-dark mb-3">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-forest mb-2">
              Check the live crowd
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              View recency-weighted community telemetry and confidence indicators before heading out, with zero authentication friction.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E2D9C5] shadow-soft">
            <div className="font-serif text-3xl font-bold text-caramel-dark mb-3">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-forest mb-2">
              Go now or pivot
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Follow our "Should I Go Now?" recommendation, or instantly pivot to a verified chill alternative nearby if your first pick is packed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
