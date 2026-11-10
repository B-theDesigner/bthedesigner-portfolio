/* ==========================================================================
   SELECT  ·  single-select dropdown
   Follows the WAI-ARIA "select-only combobox" pattern: focus stays on the
   trigger, the highlighted option is announced with aria-activedescendant.
 
   Use it two ways:
     1. Markup only: add data-select to a .Select block. It auto-starts.
     2. From JS:     const s = Select.from(el, { options, copy });
                     const el = Select.createElement();  // builds the markup
 
   Options: strings, or { value, label, description? }
 
   Public API
     s.value                      current value (or null)
     s.setValue('monthly')        set without firing select:change
     s.setOptions([...])
     s.setCopy({ label, placeholder, helper, error, empty, loading })
     s.setDisabled(true|false) · s.setLoading(true|false) · s.setError('Message' | null)
     el.addEventListener('select:change', (e) => e.detail.value)
 
   Playground contract (see playground.js)
     s.el · s.applyState(set) · s.setControl(id, value)
     emits component:statechange
   ========================================================================== */

class Select {
  static #count = 0;

  static ICONS = {
    chevron:
      '<svg class="Select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    spinner:
      '<svg class="Select-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.2-8.56"/></svg>',
    check:
      '<svg class="Select-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    alert:
      '<svg class="Select-messageIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>',
  };

  /** Returns the existing instance for an element, or creates one. */
  static from(el, options) {
    return el._select ?? new Select(el, options);
  }

  /** Starts every [data-select] block inside scope. */
  static initAll(scope = document) {
    scope.querySelectorAll("[data-select]").forEach((el) => Select.from(el));
  }

  /** Builds empty Select markup. Content is filled in by the constructor. */
  static createElement() {
    const el = document.createElement("div");
    el.className = "Select";
    el.innerHTML = `
      <label class="Select-label"></label>
      <div class="Select-control">
        <button type="button" class="Select-trigger">
          <span class="Select-icon" hidden></span>
          <span class="Select-value"></span>
          ${Select.ICONS.chevron}
          ${Select.ICONS.spinner}
        </button>
        <ul class="Select-listbox"></ul>
      </div>
      <p class="Select-message">
        ${Select.ICONS.alert}
        <span class="Select-messageText"></span>
      </p>`;
    return el;
  }

  constructor(root, { copy = {}, options } = {}) {
    this.el = root;
    root._select = this;

    this.labelEl = root.querySelector(".Select-label");
    this.trigger = root.querySelector(".Select-trigger");
    this.iconEl = root.querySelector(".Select-icon");
    this.valueEl = root.querySelector(".Select-value");
    this.listbox = root.querySelector(".Select-listbox");
    this.messageEl = root.querySelector(".Select-message");
    this.messageText = root.querySelector(".Select-messageText");

    this.wireAccessibility();

    // Copy: JS options win, then data- attributes, then whatever is in the markup
    const ds = root.dataset;
    this.copy = {
      label: this.labelEl.textContent.trim(),
      placeholder: ds.placeholder ?? "Select an option",
      helper: this.messageText.textContent.trim(),
      error: "Choose an option to continue.",
      empty: "No options available.",
      loading: ds.loadingText ?? "Loading…",
    };

    // Optional hidden input so the value submits with a form
    if (ds.name) {
      this.input = document.createElement("input");
      this.input.type = "hidden";
      this.input.name = ds.name;
      root.append(this.input);
    }

    this.value = ds.value ?? null;
    this.isOpen = false;
    this.activeIndex = -1;
    this.disabled = "disabled" in ds;
    this.loading = false;
    this.error = null;
    this.message = null;
    this.force = null;
    this.hovering = false; // real mouse hover on the trigger
    this.keyboardFocus = false; // focus arrived by keyboard (Tab), not a click
    this.typeahead = { text: "", timer: null };

    this.setCopy(copy, { render: false });
    this.setOptions(options ?? this.readOptionsFromMarkup());
    this.bindEvents();
  }

