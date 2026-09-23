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
- **Station-map design**: the page is laid out like an Among Us map seen from above.
  Floor plates as background, sections as rooms with a wall, entries and cards as
  consoles, buttons as physical keys that press down, cel-shaded CSS/SVG crewmates.
- **Overdrive FX mode** (sparkle key top right, on by default), driven by the
  `TORFX` engine in `assets/fx.js`: task-bar scroll meter under the top beam,
  crew wandering behind the page (click one...), light tilt on the mod rooms,
  staggered scroll reveals, accent glow on lit consoles.
  Respects `prefers-reduced-motion`.
- **Theme switch as circular reveal** (View Transitions API, graceful fallback).
- Each change is a **clickable accordion** — click the title to read the explanation.
- **Live search** filters every feature on a mod page (press `/` to focus it).
- Sticky **section sidebar** with scroll-spy, **expand/collapse all**, back-to-top.
- No build step — pure HTML/CSS/JS. Self-hosted fonts: Chakra Petch (display),
  Rubik (body), JetBrains Mono (labels/code).

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
