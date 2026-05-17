// =============================================================================
// PROJECT-GALLERY.JS
// Loaded as a classic <script> tag after script.js.
// anime.js is imported via a separate <script type="module"> in the HTML
// (see work_wip.html) — this file handles all non-FLIP logic and wires up
// the FLIP engine once anime.js is available on window.AnimeGallery.
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Subtab config ──────────────────────────────────────────────────────
  const SUBTAB_CONFIG = {
    designsystem: [
      { label: 'All',        subcategory: 'all'       },
      { label: 'Components', subcategory: 'component' },
      { label: 'Tokens',     subcategory: 'tokens'    },
      { label: 'Patterns',     subcategory: 'patterns'    },
    ],
    redesign: [
       { label: 'All',      subcategory: 'all'      },
       { label: 'Concept',  subcategory: 'concept'  },
       { label: 'Test Ready',  subcategory: 'test'  },
       { label: 'Production Ready',  subcategory: 'production'  },
       { label: 'Launched', subcategory: 'launched' },
     ],
     netnew: [
       { label: 'All',      subcategory: 'all'      },
       { label: 'Concept',  subcategory: 'concept'  },
       { label: 'Test Ready',  subcategory: 'test'  },
       { label: 'Production Ready',  subcategory: 'production'  },
       { label: 'Launched', subcategory: 'launched' },
     ],
     research: [
       { label: 'All',      subcategory: 'all'      },
       { label: 'Generative',  subcategory: 'generative'  }, // interviews, surveys, user understanding
       { label: 'Evaluative',  subcategory: 'eval'  }, // accessibility evaluations, website audits, heuristic reviews
     ],
  };

  // ── State ──────────────────────────────────────────────────────────────
  let currentCategory    = 'all';
  let currentSubcategory = 'all';

  // ── DOM refs ───────────────────────────────────────────────────────────
  const $grid     = document.getElementById('project-grid');
  const tier1     = document.getElementById('gallery-tier1');
  const tier2     = document.getElementById('gallery-tier2');

  if (!$grid || !tier1 || !tier2) return; // not on a gallery page

  const tier1Tabs = [...tier1.querySelectorAll('.gtab')];
  const viewBtns  = [...document.querySelectorAll('.view-toggle__btn')];

  // ── View toggle ────────────────────────────────────────────────────────
  // cardsLayout is set by the module script block in the HTML once
  // anime.js resolves. Until then, view switching still works — just
  // without the FLIP animation.
  function setView(view) {
    if (window._galleryLayout) {
      const { cardsLayout, utils, stagger } = window._galleryLayout;
      cardsLayout.update(() => {
        $grid.setAttribute('data-view', view);
        utils.set(utils.$('#project-grid .project-card'), { transform: 'none' });
        viewBtns.forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.view === view ? 'true' : 'false'));
      }, { duration: 450, ease: 'inOut(3)', delay: stagger([0, 300]) });
    } else {
      $grid.setAttribute('data-view', view);
      viewBtns.forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.view === view ? 'true' : 'false'));
    }
    try { localStorage.setItem('btd-gallery-view', view); } catch(e) {}
  }

  // Mobile: always list, hide toggle
  const mq = window.matchMedia('(max-width: 640px)');

  function applyMobileView(mobile) {
    if (mobile) {
      $grid.setAttribute('data-view', 'list');
      viewBtns.forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.view === 'list' ? 'true' : 'false'));
    } else {
      try {
        const saved = localStorage.getItem('btd-gallery-view');
        const view  = (saved === 'grid' || saved === 'list') ? saved : 'grid';
        $grid.setAttribute('data-view', view);
        viewBtns.forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.view === view ? 'true' : 'false'));
      } catch(e) {}
    }
  }

  applyMobileView(mq.matches);
  mq.addEventListener('change', e => applyMobileView(e.matches));

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-pressed') === 'true') return;
      setView(btn.dataset.view);
    });
  });

  const viewToggleGroup = document.querySelector('.view-toggle');
  if (viewToggleGroup) {
    viewToggleGroup.addEventListener('keydown', e => {
      const btns = [...viewToggleGroup.querySelectorAll('.view-toggle__btn')];
      const idx  = btns.indexOf(document.activeElement);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); btns[(idx + 1) % btns.length].focus(); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); btns[(idx - 1 + btns.length) % btns.length].focus(); }
    });
  }

  // ── Selbox ─────────────────────────────────────────────────────────────
  const selBox = document.createElement('div');
  selBox.className = 'gallery-selbox';
  selBox.setAttribute('aria-hidden', 'true');
  selBox.innerHTML = `
    <span class="gallery-selbox__corner gallery-selbox__corner--tl"></span>
    <span class="gallery-selbox__corner gallery-selbox__corner--tr"></span>
    <span class="gallery-selbox__corner gallery-selbox__corner--bl"></span>
    <span class="gallery-selbox__corner gallery-selbox__corner--br"></span>
    <span class="gallery-selbox__cursor">
      <!-- ─── Cursor Image ──────────────────────────────────
      <img src="./assets/img/Vector.svg" alt="" width="28" height="28" aria-hidden="true"> -->
    </span>
  `;
  tier1.appendChild(selBox);

  const INSET = 5;

  function moveSelbox(tab) {
    const nr = tier1.getBoundingClientRect();
    const tr = tab.getBoundingClientRect();
    selBox.style.width     = `${tr.width  + INSET * 2}px`;
    selBox.style.height    = `${tr.height + INSET * 2}px`;
    selBox.style.transform = `translate(${tr.left - nr.left - INSET}px, ${tr.top - nr.top - INSET}px)`;
  }

  let resizeRaf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const active = tier1.querySelector('.gtab[aria-selected="true"]');
      if (active) moveSelbox(active);
    });
  });

  // ── Tier-1: activate category tab ──────────────────────────────────────
  function activateTier1(tab, animate) {
    tier1Tabs.forEach(t => { t.setAttribute('aria-selected', 'false'); t.setAttribute('tabindex', '-1'); });
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');

    if (!animate) selBox.style.transition = 'none';
    moveSelbox(tab);
    if (!animate) { selBox.getBoundingClientRect(); selBox.style.transition = ''; }
    selBox.classList.add('is-ready');

    currentCategory    = tab.dataset.category;
    currentSubcategory = 'all';

    buildTier2(currentCategory);
    filterGallery();
  }

  tier1Tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTier1(tab, true));
    tab.addEventListener('keydown', e => {
      const idx = tier1Tabs.indexOf(tab);
      const nav = delta => {
        const next = tier1Tabs[(idx + delta + tier1Tabs.length) % tier1Tabs.length];
        next.focus(); activateTier1(next, true);
      };
      if (e.key === 'ArrowRight') { e.preventDefault(); nav(1);  }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); nav(-1); }
      if (e.key === 'Home') { e.preventDefault(); tier1Tabs[0].focus(); activateTier1(tier1Tabs[0], true); }
      if (e.key === 'End')  { e.preventDefault(); tier1Tabs[tier1Tabs.length - 1].focus(); activateTier1(tier1Tabs[tier1Tabs.length - 1], true); }
    });
  });

  // ── Tier-2: build subtab row ────────────────────────────────────────────
  function buildTier2(category) {
    const subtabs = SUBTAB_CONFIG[category];

    if (!subtabs || subtabs.length === 0) {
      tier2.innerHTML = '';
      tier2.classList.remove('is-visible');
      return;
    }

    tier2.innerHTML = '';
    subtabs.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className = 'gsubtab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('data-subcategory', item.subcategory);
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('tabindex',      i === 0 ? '0'   : '-1');
      btn.textContent = item.label;
      tier2.appendChild(btn);
    });

    tier2.classList.add('is-visible');

    const subtabBtns = [...tier2.querySelectorAll('.gsubtab')];
    subtabBtns.forEach(btn => {
      btn.addEventListener('click', () => activateTier2(btn, subtabBtns));
      btn.addEventListener('keydown', e => {
        const idx = subtabBtns.indexOf(btn);
        const nav = delta => {
          const next = subtabBtns[(idx + delta + subtabBtns.length) % subtabBtns.length];
          next.focus(); activateTier2(next, subtabBtns);
        };
        if (e.key === 'ArrowRight') { e.preventDefault(); nav(1);  }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); nav(-1); }
        if (e.key === 'Home') { e.preventDefault(); subtabBtns[0].focus(); activateTier2(subtabBtns[0], subtabBtns); }
        if (e.key === 'End')  { e.preventDefault(); subtabBtns[subtabBtns.length - 1].focus(); activateTier2(subtabBtns[subtabBtns.length - 1], subtabBtns); }
      });
    });
  }

  // ── Tier-2: activate subtab ─────────────────────────────────────────────
  function activateTier2(btn, allBtns) {
    allBtns.forEach(t => { t.setAttribute('aria-selected', 'false'); t.setAttribute('tabindex', '-1'); });
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');
    currentSubcategory = btn.dataset.subcategory;
    filterGallery();
  }

  // ── Filter gallery ──────────────────────────────────────────────────────
  function filterGallery() {
    $grid.querySelectorAll('.project-card').forEach(card => {
      let show = false;
      if      (currentCategory === 'all')        show = true;
      else if (currentSubcategory === 'all')      show = card.dataset.category === currentCategory;
      else show = card.dataset.category === currentCategory && card.dataset.subcategory === currentSubcategory;
      card.classList.toggle('is-hidden', !show);
    });
  }

  // ── Init ────────────────────────────────────────────────────────────────
  const initialTab = tier1.querySelector('.gtab[aria-selected="true"]') || tier1Tabs[0];
  if (initialTab) activateTier1(initialTab, false);

}); // end DOMContentLoaded