// =============================================================================
// SCRIPT.JS
// Class name convention: SUIT CSS (PascalCase components, is- state prefix)
// =============================================================================


// ─── Mobile Menu ─────────────────────────────────────────────────────────────

class MobileMenu {
  constructor() {
    this.menuOpen = false;
    this.init();
  }

  init() {
    this.setupMobileMenu();
  }

  setupMobileMenu() {
    const menuToggle  = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.MobileMenu .NavMenu-item');

    if (menuToggle) {
      menuToggle.addEventListener('click', () => this.toggleMenu());
    }

    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => this.closeMenu());
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const mobileMenu  = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuIcon    = document.getElementById('menu-icon');
    const closeIcon   = document.getElementById('close-icon');

    if (this.menuOpen) {
      mobileMenu.classList.add('is-active');
      menuOverlay.classList.add('is-active');
      menuIcon.classList.add('is-hidden');
      closeIcon.classList.remove('is-hidden');
    } else {
      mobileMenu.classList.remove('is-active');
      menuOverlay.classList.remove('is-active');
      menuIcon.classList.remove('is-hidden');
      closeIcon.classList.add('is-hidden');
    }
  }

  closeMenu() {
    if (!this.menuOpen) return;
    this.menuOpen = false;

    const mobileMenu  = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuIcon    = document.getElementById('menu-icon');
    const closeIcon   = document.getElementById('close-icon');

    mobileMenu.classList.remove('is-active');
    menuOverlay.classList.remove('is-active');
    menuIcon.classList.remove('is-hidden');
    closeIcon.classList.add('is-hidden');
  }
}

// Initialize when DOM is ready
// DOMContentLoaded — moved to end of file after all class definitions


// ─── NavMenu Dropdown — Services (and future collapsible nav items) ──────────
// Auto-detects active child by comparing link href against current pathname.
// Mirrors the JOURNAL_ENTRIES/CERT_ENTRIES pattern: one detection rule,
// works identically on desktop sidebar and mobile drawer.

class NavMenuDropdown {
  constructor(el) {
    this.el      = el;
    this.trigger = el.querySelector('.NavMenu-dropdownTrigger');
    this.items   = el.querySelectorAll('.NavMenu-dropdownItem');

    this.trigger.addEventListener('click', () => this.toggle());
    this.setActiveFromUrl();
  }

  toggle() {
    const isOpen = this.el.classList.toggle('is-open');
    this.trigger.setAttribute('aria-expanded', String(isOpen));
  }

  open() {
    this.el.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');
  }

  setActiveFromUrl() {
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    let hasActiveChild = false;

    this.items.forEach((item) => {
      const link = item.querySelector('.NavMenu-dropdownLink');
      const linkPath = link.getAttribute('href').replace(/\/$/, '');

      if (linkPath === currentPath) {
        item.classList.add('is-active');
        hasActiveChild = true;
      } else {
        item.classList.remove('is-active');
      }
    });

    // has-active-child persists regardless of open/closed state — it answers
    // "is the current page inside this section," not "is this panel expanded."
    // toggle() never touches this class, so collapsing the dropdown won't
    // erase the signal that the user is still on one of its subpages.
    this.el.classList.toggle('has-active-child', hasActiveChild);

    // Auto-open on initial page load only, as a helpful default —
    // the user is still free to manually collapse it afterward.
    if (hasActiveChild) this.open();
  }
}


// ─── Copy Email to Clipboard ──────────────────────────────────────────────────

function copyEmail(event) {
  event.preventDefault();

  const link        = event.currentTarget;
  const email       = 'hello@bthedesigner.me';
  const originalHTML = link.innerHTML;

  if (!navigator.clipboard) {
    console.warn('Clipboard API not supported');
    return;
  }

  navigator.clipboard.writeText(email)
    .then(() => {
      link.innerHTML = 'Copied!';
      setTimeout(() => {
        link.innerHTML = originalHTML;
      }, 1500);
    })
    .catch(err => {
      console.error('Failed to copy email:', err);
    });
}

window.copyEmail = copyEmail;


// ─── Gallery ──────────────────────────────────────────────────────────────────

let currentCategory    = 'all';
let currentSubcategory = 'all';

const gallery              = document.getElementById('gallery');
const subcategoryContainer = document.querySelector('.SubcategoryGroup');

function init() {
  setupCategoryFilters();
  setupSubcategoryFilters();
  updateGallery();
  // Note: setupKeyboard() removed — was called but never defined
}

function setupCategoryFilters() {
  const categoryButtons = document.querySelectorAll('.Button--filter');

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      categoryButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      currentCategory    = category;
      currentSubcategory = 'all';

      updateSubcategorySections();
      updateGallery();
    });
  });
}

function setupSubcategoryFilters() {
  const subcategoryButtons = document.querySelectorAll('.SubcategoryButton');

  subcategoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category    = btn.dataset.category;
      const subcategory = btn.dataset.subcategory;

      if (category === currentCategory) {
        const siblingButtons = document.querySelectorAll(
          `.SubcategoryButton[data-category="${category}"]`
        );
        siblingButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        currentSubcategory = subcategory;
        updateGallery();
      }
    });
  });
}

