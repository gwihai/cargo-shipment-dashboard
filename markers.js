import maplibregl from 'maplibre-gl'
import { PORTS } from '../api/mockData.js'

const BADGE_BG = { transit:'#E6F1FB', arrived:'#EAF3DE', delayed:'#FAEEDA', loading:'#EEEDFE' }
const BADGE_TX = { transit:'#185FA5', arrived:'#3B6D11', delayed:'#854F0B', loading:'#534AB7' }

/**
 * Add a small dot marker for every port.
 */
export function addPortMarkers(map) {
  Object.values(PORTS).forEach(port => {
    const el = document.createElement('div')
    el.style.cssText = [
      'width:8px', 'height:8px', 'border-radius:50%',
      'background:#185FA5', 'border:2px solid #fff', 'cursor:pointer'
    ].join(';')

    const popup = new maplibregl.Popup({ offset: 10, closeButton: false })
      .setHTML(`<div style="font-size:12px;font-weight:500;padding:2px 4px">${port.label}</div>`)

    new maplibregl.Marker({ element: el })
      .setLngLat(port.coords)
      .setPopup(popup)
      .addTo(map)
  })
}

/**
 * Wire up click-to-popup on the ships-circle layer.
 */
export function addShipPopups(map, getVessels) {
  map.on('click', 'ships-circle', e => {
    const { id } = e.features[0].properties
    const vessels = getVessels()
    const v = vessels.find(v => v.id === id)
    if (!v) return

    const pct = Math.round(v.progress * 100)

    new maplibregl.Popup({ closeButton: true, maxWidth: '220px' })
      .setLngLat(e.features[0].geometry.coordinates)
      .setHTML(`
        <div style="font-family:system-ui,sans-serif">
          <p style="font-size:13px;font-weight:500;margin:0 0 8px">${v.name}</p>
          <table style="width:100%;font-size:12px;border-collapse:collapse">
            <tr><td style="color:#666;padding:2px 0">Route</td>
                <td style="text-align:right;padding:2px 0">${v.fromLabel} → ${v.toLabel}</td></tr>
            <tr><td style="color:#666;padding:2px 0">Cargo</td>
                <td style="text-align:right;padding:2px 0">${v.cargo}</td></tr>
            <tr><td style="color:#666;padding:2px 0">Speed</td>
                <td style="text-align:right;padding:2px 0">${v.speed}</td></tr>
            <tr><td style="color:#666;padding:2px 0">Tonnes</td>
                <td style="text-align:right;padding:2px 0">${v.tons?.toLocaleString()}</td></tr>
            <tr><td style="color:#666;padding:2px 0">Progress</td>
                <td style="text-align:right;padding:2px 0">${pct}%</td></tr>
            <tr><td style="color:#666;padding:2px 0">ETA</td>
                <td style="text-align:right;padding:2px 0">${v.eta}</td></tr>
          </table>
          <span style="display:inline-block;margin-top:8px;font-size:11px;padding:2px 8px;
                border-radius:10px;background:${BADGE_BG[v.status]};color:${BADGE_TX[v.status]}">
            ${v.status.charAt(0).toUpperCase() + v.status.slice(1)}
          </span>
        </div>
      `)
      .addTo(map)
  })

  map.on('mouseenter', 'ships-circle', () => { map.getCanvas().style.cursor = 'pointer' })
  map.on('mouseleave', 'ships-circle', () => { map.getCanvas().style.cursor = '' })
}
