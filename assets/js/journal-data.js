// =============================================================================
// JOURNAL-DATA.JS — Single source of truth for all journal entries
//
// HOW TO ADD A NEW ENTRY:
//   1. Add a new object to the top of the JOURNAL_ENTRIES array (newest first)
//   2. Fill in all fields — the journal page and homepage both pull from here
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

const JOURNAL_ENTRIES = [
  {
    title:       "How I'm Building My Personal Brand System with Atomic Thinking",
    date:        "April 30, 2026",
    readTime:    "30 mins",
    tag:         "Process",
    category:    "process",
    subcategory: "",
    image:       "/assets/img/journals/bdesignsystem.png",
    imageAlt:    "Screenshot of the B the Designer brand system",
    href:        "/journal/design-identity",
  },
  {
    title:       "Why Designers Must Learn To Articulate Their Decisions",
    date:        "April 30, 2026",
    readTime:    "30 mins",
    tag:         "Reflection",
    category:    "reflection",
    subcategory: "",
    image:       "/assets/img/journals/articulate_design.jpg",
    imageAlt:    "Illustration representing design articulation",
    href:        "/journal/articulatedesigns",
  },
  {
    title:       "Understanding Stakeholders Perspectives",
    date:        "April 30, 2026",
    readTime:    "30 mins",
    tag:         "Reflection",
    category:    "reflection",
    subcategory: "",
    image:       "/assets/img/journals/perspective.jpg",
    imageAlt:    "Screenshot of a perspective",
    href:        "/journal/stakeholdersPOV",
  },
   {
    title:       "Using AI As A Productivity Partner",
    date:        "April 30, 2026",
    readTime:    "30 mins",
    tag:         "Reflection",
    category:    "reflection",
    subcategory: "",
    image:       "/assets/img/journals/ai_productivity.jpg",
    imageAlt:    "Computer on AI site",
    href:        "/journal/ai-productivity-partner",
  },

 //  {
  //   title:       "From cPanel Chaos to GitHub Pages Zen",
  //   date:        "April 30, 2026",
 //    readTime:    "30 mins",
 //    tag:         "Reflection",
 //    category:    "reflection",
 //    subcategory: "",
 //    image:       "./assets/img/journals/cPanel Banner.png",
//     imageAlt:    "Concept of cPanel in visual flames",
 //    href:        "/journals/guided-healthcare-experience",
//   },

 //  {
 //    title:       "Letting The Problem Shape The Process",
 //    date:        "April 30, 2026",
 //    readTime:    "30 mins",
//    tag:         "Reflection",
 //    category:    "reflection",
 //    subcategory: "",
//     image:       "./assets/img/journals/shaping.jpg",
//     imageAlt:    "Zoom in image of a whiteboard session",
//     href:        "/journals/guided-healthcare-experience",
//   },
];