function updateSubcategorySections() {
  const subcategorySections = document.querySelectorAll('.SubcategoryList');

  subcategorySections.forEach(section => {
    section.classList.remove('SubcategoryList--visible');
  });

  if (currentCategory !== 'all') {
    const activeSection = document.getElementById(`subcategory-${currentCategory}`);
    if (activeSection) {
      const buttons = activeSection.querySelectorAll('.SubcategoryButton');
      buttons.forEach(b => b.classList.remove('is-active'));
      buttons[0]?.classList.add('is-active');

      activeSection.classList.add('SubcategoryList--visible');
    }
  }
}

function updateGallery() {
  const galleryItems = document.querySelectorAll('.ProjectCard');
  let visibleCount = 0;

  galleryItems.forEach(item => {
    const itemCategory    = item.dataset.category;
    const itemSubcategory = item.dataset.subcategory;
    let shouldShow = false;

    if (currentCategory === 'all') {
      shouldShow = true;
    } else if (currentSubcategory === 'all') {
      shouldShow = itemCategory === currentCategory;
    } else {
      shouldShow = itemCategory === currentCategory && itemSubcategory === currentSubcategory;
    }

    if (shouldShow) {
      item.classList.remove('is-hidden');
      visibleCount++;
    } else {
      item.classList.add('is-hidden');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);

// ─── Gallery Hover — Figma Selection Box ─────────────────────────────────────

(function () {

  const PURPLE_HEX = '#A27ECC';
  const FONT_MONO  = '"DM Mono", "Courier New", monospace';

  const style = document.createElement('style');
  style.textContent = `
    .fsel-box {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 999;
      opacity: 0;
      transition: opacity 0.15s ease;
      will-change: transform, width, height;
    }
    .fsel-box.is-visible { opacity: 1; }
    .fsel-border {
      position: absolute;
      inset: 0;
      border: 1.5px solid ${PURPLE_HEX};
      background: rgba(162, 126, 204, 0.05);
      border-radius: 2px;
    }
    .fsel-handle {
      position: absolute;
      width: 6px;
      height: 6px;
      background-color: #C1A9DD;
      border: 1px solid ${PURPLE_HEX};
    }
    .fsel-handle--tl { top: -3px;    left: -3px;  }
    .fsel-handle--tr { top: -3px;    right: -3px; }
    .fsel-handle--bl { bottom: -3px; left: -3px;  }
    .fsel-handle--br { bottom: -3px; right: -3px; }
    .fsel-label {
      position: absolute;
      bottom: calc(100% + 6px);
      left: -2px;
      background: ${PURPLE_HEX};
      color: #1A1A20;
      font-family: ${FONT_MONO};
      font-size: 10px;
      font-weight: 600;
      line-height: 1;
      padding: 3px 8px;
      border-radius: 3px;
      white-space: nowrap;
      letter-spacing: 0.02em;
    }
  `;
  document.head.appendChild(style);

  const box = document.createElement('div');
  box.className = 'fsel-box';
  box.innerHTML = `
    <div class="fsel-border"></div>
    <div class="fsel-handle fsel-handle--tl"></div>
    <div class="fsel-handle fsel-handle--tr"></div>
    <div class="fsel-handle fsel-handle--bl"></div>
    <div class="fsel-handle fsel-handle--br"></div>
    <div class="fsel-label"></div>
  `;

  const label = box.querySelector('.fsel-label');
  let hideTimer = null;

  function getCardLabel(container) {
    const categoryEl = container.querySelector('.ProjectCard-Category p');
    if (categoryEl) return 'ProjectCard / ' + categoryEl.textContent.trim();
    const articleLabelEl = container.querySelector('.ArticleCard-label');
    if (articleLabelEl) return 'JournalEntryCard / ' + articleLabelEl.textContent.trim().replace(/\s+/g, ' ');
    const workcategoryEl = container.querySelector('.WorkCard-category p');
    if (workcategoryEl) return 'ProjectCard / ' + workcategoryEl.textContent.trim();
    return 'Card';
  }

  function snapToCard(container) {
    const rect = container.getBoundingClientRect();
    box.style.width     = rect.width  + 'px';
    box.style.height    = rect.height + 'px';
    box.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    label.textContent   = getCardLabel(container);
  }

  function initFigmaSelect() {
    document.body.appendChild(box);

    const containers = document.querySelectorAll('[data-card-hover]');
    let activeContainer = null;

    containers.forEach(container => {
      container.addEventListener('mouseenter', () => {
        clearTimeout(hideTimer);
        activeContainer = container;
        snapToCard(container);
        box.classList.add('is-visible');
      });

      container.addEventListener('mouseleave', () => {
        activeContainer = null;
        hideTimer = setTimeout(() => {
          box.classList.remove('is-visible');
        }, 80);
      });
    });

    const scrollContainer = document.querySelector('.ContentWrapper');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', () => {
        if (activeContainer && box.classList.contains('is-visible')) {
          snapToCard(activeContainer);
        }
      }, { passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFigmaSelect);
  } else {
    initFigmaSelect();
  }

})();

// ─── Anchor List ──────────────────────────────────────────────────────────────

(function() {
  const LINK_SPACING     = 24;
  const LINK_TOP_START   = 1;
  const SQUARE_SPACING   = 33;
  const SQUARE_TOP_START = 0.5;

  let linksContainer, svg, svgGroup, svgPath;
  let sections = [];
  let currentActiveIndex = 0;

  function calculateSVGHeight(count) {
    if (count === 0) return 0;
    return (count - 1) * SQUARE_SPACING + 5;
  }

  function initialize() {
    linksContainer = document.getElementById('anchor-links-container');
    svg            = document.getElementById('anchor-svg');
    svgGroup       = svg?.querySelector('#Line');
    svgPath        = document.getElementById('anchor-path');

    if (!linksContainer || !svg || !svgGroup) {
      console.warn('Anchor list: required DOM elements not found.');
      return;
    }

    const sectionElements = document.querySelectorAll('section[data-label]');
    sections = Array.from(sectionElements);

    if (sections.length === 0) {
      console.warn('No sections found with data-label attribute');
      return;
    }

    buildNavigation();
    setupScrollSpy();
    handleScroll();
  }

  function buildNavigation() {
    linksContainer.innerHTML = '';

    const existingSquares = svgGroup.querySelectorAll('.anchor-square');
    existingSquares.forEach(square => square.remove());

    const svgHeight = calculateSVGHeight(sections.length);
    svg.setAttribute('height', svgHeight);
    svg.setAttribute('viewBox', `0 0 5 ${svgHeight}`);

    if (sections.length > 0) {
      const pathEnd = (sections.length - 1) * SQUARE_SPACING + 2.5;
      svgPath.setAttribute('d', `M2.5 2.5V${pathEnd}`);
    }

    sections.forEach((section, index) => {
      const label     = section.dataset.label || `Section ${index + 1}`;
      const sectionId = section.id;

      if (!sectionId) {
        console.warn('Section is missing an ID:', section);
        return;
      }

      const button = document.createElement('button');
      button.className      = 'anchor-link';
      button.textContent    = label;
      button.dataset.index  = index;
      button.dataset.target = sectionId;
      button.style.top      = `${LINK_TOP_START + (index * LINK_SPACING)}px`;
      button.addEventListener('click', () => jumpToSection(sectionId, index));
      linksContainer.appendChild(button);

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('class',  'anchor-square');
      rect.setAttribute('x',      '0.5');
      rect.setAttribute('y',      SQUARE_TOP_START + (index * SQUARE_SPACING));
      rect.setAttribute('width',  '4');
      rect.setAttribute('height', '4');
      rect.setAttribute('stroke', '#A27ECC');
      rect.dataset.index = index;
      svgGroup.appendChild(rect);
    });
  }

  function jumpToSection(sectionId, index) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(index);
    }
  }

  function setActiveSection(index) {
    if (index < 0 || index >= sections.length) return;
    currentActiveIndex = index;

    const links = linksContainer.querySelectorAll('.anchor-link');
    links.forEach((link, i) => link.classList.toggle('active', i === index));

    const squares = svgGroup.querySelectorAll('.anchor-square');
    squares.forEach((square, i) => square.classList.toggle('active', i === index));
  }

  function setupScrollSpy() {
    const scrollContainer = document.querySelector('.ContentWrapper');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
  }

  function handleScroll() {
    const scrollContainer = document.querySelector('.ContentWrapper');
    if (!scrollContainer) return;

    const scrollTop    = scrollContainer.scrollTop;
    const offset       = scrollContainer.clientHeight / 3;
    const triggerPoint = scrollTop + offset;

    let currentIndex = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= triggerPoint) currentIndex = index;
    });

    setActiveSection(currentIndex);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();

