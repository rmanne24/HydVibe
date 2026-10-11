# HydVibe ☕✨
> *Find your place. Catch the right vibe.*

**HydVibe** is an AI-powered discovery and live crowd intelligence platform for Hyderabad. It combines vibe-based café discovery with community-sourced crowd reports, enabling users to describe what they want in natural language, discover matching venues, view crowd information, submit live reports, and decide whether to visit now or try an alternative.

---

## 🎨 Visual Identity & Design System

- **Warm Ivory Background**: `#F7F3EB`
- **Deep Forest Green**: `#243D32`
- **Caramel Accent**: `#D9A777`
- **Sage Secondary**: `#E3E9DD`
- **Dark Charcoal Typography**: `#1F2421`
- **Playfair Display**: Expressive headlines
- **DM Sans**: Clean interface text
- **Crowd Status Indicators**:
  - 🟢 **Empty**: `#10B981` (Plenty of open seats & zero wait)
  - 🟡 **Comfortable**: `#F59E0B` (Optimal buzz & open tables)
  - 🟠 **Busy**: `#EA580C` (Filling up fast, short wait)
  - 🔴 **Packed**: `#DC2626` (Peak capacity, possible waitlist)

---

## 🚀 Key Features

### 1. Natural Language AI Discovery
- Free-form natural language query parsing (e.g., *"Quiet café in Jubilee Hills with fast Wi-Fi for 3 hours of deep work"*, *"Aesthetic date spot in Banjara Hills with outdoor seating"*).
- Deterministic semantic parsing of:
  - Geographic areas (Jubilee Hills, Banjara Hills, Madhapur, Gachibowli, Kondapur, HITEC City)
  - Vibe categories (Quiet, Aesthetic, Work-friendly, Budget, Date, Social, Specialty Coffee, Outdoor, Pet-friendly)
  - Amenity constraints (Wi-Fi speed, charging sockets, outdoor seating, pets)
  - Budget constraints (e.g. "under 800", "budget friendly")
  - Crowd preferences ("not crowded", "peace and quiet", "lively")
- Transparent match scoring (45% to 99%) with rationale breakdown.

### 2. Live Crowd Intelligence & Decision Engine
- **Recency-Weighted Crowd Aggregation**: Fresh reports (< 15 min) receive high weighting (4.0x), with smooth decay for older reports.
- **Confidence Scoring**: High, Medium, or Low based on report density and freshness.
- **"Should I Go Now?" Recommendation**: Context-aware verdict (`Definitely Go Now`, `Great Time to Visit`, `Expect a Buzz`, `Consider Alternative`).
- **Nearby Alternatives**: Proactively recommends chill alternatives in the same hub if a café is busy or packed.
- **Duplicate Prevention**: 2-minute submission cooldown with real-time countdown timer.

### 3. Interactive Hyderabad Vibe Map
- Leaflet-powered map centered on Hyderabad's café hubs.
- Custom pulsing crowd markers with dynamic color rings.
- Quick filter chips by Area, Vibe category, and Crowd status.
- Interactive venue preview bottom sheet with one-tap directions and live reporting.

### 4. Real-time Multi-Client Synchronization
- Uses `BroadcastChannel` API for instantaneous cross-tab synchronization.
- LocalStorage persistence preserves community submissions between sessions.

### 5. Hackathon & Presentation Demo Mode (`/#demo`)
- High-contrast **Projector Night Mode** toggle designed for stage displays.
- Live **QR Code** for interactive audience scanning on mobile phones.
- Real-time simulation buttons:
  - *Simulate Jubilee Hills Evening Rush*
  - *Simulate Sunday Morning Serenity*
  - *Single Venue Crowd Spike*
  - *Reset to Default Seed State*
- Live telemetry stream and active contributor counters.

---

## 🏛️ Seed Data (14 Verified Hyderabad Cafés)

1. **Roastery Coffee House** — Road No. 14, Banjara Hills
2. **Conçū** — Road No. 37, Jubilee Hills
3. **Subko Coffee Roasters** — Road No. 45, Jubilee Hills
4. **Theory Café & Roastery** — Jubilee Hills
5. **Autumn Leaf Café** — Road No. 45, Jubilee Hills
6. **True Black Coffee** — Road No. 36, Jubilee Hills
7. **Third Wave Coffee** — Knowledge City, HITEC City
8. **Feeka Lifestyle Café** — Telecom Nagar, Gachibowli
9. **Kaficko** — Road No. 10, Banjara Hills
10. **Roast - The Caffe** — Mindspace Junction, HITEC City
11. **Ironhill Café** — Ayyappa Society, Madhapur
12. **Le Vantage Café Bar** — Road No. 45, Jubilee Hills
13. **The Hole in the Wall Café** — Road No. 36, Jubilee Hills
14. **Furaat Café** — Road No. 12, Banjara Hills

---

## 🛠️ Tech Stack

- **Framework**: React 19, TypeScript
- **Styling**: Tailwind CSS 3.4, PostCSS, Autoprefixer
- **Icons**: Lucide Icons
- **Animation & Visuals**: Canvas Confetti, CSS keyframes
- **Maps**: Leaflet with CartoDB Positron tiles
- **QR Code**: QRCode.react (SVG renderer)
- **Tooling**: Vite 8

---

## 💻 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/rmanne24/HydVibe.git
cd HydVibe

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
