import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  X, 
  MapPin, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import type { VenueWithLiveStatus, Area, CrowdLevel } from '../types';
import { CrowdBadge } from './CrowdBadge';

interface HydVibeMapProps {
  venues: VenueWithLiveStatus[];
  onSelectVenue: (venue: VenueWithLiveStatus) => void;
  onReportVenue: (venue: VenueWithLiveStatus) => void;
}

const AREAS: Area[] = [
  'Jubilee Hills',
  'Banjara Hills',
  'Madhapur',
  'Gachibowli',
  'HITEC City',
];

const CROWD_FILTER_OPTIONS: { label: string; value: CrowdLevel | 'all'; dot: string }[] = [
  { label: 'All Levels', value: 'all', dot: 'bg-charcoal' },
  { label: 'Empty', value: 'empty', dot: 'bg-emerald-500' },
  { label: 'Comfortable', value: 'comfortable', dot: 'bg-amber-500' },
  { label: 'Busy', value: 'busy', dot: 'bg-orange-500' },
  { label: 'Packed', value: 'packed', dot: 'bg-rose-500' },
];

export const HydVibeMap: React.FC<HydVibeMapProps> = ({
  venues,
  onSelectVenue,
  onReportVenue,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [selectedArea, setSelectedArea] = useState<Area | 'all'>('all');
  const [selectedCrowd, setSelectedCrowd] = useState<CrowdLevel | 'all'>('all');
  const [previewVenue, setPreviewVenue] = useState<VenueWithLiveStatus | null>(null);

  // Filtered venues for map markers
  const filteredVenues = venues.filter((v) => {
    if (selectedArea !== 'all' && v.area !== selectedArea) return false;
    if (selectedCrowd !== 'all' && v.currentCrowdLevel !== selectedCrowd) return false;
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Hyderabad Café Core (Jubilee / Banjara / HITEC hub)
    const map = L.map(mapContainerRef.current, {
      center: [17.4330, 78.4020],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Warm, editorial-friendly CartoDB Positron / OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const crowdColorMap: Record<CrowdLevel, { bg: string; ring: string }> = {
      empty: { bg: '#10B981', ring: 'rgba(16, 185, 129, 0.4)' },
      comfortable: { bg: '#F59E0B', ring: 'rgba(245, 158, 11, 0.4)' },
      busy: { bg: '#EA580C', ring: 'rgba(234, 88, 12, 0.4)' },
      packed: { bg: '#DC2626', ring: 'rgba(220, 38, 38, 0.4)' },
    };

    filteredVenues.forEach((venue) => {
      const color = crowdColorMap[venue.currentCrowdLevel] || crowdColorMap.comfortable;

      // Custom HTML Marker Pin
      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; cursor: pointer;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: ${color.ring}; animation: pulse 2s infinite;"></div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #243D32; border: 2.5px solid ${color.bg}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color.bg};"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'hydvibe-marker',
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([venue.coordinates.lat, venue.coordinates.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setPreviewVenue(venue);
          map.panTo([venue.coordinates.lat, venue.coordinates.lng], { animate: true });
        });

      markersRef.current.push(marker);
    });

    // If area changed, fit bounds to filtered markers
    if (filteredVenues.length > 0 && selectedArea !== 'all') {
      const bounds = L.latLngBounds(filteredVenues.map((v) => [v.coordinates.lat, v.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [filteredVenues, selectedArea]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([17.4330, 78.4020], 13);
      setSelectedArea('all');
      setSelectedCrowd('all');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] rounded-3xl overflow-hidden border border-[#E2D9C5] shadow-card bg-ivory">
      {/* Top Filter Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 pointer-events-none">
        {/* Area Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 hide-scrollbar pointer-events-auto bg-[#F7F3EB]/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#E2D9C5] shadow-sm">
          <button
            onClick={() => setSelectedArea('all')}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
              selectedArea === 'all'
                ? 'bg-forest text-white'
                : 'text-charcoal hover:bg-white'
            }`}
          >
            All Hyderabad
          </button>
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedArea === area
                  ? 'bg-forest text-white'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Crowd Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pointer-events-auto bg-[#F7F3EB]/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#E2D9C5] shadow-sm">
          {CROWD_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedCrowd(opt.value)}
              className={`text-xs px-2.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                selectedCrowd === opt.value
                  ? 'bg-forest text-white'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Map Reset Control */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
        <button
          onClick={resetView}
          className="px-3.5 py-2 bg-white/95 text-forest text-xs font-semibold rounded-xl shadow-card border border-[#E2D9C5] hover:bg-white flex items-center gap-1.5 transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Reset Map View
        </button>
        <span className="text-xs bg-[#243D32]/85 text-white px-3 py-2 rounded-xl backdrop-blur-xs font-medium">
          {filteredVenues.length} cafés shown
        </span>
      </div>

      {/* The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Interactive Bottom Sheet Preview when Marker Selected */}
      {previewVenue && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-30 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-white rounded-3xl border border-[#E2D9C5] shadow-elevated p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={previewVenue.images[0]}
                  alt={previewVenue.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-caramel-dark text-[11px] font-semibold uppercase">
                    <MapPin className="w-3 h-3" />
                    {previewVenue.area}
                  </div>
                  <h4 className="font-serif font-bold text-base text-forest line-clamp-1">
                    {previewVenue.name}
                  </h4>
                  <p className="text-xs text-charcoal-muted line-clamp-1">
                    ₹{previewVenue.costForTwo} for two • {previewVenue.noiseLevel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewVenue(null)}
                className="p-1.5 rounded-full text-charcoal-muted hover:bg-[#FAF7F0]"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Crowd Level & Decision Banner */}
            <div className="flex items-center justify-between pt-1">
              <CrowdBadge 
                level={previewVenue.currentCrowdLevel} 
                lastReportedMinutesAgo={previewVenue.lastReportedMinutesAgo}
                size="sm"
              />
              <span className="text-[11px] font-medium text-forest bg-sage/60 px-2.5 py-1 rounded-full">
                {previewVenue.shouldGoNowRecommendation.verdict}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#E2D9C5]">
              <button
                onClick={() => onReportVenue(previewVenue)}
                className="py-2 px-3 bg-[#FAF7F0] hover:bg-[#EDE7DA] text-forest rounded-xl text-xs font-semibold border border-[#E2D9C5] transition-colors"
              >
                Report Crowd
              </button>
              <button
                onClick={() => onSelectVenue(previewVenue)}
                className="flex-1 py-2 px-3 bg-forest hover:bg-forest-light text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                View Details
                <ArrowRight className="w-3.5 h-3.5 text-caramel-light" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