// ─── Text Highlight ───────────────────────────────────────────────────────────

(function () {
  function initScrollHighlights() {
    const scrollContainer = document.querySelector('.ContentWrapper');
    if (!scrollContainer) return;

    const highlights = document.querySelectorAll('.c-text-highlight');
    if (!highlights.length) return;

    highlights.forEach((el) => {
      const checkVisibility = () => {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elRect        = el.getBoundingClientRect();
        const triggerPoint  = containerRect.top + scrollContainer.clientHeight * 0.75;

        if (elRect.top <= triggerPoint) {
          el.getBoundingClientRect();
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.classList.add('is-active');
            });
          });
          scrollContainer.removeEventListener('scroll', checkVisibility);
        }
      };

      scrollContainer.addEventListener('scroll', checkVisibility, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollHighlights);
  } else {
    initScrollHighlights();
  }
})();

// ─── Accordion ───────────────────────────────────────────────────────────────

(function () {
  function initAccordions() {
    const accordions = document.querySelectorAll('.Accordion');
    if (!accordions.length) return;

    accordions.forEach((accordion) => {
      const summary = accordion.querySelector('.Accordion-summary');
      if (!summary) return;

      summary.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && accordion.open) {
          accordion.removeAttribute('open');
          summary.blur();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordions);
  } else {
    initAccordions();
  }
})();

// ─── Summary Accordion ───────────────────────────────────────────────────────

(function () {
  function initSummaryAccordion() {
    const accordion       = document.getElementById('summary-accordion');
    const wrapper         = document.getElementById('summary-accordion-wrapper');
    const scrollContainer = document.querySelector('.ContentWrapper');

    if (!accordion || !wrapper || !scrollContainer) return;

    let autoClosedByScroll = false;

    function handleScroll() {
      if (!accordion.open) return;

      const wrapperRect   = wrapper.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const bottomExited  = wrapperRect.bottom < containerRect.top;

      if (bottomExited) {
        autoClosedByScroll = true;
        accordion.removeAttribute('open');
      }
    }

    accordion.addEventListener('toggle', () => {
      if (accordion.open) autoClosedByScroll = false;

      // Accordion open/close changes page height — ScrollTrigger trigger
      // positions must be recalculated or text-reveal scrub fires off-mark.
      // Delay matches the accordion's CSS transition so layout is settled first.
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 400);
      }
    });

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSummaryAccordion);
  } else {
    initSummaryAccordion();
  }
})();

