/* ==========================================================================
   STARTER CONFIG  ·  copy to <name>.config.js for a new component
   Replace every NAME / Name with your component (e.g. textfield / TextField).
   Load after playground.js and the component's own .js file.
 
   Your component class must provide (see playground.js for details):
     .el · .applyState(set) · .setControl(id, value)
     dispatch 'component:statechange' on render
   ========================================================================== */

(() => {
  ComponentPlayground.register("NAME", {
    create(stage, config) {
      const el = Name.createElement(); // or build markup here
      stage.append(el);
      return new Name(el, config.content);
    },

    config: {
      // What the component displays in the demo
      content: {
        copy: { label: "…", helper: "…", error: "…" },
      },

      // Toolbar controls. Delete any your component doesn't need.
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

      // First entry is the default. set = whatever your applyState() accepts.
      states: [
        {
          id: "default",
          label: "Default",
          set: {},
          spec: {
            selector: ".Name",
            aria: "…",
            note: "…",
            tokens: [["--Name-…", "--color-…"]],
          },
        },
      ],
    },
  });
})();
