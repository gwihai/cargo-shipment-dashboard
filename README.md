# Global Cargo Tracker

A real-time global cargo shipment tracker built with MapLibre GL and live AIS vessel data. Track ships across major world trade routes with animated positions, status filtering, and per-vessel detail popups — all in a clean, zero-dependency web app.

![Status](https://img.shields.io/badge/status-active-1D9E75) ![License](https://img.shields.io/badge/license-MIT-378ADD) ![Built with](https://img.shields.io/badge/built%20with-Vite%20%2B%20MapLibre-7F77DD)

---

## Vision

Cargo tracking is typically locked behind expensive enterprise dashboards. This project brings that same visibility to anyone — built open source, self-hostable, and designed to work out of the box with free mock data, then scale up to real AIS feeds with a single environment variable.

The goal is a lightweight, modular tracker that a developer can clone, understand in 10 minutes, and extend for their own fleet, portfolio project, or learning.

---

## How the tools work together

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  index.html  →  src/main.js  (app entry point)         │
│                      │                                  │
│          ┌───────────┼───────────┐                      │
│          ▼           ▼           ▼                      │
│       src/map/    src/api/    src/ui/                   │
│      (MapLibre)  (AIS data)  (controls)                 │
└─────────────────────────────────────────────────────────┘
         │                 │
         ▼                 ▼
  OpenStreetMap       AIS API
  tile servers    (Data Docked /
  (free, no key)   Datalastic)
```

### Layer by layer

**`src/config.js`** — the single source of truth. Reads your `.env` variables and exports a `useMockData` boolean. Every other module imports from here — changing API provider means editing one file.

**`src/api/`** — data layer, two files:
- `mockData.js` ships hardcoded vessels and ports in the exact same shape as the real API response. No key needed, works offline.
- `aisClient.js` fetches live vessel positions from your AIS provider, normalises the raw response into that same shape, and exports a `getMockVessels()` fallback. Swapping providers means updating the `normalise()` function only.

**`src/map/`** — MapLibre GL rendering, three files:
- `initMap.js` boots the map with either free OpenStreetMap raster tiles (no key) or premium vector tiles from Maptiler/Mapbox (with key). The style URL is the only difference.
- `routes.js` manages two GeoJSON sources on the map: dashed route lines between ports, and circle markers at each ship's current position. Both update on every data refresh.
- `markers.js` places static port dots and wires up click-to-popup on ship circles using MapLibre's event system.

**`src/ui/`** — DOM rendering, three files:
- `filters.js` renders the status pill buttons and calls back on selection.
- `metrics.js` computes and renders the four summary stat cards (total, in transit, delayed, tonnes).
- `popup.js` renders the scrollable ship list below the map with progress bars and status badges.

**`src/main.js`** — wires it all together. Holds the three pieces of shared state (`vessels`, `filter`, `selectedId`), calls `render()` whenever state changes, and runs either the mock animation loop or the real API polling interval.

---

## Tech stack

| Tool | Role | Cost |
|---|---|---|
| [Vite](https://vitejs.dev) | Build tool & dev server | Free |
| [MapLibre GL JS](https://maplibre.org) | Interactive WebGL map | Free, open source |
| [OpenStreetMap](https://www.openstreetmap.org) | Default map tiles | Free |
| [Maptiler](https://www.maptiler.com) | Premium vector tiles (optional) | Free tier available |
| [Data Docked](https://datadocked.com) | AIS vessel tracking API | Free trial, from €80/mo |
| [Datalastic](https://datalastic.com) | Alternative AIS API | Free trial available |

No UI framework. No component library. Vanilla JS modules — easy to read, easy to extend.

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Clone and install

```bash
git clone https://github.com/your-username/cargo-tracker.git
cd cargo-tracker
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` — it works as-is with mock data. To enable live tracking, add your keys:

```env
VITE_AIS_API_KEY=your_key_here
VITE_AIS_API_BASE_URL=https://api.datadocked.com/v1
VITE_MAPTILER_KEY=your_key_here   # optional — improves map visuals
```

### 3. Run

```bash
npm run dev       # dev server at localhost:3000
npm run build     # production build → dist/
npm run preview   # preview the production build
```

---

## Project structure

```
cargo-tracker/
├── index.html              # App shell, loads main.js
├── vite.config.js          # Vite config (port, build output)
├── .env.example            # Key names — safe to commit
├── public/
│   └── ship-icon.svg       # SVG ship icon
└── src/
    ├── main.js             # Entry point — wires all modules
    ├── config.js           # Central config, reads .env
    ├── style.css           # All styles
    ├── api/
    │   ├── aisClient.js    # Live AIS API client + normaliser
    │   └── mockData.js     # Hardcoded fallback vessels & ports
    ├── map/
    │   ├── initMap.js      # MapLibre GL setup
    │   ├── routes.js       # Route lines + ship position layers
    │   └── markers.js      # Port dots + ship click popups
    └── ui/
        ├── filters.js      # Status filter pill buttons
        ├── metrics.js      # Summary stat cards
        └── popup.js        # Ship list rows with progress bars
```

---

## Switching AIS providers

The `normalise()` function in `src/api/aisClient.js` maps raw API fields to the internal vessel shape. To switch from Data Docked to Datalastic (or any other provider), only that function needs updating:

```js
// Internal vessel shape — all modules depend on this
{
  id:         string,   // unique vessel identifier (MMSI)
  name:       string,   // vessel name
  coords:     [lng, lat],
  speed:      string,   // e.g. "14.2 kn"
  status:     'transit' | 'arrived' | 'delayed' | 'loading',
  eta:        string,
  fromCoords: [lng, lat],
  toCoords:   [lng, lat],
  fromLabel:  string,
  toLabel:    string,
  cargo:      string,
  tons:       number,
}
```

---

## Roadmap

- [ ] Route history trails (fading polyline behind each vessel)
- [ ] Weather overlay on shipping lanes (Open-Meteo API)
- [ ] Search by vessel name or MMSI
- [ ] Vessel type filtering (tanker, container, bulk)
- [ ] Export shipment list to CSV
- [ ] Dark mode
- [ ] Mobile layout

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/weather-overlay`)
3. Commit your changes (`git commit -m 'add weather overlay'`)
4. Push and open a PR

---

## License

MIT — see [LICENSE](./LICENSE) for details.

Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, licensed under ODbL.  
AIS data provided at runtime by your configured API provider — not redistributed in this repository.