// ─── Tabs ─────────────────────────────────────────────────────────────────────

(function () {

  // Inject shared styles once
  const style = document.createElement('style');
  style.textContent = `
    .tab-selbox {
      position: absolute; top: 0; left: 0;
      pointer-events: none; z-index: 2;
      width: 0; height: 0;
      box-sizing: border-box;
      border: .5px solid var(--color-primary);
      transition:
        transform 380ms cubic-bezier(0.4, 0, 0.2, 1),
        width     380ms cubic-bezier(0.4, 0, 0.2, 1),
        height    380ms cubic-bezier(0.4, 0, 0.2, 1),
        opacity   200ms ease;
      opacity: 0;
    }
    .tab-selbox.is-ready { opacity: 1; }
    .tab-selbox__corner {
      position: absolute; width: 5px; height: 5px;
      background: var(--color-primary);
      border: .5px solid var(--color-primary);
    }
    .tab-selbox__corner--tl { top: -2.5px;    left: -2.5px;  }
    .tab-selbox__corner--tr { top: -2.5px;    right: -2.5px; }
    .tab-selbox__corner--bl { bottom: -2.5px; left: -2.5px;  }
    .tab-selbox__corner--br { bottom: -2.5px; right: -2.5px; }
    .tab-selbox__cursor { position: absolute; bottom: -14px; right: -10px; pointer-events: none; }
    .tab-btn__corners, .tab-btn__cursor { display: none !important; }
  `;
  document.head.appendChild(style);

  const INSET = 5;

  // ── Initialize a single tab group ─────────────────────────────────────────
  function initTabGroup(tabList, panelWrapper) {
    const tabs   = [...tabList.querySelectorAll('[role="tab"]')];
    const panels = panelWrapper ? [...panelWrapper.querySelectorAll('[role="tabpanel"]')] : [];

    if (!tabs.length) return;

    // Build a selection box per group so each nav has its own indicator
    const selBox = document.createElement('div');
    selBox.className = 'tab-selbox';
    selBox.setAttribute('aria-hidden', 'true');
    selBox.innerHTML = `
      <span class="tab-selbox__corner tab-selbox__corner--tl"></span>
      <span class="tab-selbox__corner tab-selbox__corner--tr"></span>
      <span class="tab-selbox__corner tab-selbox__corner--bl"></span>
      <span class="tab-selbox__corner tab-selbox__corner--br"></span>
      <span class="tab-selbox__cursor"></span>
    `;
    tabList.style.position = 'relative';
    tabList.appendChild(selBox);

    function moveSelboxTo(tab) {
      const navRect = tabList.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      selBox.style.width     = `${tabRect.width  + INSET * 2}px`;
      selBox.style.height    = `${tabRect.height + INSET * 2}px`;
      selBox.style.transform = `translate(${tabRect.left - navRect.left - INSET}px, ${tabRect.top - navRect.top - INSET}px)`;
    }

    function activateTab(tab, animate = true) {
      tabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      panels.forEach(p => {
        p.setAttribute('aria-hidden', 'true');
        p.style.display = 'none';
      });

      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');

      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) {
        panel.style.display = 'block';
        panel.setAttribute('aria-hidden', 'false');
      }

      if (!animate) selBox.style.transition = 'none';
      moveSelboxTo(tab);
      if (!animate) {
        selBox.getBoundingClientRect();
        selBox.style.transition = '';
      }

      selBox.classList.add('is-ready');
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab));

      tab.addEventListener('keydown', e => {
        const idx = tabs.indexOf(tab);
        if (e.key === 'ArrowRight') { const next = tabs[(idx + 1) % tabs.length]; next.focus(); activateTab(next); }
        else if (e.key === 'ArrowLeft') { const prev = tabs[(idx - 1 + tabs.length) % tabs.length]; prev.focus(); activateTab(prev); }
        else if (e.key === 'Home') { tabs[0].focus(); activateTab(tabs[0]); }
        else if (e.key === 'End')  { tabs[tabs.length - 1].focus(); activateTab(tabs[tabs.length - 1]); }
      });
    });

    // Reposition on resize
    let resizeRaf;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const activeTab = tabList.querySelector('[role="tab"][aria-selected="true"]');
        if (activeTab) moveSelboxTo(activeTab);
      });
    });

    // Init — show the initially selected tab
    const initialTab = tabList.querySelector('[role="tab"][aria-selected="true"]') || tabs[0] || null;
    if (!initialTab) return;

    const firstPanel = document.getElementById(initialTab.getAttribute('aria-controls'));
    if (firstPanel) {
      firstPanel.style.display = 'block';
      firstPanel.setAttribute('aria-hidden', 'false');
    }

    activateTab(initialTab, false);
  }

  // ── Find and init all tab groups on the page ───────────────────────────────
  function initAllTabGroups() {
    document.querySelectorAll('.tabs-nav').forEach(tabList => {
      // Each .tabs-nav is paired with the next sibling .tabs-panel-wrapper
      const panelWrapper = tabList.nextElementSibling?.classList.contains('tabs-panel-wrapper')
        ? tabList.nextElementSibling
        : tabList.closest('section, div')?.querySelector('.tabs-panel-wrapper');

      initTabGroup(tabList, panelWrapper);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllTabGroups);
  } else {
    initAllTabGroups();
  }

})();

