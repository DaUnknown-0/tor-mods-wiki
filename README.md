# TOR Mods Wiki

A static, wiki-style site for five companion mods for *The Other Roles*:

- **Chance Modifier** (`chance.html`)
- **Forgotten Fixes / Useful TOR Stuff** (`useful.html`)
- **Unknown's Collection** (`unknowns.html`)
- **Home** (`index.html`) — all mods merged with highlights and links

## Features

- Bilingual **English / German** (default English; choice saved in `localStorage`).
- **Dark / light theme** toggle (dark = "lights out"; follows the system preference
  on first visit, choice saved in `localStorage`).
- **Release-page design**: a cinematic, framed hero per page with a live Among Us
  scene drawn in a `<canvas>` by `assets/hero.js` (planet horizon with the Skeld,
  dice, a station under repair, a nebula, a moonlit ridge, the Atlas landscape),
  film grain, collage strips from the Atlas map textures, a big serif title and a
  numbered table of contents. Below it a calm editorial reading column on warm
  off-white: serif body text, thin rules, numbered sections, a dash rail at the
  left edge that tracks the current section. Dark mode keeps the same layout.
  The scenes pause when off-screen or the tab is hidden, render a single frame
  under `prefers-reduced-motion`, and use a lower resolution on phones.
- **FX mode** (sparkle key top right, on by default), driven by `TORFX` in
  `assets/fx.js`: pointer parallax and extras in the hero scenes, animated grain,
  scroll reveals. Respects `prefers-reduced-motion`.
- **Atlas map viewer**: both maps as tabs (the in-game logos), click for a
  full-size pan/zoom view (mouse, wheel, touch and pinch).
- **Theme switch as circular reveal** (View Transitions API, graceful fallback).
- Each change is a **clickable accordion** — click the title to read the explanation.
- **Live search** filters every feature on a mod page (press `/` to focus it).
- Sticky **section sidebar** with scroll-spy, **expand/collapse all**, back-to-top.
- No build step, pure HTML/CSS/JS. Fonts from Google Fonts: Fraunces (display),
  Source Serif 4 (body), IBM Plex Sans and IBM Plex Mono (UI labels, code).

## Editing content

All text lives in [`assets/data.js`](assets/data.js). Each feature is one entry with
`title`, `summary`, `body`, and optional `badges`, each holding an `en` and `de` string.
UI labels are in the `UI` object at the top of the same file.

## Local preview

Open `index.html` directly, or serve the folder:

```
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this `website/` folder to a repository.
2. In **Settings → Pages**, set the source to the branch and either the repo root
   (if these files are at the root) or `/docs` — or copy the contents of `website/`
   to wherever your Pages source points.
3. The `.nojekyll` file is included so the `assets/` folder is served as-is.

The site is fully static, so any static host (Netlify, Cloudflare Pages, …) works too.
