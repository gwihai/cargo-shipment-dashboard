/**
 * Render summary metric cards from vessel data.
 *
 * @param {HTMLElement} container
 * @param {object[]} vessels
 */
export function renderMetrics(container, vessels) {
  const total   = vessels.length
  const transit = vessels.filter(v => v.status === 'transit').length
  const delayed = vessels.filter(v => v.status === 'delayed').length
  const tons    = vessels.reduce((sum, v) => sum + (v.tons ?? 0), 0)

  const metrics = [
    { val: total,                        label: 'Total shipments' },
    { val: transit,                      label: 'In transit' },
    { val: delayed,                      label: 'Delayed' },
    { val: formatTons(tons),             label: 'Cargo tracked' },
  ]

  container.innerHTML = metrics.map(m => `
    <div class="metric-card">
      <div class="val">${m.val}</div>
      <div class="lbl">${m.label}</div>
    </div>
  `).join('')
}

function formatTons(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M t`
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K t`
  return `${n} t`
}
