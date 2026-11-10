/* ==========================================================================
   COMPONENT PLAYGROUND  ·  reusable demo harness
   You should never need to edit this file. To demo a component:
 
     1. Build the component so it follows the contract below.
     2. Write <name>.config.js that calls ComponentPlayground.register().
     3. Put <section data-playground="<name>"></section> on the page.
 
   Load order: playground.js → component .js → component .config.js
 
   ── Component contract ────────────────────────────────────────────────
   create(stage, config) must return an object with:
     .el                           root element (inside the stage)
     .applyState(set)              show a state; set comes from config.states
     .setControl(id, value)        respond to toolbar controls (size, etc.)
   and the .el must dispatch 'component:statechange' { detail: { state } }
   whenever it renders, so real interaction keeps the picker in sync.
 
   ── Config shape ──────────────────────────────────────────────────────
   {
     content:  { ... }   passed to create(); what the component displays
     controls: [{ id, label, default, options: [{ id, label }] }]
     theme:    true      shows Light / Dark (false hides it)
     defaultState  id; defaults to the first state
     states:   [{ id, label, set: {...}, spec: { selector, aria, note, tokens: [[component, semantic]] } }]
   }
   ========================================================================== */

class ComponentPlayground {
  static #registry = new Map();
  static #count = 0;

  /** Register a component under the name used in data-playground="name". */
  static register(name, definition) {
    ComponentPlayground.#registry.set(name, definition);
  }

  /** Starts every [data-playground] block inside scope. */
  static initAll(scope = document) {
    scope.querySelectorAll("[data-playground]").forEach((root) => {
      if (root._playground) return;
      const name = root.dataset.playground;
      const definition = ComponentPlayground.#registry.get(name);
      if (!definition) {
        console.warn(
          `[Playground] Nothing registered as "${name}". Is ${name}.config.js loaded after playground.js?`,
        );
        return;
      }
      root._playground = new ComponentPlayground(root, name, definition);
    });
  }

  constructor(root, name, { create, config }) {
    this.root = root;
    this.name = name;
    this.uid = `playground-${++ComponentPlayground.#count}`;
    this.config = {
      content: {},
      controls: [],
      theme: true,
      ...config,
    };
    this.stateIds = this.config.states.map((s) => s.id);
    // Theme starts on whatever the visitor's device prefers
    this.theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    root.classList.add("Playground");
    this.buildShell();
    this.component = create(this.stage, this.config);
    this.bindEvents();

    this.config.controls.forEach((c) =>
      this.setControl(c.id, c.default ?? c.options[0].id),
    );
    this.setTheme(this.theme);
    this.setState(this.config.defaultState ?? this.stateIds[0], {
      announce: false,
    });
  }

  /* Build ---------------------------------------------------------------- */

