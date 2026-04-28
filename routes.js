const STATUS_COLOR = {
  transit: '#378ADD',
  arrived: '#1D9E75',
  delayed: '#BA7517',
  loading: '#7F77DD',
}

/**
 * Add route + ship position sources and layers to the map.
 * Call once after map 'load' fires.
 */
export function addRouteLayers(map) {
  map.addSource('routes', { type: 'geojson', data: emptyFC() })
  map.addLayer({
    id: 'routes-line',
    type: 'line',
    source: 'routes',
    paint: {
      'line-color':     ['get', 'color'],
      'line-width':     1.5,
      'line-dasharray': [4, 3],
      'line-opacity':   0.4,
    }
  })

  map.addSource('ships', { type: 'geojson', data: emptyFC() })
  map.addLayer({
    id: 'ships-circle',
    type: 'circle',
    source: 'ships',
    paint: {
      'circle-radius':       7,
      'circle-color':        ['get', 'color'],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 1.5,
    }
  })
}

/**
 * Update route and ship position data on the map.
 *
 * @param {maplibregl.Map} map
 * @param {object[]} vessels - Normalised vessel objects
 * @param {string} filter - Active status filter ('all' | 'transit' | etc.)
 */
export function updateRoutes(map, vessels, filter) {
  const visible = vessels.filter(v => filter === 'all' || v.status === filter)

  const routeFC = {
    type: 'FeatureCollection',
    features: visible.map(v => ({
      type: 'Feature',
      properties: { color: STATUS_COLOR[v.status] ?? '#888' },
      geometry: {
        type: 'LineString',
        coordinates: [v.fromCoords, v.toCoords]
      }
    }))
  }

  const shipFC = {
    type: 'FeatureCollection',
    features: visible
      .filter(v => v.status !== 'arrived')
      .map(v => ({
        type: 'Feature',
        properties: {
          color: STATUS_COLOR[v.status] ?? '#888',
          id:    v.id,
          name:  v.name,
        },
        geometry: { type: 'Point', coordinates: v.coords }
      }))
  }

  map.getSource('routes')?.setData(routeFC)
  map.getSource('ships')?.setData(shipFC)
}

function emptyFC() {
  return { type: 'FeatureCollection', features: [] }
}
