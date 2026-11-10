/* ==========================================================================
   SELECT  ·  playground config
   Everything the demo shows for the Select lives here.
   Load after playground.js and select.js.
   ========================================================================== */

(() => {
  ComponentPlayground.register("select", {
    // How the harness puts a Select on the stage
    create(stage, config) {
      const el = Select.createElement();
      stage.append(el);
      return new Select(el, config.content);
    },

    config: {
      /* What the Select displays in the demo */
      content: {
        copy: {
          label: "Reporting frequency",
          placeholder: "Select a frequency",
          helper: "Applies to all exported statements.",
          error: "Choose a reporting frequency to continue.",
          empty: "No options available.",
          loading: "Loading options…",
        },
        options: ["Monthly", "Quarterly", "Annually", "Custom range"],
      },

      /* Toolbar controls. The harness calls select.setControl(id, value). */
      controls: [
        {
          id: "size",
          label: "Size",
          default: "md",
          options: [
            { id: "sm", label: "S" },
            { id: "md", label: "M" },
            { id: "lg", label: "L" },
          ],
        },
      ],

      theme: true,

      /* States. set.value can be an option value or a number (option index). */
      states: [
        {
          id: "default",
          label: "Default",
          set: {},
          spec: {
            selector: ".Select",
            aria: 'aria-haspopup="listbox"\naria-expanded="false"',
            note: "Resting state. The placeholder meets 4.5:1 contrast so it reads as content, and the label above it never disappears.",
            tokens: [
              ["--Select-surface", "--color-surface-raised"],
              ["--Select-border", "--color-border-default"],
              ["--Select-text-muted", "--color-text-muted"],
            ],
          },
        },
        {
          id: "hover",
          label: "Hover",
          set: { force: "hover" },
          spec: {
            selector: ".Select-trigger:hover",
            aria: "(no ARIA change)",
            note: "The border steps one shade stronger. Hover previews interactivity; it never carries meaning on its own.",
            tokens: [
              ["--Select-border-hover", "--color-border-strong"],
              ["--Select-surface", "--color-surface-raised"],
            ],
          },
        },
        {
          id: "focus",
          label: "Focus",
          set: { force: "focus" },
          spec: {
            selector: ".Select-trigger:focus-visible",
            aria: "(native focus)",
            note: "A 3px ring paired with a transparent outline, so focus still shows in forced-colors mode.",
            tokens: [
              ["--Select-border-focus", "--color-focus"],
              ["--Select-ring", "--color-focus-ring"],
            ],
          },
        },
        {
          id: "open",
          label: "Open",
          set: { open: true },
          spec: {
            selector: ".Select.is-open",
            aria: 'aria-expanded="true"\naria-activedescendant="…-opt-0"',
            note: "Focus stays on the trigger. The highlighted option is announced through aria-activedescendant, so closing the list never strands focus.",
            tokens: [
              ["--Select-surface", "--color-surface-raised"],
              ["--Select-option-hover", "--color-surface-hover"],
            ],
          },
        },
        {
          id: "selected",
          label: "Selected",
          set: { value: 1 },
          spec: {
            selector: '.Select-option[aria-selected="true"]',
            aria: 'aria-selected="true"  (on the option)',
            note: "The value is restated in the trigger and marked in the list with a check and heavier weight, never color alone.",
            tokens: [
              ["--Select-text", "--color-text-primary"],
              ["--Select-option-selected", "--color-accent-subtle"],
              ["--Select-option-selected-text", "--color-accent-text"],
            ],
          },
        },
        {
          id: "disabled",
          label: "Disabled",
          set: {
            disabled: true,
            message: "Locked by your plan administrator.",
          },
          spec: {
            selector: ".Select.is-disabled",
            aria: 'aria-disabled="true"',
            note: "aria-disabled instead of the disabled attribute keeps the field discoverable to screen readers. Helper text explains why it is unavailable.",
            tokens: [
              ["--Select-surface-disabled", "--color-surface-disabled"],
              ["--Select-border-disabled", "--color-border-subtle"],
              ["--Select-text-disabled", "--color-text-disabled"],
            ],
          },
        },
        {
          id: "error",
          label: "Error",
          set: { error: true },
          spec: {
            selector: ".Select.is-invalid",
            aria: 'aria-invalid="true"\naria-describedby="…-message"',
            note: "The message takes over the helper slot, so dense forms do not jump. Icon plus text, never red alone.",
            tokens: [["--Select-danger", "--color-text-danger"]],
          },
        },
        {
          id: "loading",
          label: "Loading",
          set: { loading: true, message: "Fetching available options…" },
          spec: {
            selector: ".Select.is-loading",
            aria: 'aria-busy="true"\naria-disabled="true"',
            note: "The trigger keeps its size while options load. The spinner stops under prefers-reduced-motion.",
            tokens: [
              ["--Select-surface", "--color-surface-raised"],
              ["--Select-text-muted", "--color-text-muted"],
            ],
          },
        },
      ],
    },
  });
})();