  // Tiny element helper: h('div', { class: 'X', 'data-y': '' }, child, 'text')
  static h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (v === false || v == null) return;
      if (k === "text") el.textContent = v;
      else el.setAttribute(k, v === true ? "" : v);
    });
    children.flat().forEach((c) => c != null && el.append(c));
    return el;
  }

  static icon(d) {
    const span = document.createElement("span");
    span.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
    return span.firstChild;
  }

  buildShell() {
    const { h, icon } = ComponentPlayground;
    const id = (s) => `${this.uid}-${s}`;
    const { controls, theme } = this.config;

    // State picker with previous / next
    this.statePicker = h("select", {
      class: "Playground-picker",
      id: id("state"),
    });
    this.config.states.forEach((s, i) =>
      this.statePicker.add(
        new Option(`${String(i + 1).padStart(2, "0")} · ${s.label}`, s.id),
      ),
    );
    this.prevBtn = h(
      "button",
      {
        type: "button",
        class: "Playground-stepBtn",
        "aria-label": "Previous state",
      },
      icon("m15 18-6-6 6-6"),
    );
    this.nextBtn = h(
      "button",
      {
        type: "button",
        class: "Playground-stepBtn",
        "aria-label": "Next state",
      },
      icon("m9 18 6-6-6-6"),
    );
    const stateControl = h(
      "div",
      { class: "Playground-control Playground-control--picker" },
      h("label", {
        class: "Playground-controlLabel",
        for: id("state"),
        text: "State",
      }),
      h(
        "div",
        { class: "Playground-stepper" },
        this.prevBtn,
        h(
          "div",
          { class: "Playground-pickerWrap" },
          this.statePicker,
          this.pickerIcon(),
        ),
        this.nextBtn,
      ),
    );

    // Segmented controls: one per config control, plus theme
    this.controlGroups = new Map();
    const segmented = (key, label, items, onPick) => {
      const labelId = id(`${key}-label`);
      const group = h("div", {
        class: "Playground-segmented",
        role: "group",
        "aria-labelledby": labelId,
      });
      items.forEach((item) => {
        const btn = h("button", {
          type: "button",
          class: "Playground-segmentedBtn",
          "data-value": item.id,
          "aria-pressed": "false",
          text: item.label,
        });
        btn.addEventListener("click", () => onPick(item.id));
        group.append(btn);
      });
      this.controlGroups.set(key, group);
      return h(
        "div",
        { class: "Playground-control" },
        h("span", {
          class: "Playground-controlLabel",
          id: labelId,
          text: label,
        }),
        group,
      );
    };

    const controlEls = controls.map((c) =>
      segmented(c.id, c.label, c.options, (v) => this.setControl(c.id, v)),
    );
    const themeEl = theme
      ? segmented(
          "theme",
          "Theme",
          [
            { id: "light", label: "Light" },
            { id: "dark", label: "Dark" },
          ],
          (v) => this.setTheme(v),
        )
      : null;

    this.stage = h("div", { class: "Playground-stage" });
    this.live = h("p", { class: "Playground-live", "aria-live": "polite" });

    // Every state's spec is built once and stacked in the same spot.
    // Only the current one is visible, so the panel is always as tall as the
    // tallest spec and the layout never jumps when the state changes.
    this.specPanels = new Map();
    const spec = h("aside", {
      class: "Playground-spec",
      "aria-label": "State specification",
    });
    this.config.states.forEach((state) => {
      const panel = this.buildSpecPanel(state);
      this.specPanels.set(state.id, panel);
      spec.append(panel);
    });

    // Row 1: controls. Row 2: stage + spec side by side (they stack on small screens).
    this.root.append(
      h(
        "div",
        { class: "Playground-body" },
        h(
          "div",
          { class: "Playground-toolbar" },
          stateControl,
          controlEls,
          themeEl,
        ),
        h("div", { class: "Playground-main" }, this.stage, spec),
        this.live,
      ),
    );
  }

  pickerIcon() {
    const svg = ComponentPlayground.icon("m6 9 6 6 6-6");
    svg.classList.add("Playground-pickerIcon");
    return svg;
  }

  bindEvents() {
    this.statePicker.addEventListener("change", () =>
      this.setState(this.statePicker.value),
    );
    this.prevBtn.addEventListener("click", () => this.step(-1));
    this.nextBtn.addEventListener("click", () => this.step(1));

    // Using the real component updates the picker and spec
    this.component.el.addEventListener("component:statechange", (e) =>
      this.syncFrom(e.detail.state),
    );

    // Optional jump links anywhere on the page:
    // <button data-playground-jump="select" data-state="error">
    document
      .querySelectorAll(`[data-playground-jump="${this.name}"]`)
      .forEach((el) => {
        el.addEventListener("click", () => {
          if (el.dataset.state) this.setState(el.dataset.state);
          this.root.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
  }

  /* Actions -------------------------------------------------------------- */

  step(direction) {
    const count = this.stateIds.length;
    const index = this.stateIds.indexOf(this.current);
    this.setState(this.stateIds[(index + direction + count) % count]);
  }

  setState(id, { announce = true } = {}) {
    const state = this.config.states.find((s) => s.id === id);
    if (!state) return;
    this.current = id;
    this.statePicker.value = id;
    this.component.applyState(state.set ?? {});
    this.renderSpec(state);
    if (announce) this.live.textContent = `${state.label} state`;
  }

  syncFrom(id) {
    if (id === this.current || !this.stateIds.includes(id)) return;
    this.current = id;
    this.statePicker.value = id;
    this.renderSpec(this.config.states.find((s) => s.id === id));
  }

  setControl(id, value) {
    this.component.setControl(id, value);
    this.markPressed(id, value);
  }

  // light-dark() resolves per element, so changing color-scheme on the stage
  // re-themes only the component, not your page.
  setTheme(id) {
    this.theme = id;
    this.stage.style.colorScheme = id;
    this.markPressed("theme", id);
    this.refreshTokens();
  }

  markPressed(key, value) {
    this.controlGroups
      .get(key)
      ?.querySelectorAll("button")
      .forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.value === value));
      });
  }

  /* Spec panel ----------------------------------------------------------- */

  buildSpecPanel(state) {
    const { h } = ComponentPlayground;
    const spec = state.spec ?? {};
    const code = [spec.selector, spec.aria].filter(Boolean).join("\n");
    const tokens = spec.tokens ?? [];

    return h(
      "div",
      { class: "Playground-specPanel", "data-state": state.id },
      h(
        "div",
        { class: "Playground-specHeader" },
        h("span", { class: "Playground-controlLabel", text: "Spec" }),
        h("span", { class: "Playground-specState", text: state.label }),
      ),
      spec.note
        ? h("p", { class: "Playground-specNote", text: spec.note })
        : null,
      code
        ? h(
            "div",
            { class: "Playground-control" },
            h("span", {
              class: "Playground-controlLabel",
              text: "Selector · ARIA",
            }),
            h("pre", { class: "Playground-code" }, h("code", { text: code })),
          )
        : null,
      tokens.length
        ? h(
            "div",
            { class: "Playground-control" },
            h("span", { class: "Playground-controlLabel", text: "Tokens" }),
            h(
              "ul",
              { class: "Playground-tokens" },
              tokens.map(([token, semantic]) => {
                const swatch = h("span", {
                  class: "Playground-swatch",
                  "aria-hidden": "true",
                });
                swatch.style.background = `var(${token})`;
                return h(
                  "li",
                  {
                    class: "Playground-token",
                    "data-semantic": semantic ?? "",
                  },
                  swatch,
                  h(
                    "span",
                    { class: "Playground-tokenText" },
                    h("span", { text: token }),
                    h("span", { class: "Playground-tokenMeta" }),
                  ),
                );
              }),
            ),
          )
        : null,
    );
  }

  // Shows the current state's panel; the others stay in place, invisible
  renderSpec(state) {
    this.specPanels.forEach((panel, id) =>
      panel.classList.toggle("is-active", id === state.id),
    );
  }

  // Swatches follow the stage theme; read each color back so the hex matches the screen
  refreshTokens() {
    this.root.querySelectorAll(".Playground-token").forEach((li) => {
      const swatch = li.querySelector(".Playground-swatch");
      swatch.style.colorScheme = this.theme;
      const hex = ComponentPlayground.toHex(
        getComputedStyle(swatch).backgroundColor,
      );
      const semantic = li.dataset.semantic;
      li.querySelector(".Playground-tokenMeta").textContent = semantic
        ? `→ ${semantic} · ${hex}`
        : hex;
    });
  }

  static toHex(color) {
    const m = color.match(/rgba?\(([^)]+)\)/);
    if (!m) return color;
    const [r, g, b, a] = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    const hex =
      "#" +
      [r, g, b]
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
    return a !== undefined && a < 1 ? `${hex} · ${Math.round(a * 100)}%` : hex;
  }
}

window.ComponentPlayground = ComponentPlayground;

document.addEventListener("DOMContentLoaded", async () => {
  if (window.navLoaderReady) await window.navLoaderReady;
  ComponentPlayground.initAll();
});
