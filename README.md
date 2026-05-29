# Al Hossain Shawn — Portfolio

A static portfolio website. Built as a "dark schematic" — drawing-frame
chrome, monospace technical labels, serif headlines, deep blue-black
background with a warm terracotta accent.

```
├── index.html                       — landing page
├── styles.css                       — shared styles for every page
├── assets/
│   └── portrait.jpg                 — hero portrait
└── projects/
    ├── hybrid-neural-accelerator.html
    ├── mbcfet.html
    ├── cubesat.html
    ├── aerial-survey.html
    └── birds-x.html
```

## Publishing to GitHub Pages

This site is pure static HTML/CSS — no build step, no server runtime.
Deploying is three steps.

### 1. Create the repository

If you want the site to live at `https://<your-username>.github.io/`,
name the repo exactly `<your-username>.github.io`. For any other URL
(`https://<your-username>.github.io/<repo-name>/`), use any name.

### 2. Push the files

From the project folder:

```bash
git init
git branch -M main
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### 3. Turn on GitHub Pages

1. Open the repo on github.com → **Settings** → **Pages**
2. Under **Source**, pick **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. **Save**

Wait ~30 seconds. Your site is live at the URL GitHub shows on that page.

## Editing the content

Everything is plain HTML — open `index.html` or any file under
`projects/` and edit the text directly. There's no build step or
preview command needed; just refresh the browser.

Common things to change:

| What | Where |
|---|---|
| Hero name / tagline | `index.html` → `<section class="hero">` |
| Status (e.g. "Open to collabs") | `index.html` → `.metabar` block |
| Research interests (the 4 cards) | `index.html` → `<div class="interests">` |
| Active research (2 large cards) | `index.html` → `<div class="research-grid">` |
| Project rows | `index.html` → `<div class="projects">` |
| Publications | `index.html` → `<div class="pubs">` |
| Experience / timeline | `index.html` → `<div class="exp">` |
| Skills (5 columns) | `index.html` → `<div class="skills">` |
| Achievements / education | `index.html` → `<div class="twocol">` |
| Contact info | `index.html` → `<footer class="foot">` |
| Portrait photo | replace `assets/portrait.jpg` |

To add a new project page, copy any file in `projects/` to a new name
inside the same folder, edit the content, then add a matching row in
`index.html`'s `.projects` block linking to the new file.

## Theming

The whole palette lives at the top of `styles.css` as CSS variables.
Change `--bg`, `--accent`, etc. once and the whole site picks it up.

```css
:root {
  --bg: #0b0d11;          /* page background */
  --paper: #13161c;       /* card background */
  --ink: #eef0f2;         /* body text */
  --accent: #d97757;      /* warm terracotta */
  --accent-2: #5eb8a3;    /* "online / ok" green */
  ...
}
```

## Local preview

You don't need any tooling, but for a clean preview that mimics
GitHub Pages routing, run a one-liner from the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

---

© 2026 Al Hossain Shawn
