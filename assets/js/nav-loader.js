// =============================================================================
// NAV-LOADER.JS
// Fetches the shared _nav.html partial and injects it into every page,
// then marks the active top-level nav link based on the current URL.
//
// Must run and FINISH before script.js's MobileMenu / NavMenuDropdown classes
// try to query the DOM — those elements don't exist until this injects them.
// Exposes window.navLoaderReady (a Promise) so script.js can wait on it.
//
// Mount point: a single <div id="nav-mount"></div> placed where the old
// <aside class="Sidebar"> used to start. _nav.html contains the sidebar,
// mobile header, overlay, and mobile menu back-to-back as one fragment —
// one fetch, one injection point, covers all of it.
// =============================================================================

window.navLoaderReady = (async function loadNav() {
  const mount = document.getElementById('nav-mount');

  if (!mount) {
    console.warn('nav-loader: no #nav-mount found on this page. Skipping nav injection.');
    return;
  }

  let html;
  try {
    const response = await fetch('/_nav.html');
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    html = await response.text();
  } catch (err) {
    console.error('nav-loader: failed to fetch /_nav.html', err);
    return;
  }

  mount.outerHTML = html;
  markActiveLink();
})();

// ── Mark the active top-level nav link based on the current URL ────────────
// Mirrors the same detection approach as NavMenuDropdown.setActiveFromUrl(),
// extended with prefix-matching so child pages (journal entries, work case
// studies) that aren't themselves listed in the nav still light up their
// parent link.
//
// Exact match:  /about === /about                          → active
// Prefix match: /journal/some-entry starts with /journal/   → active
//
// Home (/) is deliberately excluded from prefix-matching — "/" is a prefix
// of every path on the site, so without this exclusion Home would show as
// active on every single page, including Journal and Work entries.
function markActiveLink() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const linkPath = link.getAttribute('href').replace(/\/$/, '') || '/';

    const isExactMatch = linkPath === currentPath;
    const isParentMatch = linkPath !== '/' && currentPath.startsWith(linkPath + '/');

    link.classList.toggle('is-active', isExactMatch || isParentMatch);
  });
}