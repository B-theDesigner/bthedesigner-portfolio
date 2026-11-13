// =============================================================================
// GALLERY-TAB-SELECT.JS
// Mobile dropdown for the Tier-1 gallery tabs (Work, Journal, Playground).
// Reuses the design-system Select (assets/components/select/select.js).
//
// The tabs stay the source of truth:
//   - Choosing an option clicks the matching .GalleryTab, so each page's
//     gallery script (filtering, Tier-2 subtabs, selbox) runs unchanged.
//   - Any tab change (click, keyboard, init) updates the Select.
//
// Load after the page's gallery script and select.js.
// Visibility swap (tabs ↔ select) lives in module.css at max-width: 640px.
// =============================================================================

document.addEventListener("DOMContentLoaded", function () {
  const tier1 = document.getElementById("gallery-tier1");
  if (!tier1 || !window.Select) return; // not a gallery page, or Select missing

  const tabs = [...tier1.querySelectorAll(".GalleryTab")];
  if (!tabs.length) return;

  // ── Build the Select from the tabs ─────────────────────────────────────
  const el = Select.createElement();
  el.classList.add("GalleryTabs-select");
  tier1.before(el); // inside .GalleryTabs, above Tier-1, so Tier-2 still follows

  const select = new Select(el, {
    copy: {
      label: tier1.getAttribute("aria-label") || "Filter by category",
      helper: "",
    },
    options: tabs.map((tab) => ({
      value: tab.dataset.category,
      label: tab.textContent.trim(),
    })),
  });

  // ── Tabs → Select ──────────────────────────────────────────────────────
  function syncFromTabs() {
    const active = tier1.querySelector('.GalleryTab[aria-selected="true"]');
    if (active && select.value !== active.dataset.category) {
      select.setValue(active.dataset.category);
    }
  }

  syncFromTabs();

  new MutationObserver(syncFromTabs).observe(tier1, {
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-selected"],
  });

  // ── Select → Tabs ──────────────────────────────────────────────────────
  el.addEventListener("select:change", (e) => {
    const tab = tabs.find((t) => t.dataset.category === e.detail.value);
    if (tab && tab.getAttribute("aria-selected") !== "true") tab.click();
  });
});