// ─── Tab Accordion (mobile fallback) ─────────────────────────────────────────

(function () {
  function initTabAccordion() {
    const accTriggers = document.querySelectorAll('.accordion-trigger');
    if (!accTriggers.length) return;

    accTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Collapse only siblings within the same .accordion group —
        // prevents a cert accordion click from closing a Background accordion item
        const group = trigger.closest('.accordion');
        const groupTriggers = group
          ? group.querySelectorAll('.accordion-trigger')
          : accTriggers;

        groupTriggers.forEach(t => {
          t.setAttribute('aria-expanded', 'false');
          const b = document.getElementById(t.getAttribute('aria-controls'));
          if (b) b.setAttribute('aria-hidden', 'true');
        });

        if (!isOpen) {
          trigger.setAttribute('aria-expanded', 'true');
          const body = document.getElementById(trigger.getAttribute('aria-controls'));
          if (body) body.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTabAccordion);
  } else {
    initTabAccordion();
  }
})();

// ─── Testimonials Scroll ──────────────────────────────────────────────────────

(function () {
  'use strict';

  function initTestimonialsScroll() {
    var track = document.getElementById('js-testimonials-track');
    if (!track) return;

    var originals = track.querySelectorAll('.Testimonials-card:not([data-clone])');
    if (originals.length === 0) return;

    originals.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('data-clone', 'true');
      track.appendChild(clone);
    });

    applyMotionPreference(track);

    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', function () {
      applyMotionPreference(track);
    });
  }

  function applyMotionPreference(track) {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.style.animationPlayState = prefersReduced ? 'paused' : '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialsScroll);
  } else {
    initTestimonialsScroll();
  }
})();

// ─── DisplayEmphasis ─────────────────────────────────────────────────────────

class DisplayEmphasis {
  constructor() {
    this.elements = document.querySelectorAll('.DisplayEmphasis');
    if (!this.elements.length) return;
    this.CORNER_SIZE = 9;
    this.init();
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.elements.forEach(el => this.setTargets(el));
      this.elements.forEach(el => el.classList.add('is-active'));
      return;
    }

    const scrollRoot = document.querySelector('.ContentWrapper') || null;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setTargets(entry.target);
          entry.target.classList.add('is-active');
          this.observer.unobserve(entry.target);
        }
      });
    }, { root: scrollRoot, rootMargin: '0px', threshold: 0.5 });

    this.elements.forEach(el => this.observer.observe(el));

    let resizeRaf;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        this.elements.forEach(el => {
          if (el.classList.contains('is-active')) this.setTargets(el);
        });
      });
    });
  }

  setTargets(el) {
    const w  = el.offsetWidth;
    const h  = el.offsetHeight;
    const cs = this.CORNER_SIZE;

    const tr     = el.querySelector('.DisplayEmphasis-corner--tr');
    const bl     = el.querySelector('.DisplayEmphasis-corner--bl');
    const br     = el.querySelector('.DisplayEmphasis-corner--br');
    const cursor = el.querySelector('.DisplayEmphasis-cursor');

    if (tr)     tr.style.left = (w - cs) + 'px';
    if (bl)     bl.style.top  = (h - cs) + 'px';
    if (br)     { br.style.left = (w - cs) + 'px'; br.style.top = (h - cs) + 'px'; }
    if (cursor) { cursor.style.left = (w + 4) + 'px'; cursor.style.top = (h + 4) + 'px'; }
  }

  resetTargets(el) {
    el.style.transition = 'none';
    const tr     = el.querySelector('.DisplayEmphasis-corner--tr');
    const bl     = el.querySelector('.DisplayEmphasis-corner--bl');
    const br     = el.querySelector('.DisplayEmphasis-corner--br');
    const cursor = el.querySelector('.DisplayEmphasis-cursor');

    if (tr)     { tr.style.transition = 'none'; tr.style.left = '0px'; }
    if (bl)     { bl.style.transition = 'none'; bl.style.top  = '0px'; }
    if (br)     { br.style.transition = 'none'; br.style.left = '0px'; br.style.top = '0px'; }
    if (cursor) { cursor.style.transition = 'none'; cursor.style.left = '0px'; cursor.style.top = '0px'; }

    void el.offsetWidth;

    el.style.transition = '';
    if (tr)     tr.style.transition     = '';
    if (bl)     bl.style.transition     = '';
    if (br)     br.style.transition     = '';
    if (cursor) cursor.style.transition = '';
  }

  refresh() {
    if (!this.observer) return;
    this.elements = document.querySelectorAll('.DisplayEmphasis');
    this.elements.forEach(el => this.observer.observe(el));
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
  }
}

// ─── Summary Slideshow ────────────────────────────────────────────────────────

var sliderControl = document.querySelector('.slider-control');

