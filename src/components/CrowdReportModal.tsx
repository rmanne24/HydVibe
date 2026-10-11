import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, Clock, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import type { CrowdLevel, VenueWithLiveStatus } from '../types';
import { useCrowd } from '../context/CrowdContext';

interface CrowdReportModalProps {
  venue: VenueWithLiveStatus;
  isOpen: boolean;
  onClose: () => void;
}

const CROWD_OPTIONS: {
  level: CrowdLevel;
  label: string;
  sub: string;
  colorClass: string;
  selectedClass: string;
  emoji: string;
}[] = [
  {
    level: 'empty',
    label: 'Empty',
    sub: 'Plenty of open seats & zero wait',
    colorClass: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-emerald-900',
    selectedClass: 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500 text-emerald-950',
    emoji: '🟢',
  },
  {
    level: 'comfortable',
    label: 'Comfortable',
    sub: 'Pleasant buzz & open tables',
    colorClass: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-amber-900',
    selectedClass: 'border-amber-600 bg-amber-50 ring-2 ring-amber-500 text-amber-950',
    emoji: '🟡',
  },
  {
    level: 'busy',
    label: 'Busy',
    sub: 'Most tables taken, fast turnover',
    colorClass: 'border-orange-200 hover:border-orange-400 hover:bg-orange-50/50 text-orange-900',
    selectedClass: 'border-orange-600 bg-orange-50 ring-2 ring-orange-500 text-orange-950',
    emoji: '🟠',
  },
  {
    level: 'packed',
    label: 'Packed',
    sub: 'Full capacity, queue / waitlist',
    colorClass: 'border-rose-200 hover:border-rose-400 hover:bg-rose-50/50 text-rose-900',
    selectedClass: 'border-rose-600 bg-rose-50 ring-2 ring-rose-500 text-rose-950',
    emoji: '🔴',
  },
];

const PRESET_NOTES = [
  'Open power outlets',
  'Outdoor patio is breezy',
  'Line at order counter',
  'Wi-Fi running super fast',
  'Hard to find parking nearby',
  'Great background playlist',
];

export const CrowdReportModal: React.FC<CrowdReportModalProps> = ({ venue, isOpen, onClose }) => {
  const { submitReport, canSubmitForVenue } = useCrowd();
  const [selectedLevel, setSelectedLevel] = useState<CrowdLevel | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const cooldownStatus = canSubmitForVenue(venue.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevel) {
      setErrorMessage('Please select a crowd level before submitting.');
      return;
    }

    if (!cooldownStatus.allowed) {
      setErrorMessage(`Please wait ${cooldownStatus.cooldownRemainingSeconds}s before submitting again.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitReport(venue.id, selectedLevel, note);
      if (res.success) {
        setIsSubmittedSuccess(true);
        // Confetti celebration
        try {
          confetti({
            particleCount: 65,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#243D32', '#D9A777', '#10B981', '#E3E9DD'],
          });
        } catch {
          // ignore confetti if unsupported
        }

        setTimeout(() => {
          setIsSubmittedSuccess(false);
          setSelectedLevel(null);
          setNote('');
          onClose();
        }, 1800);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#1F2421]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#FAF7F0] rounded-t-3xl sm:rounded-3xl shadow-elevated border border-[#E2D9C5] p-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-[#EBE4D5]/60 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmittedSuccess ? (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-forest mb-2">Thank you!</h3>
            <p className="text-charcoal-muted max-w-xs text-sm">
              Your live report for <strong className="text-charcoal font-medium">{venue.name}</strong> has been shared with everyone exploring Hyderabad right now.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 text-caramel-dark text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Live Community Intel
              </div>
              <h2 className="font-serif text-2xl font-bold text-forest leading-snug">
                How crowded is {venue.name}?
              </h2>
              <p className="text-xs text-charcoal-muted mt-1">
                {venue.area} • Real-time update for Hyderabad explorers
              </p>
            </div>

            {/* Cooldown Warning if applicable */}
            {!cooldownStatus.allowed && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  You recently submitted a report for this café. Cooldown: <strong>{cooldownStatus.cooldownRemainingSeconds} seconds</strong> remaining.
                </span>
              </div>
            )}

            {/* 4 Large Tactile Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {CROWD_OPTIONS.map((opt) => {
                const isSelected = selectedLevel === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(opt.level);
                      setErrorMessage(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      isSelected ? opt.selectedClass : `${opt.colorClass} bg-white/70`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{opt.emoji}</span>
                        <span className="font-bold text-base text-forest">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-charcoal-muted leading-tight">{opt.sub}</p>
                  </button>
                );
              })}
            </div>

            {/* Optional Short Note */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-forest mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-caramel-dark" />
                Add a quick helpful tip (optional)
              </label>

              {/* Quick Note Pills */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {PRESET_NOTES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      if (note.includes(preset)) {
                        setNote((prev) => prev.replace(preset, '').replace(/,\s*,/g, ',').trim());
                      } else {
                        setNote((prev) => (prev ? `${prev}, ${preset}` : preset));
                      }
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                      note.includes(preset)
                        ? 'bg-forest text-white border-forest'
                        : 'bg-white text-charcoal-muted border-[#E2D9C5] hover:border-caramel hover:text-charcoal'
                    }`}
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Corner booth open, Wi-Fi tested 120 Mbps..."
                maxLength={100}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2D9C5] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest text-charcoal placeholder:text-charcoal-faint"
              />
              <div className="flex justify-between items-center text-[11px] text-charcoal-faint mt-1">
                <span>Helps remote workers & coffee hunters</span>
                <span>{note.length}/100</span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-600 mb-3 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {errorMessage}
              </p>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedLevel || isSubmitting || !cooldownStatus.allowed}
                className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                  !selectedLevel || !cooldownStatus.allowed
                    ? 'bg-[#E2D9C5] text-charcoal-muted cursor-not-allowed'
                    : 'bg-forest hover:bg-forest-light text-white active:scale-[0.99] cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Broadcasting Live...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-caramel-light" />
                    Submit Live Status
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-charcoal-muted mt-2">
                Reports automatically update connected Hyderabad users in real time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