  /* Setup ---------------------------------------------------------------- */

  wireAccessibility() {
    const uid = `select-${++Select.#count}`;
    const id = (el, suffix) => (el.id ||= `${uid}-${suffix}`);

    const labelId = id(this.labelEl, "label");
    const triggerId = id(this.trigger, "trigger");
    const listboxId = id(this.listbox, "listbox");
    const messageId = id(this.messageEl, "message");

    this.labelEl.htmlFor = triggerId;
    this.trigger.type = "button";
    this.trigger.setAttribute("aria-haspopup", "listbox");
    this.trigger.setAttribute("aria-controls", listboxId);
    this.trigger.setAttribute("aria-describedby", messageId);
    this.listbox.setAttribute("role", "listbox");
    this.listbox.setAttribute("aria-labelledby", labelId);
    this.listbox.hidden = true;
  }

  readOptionsFromMarkup() {
    return [...this.listbox.querySelectorAll(".Select-option")].map((li) => {
      const label = li.textContent.trim();
      return {
        value: li.dataset.value ?? label,
        label,
        description: li.dataset.description,
      };
    });
  }

  setCopy(copy = {}, { render = true } = {}) {
    this.copy = { ...this.copy, ...copy };
    this.labelEl.textContent = this.copy.label;
    if (render) this.render();
  }

  setOptions(list) {
    this.options = list.map((o) =>
      typeof o === "string" ? { value: o, label: o } : o,
    );
    if (this.indexOf(this.value) < 0) this.value = null;

    this.listbox.innerHTML = "";
    this.optionEls = this.options.map((option, i) => {
      const li = document.createElement("li");
      li.className = "Select-option";
      li.id = `${this.listbox.id}-opt-${i}`;
      li.dataset.value = option.value;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");

      const body = document.createElement("span");
      body.className = "Select-optionBody";
      const text = document.createElement("span");
      text.className = "Select-optionText";
      text.textContent = option.label;
      body.append(text);

      if (option.description) {
        const desc = document.createElement("span");
        desc.className = "Select-optionDesc";
        desc.textContent = option.description;
        body.append(desc);
      }

      li.append(body);
      li.insertAdjacentHTML("beforeend", Select.ICONS.check);
      this.listbox.append(li);
      return li;
    });

    // Empty state: explain instead of showing an empty box
    if (!this.options.length) {
      const empty = document.createElement("li");
      empty.className = "Select-empty";
      empty.setAttribute("role", "option");
      empty.setAttribute("aria-disabled", "true");
      this.emptyEl = empty;
      this.listbox.append(empty);
    } else {
      this.emptyEl = null;
    }

    this.render();
  }

  /** Variant settings. Currently: { icon: 'svg path data' } adds a leading icon. */
  setVariant({ icon = null } = {}) {
    if (!this.iconEl) return; // markup without a .Select-icon slot
    this.iconEl.hidden = !icon;
    this.iconEl.innerHTML = "";
    if (!icon) return;
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    Object.entries({
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
    }).forEach(([k, v]) => svg.setAttribute(k, v));
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", icon);
    svg.append(path);
    this.iconEl.append(svg);
  }

  setSize(size) {
    this.el.classList.remove("Select--sm", "Select--lg");
    if (size && size !== "md") this.el.classList.add(`Select--${size}`);
  }