if (sliderControl) {
  var slides       = document.querySelectorAll('.summaryslide');
  var slidesLength = slides.length;
  var slidesArr    = [].slice.call(slides).reverse();
  var slideCurrent = 0;

  sliderControl.addEventListener('click', function(e) {
    var target = e.target;

    if (target.classList.contains('next')) {
      var next      = e.target;
      var prev      = next.previousElementSibling;
      var nextSlide = slidesArr[slideCurrent + 1];
      var slide     = slidesArr[slideCurrent];

      slide.classList.add('slide-on');
      slide.classList.remove('text-on');
      nextSlide.classList.add('text-on');
      slideCurrent += 1;

      if (slideCurrent > 0)                    prev.classList.remove('disabled');
      if (slideCurrent === slidesLength - 1)   next.classList.add('disabled');
    }

    if (target.classList.contains('prev')) {
      slideCurrent -= 1;

      var prev      = e.target;
      var next      = prev.nextElementSibling;
      var prevSlide = slidesArr[slideCurrent + 1];
      var slide     = slidesArr[slideCurrent];

      prevSlide.classList.remove('text-on');
      slide.classList.remove('slide-on');
      slide.classList.add('text-on');

      if (slideCurrent === slidesLength - 2) next.classList.remove('disabled');
      if (slideCurrent === 0)                prev.classList.add('disabled');
    }
  });
}

// ─── Annotation Toggle ────────────────────────────────────────────────────────

(function initAnnotationToggles() {
  document.querySelectorAll('[data-annotation-toggle]').forEach(function (toggleBtn) {
    var wrapper   = toggleBtn.closest('.MediaDisplay-ProjectDetails--annotatable');
    var frame     = wrapper.querySelector('[data-annotation-frame]');
    var labelShow = wrapper.querySelector('[data-label="show"]');
    var labelHide = wrapper.querySelector('[data-label="hide"]');
    var isOn = true;

    toggleBtn.classList.add('is-on');
    toggleBtn.setAttribute('aria-checked', 'true');
    frame.classList.add('is-annotated');
    labelShow.classList.add('is-inactive');

    toggleBtn.addEventListener('click', function () {
      isOn = !isOn;
      toggleBtn.classList.toggle('is-on', isOn);
      toggleBtn.setAttribute('aria-checked', String(isOn));
      frame.classList.toggle('is-annotated', isOn);
      labelShow.classList.toggle('is-inactive', isOn);
      labelHide.classList.toggle('is-inactive', !isOn);
    });
  });
})();

// ─── Text Reveal — only runs on pages that load GSAP + Lenis + SplitType ────────

if (typeof gsap !== 'undefined' && typeof Lenis !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.defaults({
    scroller: '.ContentWrapper'
  });

  const lenisWrapper = document.querySelector('.ContentWrapper');
  const lenisContent = lenisWrapper ? lenisWrapper.firstElementChild : null;

  const lenis = new Lenis({
    lerp: 0.07,
    wrapper: lenisWrapper || undefined,
    content: lenisContent || undefined,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  const setTextRevealAnimations = () => {
    ScrollTrigger.getAll()
      .filter(st => st.vars._textReveal)
      .forEach(st => st.kill());

    document.querySelectorAll('.text-reveal').forEach(text => {
      if (text._splitInstance) text._splitInstance.revert();

      const splitText = new SplitType(text, { types: 'words' });
      text._splitInstance = splitText;

      if (!splitText.words || !splitText.words.length) return;

      gsap.fromTo(splitText.words,
        { opacity: 0.08 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.4,
          scrollTrigger: {
            _textReveal: true,
            trigger: text,
            start: 'top 85%',
            end: 'bottom 25%',
            scrub: true,
          }
        }
      );
    });
  };

  setTextRevealAnimations();

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  };

  new ResizeObserver(
    debounce(() => {
      setTextRevealAnimations();
      ScrollTrigger.refresh();
    }, 500)
  ).observe(document.body);
} // end GSAP guard

// ─── PatternCards ─────────────────────────────────────────────────────────────

class PatternCards {
  constructor() {
    this.cards = document.querySelectorAll('.PatternCard');
    if (!this.cards.length) return;
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      const summary = card.querySelector('.PatternCard-summary');
      const body    = card.querySelector('.PatternCard-body');
      if (!summary || !body) return;

      // Summary click — open or close
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        card.classList.contains('is-open') ? this.close(card) : this.open(card);
      });

      // Keyboard: Enter / Space on summary
      summary.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.contains('is-open') ? this.close(card) : this.open(card);
        }
      });

      // Bottom toggle (mobile close trigger — lives in body, not summary)
      const bottomToggle = card.querySelector('.PatternCard-toggle--bottom');
      if (bottomToggle) {
        bottomToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          this.close(card);
        });
      }

      // Start collapsed
      body.style.height     = '0px';
      body.style.overflow   = 'hidden';
      body.style.transition = 'height 500ms cubic-bezier(0.4, 0, 0.2, 1)';
    });
  }

  open(card) {
    // Close any other open card first
    this.cards.forEach(other => {
      if (other !== card && other.classList.contains('is-open')) {
        this.close(other);
      }
    });

    const body = card.querySelector('.PatternCard-body');

    card.setAttribute('open', '');
    card.classList.add('is-open');

    body.style.height = 'auto';
    const targetHeight = body.scrollHeight + 'px';
    body.style.height = '0px';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        body.style.height = targetHeight;
      });
    });

    body.addEventListener('transitionend', () => {
      body.style.height = 'auto';
    }, { once: true });
  }

  close(card) {
    const body = card.querySelector('.PatternCard-body');

    body.style.height = body.scrollHeight + 'px';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        body.style.height = '0px';
        card.classList.remove('is-open');
      });
    });

    body.addEventListener('transitionend', () => {
      card.removeAttribute('open');
    }, { once: true });
  }
}

