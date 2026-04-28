import 'maplibre-gl/dist/maplibre-gl.css'
import './style.css'

import { config, useMockData } from './config.js'
import { getMockVessels, fetchVessels } from './api/aisClient.js'
import { initMap }        from './map/initMap.js'
import { addRouteLayers, updateRoutes } from './map/routes.js'
import { addPortMarkers, addShipPopups } from './map/markers.js'
import { renderFilters }  from './ui/filters.js'
import { renderMetrics }  from './ui/metrics.js'
import { renderShipList } from './ui/popup.js'

// ── State ────────────────────────────────────────────────────────────────────
let vessels    = []
let filter     = 'all'
let selectedId = null
let searchQuery = ''

// ── DOM refs ─────────────────────────────────────────────────────────────────
const filterEl  = document.getElementById('filters')
const metricsEl = document.getElementById('metrics')
const listEl    = document.getElementById('ship-list')
const clockEl   = document.getElementById('clock')
const searchEl  = document.getElementById('search')

// ── Clock ────────────────────────────────────────────────────────────────────
function updateClock() {
  clockEl.textContent = new Date().toUTCString().replace(/ GMT$/, ' UTC')
}
updateClock()
setInterval(updateClock, 1000)

// ── Data ─────────────────────────────────────────────────────────────────────
async function loadVessels() {
  if (useMockData) {
    vessels = getMockVessels()
    console.info('Running in mock mode — add VITE_AIS_API_KEY to .env for live data')
  } else {
    vessels = await fetchVessels()
  }
}

// ── Render ───────────────────────────────────────────────────────────────────
function render(map) {
  const query   = searchQuery.toLowerCase()
  const visible = vessels.filter(v =>
    (filter === 'all' || v.status === filter) &&
    (!query || v.name.toLowerCase().includes(query))
  )

  renderMetrics(metricsEl, vessels)
  renderFilters(filterEl, filter, newFilter => {
    filter = newFilter
    render(map)
  })
  renderShipList(listEl, visible, 'all', selectedId, id => {
    selectedId = selectedId === id ? null : id
    render(map)
  })
  updateRoutes(map, visible, 'all')
}

// ── Mock animation (no-op with real API) ────────────────────────────────────
function animateMock(map) {
  if (!useMockData) return
  setInterval(() => {
    vessels.forEach(v => {
      if (v.status !== 'transit') return
      v.progress = Math.min(1, (v.progress ?? 0) + config.animation.stepSize)
      if (v.progress >= 1) v.status = 'arrived'
      v.coords = [
        v.fromCoords[0] + (v.toCoords[0] - v.fromCoords[0]) * v.progress,
        v.fromCoords[1] + (v.toCoords[1] - v.fromCoords[1]) * v.progress,
      ]
    })
    render(map)
  }, config.animation.tickMs)
}

// ── Real API polling ─────────────────────────────────────────────────────────
function startPolling(map) {
  if (useMockData) return
  setInterval(async () => {
    await loadVessels()
    render(map)
  }, config.ais.pollIntervalMs)
}

// ── Search ───────────────────────────────────────────────────────────────────
searchEl.addEventListener('input', e => {
  searchQuery = e.target.value
  // render without reinitialising map
})

// ── Boot ─────────────────────────────────────────────────────────────────────
async function main() {
  await loadVessels()

  const map = initMap('map')

  map.on('load', () => {
    addRouteLayers(map)
    addPortMarkers(map)
    addShipPopups(map, () => vessels)
    render(map)
    animateMock(map)
    startPolling(map)
  })
}

main()