  bindEvents() {
    this.trigger.addEventListener("click", () => {
      if (this.locked) return;
      this.isOpen ? this.close() : this.open();
    });

    this.trigger.addEventListener("keydown", (e) => this.onKeydown(e));

    // Space activates buttons on keyup in some browsers; keydown already handled it
    this.trigger.addEventListener("keyup", (e) => {
      if (e.key === " ") e.preventDefault();
    });

    // Clicking the label focuses the field, like a native select
    this.labelEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.trigger.focus();
    });

    // Track real hover and keyboard focus so the demo can report them.
    // Mouse/pen only: on touch screens a tap would flash "Hover" for a moment.
    this.trigger.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "touch") return;
      this.hovering = true;
      this.render();
    });
    this.trigger.addEventListener("pointerleave", () => {
      if (!this.hovering) return;
      this.hovering = false;
      this.render();
    });
    this.trigger.addEventListener("focus", () => {
      this.keyboardFocus = this.trigger.matches(":focus-visible");
      this.render();
    });
    this.trigger.addEventListener("blur", () => {
      this.keyboardFocus = false;
      this.render();
    });

    // Real interaction ends a forced hover/focus preview (playground only)
    ["pointerdown", "focus"].forEach((type) => {
      this.trigger.addEventListener(type, () => {
        if (!this.force) return;
        this.force = null;
        this.render();
      });
    });

    // Keep focus on the trigger while clicking options
    this.listbox.addEventListener("mousedown", (e) => e.preventDefault());

    this.listbox.addEventListener("click", (e) => {
      const li = e.target.closest(".Select-option");
      if (li) this.choose(this.optionEls.indexOf(li));
    });

    this.listbox.addEventListener("mousemove", (e) => {
      const li = e.target.closest(".Select-option");
      const i = this.optionEls.indexOf(li);
      if (li && i !== this.activeIndex) this.setActive(i);
    });

    document.addEventListener("pointerdown", (e) => {
      if (this.isOpen && !this.el.contains(e.target)) this.close();
    });
  }

  /* Behavior ------------------------------------------------------------- */

  get locked() {
    return this.disabled || this.loading;
  }

  get selectedOption() {
    return this.options[this.indexOf(this.value)] ?? null;
  }

  indexOf(value) {
    return this.options ? this.options.findIndex((o) => o.value === value) : -1;
  }

  onKeydown(e) {
    if (this.locked) return;
    const last = this.options.length - 1;

    if (!this.isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        this.open();
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      this.close();
      return;
    }
    if (e.key === "Tab") {
      this.close();
      return;
    }
    if (last < 0) {
      if (e.key === "Enter" || e.key === " ") e.preventDefault();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.setActive(Math.min(this.activeIndex + 1, last));
        break;
      case "ArrowUp":
        e.preventDefault();
        this.setActive(Math.max(this.activeIndex - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        this.setActive(0);
        break;
      case "End":
        e.preventDefault();
        this.setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        this.choose(this.activeIndex);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey)
          this.typeToFind(e.key);
    }
  }

  // Typing letters jumps to the first matching option
  typeToFind(char) {
    clearTimeout(this.typeahead.timer);
    this.typeahead.text += char.toLowerCase();
    this.typeahead.timer = setTimeout(() => (this.typeahead.text = ""), 500);
    const match = this.options.findIndex((o) =>
      o.label.toLowerCase().startsWith(this.typeahead.text),
    );
    if (match >= 0) this.setActive(match);
  }

  open() {
    if (this.locked || this.isOpen) return;
    this.force = null;
    this.keyboardFocus = false;
    this.isOpen = true;
    this.activeIndex = this.options.length
      ? Math.max(this.indexOf(this.value), 0)
      : -1;
    this.render();
    this.optionEls[this.activeIndex]?.scrollIntoView({ block: "nearest" });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.activeIndex = -1;
    this.render();
  }

  choose(index) {
    const option = this.options[index];
    if (!option) return;
    this.value = option.value;
    this.error = null;
    this.isOpen = false;
    this.activeIndex = -1;
    this.render();
    this.el.dispatchEvent(
      new CustomEvent("select:change", {
        bubbles: true,
        detail: { ...option },
      }),
    );
  }

  setActive(index) {
    this.activeIndex = index;
    this.render();
    this.optionEls[index]?.scrollIntoView({ block: "nearest" });
  }

  /* Public setters ------------------------------------------------------- */

  setValue(value) {
    this.value = this.indexOf(value) >= 0 ? value : null;
    this.render();
  }
  setDisabled(on = true) {
    this.disabled = on;
    if (on) this.isOpen = false;
    this.render();
  }
  setLoading(on = true) {
    this.loading = on;
    if (on) this.isOpen = false;
    this.render();
  }
  setError(message = null) {
    this.error = message;
    this.render();
  }

  /* Playground contract -------------------------------------------------- */

  // Order matters: earlier states win. Hover and focus are temporary,
  // so they show only while nothing more important (open, error…) applies.
  get currentState() {
    if (this.force) return this.force;
    if (this.isOpen) return "open";
    if (this.loading) return "loading";
    if (this.disabled) return "disabled";
    if (this.error) return "error";
    if (this.hovering) return "hover";
    if (this.keyboardFocus) return "focus";
    if (this.value) return "selected";
    return "default";
  }

  /**
   * value:  an option value, or a number = option index
   * error:  true uses copy.error, or pass a string
   */
  applyState({
    open = false,
    value = null,
    disabled = false,
    loading = false,
    error = null,
    message = null,
    force = null,
  } = {}) {
    this.hovering = false;
    this.keyboardFocus = false;
    const resolved =
      typeof value === "number" ? (this.options[value]?.value ?? null) : value;
    this.value = this.indexOf(resolved) >= 0 ? resolved : null;
    this.disabled = disabled;
    this.loading = loading;
    this.error = error === true ? this.copy.error : error;
    this.message = message;
    this.force = force;
    this.isOpen = open;
    this.activeIndex =
      open && this.options.length ? Math.max(this.indexOf(this.value), 0) : -1;
    this.render();
  }

  setControl(id, value) {
    if (id === "size") this.setSize(value);
  }

  /* Render: the only place the DOM is updated ---------------------------- */

  render() {
    const { el, trigger } = this;

    el.classList.toggle("is-open", this.isOpen);
    el.classList.toggle("is-disabled", this.disabled);
    el.classList.toggle("is-loading", this.loading);
    el.classList.toggle("is-invalid", Boolean(this.error));
    el.classList.toggle("is-hover", this.force === "hover");
    el.classList.toggle("is-focus", this.force === "focus");

    trigger.setAttribute("aria-expanded", String(this.isOpen));
    trigger.setAttribute("aria-disabled", String(this.locked));
    trigger.setAttribute("aria-busy", String(this.loading));
    trigger.setAttribute("aria-invalid", String(Boolean(this.error)));

    if (this.isOpen && this.activeIndex >= 0) {
      trigger.setAttribute(
        "aria-activedescendant",
        this.optionEls[this.activeIndex].id,
      );
    } else {
      trigger.removeAttribute("aria-activedescendant");
    }

    this.listbox.hidden = !this.isOpen;
    if (this.emptyEl) this.emptyEl.textContent = this.copy.empty;

    const selected = this.selectedOption;
    this.valueEl.textContent = this.loading
      ? this.copy.loading
      : (selected?.label ?? this.copy.placeholder);
    this.valueEl.classList.toggle("is-placeholder", this.loading || !selected);

    this.optionEls.forEach((li, i) => {
      li.setAttribute(
        "aria-selected",
        String(this.options[i].value === this.value),
      );
      li.classList.toggle("is-active", i === this.activeIndex);
    });

    this.messageText.textContent =
      this.error ?? this.message ?? this.copy.helper;
    if (this.input) this.input.value = this.value ?? "";

    el.dispatchEvent(
      new CustomEvent("component:statechange", {
        detail: { state: this.currentState },
      }),
    );
  }
}

window.Select = Select;

document.addEventListener("DOMContentLoaded", async () => {
  if (window.navLoaderReady) await window.navLoaderReady;
  Select.initAll();
});