// =============================================================================
// FindingsSlideshow — paginated findings with fade transition
// Add `new FindingsSlideshow();` inside DOMContentLoaded
// =============================================================================

class FindingsSlideshow {
  constructor() {
    this.slideshows = document.querySelectorAll('[data-findings-slideshow]');
    if (!this.slideshows.length) return;
    this.slideshows.forEach(el => this.initInstance(el));
  }

  initInstance(el) {
    const slides   = Array.from(el.querySelectorAll('[data-findings-slide]'));
    const pips     = Array.from(el.querySelectorAll('[data-findings-pip]'));
    const prevBtn  = el.querySelector('[data-findings-prev]');
    const nextBtn  = el.querySelector('[data-findings-next]');

    if (!slides.length) return;

    let current = 0;
    const total = slides.length;

    const goTo = (index) => {
      if (index === current) return;

      // Hide current
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      pips[current]?.classList.remove('is-active');
      pips[current]?.setAttribute('aria-selected', 'false');

      current = index;

      // Show new with entry animation
      slides[current].classList.add('is-active', 'is-entering');
      slides[current].setAttribute('aria-hidden', 'false');
      pips[current]?.classList.add('is-active');
      pips[current]?.setAttribute('aria-selected', 'true');

      // Remove animation class after it completes so it can replay
      slides[current].addEventListener('animationend', () => {
        slides[current].classList.remove('is-entering');
      }, { once: true });

      updateArrows();
    };

    const updateArrows = () => {
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === total - 1;
    };

    // Pip clicks
    pips.forEach((pip, i) => {
      pip.addEventListener('click', () => goTo(i));
    });

    // Arrow clicks
    prevBtn?.addEventListener('click', () => goTo(Math.max(0, current - 1)));
    nextBtn?.addEventListener('click', () => goTo(Math.min(total - 1, current + 1)));

    // Keyboard: left/right arrow when focus is inside the slideshow
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  goTo(Math.max(0, current - 1));
      if (e.key === 'ArrowRight') goTo(Math.min(total - 1, current + 1));
    });

    // Set initial arrow state
    updateArrows();
  }
}

// =============================================================================
// CaseStudyOutro — slide-up animation on the mockup image when it enters view
// No class needed — fires once per page, scoped to [data-outro-image]
// =============================================================================

(function initCaseStudyOutro() {
  const img = document.querySelector('[data-outro-image]');
  if (!img) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    img.classList.add('is-visible');
    return;
  }

  const scrollRoot = document.querySelector('.ContentWrapper') || null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.classList.add('is-visible');
          observer.unobserve(img);
        }
      });
    },
    {
      root: scrollRoot,
      rootMargin: '0px',
      threshold: 0.15
    }
  );

  observer.observe(img);
})();

// =============================================================================
// =============================================================================
// IRL Carousel — Outside of Work section (about.html only)
// =============================================================================

(function initIrlCarousel() {

  // ── Data ───────────────────────────────────────────────────────────────────
  const irlActivities = [
    { irlName: "Streaming & Community Building", irlDescription: "I host live streams and engage with creative communities, which has strengthened my communication and facilitation skills." },
    { irlName: "K-Drama Podcasting",                     irlDescription: "I host a podcast focused on character arcs, narrative structure, and storytelling in Korean Dramas." },
    { irlName: "Learning Game Design",                    irlDescription: "I'm actively building skills in game UI and interactive systems, blending my product design background with more experiential design challenges." },
  ];

  // ── DOM refs ───────────────────────────────────────────────────────────────
  const irlcards   = document.querySelectorAll(".irlcard");
  const dots       = document.querySelectorAll(".dot");
  const irlNameEl  = document.querySelector(".irl-name");
  const irlDescEl  = document.querySelector(".irl-description");
  const upArrows   = document.querySelectorAll(".irlnav-arrow.up");
  const downArrows = document.querySelectorAll(".irlnav-arrow.down");

  // Guard — only runs on pages with a carousel
  if (!irlcards.length || !irlNameEl || !irlDescEl) return;

  // ── State ──────────────────────────────────────────────────────────────────
  let currentIndex = 0;
  let isAnimating  = false;

  // ── Core update ────────────────────────────────────────────────────────────
  function updateCarousel(newIndex) {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (newIndex + irlcards.length) % irlcards.length;

    irlcards.forEach((card, i) => {
      const offset = (i - currentIndex + irlcards.length) % irlcards.length;
      card.classList.remove("center", "up-1", "up-2", "down-1", "down-2", "hidden");

      if      (offset === 0)                   card.classList.add("center");
      else if (offset === 1)                   card.classList.add("down-1");
      else if (offset === 2)                   card.classList.add("down-2");
      else if (offset === irlcards.length - 1) card.classList.add("up-1");
      else if (offset === irlcards.length - 2) card.classList.add("up-2");
      else                                     card.classList.add("hidden");
    });

    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));

    irlNameEl.style.opacity = "0";
    irlDescEl.style.opacity = "0";

    setTimeout(() => {
      irlNameEl.textContent  = irlActivities[currentIndex].irlName;
      irlDescEl.textContent  = irlActivities[currentIndex].irlDescription;
      irlNameEl.style.opacity = "1";
      irlDescEl.style.opacity = "1";
    }, 300);

    setTimeout(() => { isAnimating = false; }, 800);
  }

  // ── Controls ────────────────────────────────────────────────────────────────
  upArrows.forEach(arrow   => arrow.addEventListener("click",   () => updateCarousel(currentIndex - 1)));
  downArrows.forEach(arrow => arrow.addEventListener("click",   () => updateCarousel(currentIndex + 1)));
  dots.forEach((dot, i)    => dot.addEventListener("click",     () => updateCarousel(i)));
  irlcards.forEach((card, i) => card.addEventListener("click",  () => updateCarousel(i)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp")   updateCarousel(currentIndex - 1);
    if (e.key === "ArrowDown") updateCarousel(currentIndex + 1);
  });

  let touchStartY = 0;
  document.addEventListener("touchstart", (e) => { touchStartY = e.changedTouches[0].screenY; }, { passive: true });
  document.addEventListener("touchend",   (e) => {
    const diff = touchStartY - e.changedTouches[0].screenY;
    if (Math.abs(diff) > 50) updateCarousel(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }, { passive: true });

  // ── Init ───────────────────────────────────────────────────────────────────
  updateCarousel(0);

})();

