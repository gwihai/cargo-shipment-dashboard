const STATUS_COLOR = { transit:'#378ADD', arrived:'#1D9E75', delayed:'#BA7517', loading:'#7F77DD' }
const BADGE_BG     = { transit:'#E6F1FB', arrived:'#EAF3DE', delayed:'#FAEEDA', loading:'#EEEDFE' }
const BADGE_TX     = { transit:'#185FA5', arrived:'#3B6D11', delayed:'#854F0B', loading:'#534AB7' }

/**
 * Render the scrollable ship list below the map.
 *
 * @param {HTMLElement} container
 * @param {object[]} vessels
 * @param {string} filter
 * @param {string|null} selectedId
 * @param {function} onSelect
 */
export function renderShipList(container, vessels, filter, selectedId, onSelect) {
  const visible = vessels.filter(v => filter === 'all' || v.status === filter)

  container.innerHTML = visible.map(v => {
    const pct   = Math.round((v.progress ?? 0) * 100)
    const color = STATUS_COLOR[v.status] ?? '#888'
    const bgCol = BADGE_BG[v.status] ?? '#eee'
    const txCol = BADGE_TX[v.status] ?? '#333'
    const label = v.status.charAt(0).toUpperCase() + v.status.slice(1)

    return `
      <div class="ship-row ${v.id === selectedId ? 'selected' : ''}" data-id="${v.id}">
        <div class="ship-icon" style="background:${bgCol};color:${txCol}">
          ${v.name.replace('MV ','').charAt(0)}
        </div>
        <div class="ship-info">
          <div class="ship-name">${v.name}</div>
          <div class="ship-route">${v.fromLabel} → ${v.toLabel} · ${v.cargo}</div>
        </div>
        <div class="ship-meta">
          <span class="badge" style="background:${bgCol};color:${txCol}">${label}</span>
          <div class="progress-wrap">
            <div class="progress-bar" style="width:${pct}%;background:${color}"></div>
          </div>
          <span class="eta">${v.status === 'arrived' ? 'Arrived' : v.eta + ' left'}</span>
        </div>
      </div>
    `
  }).join('')

  container.querySelectorAll('[data-id]').forEach(row => {
    row.addEventListener('click', () => onSelect(row.dataset.id))
  })
}
