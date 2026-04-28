const FILTERS = [
  { key: 'all',     label: 'All shipments' },
  { key: 'transit', label: 'In transit' },
  { key: 'delayed', label: 'Delayed' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'loading', label: 'Loading' },
]

/**
 * Render filter pills and call onChange when one is clicked.
 *
 * @param {HTMLElement} container
 * @param {string} active - Currently active filter key
 * @param {function} onChange - Called with new filter key
 */
export function renderFilters(container, active, onChange) {
  container.innerHTML = FILTERS.map(f => `
    <button class="filter-btn ${f.key === active ? 'active' : ''}" data-f="${f.key}">
      ${f.label}
    </button>
  `).join('')

  container.querySelectorAll('[data-f]').forEach(btn => {
    btn.addEventListener('click', () => onChange(btn.dataset.f))
  })
}
