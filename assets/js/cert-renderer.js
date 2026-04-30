// =============================================================================
// CERT-RENDERER.JS
// Reads CERT_ENTRIES (defined in cert-data.js) and populates:
//   — The 4 tab panel <tbody> elements  (desktop view)
//   — The 4 accordion <tbody> elements  (mobile view)
//
// Both use the same buildRows() function so the row template is written once.
// cert-data.js must be loaded before this file.
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {

  if (typeof CERT_ENTRIES === 'undefined' || typeof CERT_ICONS === 'undefined') return;

  // ── Shared SVG snippets ──────────────────────────────────────────────────────
  const EXTERNAL_ICON = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  // ── Status value → CSS modifier class ───────────────────────────────────────
  const STATUS_CLASS = {
    'completed':   'CertTable-status--complete',
    'in progress': 'CertTable-status--inprogress',
  };

  function statusModifier(status) {
    return STATUS_CLASS[status.toLowerCase()] || 'CertTable-status--complete';
  }

  // ── Build <tr> rows for a given category ────────────────────────────────────
  // category: 'all' shows everything, otherwise filters to matching entries
  function buildRows(category) {
    const entries = category === 'all'
      ? CERT_ENTRIES
      : CERT_ENTRIES.filter(e => e.category === category);

    return entries.map(entry => {
      const iconPath = CERT_ICONS[entry.icon] || CERT_ICONS.monitor;

      const statusCell = entry.status
        ? `<td class="CertTable-cell CertTable-cell--status">
             <span class="CertTable-status ${statusModifier(entry.status)}">${entry.status}</span>
           </td>`
        : `<td class="CertTable-cell CertTable-cell--status"></td>`;

      const linkCell = entry.href
        ? `<td class="CertTable-cell CertTable-cell--link">
             <a href="${entry.href}" class="CertTable-link" rel="noopener noreferrer" target="_blank">
               View certification ${EXTERNAL_ICON}
             </a>
           </td>`
        : `<td class="CertTable-cell CertTable-cell--link"></td>`;

      return `
        <tr class="CertTable-row">
          <td class="CertTable-cell CertTable-cell--icon" aria-hidden="true">
            <svg class="CertTable-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="${iconPath}"/>
            </svg>
          </td>
          <td class="CertTable-cell CertTable-cell--title">
            <span class="CertTable-name">${entry.name}</span>
            <span class="CertTable-issuer">${entry.issuer}</span>
          </td>
          <td class="CertTable-cell CertTable-cell--badge">
            <span class="CertTable-badge">${entry.badge}</span>
          </td>
          ${statusCell}
          ${linkCell}
        </tr>`;
    }).join('');
  }

  // ── Populate a <tbody> by its ID ─────────────────────────────────────────────
  function populate(id, category) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = buildRows(category);
  }

  // ── Tab panel tbodies ────────────────────────────────────────────────────────
  populate('cert-tbody-all',      'all');
  populate('cert-tbody-design',   'design');
  populate('cert-tbody-frontend', 'frontend');
  populate('cert-tbody-pm',       'pm');
  populate('cert-tbody-ai',       'ai');

  // ── Accordion tbodies ────────────────────────────────────────────────────────
  populate('cert-acc-tbody-all',      'all');
  populate('cert-acc-tbody-design',   'design');
  populate('cert-acc-tbody-frontend', 'frontend');
  populate('cert-acc-tbody-ai',       'ai');

});