// ─── MediaDisplayLightbox ─────────────────────────────────────────────────────
class MediaDisplayLightbox {
  constructor() {
    this.triggers = document.querySelectorAll('[data-lightbox]');
    if (!this.triggers.length) return;
    this.lightbox = null;
    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this.lightbox && this.lightbox.classList.contains('is-open')) {
        this.close();
      }
    };
    this.init();
  }

  init() {
    this.buildLightbox();
    this.triggers.forEach(trigger => {
      const frame = trigger.querySelector('.MediaDisplay-framelg');
      if (frame) {
        frame.addEventListener('click', () => this.open(trigger));
      }
    });
  }

  buildLightbox() {
    const lb = document.createElement('div');
    lb.className = 'Lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image lightbox');
    lb.innerHTML = `
      <button class="Lightbox-close" aria-label="Close lightbox">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="Lightbox-content">
        <img class="Lightbox-image" src="" alt="">
        <div class="Lightbox-caption">
          <div class="Lightbox-captionBadge"><p></p></div>
          <p class="Lightbox-captionText"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lb);
    this.lightbox = lb;

    lb.addEventListener('click', (e) => {
      if (e.target === lb) this.close();
    });
    lb.querySelector('.Lightbox-close').addEventListener('click', () => this.close());
    document.addEventListener('keydown', this._onKeyDown);
  }

  open(trigger) {
    const img = trigger.querySelector('.MediaDisplay-imagelg');
    const badgeEl = trigger.querySelector('.MediaDisplay-badge p');
    const captionEl = trigger.querySelector('.MediaDisplay-caption p');

    const lbImg = this.lightbox.querySelector('.Lightbox-image');
    const lbBadge = this.lightbox.querySelector('.Lightbox-captionBadge p');
    const lbCaption = this.lightbox.querySelector('.Lightbox-captionText');

    if (img) {
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
    }
    if (badgeEl) lbBadge.textContent = badgeEl.textContent;
    if (captionEl) lbCaption.textContent = captionEl.textContent;

    this.lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    this.lightbox.querySelector('.Lightbox-close').focus();
  }

  close() {
    this.lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

// =============================================================================
// DOMContentLoaded — class-based component init
// Placed after all class definitions so PatternCards, FindingsSlideshow etc.
// are defined before they are instantiated.
// =============================================================================

// nav-loader.js sets window.navLoaderReady (a Promise) before this file runs.
// Wait for it so MobileMenu / NavMenuDropdown don't query for nav elements
// that haven't been injected into the DOM yet. On pages without nav-loader.js,
// navLoaderReady is undefined — fall back to resolving immediately.
document.addEventListener('DOMContentLoaded', () => {
  Promise.resolve(window.navLoaderReady).then(() => {
    new MobileMenu();
    new DisplayEmphasis();
    new PatternCards();
    new FindingsSlideshow();
    new MediaDisplayLightbox();

    // Services dropdown (and any future collapsible nav items)
    document.querySelectorAll('[data-nav-dropdown]').forEach(el => new NavMenuDropdown(el));
  });
});


// =============================================================================
// Back Button — smart navigation for case study pages
// Default href on .js-back-btn points to the work gallery (safe fallback for
// external referrers e.g. LinkedIn). If the user came from within this site,
// history.back() is used instead so they return to their exact scroll position.
// =============================================================================

(function initBackButton() {
  const btn = document.querySelector('.js-back-btn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    const referrer = document.referrer;
    const isInternal = referrer && (
      referrer.includes(window.location.hostname) ||
      referrer.startsWith('http://127.0.0.1') ||
      referrer.startsWith('http://localhost')
    );

    if (isInternal && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
    // Otherwise let the default href (work gallery) handle it
  });
})();