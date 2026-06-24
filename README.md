# TOR Mods Wiki

A static, wiki-style site for two companion mods for *The Other Roles*:

- **Chance Modifier** (`chance.html`)
- **Useful TOR Stuff** (`useful.html`)
- **Home** (`index.html`) — both mods merged with highlights and links

## Features

- Bilingual **English / German** (default English; choice saved in `localStorage`).
- Each change is a **clickable accordion** — click the title to read the explanation.
- **Live search** filters every feature on a mod page.
- Sticky **section sidebar** with scroll-spy, **expand/collapse all**, back-to-top.
- No build step — pure HTML/CSS/JS.

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
