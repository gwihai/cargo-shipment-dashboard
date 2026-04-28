// All config lives here — pulled from .env at build time by Vite
// Prefix VITE_ is required for Vite to expose env vars to the browser

export const config = {
  ais: {
    apiKey: import.meta.env.VITE_AIS_API_KEY || '',
    baseUrl: import.meta.env.VITE_AIS_API_BASE_URL || 'https://api.datadocked.com/v1',
    pollIntervalMs: 30_000, // how often to refresh vessel positions
  },
  map: {
    // Falls back to free OSM tiles if no key provided
    styleUrl: import.meta.env.VITE_MAPTILER_KEY
      ? `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`
      : null,
    center: [20, 20],
    zoom: 1.8,
    minZoom: 1,
    maxZoom: 10,
  },
  animation: {
    tickMs: 2000, // how fast demo ships move (mock mode only)
    stepSize: 0.001,
  }
}

// Are we using real AIS data or mock data?
export const useMockData = !config.ais.apiKey
