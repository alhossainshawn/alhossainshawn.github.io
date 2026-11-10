# Al Hossain Shawn: Portfolio

Personal research portfolio, live at **<https://alhossainshawn.github.io/>**.

A static site (plain HTML, CSS and a little JavaScript) with no build step. It uses a clean academic layout: a profile sidebar beside the main content, Lora headings, Inter body text, a slate-blue accent, and a light/dark theme toggle.

```
├── index.html                  landing page (all main sections)
├── styles.css                  shared styles for every page
├── interactive.js              mobile nav, scroll-spy, reveal, smooth scroll, theme toggle
├── icons.svg                   SVG icon sprite (<use href="#i-...">)
├── assets/
│   ├── portrait.jpg            sidebar portrait (also the link-preview image)
│   ├── favicon.svg             browser-tab icon
│   ├── tools/                  logos for "Tools in Rotation"
│   └── projects/<project>/     images and demo videos per project
├── domains/                    one page per research domain
│   ├── dom-fpga.html           DOM-01 FPGA & Reconfigurable Computing
│   ├── dom-device-physics.html DOM-02 Semiconductor Device Physics
│   ├── dom-vlsi.html           DOM-03 VLSI & IC Design
│   └── dom-embedded.html       DOM-04 Embedded Systems & Robotics
└── projects/                   one page per project
    ├── hybrid-neural-accelerator.html  R-01
    ├── mbcfet.html                     R-02
    ├── cnn-digit-detector.html         P-04
    ├── fpga-adder.html                 P-05
    ├── sobel-video-coprocessor.html    P-06
    ├── aerial-survey.html              P-01
    ├── cubesat.html                    P-02
    └── birds-x.html                    P-03
```

## Editing the content

Everything is plain HTML: edit the text and refresh the browser.

| What | Where |
|---|---|
| Name, role, contact links, expertise tags | `index.html` → `<aside class="sidebar">` |
| Hero headline and tagline | `index.html` → `<section class="hero">` |
| Bio and education | `index.html` → `#about` (`.about__bio`, `.edu-timeline`) |
| Current and past roles | `index.html` → `#roles` (`.current-role-card`, `.timeline`) |
| The 4 research domain cards | `index.html` → `#expertise` (`.interests-grid`) |
| Active research (2 cards) | `index.html` → `#research` (`.research-grid`) |
| Project cards | `index.html` → `#projects` (`.proj-grid`) |
| Publications | `index.html` → `#publications` (`.pub-list`) |
| Tools | `index.html` → `#stack` (`.tools-section__grid`) |
| Awards, licences, training | `index.html` → `#awards`, `#licences`, `#training` (`.simple-list`) |
| Contact block | `index.html` → `#contact` (`.contact-grid`) |

### Adding a project

1. Copy an existing file in `projects/` and edit it. Put its images in `assets/projects/<name>/`.
2. Add a matching `.proj-card` to `#projects` in `index.html`, and to the relevant domain page if it belongs to one.
3. Update the `.page-pager` (Previous / Next) links on the new page and its neighbours. The chain follows the order of the cards on the homepage.

Publication status badges use `.pub-status--accepted` or `.pub-status--published`.

## Theming

The palette is defined as CSS variables at the top of `styles.css`. Dark mode overrides them under `body.dark-mode`.

```css
:root {
  --bg:           #f5f5f7;   /* page background */
  --bg-white:     #ffffff;   /* cards, sidebar */
  --bg-hero:      #1a2744;   /* hero splash */
  --text:         #3d4144;
  --text-heading: #1a1a2e;
  --accent:       #4a5d8c;   /* slate blue */
  ...
}
```

The theme toggle saves the choice in `localStorage`. A short inline script at the top of each page's `<body>` applies it before first paint. Keep that script on any new page.

## Local preview

Serve the folder over HTTP. The icon sprite is loaded with `fetch()`, so icons don't render when a page is opened straight from disk.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Publishing

The repo is `alhossainshawn.github.io`, served by GitHub Pages from `main` (root). Pushing to `main` publishes the site.

After changing `styles.css`, bump the `?v=` query on its `<link>` tags so browsers fetch the new version.

---

© 2026 Al Hossain Shawn
