import { config } from '../config.js'
import { MOCK_SHIPS, PORTS } from './mockData.js'

/**
 * Fetch current vessel positions from the AIS API.
 * Returns data in a normalised shape regardless of provider.
 *
 * @param {string[]} mmsiList - Array of MMSI numbers to track
 * @returns {Promise<NormalisedVessel[]>}
 */
export async function fetchVessels(mmsiList = []) {
  const res = await fetch(
    `${config.ais.baseUrl}/vessels?mmsi=${mmsiList.join(',')}`,
    {
      headers: {
        'X-API-Key': config.ais.apiKey,
        'Accept': 'application/json',
      }
    }
  )

  if (!res.ok) {
    throw new Error(`AIS API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data.vessels.map(normalise)
}

/**
 * Normalise a raw AIS API vessel response into our internal shape.
 * Update this function when switching API providers.
 *
 * @param {object} raw - Raw vessel object from API
 * @returns {NormalisedVessel}
 */
function normalise(raw) {
  return {
    id:       raw.mmsi,
    name:     raw.name,
    coords:   [raw.longitude, raw.latitude],
    speed:    `${raw.speed} kn`,
    heading:  raw.heading,
    status:   mapNavStatus(raw.navStatus),
    eta:      raw.eta,
    destination: raw.destination,
  }
}

/**
 * Map AIS navigation status codes to our UI status strings.
 */
function mapNavStatus(navStatus = '') {
  const s = navStatus.toLowerCase()
  if (s.includes('under way')) return 'transit'
  if (s.includes('anchor') || s.includes('moored')) return 'loading'
  if (s.includes('not under command')) return 'delayed'
  return 'transit'
}

/**
 * Mock version — returns simulated data without hitting any API.
 * Used automatically by main.js when no API key is configured.
 */
export function getMockVessels() {
  return MOCK_SHIPS.map(s => {
    const fromPort = PORTS[s.from]
    const toPort   = PORTS[s.to]
    const coords   = [
      fromPort.coords[0] + (toPort.coords[0] - fromPort.coords[0]) * s.progress,
      fromPort.coords[1] + (toPort.coords[1] - fromPort.coords[1]) * s.progress,
    ]
    return { ...s, coords, fromCoords: fromPort.coords, toCoords: toPort.coords,
             fromLabel: fromPort.label, toLabel: toPort.label }
  })
}
