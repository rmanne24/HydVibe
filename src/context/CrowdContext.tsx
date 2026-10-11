import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { CrowdLevel, CrowdReport, VenueWithLiveStatus } from '../types';
import { INITIAL_VENUES, INITIAL_SIMULATED_REPORTS } from '../data/venues';

interface CrowdContextType {
  venues: VenueWithLiveStatus[];
  reports: CrowdReport[];
  totalReportCount: number;
  activeContributorsCount: number;
  submitReport: (venueId: string, level: CrowdLevel, note?: string) => Promise<{ success: boolean; message: string }>;
  canSubmitForVenue: (venueId: string) => { allowed: boolean; cooldownRemainingSeconds: number };
  simulateCrowdSpike: (area?: string) => void;
  simulateMorningCalm: () => void;
  resetToDefaults: () => void;
  lastSyncTimestamp: number;
}

const STORAGE_REPORTS_KEY = 'hydvibe_crowd_reports_v1';
const STORAGE_SUBMISSIONS_KEY = 'hydvibe_user_submissions_v1';
const COOLDOWN_SECONDS = 120; // 2 minutes cooldown to prevent accidental duplicates

const CrowdContext = createContext<CrowdContextType | undefined>(undefined);

export const CrowdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<CrowdReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REPORTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_SIMULATED_REPORTS;
  });

  const [userSubmissionTimestamps, setUserSubmissionTimestamps] = useState<Record<string, number>>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_SUBMISSIONS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number>(Date.now());

  // BroadcastChannel for cross-tab synchronization
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel('hydvibe_crowd_sync');

    channel.onmessage = (event) => {
      if (event.data?.type === 'NEW_REPORT' && event.data?.report) {
        const incomingReport: CrowdReport = event.data.report;
        setReports((prev) => {
          if (prev.some((r) => r.id === incomingReport.id)) return prev;
          const updated = [incomingReport, ...prev];
          try {
            localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(updated.slice(0, 100)));
          } catch {
            // ignore
          }
          return updated;
        });
        setLastSyncTimestamp(Date.now());
      } else if (event.data?.type === 'SYNC_ALL' && Array.isArray(event.data?.reports)) {
        setReports(event.data.reports);
        setLastSyncTimestamp(Date.now());
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // Save reports to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports.slice(0, 100)));
    } catch {
      // ignore
    }
  }, [reports]);

  // Recency-weighted crowd calculation
  const calculateVenueCrowdStatus = useCallback((
    venueId: string, 
    defaultLevel: CrowdLevel,
    allReports: CrowdReport[]
  ): {
    currentLevel: CrowdLevel;
    lastReportedMinutesAgo: number;
    confidence: 'High' | 'Medium' | 'Low';
    recentReportCount: number;
    trend: 'clearing' | 'stable' | 'filling_up';
  } => {
    const venueReports = allReports
      .filter((r) => r.venueId === venueId)
      .sort((a, b) => b.timestamp - a.timestamp);

    const now = Date.now();
    const twoHoursAgo = now - 2 * 60 * 60 * 1000;
    const recentReports = venueReports.filter((r) => r.timestamp >= twoHoursAgo);

    if (venueReports.length === 0) {
      return {
        currentLevel: defaultLevel,
        lastReportedMinutesAgo: 60,
        confidence: 'Low',
        recentReportCount: 0,
        trend: 'stable'
      };
    }

    const latestReport = venueReports[0];
    const minutesAgo = Math.max(1, Math.round((now - latestReport.timestamp) / (1000 * 60)));

    if (recentReports.length === 0) {
      return {
        currentLevel: latestReport.level,
        lastReportedMinutesAgo: minutesAgo,
        confidence: 'Low',
        recentReportCount: 0,
        trend: 'stable'
      };
    }

    // Weight reports by recency:
    // < 15 min: weight 4.0
    // 15 - 45 min: weight 2.5
    // 45 - 90 min: weight 1.5
    // > 90 min: weight 0.8
    const levelToScore: Record<CrowdLevel, number> = {
      empty: 1.0,
      comfortable: 2.0,
      busy: 3.0,
      packed: 4.0,
    };

    let totalWeight = 0;
    let weightedScoreSum = 0;

    recentReports.forEach((rep) => {
      const ageMinutes = (now - rep.timestamp) / (1000 * 60);
      let weight = 0.8;
      if (ageMinutes <= 15) weight = 4.0;
      else if (ageMinutes <= 45) weight = 2.5;
      else if (ageMinutes <= 90) weight = 1.5;

      weightedScoreSum += levelToScore[rep.level] * weight;
      totalWeight += weight;
    });

    const averageScore = totalWeight > 0 ? weightedScoreSum / totalWeight : levelToScore[defaultLevel];

    let calculatedLevel: CrowdLevel = 'comfortable';
    if (averageScore <= 1.6) calculatedLevel = 'empty';
    else if (averageScore <= 2.6) calculatedLevel = 'comfortable';
    else if (averageScore <= 3.35) calculatedLevel = 'busy';
    else calculatedLevel = 'packed';

    // Confidence determination
    let confidence: 'High' | 'Medium' | 'Low' = 'Low';
    if (recentReports.length >= 4 && minutesAgo <= 30) {
      confidence = 'High';
    } else if (recentReports.length >= 2 || minutesAgo <= 45) {
      confidence = 'Medium';
    }

    // Trend calculation
    let trend: 'clearing' | 'stable' | 'filling_up' = 'stable';
    if (recentReports.length >= 2) {
      const newestScore = levelToScore[recentReports[0].level];
      const olderScore = levelToScore[recentReports[1].level];
      if (newestScore > olderScore) trend = 'filling_up';
      else if (newestScore < olderScore) trend = 'clearing';
    }

    return {
      currentLevel: calculatedLevel,
      lastReportedMinutesAgo: minutesAgo,
      confidence,
      recentReportCount: recentReports.length,
      trend
    };
  }, []);

  // Compute live venues with "Should I go now?" recommendation
  const venues = useMemo<VenueWithLiveStatus[]>(() => {
    // First pass: compute crowd levels for all
    const baseWithStatus = INITIAL_VENUES.map((venue) => {
      const crowdStatus = calculateVenueCrowdStatus(venue.id, venue.defaultCrowdLevel, reports);
      return {
        ...venue,
        currentCrowdLevel: crowdStatus.currentLevel,
        lastReportedMinutesAgo: crowdStatus.lastReportedMinutesAgo,
        confidence: crowdStatus.confidence,
        recentReportCount: crowdStatus.recentReportCount,
        trend: crowdStatus.trend,
      };
    });

    // Second pass: compute "Should I go now?" recommendation & nearby alternatives
    return baseWithStatus.map((venue) => {
      const level = venue.currentCrowdLevel;

      // Find best alternative if busy or packed
      let alternativeVenueId: string | undefined = undefined;
      if (level === 'busy' || level === 'packed') {
        const alternative = baseWithStatus.find(
          (other) =>
            other.id !== venue.id &&
            (other.area === venue.area || other.area === 'Jubilee Hills' || other.area === 'Banjara Hills') &&
            (other.currentCrowdLevel === 'empty' || other.currentCrowdLevel === 'comfortable')
        );
        if (alternative) {
          alternativeVenueId = alternative.id;
        }
      }

      let recommendation: VenueWithLiveStatus['shouldGoNowRecommendation'];

      switch (level) {
        case 'empty':
          recommendation = {
            verdict: 'Definitely Go Now',
            badgeColor: 'emerald',
            headline: 'Prime Window • Zero Waiting',
            description: `Ample open seating and serene ambience reported ${venue.lastReportedMinutesAgo}m ago. Ideal for quiet focus, reading, or uninterrupted conversation.`,
          };
          break;
        case 'comfortable':
          recommendation = {
            verdict: 'Great Time to Visit',
            badgeColor: 'amber',
            headline: 'Optimal Energy • Tables Open',
            description: `Balanced crowd atmosphere with steady turnover. You should find a comfortable spot without seating friction.`,
          };
          break;
        case 'busy':
          recommendation = {
            verdict: 'Expect a Buzz',
            badgeColor: 'orange',
            headline: 'High Activity • Fast Turnover',
            description: `Majority of seating occupied. If you need dedicated work booths or large tables, consider checking an alternative.`,
            alternativeVenueId,
          };
          break;
        case 'packed':
          recommendation = {
            verdict: 'Consider Alternative',
            badgeColor: 'rose',
            headline: 'Peak Capacity • Possible Waitlist',
            description: `Venue is currently at full capacity. Unless you already have a table or don't mind a wait, explore our nearby chill alternative.`,
            alternativeVenueId,
          };
          break;
      }

      return {
        ...venue,
        shouldGoNowRecommendation: recommendation,
      };
    });
  }, [reports, calculateVenueCrowdStatus]);

  // Check duplicate submission cooldown
  const canSubmitForVenue = useCallback((venueId: string) => {
    const lastTimestamp = userSubmissionTimestamps[venueId];
    if (!lastTimestamp) {
      return { allowed: true, cooldownRemainingSeconds: 0 };
    }
    const elapsedSeconds = Math.floor((Date.now() - lastTimestamp) / 1000);
    if (elapsedSeconds < COOLDOWN_SECONDS) {
      return {
        allowed: false,
        cooldownRemainingSeconds: COOLDOWN_SECONDS - elapsedSeconds,
      };
    }
    return { allowed: true, cooldownRemainingSeconds: 0 };
  }, [userSubmissionTimestamps]);

  // Submit live crowd report
  const submitReport = useCallback(async (
    venueId: string, 
    level: CrowdLevel, 
    note?: string
  ): Promise<{ success: boolean; message: string }> => {
    const check = canSubmitForVenue(venueId);
    if (!check.allowed) {
      return {
        success: false,
        message: `Please wait ${check.cooldownRemainingSeconds} seconds before submitting another update for this venue.`
      };
    }

    const targetVenue = INITIAL_VENUES.find((v) => v.id === venueId);
    const newReport: CrowdReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      venueId,
      venueName: targetVenue?.name || 'Hyderabad Venue',
      level,
      note: note?.trim() || undefined,
      timestamp: Date.now(),
      isSimulated: false,
      userBadge: 'Live Contributor'
    };

    setReports((prev) => [newReport, ...prev]);

    // Record submission cooldown
    setUserSubmissionTimestamps((prev) => {
      const updated = { ...prev, [venueId]: Date.now() };
      try {
        sessionStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // Broadcast to other open tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('hydvibe_crowd_sync');
        channel.postMessage({ type: 'NEW_REPORT', report: newReport });
        channel.close();
      } catch {
        // ignore
      }
    }

    setLastSyncTimestamp(Date.now());
    return { success: true, message: 'Crowd status updated in realtime!' };
  }, [canSubmitForVenue]);

  // Demo simulator functions
  const simulateCrowdSpike = useCallback((targetArea?: string) => {
    const now = Date.now();
    const spikedVenues = INITIAL_VENUES.filter((v) => !targetArea || v.area === targetArea);
    
    const newSimulatedReports: CrowdReport[] = spikedVenues.slice(0, 4).map((v, idx) => ({
      id: `spike-${now}-${idx}`,
      venueId: v.id,
      venueName: v.name,
      level: idx % 2 === 0 ? 'packed' : 'busy',
      note: idx % 2 === 0 ? 'Sudden evening surge! Tables completely filled.' : 'Busy rush hour, fast counter queue.',
      timestamp: now - idx * 60 * 1000,
      isSimulated: true,
      userBadge: 'Demo Simulator'
    }));

    setReports((prev) => [...newSimulatedReports, ...prev]);
    setLastSyncTimestamp(Date.now());
  }, []);

  const simulateMorningCalm = useCallback(() => {
    const now = Date.now();
    const calmReports: CrowdReport[] = INITIAL_VENUES.slice(0, 5).map((v, idx) => ({
      id: `calm-${now}-${idx}`,
      venueId: v.id,
      venueName: v.name,
      level: 'empty',
      note: 'Peaceful morning calm. Freshly brewed single origin and open terrace seating.',
      timestamp: now - idx * 2 * 60 * 1000,
      isSimulated: true,
      userBadge: 'Demo Simulator'
    }));

    setReports((prev) => [...calmReports, ...prev]);
    setLastSyncTimestamp(Date.now());
  }, []);

  const resetToDefaults = useCallback(() => {
    setReports(INITIAL_SIMULATED_REPORTS);
    setUserSubmissionTimestamps({});
    try {
      localStorage.removeItem(STORAGE_REPORTS_KEY);
      sessionStorage.removeItem(STORAGE_SUBMISSIONS_KEY);
    } catch {
      // ignore
    }
    setLastSyncTimestamp(Date.now());
  }, []);

  const totalReportCount = reports.length;
  const activeContributorsCount = useMemo(() => {
    return Math.max(12, Math.floor(reports.length * 1.8));
  }, [reports.length]);

  return (
    <CrowdContext.Provider
      value={{
        venues,
        reports,
        totalReportCount,
        activeContributorsCount,
        submitReport,
        canSubmitForVenue,
        simulateCrowdSpike,
        simulateMorningCalm,
        resetToDefaults,
        lastSyncTimestamp,
      }}
    >
      {children}
    </CrowdContext.Provider>
  );
};

export const useCrowd = (): CrowdContextType => {
  const context = useContext(CrowdContext);
  if (!context) {
    throw new Error('useCrowd must be used within a CrowdProvider');
  }
  return context;
};
