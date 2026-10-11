export type CrowdLevel = 'empty' | 'comfortable' | 'busy' | 'packed';

export type VibeCategory = 
  | 'Quiet' 
  | 'Aesthetic' 
  | 'Work-friendly' 
  | 'Budget' 
  | 'Date' 
  | 'Social'
  | 'Specialty Coffee'
  | 'Pet-friendly'
  | 'Outdoor';

export type Area = 
  | 'Jubilee Hills' 
  | 'Banjara Hills' 
  | 'Madhapur' 
  | 'Gachibowli' 
  | 'Kondapur' 
  | 'HITEC City';

export type NoiseLevel = 'Whisper quiet' | 'Gentle buzz' | 'Energetic' | 'Lively & loud';

export type PriceTier = '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';

export interface CrowdReport {
  id: string;
  venueId: string;
  venueName: string;
  level: CrowdLevel;
  note?: string;
  timestamp: number; // Unix ms
  isSimulated: boolean;
  userBadge?: string;
}

export interface VenueAmenities {
  wifiSpeed: string; // e.g. "120 Mbps Fast Wi-Fi"
  hasWifi: boolean;
  powerSockets: string; // e.g. "At all booth tables"
  hasSockets: boolean;
  outdoorSeating: boolean;
  petFriendly: boolean;
  airConditioned: boolean;
  valetParking: boolean;
  specialtyRoast: boolean;
  veganOptions: boolean;
}

export interface Venue {
  id: string;
  name: string;
  tagline: string;
  area: Area;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  priceTier: PriceTier;
  costForTwo: number; // in INR
  images: string[];
  vibes: VibeCategory[];
  noiseLevel: NoiseLevel;
  amenities: VenueAmenities;
  signatureItems: string[];
  curatorNote: string;
  openingHours: string;
  googleMapsUrl: string;
  phone: string;
  defaultCrowdLevel: CrowdLevel;
}

export interface VenueWithLiveStatus extends Venue {
  currentCrowdLevel: CrowdLevel;
  lastReportedMinutesAgo: number;
  confidence: 'High' | 'Medium' | 'Low';
  recentReportCount: number;
  trend: 'clearing' | 'stable' | 'filling_up';
  vibeMatchScore?: number;
  matchReasons?: string[];
  shouldGoNowRecommendation: {
    verdict: 'Definitely Go Now' | 'Great Time to Visit' | 'Expect a Buzz' | 'Consider Alternative';
    badgeColor: 'emerald' | 'amber' | 'orange' | 'rose';
    headline: string;
    description: string;
    alternativeVenueId?: string;
  };
}

export interface SearchQueryAnalysis {
  rawQuery: string;
  extractedVibes: VibeCategory[];
  extractedArea?: Area;
  extractedMaxBudget?: number;
  requiresWifi: boolean;
  requiresSockets: boolean;
  requiresOutdoor: boolean;
  requiresPetFriendly: boolean;
  preferredCrowd?: CrowdLevel[];
  isNaturalLanguage: boolean;
}
