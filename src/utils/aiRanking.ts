import type { VenueWithLiveStatus, VibeCategory, MoodCategory, Area, CrowdLevel, SearchQueryAnalysis } from '../types';

export const EXAMPLE_PROMPTS = [
  "Quiet café for deep work",
  "Aesthetic date spot under ₹800",
  "Find somewhere less crowded",
  "Specialty pour-overs in Jubilee Hills",
  "Breezy garden brunch with pets",
  "Tech roastery near HITEC City with high-speed Wi-Fi",
];

export const MOOD_CONFIG: Record<
  MoodCategory,
  {
    label: string;
    description: string;
    vibes: VibeCategory[];
    searchQuery: string;
    icon: string;
  }
> = {
  'Deep Work': {
    label: 'Deep Work',
    description: 'High-speed fiber Wi-Fi & booth charging sockets',
    vibes: ['Work-friendly', 'Quiet'],
    searchQuery: 'Quiet café with high-speed Wi-Fi and power sockets for deep work',
    icon: 'Laptop',
  },
  'Coffee Date': {
    label: 'Coffee Date',
    description: 'Intimate seating, delicate pastries & warm lighting',
    vibes: ['Date', 'Aesthetic', 'Specialty Coffee'],
    searchQuery: 'Aesthetic intimate date spot with artisan desserts',
    icon: 'Heart',
  },
  'Social Hangout': {
    label: 'Social Hangout',
    description: 'Spacious multi-tiered seating & lively conversations',
    vibes: ['Social', 'Outdoor'],
    searchQuery: 'Lively café for social gathering and group brunch',
    icon: 'Users',
  },
  'Solo Reset': {
    label: 'Solo Reset',
    description: 'Tranquil shade beneath ancient trees & book nooks',
    vibes: ['Quiet', 'Outdoor', 'Aesthetic'],
    searchQuery: 'Peaceful garden sanctuary for book reading and solo reset',
    icon: 'Sparkles',
  },
  'Study Session': {
    label: 'Study Session',
    description: 'Ergonomic study pods & uninterrupted single-origins',
    vibes: ['Work-friendly', 'Quiet'],
    searchQuery: 'Quiet study session café with reliable power and coffee',
    icon: 'BookOpen',
  },
  'Budget Friendly': {
    label: 'Budget Friendly',
    description: 'Satisfying coffee & hearty portions under ₹800',
    vibes: ['Budget'],
    searchQuery: 'Pocket-friendly café under 800 for two with great vibe',
    icon: 'Wallet',
  },
  'Aesthetic Spots': {
    label: 'Aesthetic Spots',
    description: 'Architectural terracotta, sunlit atriums & boutique flora',
    vibes: ['Aesthetic', 'Outdoor'],
    searchQuery: 'Aesthetic photogenic café with stunning design and courtyards',
    icon: 'Compass',
  },
};

