import maplibregl from 'maplibre-gl'
import { config } from '../config.js'

/**
 * Initialise and return the MapLibre GL map instance.
 * Falls back to free OpenStreetMap raster tiles if no Maptiler key is set.
 */
export function initMap(containerId) {
  const style = config.map.styleUrl ?? {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
  }

  const map = new maplibregl.Map({
    container: containerId,
    style,
    center: config.map.center,
    zoom:   config.map.zoom,
    minZoom: config.map.minZoom,
    maxZoom: config.map.maxZoom,
  })

  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  map.addControl(new maplibregl.ScaleControl(), 'bottom-left')

  return map
}
