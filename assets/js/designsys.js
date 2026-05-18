/**
 * live-preview.js
 * Controls for the Data Card live preview component.
 * No dependencies — vanilla JS, runs on DOMContentLoaded.
 */
 
(function () {
 
  /* ── State ─────────────────────────────────────────────── */
  const state = {
    variant: 'full',
    delta:   'up',
    vp:      'desktop'
  };
 
  /* ── Delta config ───────────────────────────────────────── */
  const deltaConfig = {
    up:      { cls: 'is-up',      icon: 'M5 8V2M2 5l3-3 3 3', text: '4 this quarter' },
    down:    { cls: 'is-down',    icon: 'M5 2v6M2 5l3 3 3-3', text: '2 this quarter' },
    neutral: { cls: 'is-neutral', icon: 'M2 5h8',              text: 'No change'      }
  };
 
  /* ── Slot visibility per variant ────────────────────────── */
  const variantSlots = {
    full:    { tag: true,  delta: true,  context: true,  cta: false },
    minimal: { tag: false, delta: false, context: false, cta: false },
    withcta: { tag: true,  delta: true,  context: false, cta: true  }
  };
 
  /* ── Public: called by toolbar button onclick attrs ─────── */
  window.setVariant = function (v, btn) {
    state.variant = v;
    activateBtn(btn, '[data-variant]');
    applySlots();
  };
 
  window.setDelta = function (d, btn) {
    state.delta = d;
    activateBtn(btn, '[data-delta]');
    applyDelta();
  };
 
  window.setViewport = function (vp, btn) {
    state.vp = vp;
    activateBtn(btn, '[data-vp]');
 
    const canvas = document.getElementById('previewCanvas');
    canvas.classList.remove('vp-desktop', 'vp-tablet', 'vp-mobile');
    canvas.classList.add('vp-' + vp);
 
    const label = document.getElementById('statusViewport');
    if (label) label.textContent = vp.charAt(0).toUpperCase() + vp.slice(1);
  };
 
  /* ── Slot toggling ──────────────────────────────────────── */
  function applySlots () {
    const slots = variantSlots[state.variant];
 
    toggle('slot-tag',     slots.tag);
    toggle('slot-delta',   slots.delta);
    toggle('slot-context', slots.context);
    toggle('slot-cta',     slots.cta);
    toggle('slot-divider', slots.cta);
 
    if (slots.delta) applyDelta();
  }
 
  function toggle (id, show) {
    const el = document.getElementById(id);
    if (!el) return;
    if (show) {
      el.style.display = '';
      animateIn(el);
    } else {
      el.style.display = 'none';
    }
  }
 
  /* ── Delta state ────────────────────────────────────────── */
  function applyDelta () {
    const cfg  = deltaConfig[state.delta];
    const el   = document.getElementById('slot-delta');
    const icon = document.getElementById('delta-icon');
    const text = document.getElementById('delta-text');
    if (!el || !icon || !text) return;
 
    el.className = 'p-DataCard__delta ' + cfg.cls;
    icon.querySelector('path').setAttribute('d', cfg.icon);
    text.textContent = cfg.text;
    animateIn(el);
  }
 
  /* ── Slide-in animation helper ──────────────────────────── */
  function animateIn (el) {
    el.classList.add('slot-animate');
    el.addEventListener('animationend', () => {
      el.classList.remove('slot-animate');
    }, { once: true });
  }
 
  /* ── Active button state ────────────────────────────────── */
  function activateBtn (btn, selector) {
    const group = btn.closest('.toolbar-group');
    if (!group) return;
    group.querySelectorAll('.toolbar-btn' + selector)
         .forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
  }
 
  /* ── Init ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', applySlots);
 
})();