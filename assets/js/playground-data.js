// =============================================================================
// PLAYGROUND-DATA.JS — Single source of truth for all playground entries
//
// HOW TO ADD A NEW ENTRY:
//   1. Add a new object to the top of the PLAYGROUND_ENTRIES array (newest first)
//   2. Fill in all fields — the playground page and homepage both pull from here
//   3. Save. Both pages update automatically.
//
// FIELDS:
//   title       {string}  — full entry title
//   date        {string}  — display date, e.g. "April 30, 2026"
//   readTime    {string}  — e.g. "30 mins"
//   tag         {string}  — display label, e.g. "Process"
//   category    {string}  — filter slug, e.g. "process" (matches gtab data-category)
//   subcategory {string}  — filter slug for tier-2, or "" if none
//   image       {string}  — path relative to the page loading it
//   imageAlt    {string}  — descriptive alt text
//   href        {string}  — path to the entry page
// =============================================================================

const PLAYGROUND_ENTRIES = [
  {
    title: "How I'm Building My Personal Brand System with Atomic Thinking",
    date: "April 30, 2026",
    readTime: "30 mins",
    tag: "Process",
    category: "process",
    subcategory: "",
    image: "/assets/img/playground/bdesignsystem.png",
    imageAlt: "Screenshot of the B the Designer brand system",
    href: "/playground/design-identity",
  },
  {
    title: "Why Designers Must Learn To Articulate Their Decisions",
    date: "April 30, 2026",
    readTime: "30 mins",
    tag: "Reflection",
    category: "reflection",
    subcategory: "",
    image: "/assets/img/playground/articulate_design.jpg",
    imageAlt: "Illustration representing design articulation",
    href: "/playground/articulatedesigns",
  },
  {
    title: "Understanding Stakeholders Perspectives",
    date: "April 30, 2026",
    readTime: "30 mins",
    tag: "Reflection",
    category: "reflection",
    subcategory: "",
    image: "/assets/img/playground/perspective.jpg",
    imageAlt: "Screenshot of a perspective",
    href: "/playground/stakeholdersPOV",
  },
  {
    title: "Using AI As A Productivity Partner",
    date: "April 30, 2026",
    readTime: "30 mins",
    tag: "Reflection",
    category: "reflection",
    subcategory: "",
    image: "/assets/img/playground/ai_productivity.jpg",
    imageAlt: "Computer on AI site",
    href: "/playground/ai-productivity-partner",
  },

  //  {
  //   title:       "From cPanel Chaos to GitHub Pages Zen",
  //   date:        "April 30, 2026",
  //    readTime:    "30 mins",
  //    tag:         "Reflection",
  //    category:    "reflection",
  //    subcategory: "",
  //    image:       "./assets/img/playground/cPanel Banner.png",
  //     imageAlt:    "Concept of cPanel in visual flames",
  //    href:        "/playgrounds/guided-healthcare-experience",
  //   },

  //  {
  //    title:       "Letting The Problem Shape The Process",
  //    date:        "April 30, 2026",
  //    readTime:    "30 mins",
  //    tag:         "Reflection",
  //    category:    "reflection",
  //    subcategory: "",
  //     image:       "./assets/img/playground/shaping.jpg",
  //     imageAlt:    "Zoom in image of a whiteboard session",
  //     href:        "/playgrounds/guided-healthcare-experience",
  //   },
];