export function parseNaturalLanguageQuery(query: string): SearchQueryAnalysis {
  const normalized = query.toLowerCase().trim();

  const analysis: SearchQueryAnalysis = {
    rawQuery: query,
    extractedVibes: [],
    requiresWifi: false,
    requiresSockets: false,
    requiresOutdoor: false,
    requiresPetFriendly: false,
    isNaturalLanguage: false,
  };

  if (!normalized) return analysis;

  // Determine if it's natural language (> 2 words or contains conversational terms)
  if (normalized.split(/\s+/).length >= 2 || /in|with|for|near|spot|place|where|can|need|want/.test(normalized)) {
    analysis.isNaturalLanguage = true;
  }

  // Area detection
  if (/jubilee(\s*hills)?/.test(normalized)) analysis.extractedArea = 'Jubilee Hills';
  else if (/banjara(\s*hills)?/.test(normalized)) analysis.extractedArea = 'Banjara Hills';
  else if (/madhapur/.test(normalized)) analysis.extractedArea = 'Madhapur';
  else if (/gachibowli/.test(normalized)) analysis.extractedArea = 'Gachibowli';
  else if (/kondapur/.test(normalized)) analysis.extractedArea = 'Kondapur';
  else if (/hitec|hi-tech|cyberabad|mindspace|knowledge\s*city/.test(normalized)) analysis.extractedArea = 'HITEC City';

  // Vibe keyword detection
  const detectedVibes = new Set<VibeCategory>();

  if (/quiet|peaceful|silent|calm|read|reading|book|study|serene|uninterrupted/.test(normalized)) {
    detectedVibes.add('Quiet');
  }
  if (/deep\s*work/.test(normalized)) {
    detectedVibes.add('Work-friendly');
    detectedVibes.add('Quiet');
    analysis.requiresWifi = true;
    analysis.requiresSockets = true;
  }
  if (/aesthetic|pretty|interior|design|beautiful|cozy|photogenic|instagram|decor/.test(normalized)) {
    detectedVibes.add('Aesthetic');
  }
  if (/work|laptop|coding|code|desk|focus|productivity|remote|office|plug|socket|power|wifi|wi-fi/.test(normalized)) {
    detectedVibes.add('Work-friendly');
  }
  if (/date|romantic|couple|candle|intimate|anniversary|partner/.test(normalized)) {
    detectedVibes.add('Date');
  }
  if (/social|friends|hangout|gathering|squad|group|meetup|lively|vibe/.test(normalized)) {
    detectedVibes.add('Social');
  }
  if (/budget|cheap|affordable|pocket[- ]friendly|economical|student|under\s*(500|700|800|1000)/.test(normalized)) {
    detectedVibes.add('Budget');
  }
  if (/specialty\s*coffee|pour[- ]over|pourover|espresso|single[- ]origin|roaster|brew|beans|aeropress|cortado/.test(normalized)) {
    detectedVibes.add('Specialty Coffee');
  }
  if (/pet|dog|puppy|cat|furry|animals/.test(normalized)) {
    detectedVibes.add('Pet-friendly');
  }
  if (/outdoor|garden|open[- ]air|terrace|patio|balcony|verandah|outside|breeze|trees/.test(normalized)) {
    detectedVibes.add('Outdoor');
  }

  analysis.extractedVibes = Array.from(detectedVibes);

  // Amenity requirements
  if (/wifi|wi-fi|internet|speed|fiber/.test(normalized)) analysis.requiresWifi = true;
  if (/socket|plug|charging|power|outlet/.test(normalized)) analysis.requiresSockets = true;
  if (/outdoor|garden|patio|open[- ]air/.test(normalized)) analysis.requiresOutdoor = true;
  if (/pet|dog/.test(normalized)) analysis.requiresPetFriendly = true;

  // Crowd preference
  if (/not (too )?crowded|empty|chill|low crowd|less crowd|less crowded|somewhere less|quiet right now|open tables|peace/.test(normalized)) {
    analysis.preferredCrowd = ['empty', 'comfortable'];
  } else if (/buzzing|lively|happening|energetic/.test(normalized)) {
    analysis.preferredCrowd = ['comfortable', 'busy'];
  }

  // Budget ceiling extraction
  const budgetMatch = normalized.match(/under\s*(\d{3,4})/);
  if (budgetMatch) {
    analysis.extractedMaxBudget = parseInt(budgetMatch[1], 10);
  } else if (/cheap|budget|affordable/.test(normalized)) {
    analysis.extractedMaxBudget = 800;
  }

  return analysis;
}

export interface RankOptions {
  activeVibeFilters?: VibeCategory[];
  activeAreaFilter?: Area | 'all';
  activeCrowdFilter?: CrowdLevel | 'all';
  activeSort?: 'vibe-match' | 'crowd-chill' | 'rating' | 'price-asc';
}

