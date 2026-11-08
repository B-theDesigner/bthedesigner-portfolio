# B the Designer — Portfolio

Source for **[bthedesigner.me](https://bthedesigner.me)**, the portfolio of Bryttany Winkfield. It covers UX/UI case studies, services, and writing.

The site is built with plain HTML, CSS, and JavaScript. There's no framework and no build step. It's hosted on GitHub Pages under a custom domain.

---

## Quick start

The site loads its shared navigation with `fetch("/nav-partial.html")`. That means you have to **serve it from the project root** over HTTP. Opening `index.html` directly (`file://`) won't work.

```bash
# any static server works — pick one
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:3000` (serve) or `http://localhost:8000` (python).

VS Code's **Live Server** extension also works if it serves from the workspace root.

### Optional: install dev tools

```bash
npm install    # installs Prettier and Storybook
npx prettier --write "**/*.{html,css,js}"
```

---

## Project structure

```
.
├── index.html              # Homepage
├── nav-partial.html        # Shared sidebar + mobile nav (injected into every page)
├── about/                  # About page
├── work/                   # Case studies
│   ├── index.html          #   Filterable project gallery
│   ├── projectdetails/     #   Case study template
│   └── <project>/          #   One folder per case study (BGDE, airbnb, datacard, …)
├── services/               # Services overview + detail pages
│   ├── accessibility/
│   ├── design_systems/
│   ├── ui_ux_design/
│   └── web_management/
├── playground/             # Playground gallery (in progress — replacing Journal)
├── journal/                # Journal entries (archived feature, still linked in nav)
├── archives/pages/         # Old page versions kept for reference (not linked)
├── assets/
│   ├── css/                # Stylesheets (see below)
│   ├── js/                 # Scripts + data files (see below)
│   ├── img/                # Images, logos, project + playground media
│   └── resume/             # Downloadable CV (PDF)
├── storybook/              # Storybook config, stories, and story tests (not deployed)
├── .github/workflows/      # GitHub Pages deploy workflow
├── CNAME                   # Custom domain for GitHub Pages
└── .nojekyll               # Tells GitHub Pages to skip Jekyll processing
```

## Storybook

```bash
npm install
npm run storybook        # http://localhost:6006
npm test                 # runs every story as a browser test, with accessibility checks
npm run build-storybook  # static build in storybook-static/ (git-ignored)
```

Add stories in `storybook/stories/`. The files there now are Storybook's samples.

Each page is a folder with an `index.html` inside, so URLs stay clean (`/work/airbnb`, not `/work/airbnb.html`).

---

## CSS architecture

The CSS follows **SMACSS**: five files, loaded in this order on every page, each with a single job. Nothing else holds CSS — not page-specific stylesheets, and not JavaScript.

| File | Purpose |
| --- | --- |
| `theme.css` | Design tokens only (`:root` custom properties): color scales, semantic colors, type, spacing. Uses `color-scheme` + `light-dark()` for light and dark mode. |
| `base.css` | Element defaults only (`body`, `h2`, `p`, `a`, `li`, …). No classes. |
| `layout.css` | Page structure: sidebar, mobile header, frame borders, main content area, and their breakpoint overrides. |
| `module.css` | Every component, including the galleries. Base styles and variants (`--modifier`) only. |
| `state.css` | Every state — `:hover`, `:focus`, `:active`, `:disabled`, `.is-*`, `[aria-selected]`/`[aria-expanded]`/`[open]` — plus all `@keyframes` and `@starting-style`. |

**Conventions**
- Class names follow **SUIT CSS**: `ComponentName`, `ComponentName-descendantName`, `ComponentName--modifierName`, and states as `.is-stateName`, scoped to their component (e.g. `.NavMenu-item.is-active`). The one global state is `.is-hidden { display: none }`, so don't reuse that name for a component state that should fade or animate out. Utilities use `u-` (`u-slideRight`).
- A component's state rules go in `state.css`, never inside its `module.css` block. Keep them in the same order as the component's rules in `module.css` so the cascade stays predictable.
- `@keyframes` names are camelCase (`slideRight`, `testimonialsScroll`).
- Tokens go in two layers: **foundation** (raw values like `--scale-100`, `--color-purple-800`), then **semantic** aliases (`--color-primary`, `--spacing-md`). Use the semantic tokens in components.
- Units: `rem` for font sizes, `px` for spacing and layout (1rem = 16px).

---

## JavaScript

| File | Purpose |
| --- | --- |
| `nav-loader.js` | Fetches `nav-partial.html`, swaps it in for `<div id="nav-mount">`, and highlights the active link. Exposes `window.navLoaderReady` (a Promise). |
| `script.js` | Global behavior: mobile menu, nav dropdowns, theme toggle, etc. Waits on `navLoaderReady` before touching nav elements. |
| `project-gallery.js` | Filtering (tabs + subtabs) for the `/work` gallery |
| `playground-gallery.js` / `journal-gallery.js` | Rendering + filtering for those galleries |
| `homepage-journal.js` | Renders recent entries on the homepage |
| `cert-renderer.js` | Renders Education & Certifications (desktop tabs + mobile accordion) |
| `designsys.js` | Live-preview controls for the Data Card case study |

**External libraries (loaded from a CDN, not bundled):**
- [anime.js](https://animejs.com/) v4 via `esm.sh`, for FLIP layout animation in the galleries
- [Lenis](https://lenis.darkroom.engineering/), for smooth scrolling on case study pages
- Google Fonts

---

## Updating content

Most repeating content comes from **data files**. Edit the array and every page that uses it updates.

### Add a Playground entry
Edit `assets/js/playground-data.js` and add an object to the **top** of `PLAYGROUND_ENTRIES` (newest first):

```js
{
  title: "Entry title",
  date: "April 30, 2026",
  readTime: "10 mins",
  tag: "Process",              // display label
  category: "process",         // filter slug — must match a tab's data-category
  subcategory: "",             // tier-2 filter slug, or ""
  image: "/assets/img/playground/my-image.png",
  imageAlt: "Describe the image",
  href: "/playground/my-entry",
},
```

Then create the page at `playground/my-entry/index.html`.

### Add a Journal entry
It works the same way as Playground. Use `assets/js/journal-data.js` → `JOURNAL_ENTRIES`. Copy `journal/entrytemp/` as a starting template.

### Add a certification or degree
Edit `CERT_ENTRIES` in `assets/js/cert-data.js`. Set `category` to `design`, `frontend`, `pm`, or `ai`. Set `icon` to a key from `CERT_ICONS`. Leave `href` as `""` if there's no verification link.

### Add a case study
1. Copy `work/projectdetails/` to `work/<new-project>/` and fill in the content.
2. Put images in `assets/img/projects/<new-project>/`.
3. Add a card for it in `work/index.html`. Its `data-category` / `data-subcategory` attributes must match the tab config in `project-gallery.js` (`SUBTAB_CONFIG`).

### Edit the navigation
Change `nav-partial.html` once. It's injected into every page. Each page just needs:

```html
<div id="nav-mount"></div>
...
<script src="/assets/js/nav-loader.js"></script>
<script src="/assets/js/script.js"></script>
```

### Update the résumé
Replace `assets/resume/Winkfield_Bryttany_CV.pdf`. Keep the filename, or update the link in `nav-partial.html`.

---

## Deployment

Pushing to `main` runs the **Deploy site to GitHub Pages** workflow ([.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)). It copies the site files, leaves out development-only files (`storybook/`, `package.json`, `README.md`, etc.), and publishes the result to `bthedesigner.me`. There's no build step.

New site folders are deployed automatically. If you add a new **development-only** file or folder, add it to the workflow's `--exclude` list so it stays off the live site.

GitHub's Pages source must be set to **GitHub Actions** (repo Settings → Pages → Build and deployment).

Before pushing:
- [ ] Check pages locally through a server (nav loads, links work)
- [ ] Check light and dark mode
- [ ] Check mobile width (the mobile menu replaces the sidebar)
- [ ] Give new images descriptive `alt` text

---

## Linting

`.hintrc` configures [webhint](https://webhint.io/) for accessibility and compatibility checks. The browser targets are recent evergreen versions (Safari 17.5+, Chrome 110+, Firefox 127+).

---

© Bryttany Winkfield. All rights reserved.
