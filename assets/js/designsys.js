/* ── state ── */
const state = {
  variant: 'full',
  delta:   'up',
  vp:      'desktop'
};
 
const deltaConfig = {
  up:      { cls: 'is-up',      icon: 'M5 8V2M2 5l3-3 3 3', text: '4 this quarter' },
  down:    { cls: 'is-down',    icon: 'M5 2v6M2 5l3 3 3-3', text: '2 this quarter' },
  neutral: { cls: 'is-neutral', icon: 'M2 5h8',              text: 'No change'      }
};
 
/* ── variant slots visibility ── */
const variantSlots = {
  full:    { tag: true,  delta: true,  context: true,  cta: false },
  minimal: { tag: false, delta: false, context: false, cta: false },
  withcta: { tag: true,  delta: true,  context: false, cta: true  }
};
 
function setVariant(v, btn) {
  state.variant = v;
  activateBtn(btn, '[data-variant]');
  applySlots();
}
 
function setDelta(d, btn) {
  state.delta = d;
  activateBtn(btn, '[data-delta]');
  applyDelta();
}
 
function setViewport(vp, btn) {
  state.vp = vp;
  activateBtn(btn, '[data-vp]');
  const canvas = document.getElementById('previewCanvas');
  canvas.classList.remove('vp-desktop', 'vp-tablet', 'vp-mobile');
  canvas.classList.add('vp-' + vp);
  document.getElementById('statusViewport').textContent =
    vp.charAt(0).toUpperCase() + vp.slice(1);
}
 
function applySlots() {
  const slots  = variantSlots[state.variant];
  const toggle = (id, show) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (show) {
      el.style.display = '';
      el.classList.add('slot-animate');
      el.addEventListener('animationend', () => el.classList.remove('slot-animate'), { once: true });
    } else {
      el.style.display = 'none';
    }
  };
  toggle('slot-tag',     slots.tag);
  toggle('slot-delta',   slots.delta);
  toggle('slot-context', slots.context);
  toggle('slot-cta',     slots.cta);
  toggle('slot-divider', slots.cta);
  // re-apply delta state whenever slots become visible
  if (slots.delta) applyDelta();
}
 
function applyDelta() {
  const cfg   = deltaConfig[state.delta];
  const el    = document.getElementById('slot-delta');
  const icon  = document.getElementById('delta-icon');
  const text  = document.getElementById('delta-text');
  el.className = 'p-DataCard__delta ' + cfg.cls;
  icon.querySelector('path').setAttribute('d', cfg.icon);
  text.textContent = cfg.text;
  el.classList.add('slot-animate');
  el.addEventListener('animationend', () => el.classList.remove('slot-animate'), { once: true });
}
 
function activateBtn(btn, selector) {
  // Scope to the nearest .toolbar-group so we only deactivate siblings
  const group = btn.closest('.toolbar-group');
  group.querySelectorAll('.toolbar-btn' + selector)
       .forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
}
 
/* init */
applySlots();