export function rankVenues(
  venues: VenueWithLiveStatus[],
  query: string,
  options: RankOptions = {}
): VenueWithLiveStatus[] {
  const analysis = parseNaturalLanguageQuery(query);
  const {
    activeVibeFilters = [],
    activeAreaFilter = 'all',
    activeCrowdFilter = 'all',
    activeSort = 'vibe-match',
  } = options;

  // Combine manual vibe filters and AI extracted vibes
  const combinedVibePreferences = Array.from(
    new Set([...analysis.extractedVibes, ...activeVibeFilters])
  );

  const targetArea = activeAreaFilter !== 'all' ? activeAreaFilter : analysis.extractedArea;

  const scoredVenues = venues.map((venue) => {
    let score = 50; // base score
    const matchReasons: string[] = [];

    // 1. Text direct match (venue name, address, tagline, specialties)
    const normName = venue.name.toLowerCase();
    const normQuery = query.toLowerCase();
    if (query.trim() && normName.includes(normQuery)) {
      score += 40;
      matchReasons.push('Direct name match');
    }

    // 2. Area match
    if (targetArea) {
      if (venue.area === targetArea) {
        score += 25;
        matchReasons.push(`Located in ${targetArea}`);
      } else {
        score -= 20; // lower rank for non-matching area when specifically requested
      }
    }

    // 3. Vibe affinity match
    if (combinedVibePreferences.length > 0) {
      const matchedVibes = venue.vibes.filter((v) => combinedVibePreferences.includes(v));
      const matchRatio = matchedVibes.length / combinedVibePreferences.length;
      const vibeBonus = Math.round(matchRatio * 35);
      score += vibeBonus;

      if (matchedVibes.length > 0) {
        matchReasons.push(`${matchedVibes.join(', ')} vibes`);
      }
    }

    // 4. Amenities requirements match
    if (analysis.requiresWifi) {
      if (venue.amenities.hasWifi) {
        score += 15;
        matchReasons.push(venue.amenities.wifiSpeed);
      } else {
        score -= 20;
      }
    }

    if (analysis.requiresSockets) {
      if (venue.amenities.hasSockets) {
        score += 15;
        matchReasons.push(venue.amenities.powerSockets);
      } else {
        score -= 20;
      }
    }

    if (analysis.requiresOutdoor) {
      if (venue.amenities.outdoorSeating) {
        score += 12;
        matchReasons.push('Outdoor seating available');
      } else {
        score -= 15;
      }
    }

    if (analysis.requiresPetFriendly) {
      if (venue.amenities.petFriendly) {
        score += 12;
        matchReasons.push('Pet-friendly venue');
      } else {
        score -= 15;
      }
    }

    // 5. Crowd status compatibility
    if (analysis.preferredCrowd && analysis.preferredCrowd.length > 0) {
      if (analysis.preferredCrowd.includes(venue.currentCrowdLevel)) {
        score += 18;
        matchReasons.push(`Currently ${venue.currentCrowdLevel} (${venue.lastReportedMinutesAgo}m ago)`);
      } else {
        score -= 12;
      }
    } else {
      // General crowd health: Empty & Comfortable get slight boost over Packed
      if (venue.currentCrowdLevel === 'empty') {
        score += 8;
        matchReasons.push(`Empty • No waiting`);
      } else if (venue.currentCrowdLevel === 'comfortable') {
        score += 10;
        matchReasons.push(`Comfortable buzz`);
      } else if (venue.currentCrowdLevel === 'packed') {
        score -= 8;
      }
    }

    // 6. Budget compatibility
    if (analysis.extractedMaxBudget) {
      if (venue.costForTwo <= analysis.extractedMaxBudget) {
        score += 14;
        matchReasons.push(`₹${venue.costForTwo} for two (fits budget)`);
      } else {
        score -= 15;
      }
    }

    // 7. Base rating quality boost
    score += Math.round((venue.rating - 4.0) * 10);

    // Clamp score between 45% and 99%
    const normalizedScore = Math.max(45, Math.min(99, score));

    return {
      ...venue,
      vibeMatchScore: normalizedScore,
      matchReasons: matchReasons.slice(0, 3),
    };
  });

  // Apply crowd filter if explicitly selected
  let filtered = scoredVenues;
  if (activeCrowdFilter !== 'all') {
    filtered = filtered.filter((v) => v.currentCrowdLevel === activeCrowdFilter);
  }

  // Sorting
  filtered.sort((a, b) => {
    if (activeSort === 'vibe-match') {
      return (b.vibeMatchScore || 0) - (a.vibeMatchScore || 0);
    }
    if (activeSort === 'crowd-chill') {
      const crowdRank: Record<CrowdLevel, number> = { empty: 4, comfortable: 3, busy: 2, packed: 1 };
      return crowdRank[b.currentCrowdLevel] - crowdRank[a.currentCrowdLevel];
    }
    if (activeSort === 'rating') {
      return b.rating - a.rating;
    }
    if (activeSort === 'price-asc') {
      return a.costForTwo - b.costForTwo;
    }
    return 0;
  });

  return filtered;
}
