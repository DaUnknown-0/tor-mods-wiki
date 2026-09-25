/* ============================================================================
 * TOR Mods Wiki : app logic: i18n, rendering, search, accordion, nav
 * ==========================================================================*/
(function () {
  "use strict";

  const LANG_KEY = "tormods-lang";
  let lang = localStorage.getItem(LANG_KEY) || "en";
  if (lang !== "en" && lang !== "de") lang = "en";

  const page = document.body.dataset.page; // "home" | "chance" | "useful" | ...
  const t = (key) => (UI[lang] && UI[lang][key]) || (UI.en[key] || key);
  const L = (obj) => (obj ? (obj[lang] != null ? obj[lang] : obj.en) : "");

  // small UI strings that only the shell needs (not part of data.js)
  const SHELL = {
    en: { contents: "Contents", mods: "The mods", open_map: "Open the full map", close: "Close", zoom_in: "Zoom in", zoom_out: "Zoom out", reset: "Reset view", map_hint: "Click the map to open it full size. Drag to pan, scroll or pinch to zoom.", museum: "Vesper Museum", forest: "Forest Station", carnival: "Moonlight Carnival", sections: "Sections", site: "Site", map_entry: "Read the map entry", all_sections: "All {n} sections" },
    de: { contents: "Inhalt", mods: "Die Mods", open_map: "Ganze Karte öffnen", close: "Schließen", zoom_in: "Vergrößern", zoom_out: "Verkleinern", reset: "Ansicht zurücksetzen", map_hint: "Klick auf die Karte, um sie in voller Größe zu öffnen. Ziehen zum Verschieben, Scrollen oder Pinch zum Zoomen.", museum: "Vesper-Museum", forest: "Forststation", carnival: "Moonlight Carnival", sections: "Abschnitte", site: "Seiten", map_entry: "Zum Karten-Eintrag", all_sections: "Alle {n} Abschnitte" }
  };
  const s = (key) => (SHELL[lang] && SHELL[lang][key]) || SHELL.en[key] || key;

  /* ---------- theme (dark = "lights out" / light) ---------- */
  const THEME_KEY = "tormods-theme";
  const THEME_COLORS = { dark: "#141312", light: "#f6f3ec" };
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = THEME_COLORS[theme] || THEME_COLORS.dark;
  }
  function toggleTheme(ev) {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    const commit = () => {
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    };
    // circular reveal from the toggle button; the global reduced-motion CSS
    // kill-switch does not cover ::view-transition pseudos, so guard here
    const reduce = window.matchMedia &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) {
      const btn = ev && ev.currentTarget;
      if (btn && btn.getBoundingClientRect) {
        const r = btn.getBoundingClientRect();
        document.documentElement.style.setProperty("--vt-x", r.left + r.width / 2 + "px");
        document.documentElement.style.setProperty("--vt-y", r.top + r.height / 2 + "px");
      }
      document.startViewTransition(commit);
    } else {
      commit();
    }
  }

  const ICO_SUN = `<svg class="ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7"/></svg>`;
  const ICO_MOON = `<svg class="ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.4 14.2A8.4 8.4 0 0 1 9.8 3.6a8.4 8.4 0 1 0 10.6 10.6z"/></svg>`;
  const ICO_SPARK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.1 6.2L20 11l-5.9 1.8L12 19l-2.1-6.2L4 11l5.9-1.8z"/></svg>`;

  /* ---------- FX mode ---------- */
  const FX_KEY = "tormods-fx";
  const fxOn = () => document.documentElement.dataset.fx === "on";
  function applyFx(on) {
    document.documentElement.dataset.fx = on ? "on" : "off";
    if (window.TORFX) (on ? TORFX.start() : TORFX.stop());
    const btn = document.querySelector(".fx-toggle");
    if (btn) {
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-pressed", String(on));
    }
  }
  function toggleFx() {
    const next = !fxOn();
    localStorage.setItem(FX_KEY, next ? "on" : "off");
    applyFx(next);
  }

  /* ---------- top bar (shared) ---------- */
  function renderTopbar() {
    const el = document.getElementById("topbar");
    if (!el) return;
    const link = (p, key) =>
      `<a href="${p}" class="nav-link${page === navKey(p) ? " active" : ""}">${t(key)}</a>`;
    el.innerHTML = `
      <div class="topbar-inner">
        <a class="brand" href="index.html">
          <span class="crewmate" aria-hidden="true"></span>
          <span class="brand-text">TOR&nbsp;Mods</span>
        </a>
        <nav class="topnav">
          ${link("index.html", "nav_home")}
          ${link("chance.html", "nav_chance")}
          ${link("useful.html", "nav_useful")}
          ${link("unknowns.html", "nav_unknowns")}
          ${link("nightfall.html", "nav_nightfall")}
          ${link("atlas.html", "nav_atlas")}
        </nav>
        <div class="topbar-actions">
          <div class="lang-switch" role="group" aria-label="Language">
            <button data-lang="en" class="${lang === "en" ? "on" : ""}">EN</button>
            <button data-lang="de" class="${lang === "de" ? "on" : ""}">DE</button>
          </div>
          <button class="theme-toggle" aria-label="Lights on / lights out" title="Lights">${ICO_SUN}${ICO_MOON}</button>
          <button class="theme-toggle fx-toggle${fxOn() ? " on" : ""}" aria-label="Visual effects" aria-pressed="${fxOn()}" title="Effects">${ICO_SPARK}</button>
          <button class="menu-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
        </div>
      </div>`;
    el.querySelectorAll(".lang-switch button").forEach((b) =>
      b.addEventListener("click", () => setLang(b.dataset.lang))
    );
    const tt = el.querySelector(".theme-toggle:not(.fx-toggle)");
    if (tt) tt.addEventListener("click", toggleTheme);
    const fx = el.querySelector(".fx-toggle");
    if (fx) fx.addEventListener("click", toggleFx);
    const mt = el.querySelector(".menu-toggle");
    if (mt) mt.addEventListener("click", () => setDrawer(!document.body.classList.contains("sidebar-open")));
    wireSecretDoor(el);
    wireScrolledBar();
  }

  function setDrawer(open) {
    document.body.classList.toggle("sidebar-open", open);
    const mt = document.querySelector(".menu-toggle");
    if (mt) mt.setAttribute("aria-expanded", String(open));
  }

  // the bar is transparent over the hero and frosted once the reading area starts
  function wireScrolledBar() {
    if (window.__scrolledWired) return;
    window.__scrolledWired = true;
    const update = () => {
      const hero = document.querySelector(".hero");
      const limit = hero ? hero.offsetHeight - 72 : 40;
      document.body.classList.toggle("scrolled", window.scrollY > limit);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    window.__updateScrolled = update;
  }

  /* ---------- hidden entrance to the prerelease test board ----------
   * Five quick clicks on the crewmate next to the wordmark open test.html. The
   * crewmate sits inside the brand link, so every click has to be swallowed and
   * the normal navigation replayed by hand - otherwise the first click would
   * already leave the page and the burst could never finish. A burst that stops
   * short of five still goes home, so the logo keeps behaving like a logo. */
  const SECRET_CLICKS = 5;
  const SECRET_WINDOW = 550; // ms between clicks
  function wireSecretDoor(topbar) {
    const brand = topbar.querySelector(".brand");
    const crew = brand && brand.querySelector(".crewmate");
    if (!crew) return;
    const home = brand.getAttribute("href") || "index.html";
    let hits = 0;
    let timer = null;
    crew.style.cursor = "pointer";
    crew.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      hits++;
      clearTimeout(timer);
      if (hits >= SECRET_CLICKS) {
        hits = 0;
        location.href = "test.html";
        return;
      }
      timer = setTimeout(() => {
        hits = 0;
        if (page !== "home" || home !== "index.html") location.href = home;
      }, SECRET_WINDOW);
    });
  }
  function navKey(p) {
    return p.indexOf("chance") >= 0 ? "chance"
      : p.indexOf("useful") >= 0 ? "useful"
      : p.indexOf("unknowns") >= 0 ? "unknowns"
      : p.indexOf("nightfall") >= 0 ? "nightfall"
      : p.indexOf("atlas") >= 0 ? "atlas"
      : "home";
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    renderAll();
  }

  /* ---------- hero (shared by every page) ----------
   * Full-bleed framed scene (canvas from hero.js), kicker, serif title, lead,
   * numbered table of contents with dotted leaders, and the meta row. */
  // long pages show only the first TOC_MAX entries in the hero; the side rail keeps the full list
  const TOC_MAX = 6;
  function tocHTML(items) {
    const row = (href, n, label) =>
      `<li><a href="#${href}"><span class="toc-n">${n}</span><span class="toc-dots" aria-hidden="true"></span><span class="toc-l">${label}</span></a></li>`;
    let li = items.slice(0, TOC_MAX).map((it, i) => row(it.id, `(${i + 1})`, it.label)).join("");
    if (items.length > TOC_MAX) {
      li += row(items[TOC_MAX].id, `(+${items.length - TOC_MAX})`, s("all_sections").replace("{n}", items.length));
    }
    return `<nav class="toc" aria-label="${s("contents")}"><ol>${li}</ol></nav>`;
  }

  function stripsHTML() {
    const tiles = ["terracotta", "stars", "grass", "sand", "wood", "lab"];
    const tile = (n, i) => `<span class="tile t-${n}" style="--i:${i}"></span>`;
    return `
      <div class="hero-strips" aria-hidden="true">
        <div class="strip strip-l">${tile(tiles[0], 0)}${tile(tiles[1], 1)}${tile(tiles[2], 2)}</div>
        <div class="strip strip-r">${tile(tiles[3], 3)}${tile(tiles[4], 4)}${tile(tiles[5], 5)}</div>
      </div>`;
  }

  function heroHTML(o) {
    return `
      <header class="hero ${o.cls || ""}" data-scene="${o.scene}">
        ${stripsHTML()}
        <div class="hero-frame">
          <div class="hero-scene" aria-hidden="true"><canvas></canvas><div class="hero-grain"></div></div>
          <div class="hero-content">
            <p class="kicker">${o.kicker}</p>
            <h1 class="hero-title">${o.title}</h1>
            <p class="lead">${o.lead}</p>
            ${o.toc ? tocHTML(o.toc) : ""}
            ${o.meta ? `<div class="meta-row">${o.meta}</div>` : ""}
          </div>
        </div>
      </header>`;
  }

  /* ---------- entry / section rendering (mod pages) ---------- */
  function entryHTML(entry) {
    const badges = (entry.badges || [])
      .map((b) => `<span class="badge">${L(b)}</span>`)
      .join("");
    const haystack = (
      L(entry.title) + " " + L(entry.summary) + " " + L(entry.body)
    )
      .replace(/<[^>]+>/g, " ")
      .toLowerCase();
    return `
      <article class="entry" id="${entry.id}" data-search="${escapeAttr(haystack)}">
        <button class="entry-head" aria-expanded="false">
          <span class="entry-title">${L(entry.title)}</span>
          <span class="entry-badges">${badges}</span>
          <span class="chevron" aria-hidden="true"></span>
        </button>
        <p class="entry-summary">${L(entry.summary)}</p>
        <div class="entry-collapse"><div class="entry-body">${L(entry.body)}</div></div>
      </article>`;
  }

  function sectionHTML(section) {
    const intro = section.intro ? `<p class="section-intro">${L(section.intro)}</p>` : "";
    return `
      <section class="doc-section" id="${section.id}">
        <h2>${L(section.title)}</h2>
        ${intro}
        <div class="entries">${section.entries.map(entryHTML).join("")}</div>
      </section>`;
  }

  function renderModPage(mod) {
    const main = document.getElementById("content");
    const allClients = mod.allClients
      ? `<span class="chip">${t("all_clients")}</span>`
      : "";
    const toc = mod.sections.map((sec) => ({ id: sec.id, label: L(sec.title) }))
      .concat([{ id: "install", label: t("install_title") }, { id: "requirements", label: t("deps_title") }]);
    main.innerHTML = `
      ${heroHTML({
        scene: mod.key, cls: "mod-hero " + mod.key,
        kicker: L(mod.fullName), title: mod.name, lead: L(mod.tagline), toc,
        meta: `<span class="chip">${t("version")} ${mod.version}</span>${allClients}
               <a class="btn primary" href="${mod.download}" target="_blank" rel="noopener">${t("download")}</a>
               <a class="btn" href="${mod.repo}" target="_blank" rel="noopener">${t("repo")}</a>`
      })}

      <div class="layout">
        <aside id="sidebar"></aside>
        <div class="reading">
          <div class="intro-block">${L(mod.intro)}</div>
          ${mapViewerHTML(mod)}

          <div class="toolbar">
            <span class="search-wrap">
              <input type="search" id="search" placeholder="${escapeAttr(t("search_placeholder"))}" autocomplete="off" />
              <span class="search-key" aria-hidden="true">/</span>
            </span>
            <span class="toolbar-actions">
              <button class="btn small text" id="expandAll">${t("expand_all")}</button>
              <button class="btn small text" id="collapseAll">${t("collapse_all")}</button>
            </span>
          </div>
          <p class="no-results" id="noResults" hidden>${t("search_none")}</p>

          ${mod.sections.map(sectionHTML).join("")}

          <section class="doc-section" id="install">
            <h2>${t("install_title")}</h2>
            <div class="prose">${L(mod.install)}</div>
          </section>
          <section class="doc-section" id="requirements">
            <h2>${t("deps_title")}</h2>
            <div class="prose">${L(mod.deps)}</div>
          </section>

          <p class="disclaimer">${t("disclaimer")}</p>
        </div>
      </div>
    `;
    renderSidebar(mod);
    renderRail(toc);
    wireEntries();
    wireSearch();
    wireToolbar();
    wireScrollSpy();
    wireMapViewer();
  }

  /* ---------- Atlas map viewer ----------
   * All three maps as tabs (the in-game logos switch them), the stage
   * opens a pan/zoom lightbox. Works with mouse, wheel, touch and pinch. */
  const MAPS = [
    { key: "museum", src: "assets/img/museum_preview.webp", logo: "assets/img/btn_museum.webp", w: 1800, h: 1200, entry: "#museum" },
    { key: "forest", src: "assets/img/forest_preview.webp", logo: "assets/img/btn_wald.webp", w: 1800, h: 1200, entry: "#forest" },
    { key: "carnival", src: "assets/img/park_preview.webp", logo: "assets/img/btn_park.webp", w: 1600, h: 1420, entry: "#carnival" }
  ];
  function mapViewerHTML(mod) {
    if (mod.key !== "atlas") return "";
    const tabs = MAPS.map((m, i) =>
      `<button class="map-tab${i === 0 ? " on" : ""}" role="tab" aria-selected="${i === 0}" data-map="${m.key}">
         <img src="${m.logo}" alt="${s(m.key)}" width="220" height="55" />
       </button>`).join("");
    const stages = MAPS.map((m, i) =>
      `<figure class="map-stage${i === 0 ? " on" : ""}" data-map="${m.key}" ${i === 0 ? "" : "hidden"}>
         <button class="map-open" aria-label="${s("open_map")}">
           <img src="${m.src}" alt="${s(m.key)}" width="${m.w}" height="${m.h}" loading="${i === 0 ? "eager" : "lazy"}" decoding="async" />
         </button>
         <figcaption><span>${s(m.key)}</span><a href="${m.entry}">${s("map_entry")} &rarr;</a></figcaption>
       </figure>`).join("");
    return `
      <section class="map-viewer" aria-label="Maps">
        <div class="map-tabs" role="tablist">${tabs}</div>
        ${stages}
        <p class="map-hint">${s("map_hint")}</p>
      </section>`;
  }
  function wireMapViewer() {
    const viewer = document.querySelector(".map-viewer");
    if (!viewer) return;
    const tabs = viewer.querySelectorAll(".map-tab");
    const stages = viewer.querySelectorAll(".map-stage");
    tabs.forEach((tab) => tab.addEventListener("click", () => {
      tabs.forEach((x) => { x.classList.toggle("on", x === tab); x.setAttribute("aria-selected", String(x === tab)); });
      stages.forEach((st) => { const on = st.dataset.map === tab.dataset.map; st.classList.toggle("on", on); st.hidden = !on; });
    }));
    viewer.querySelectorAll(".map-open").forEach((btn) => btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      openLightbox(img.getAttribute("src"), img.alt, +img.getAttribute("width"), +img.getAttribute("height"));
    }));
  }
  function openLightbox(src, alt, iw, ih) {
    let box = document.querySelector(".map-lightbox");
    if (box) box.remove();
    box = document.createElement("div");
    box.className = "map-lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", alt);
    box.innerHTML = `
      <div class="lb-stage"><img src="${src}" alt="${escapeAttr(alt)}" draggable="false" /></div>
      <div class="lb-bar">
        <span class="lb-title">${alt}</span>
        <span class="lb-tools">
          <button data-act="out" aria-label="${s("zoom_out")}" title="${s("zoom_out")}">&minus;</button>
          <button data-act="reset" aria-label="${s("reset")}" title="${s("reset")}">1:1</button>
          <button data-act="in" aria-label="${s("zoom_in")}" title="${s("zoom_in")}">+</button>
          <button data-act="close" aria-label="${s("close")}" title="${s("close")}">&times;</button>
        </span>
      </div>`;
    document.body.appendChild(box);
    document.body.classList.add("lb-open");
    const stage = box.querySelector(".lb-stage");
    const img = box.querySelector("img");
    let scale = 1, minScale = 1, x = 0, y = 0;
    const pointers = new Map();
    let pinchDist = 0, pinchScale = 1, dragging = false, moved = false;

    function fit() {
      const sw = stage.clientWidth, sh = stage.clientHeight;
      minScale = Math.min(sw / iw, sh / ih) * 0.96;
      scale = minScale;
      x = (sw - iw * scale) / 2; y = (sh - ih * scale) / 2;
      apply();
    }
    function apply() {
      img.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(4)})`;
      box.classList.toggle("zoomed", scale > minScale * 1.02);
    }
    function clampPan() {
      const sw = stage.clientWidth, sh = stage.clientHeight;
      const w = iw * scale, h = ih * scale;
      if (w <= sw) x = (sw - w) / 2; else x = Math.min(0, Math.max(sw - w, x));
      if (h <= sh) y = (sh - h) / 2; else y = Math.min(0, Math.max(sh - h, y));
    }
    function zoomAt(factor, cx, cy) {
      const next = Math.min(Math.max(scale * factor, minScale), 6);
      const k = next / scale;
      x = cx - (cx - x) * k; y = cy - (cy - y) * k;
      scale = next;
      clampPan(); apply();
    }
    const close = () => {
      box.remove();
      document.body.classList.remove("lb-open");
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", fit);
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "+" || e.key === "=") zoomAt(1.25, stage.clientWidth / 2, stage.clientHeight / 2);
      else if (e.key === "-") zoomAt(0.8, stage.clientWidth / 2, stage.clientHeight / 2);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", fit);
    box.querySelectorAll(".lb-bar button").forEach((b) => b.addEventListener("click", () => {
      const cx = stage.clientWidth / 2, cy = stage.clientHeight / 2;
      if (b.dataset.act === "in") zoomAt(1.4, cx, cy);
      else if (b.dataset.act === "out") zoomAt(1 / 1.4, cx, cy);
      else if (b.dataset.act === "reset") fit();
      else close();
    }));
    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      const r = stage.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    stage.addEventListener("pointerdown", (e) => {
      stage.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dragging = true; moved = false;
      if (pointers.size === 2) {
        const p = Array.from(pointers.values());
        pinchDist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); pinchScale = scale;
      }
    });
    stage.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      const prev = pointers.get(e.pointerId);
      const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      if (pointers.size === 2) {
        const p = Array.from(pointers.values());
        const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        const r = stage.getBoundingClientRect();
        const mx = (p[0].x + p[1].x) / 2 - r.left, my = (p[0].y + p[1].y) / 2 - r.top;
        const target = Math.min(Math.max(pinchScale * (d / pinchDist), minScale), 6);
        zoomAt(target / scale, mx, my);
        x += dx / 2; y += dy / 2; clampPan(); apply();
      } else if (dragging) {
        x += dx; y += dy; clampPan(); apply();
      }
    });
    const up = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) dragging = false;
    };
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    // double click / tap toggles between fit and 2.5x at that point
    stage.addEventListener("dblclick", (e) => {
      const r = stage.getBoundingClientRect();
      if (scale > minScale * 1.02) fit(); else zoomAt(2.5, e.clientX - r.left, e.clientY - r.top);
    });
    stage.addEventListener("click", (e) => {
      if (!moved && e.target === stage) close();
    });
    if (img.complete) fit(); else img.addEventListener("load", fit, { once: true });
    fit();
  }

  /* ---------- sidebar: section list on wide screens, drawer on phones ---------- */
  function renderSidebar(mod) {
    const side = document.getElementById("sidebar");
    if (!side) return;
    const sections = mod ? mod.sections
      .map((sec, i) => `<li><a href="#${sec.id}"><span class="side-n">${String(i + 1).padStart(2, "0")}</span>${L(sec.title)}</a></li>`)
      .join("") : "";
    const extra = mod ? `
          <li><a href="#install"><span class="side-n">${String(mod.sections.length + 1).padStart(2, "0")}</span>${t("install_title")}</a></li>
          <li><a href="#requirements"><span class="side-n">${String(mod.sections.length + 2).padStart(2, "0")}</span>${t("deps_title")}</a></li>` : "";
    const site = [["index.html", "nav_home"], ["chance.html", "nav_chance"], ["useful.html", "nav_useful"], ["unknowns.html", "nav_unknowns"], ["nightfall.html", "nav_nightfall"], ["atlas.html", "nav_atlas"]]
      .map(([p, k]) => `<li><a href="${p}" class="${page === navKey(p) ? "active" : ""}">${t(k)}</a></li>`).join("");
    side.innerHTML = `
      <div class="sidebar-inner">
        ${mod ? `
        <p class="side-title">${t("on_this_page")}</p>
        <ul class="side-nav">${sections}${extra}</ul>` : ""}
        <p class="side-title side-site-title">${s("site")}</p>
        <ul class="side-nav side-site">${site}</ul>
      </div>`;
    side.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  }

  /* ---------- section rail: the dash indicator at the left edge ---------- */
  function renderRail(items) {
    let rail = document.querySelector(".rail");
    if (!rail) {
      rail = document.createElement("nav");
      rail.className = "rail";
      rail.setAttribute("aria-label", s("sections"));
      document.body.appendChild(rail);
    }
    rail.innerHTML = items.map((it) => `<a href="#${it.id}" data-label="${escapeAttr(it.label)}"><span></span></a>`).join("");
  }

  /* ---------- home page ---------- */
  function renderHome() {
    const main = document.getElementById("content");

    const row = (mod, i) => `
      <a class="mod-row ${mod.key}" href="${mod.key}.html">
        <span class="mod-mark" aria-hidden="true"><span class="crewmate c-${mod.key}"></span></span>
        <span class="mod-row-body">
          <span class="mod-row-top"><h3>${mod.name}</h3><span class="ver">v${mod.version}</span></span>
          <p>${L(mod.tagline)}</p>
        </span>
        <span class="mod-row-cta">${t("open_mod")}<span class="arrow" aria-hidden="true">&rarr;</span></span>
      </a>`;

    // a few hand-picked highlights pulled from all mods
    const highlights = [
      { mod: "chance", de: "Zufällige Stats: Speed, Cooldown, Sicht, Aufgaben, Stimmen", en: "Randomized stats: speed, cooldown, vision, tasks, votes" },
      { mod: "chance", de: "Chaos Mode: Rollen-Reroll nach jedem Meeting", en: "Chaos Mode: role reroll after every meeting" },
      { mod: "useful", de: "Sheriff verhindert Killer-Parity-Win (host-autoritativ)", en: "Sheriff prevents killer parity win (host-authoritative)" },
      { mod: "useful", de: "Dynamische Meeting-Dauer nach Spielerzahl", en: "Dynamic meeting duration by player count" },
      { mod: "useful", de: "Bloody Lag-Drosselung & Killer-Map-Fix", en: "Bloody lag throttle & killer-map fix" },
      { mod: "useful", de: "In-Game Mod Manager mit Update-All", en: "In-game Mod Manager with Update-All" },
      { mod: "unknowns", de: "The Tesla: lade ein +/−-Paar, das bei Nähe stirbt", en: "The Tesla: charge a +/− pair that dies when too close" },
      { mod: "unknowns", de: "The Saboteur: Task-Sabotage & unsichtbare Fallen", en: "The Saboteur: task sabotage & invisible traps" },
      { mod: "unknowns", de: "The Silencer: markiert Opfer zum Stummschalten im Meeting", en: "The Silencer: marks victims to be muted in meetings" },
      { mod: "unknowns", de: "The Siphoner: zieht passiv Kill-Cooldown von Impostoren", en: "The Siphoner: passively drains Impostor kill cooldown" },
      { mod: "unknowns", de: "The Witness: alleiniger Zeuge, öffentliche/anonyme Enthüllung", en: "The Witness: sole witness, public/anonymous reveal" },
      { mod: "unknowns", de: "The Werewolf: Alpha-Ladung im Dunkeln, Wolfsform, Silber-Regeln", en: "The Werewolf: alpha charge in the dark, wolf form, silver rules" },
      { mod: "unknowns", de: "The Auditor: nimmt erledigte Crew-Tasks server-echt zurück", en: "The Auditor: reverts completed crew tasks for real" },
      { mod: "unknowns", de: "The Illusionist: Pfad-Clone mit Kill-Block", en: "The Illusionist: path clone with kill block" },
      { mod: "unknowns", de: "Eigene Kill-Cutscenes für UC- und TOR-Spezialkills", en: "Custom kill cutscenes for UC and TOR special kills" },
      { mod: "unknowns", de: "Eigene Rollen ohne Änderung an TORs Quellcode", en: "Custom roles without touching TOR's source" },
      { mod: "useful", de: "Lover Revenger: Überlebender wird zum Rächer", en: "Lover Revenger: survivor becomes the avenger" },
      { mod: "useful", de: "Newcomer-Kill-Schild: freie erste Runde für Session-Neulinge", en: "Newcomer kill shield: a free first round for session newcomers" },
      { mod: "useful", de: "Mod-Abgleich: fehlende Mods des Hosts per Klick nachladen", en: "Mod sync: fetch the host's missing mods with one click" },
      { mod: "useful", de: "25 Sprachen für TOR und die ganze Mod-Familie", en: "25 languages for TOR and the whole mod family" },
      { mod: "nightfall", de: "Ich-Perspektive, sobald sich der Werwolf verwandelt", en: "First person the moment the werewolf transforms" },
      { mod: "atlas", de: "Zwei neue Karten: Vesper-Museum und Forststation", en: "Two new maps: Vesper Museum and Forest Station" },
    ];
    const hl = highlights
      .map(
        (h) =>
          `<li class="hl ${h.mod}"><span class="hl-tag">${MODS[h.mod].name}</span><span>${h[lang] || h.en}</span></li>`
      )
      .join("");

    const toc = [{ id: "mods", label: t("home_explore") }, { id: "highlights", label: t("home_combined") }];
    main.innerHTML = `
      ${heroHTML({
        scene: "home", cls: "home-hero",
        kicker: t("home_hero_kicker"), title: t("home_hero_title"), lead: t("home_hero_sub"), toc
      })}
      <div class="layout">
        <aside id="sidebar"></aside>
        <div class="reading">
          <section class="doc-section" id="mods">
            <h2>${t("home_explore")}</h2>
            <div class="mod-list">
              ${row(CHANCE)}${row(USEFUL)}${row(UNKNOWNS)}${row(NIGHTFALL)}${row(ATLAS)}
            </div>
          </section>

          <section class="doc-section" id="highlights">
            <h2>${t("home_combined")}</h2>
            <ul class="highlights">${hl}</ul>
          </section>

          <p class="disclaimer">${t("disclaimer")}</p>
        </div>
      </div>
    `;
    renderSidebar(null);
    renderRail(toc);
    wireScrollSpy();
  }

  /* ---------- interactivity ---------- */
  function wireEntries() {
    document.querySelectorAll(".entry-head").forEach((head) => {
      head.addEventListener("click", () => {
        const open = head.getAttribute("aria-expanded") === "true";
        head.setAttribute("aria-expanded", String(!open));
        head.closest(".entry").classList.toggle("open", !open);
      });
    });
    // open entry if linked via hash
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target && target.classList.contains("entry")) openEntry(target);
    }
    // in-page links to an entry (map captions) open it as well
    document.querySelectorAll('#content a[href^="#"]').forEach((a) => {
      a.addEventListener("click", () => {
        const target = document.querySelector(a.getAttribute("href"));
        if (target && target.classList.contains("entry")) openEntry(target);
      });
    });
  }
  function openEntry(entry) {
    entry.classList.add("open");
    const head = entry.querySelector(".entry-head");
    if (head) head.setAttribute("aria-expanded", "true");
  }

  function wireToolbar() {
    const ex = document.getElementById("expandAll");
    const co = document.getElementById("collapseAll");
    if (ex) ex.addEventListener("click", () =>
      document.querySelectorAll(".entry").forEach(openEntry));
    if (co) co.addEventListener("click", () =>
      document.querySelectorAll(".entry").forEach((e) => {
        e.classList.remove("open");
        e.querySelector(".entry-head").setAttribute("aria-expanded", "false");
      }));
  }

  function wireSearch() {
    const input = document.getElementById("search");
    if (!input) return;
    // "/" focuses the search box (unless already typing somewhere)
    if (!window.__searchKeyWired) {
      window.__searchKeyWired = true;
      document.addEventListener("keydown", (e) => {
        if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        const s = document.getElementById("search");
        if (s) { e.preventDefault(); s.focus(); }
      });
    }
    const noRes = document.getElementById("noResults");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      let anyVisible = false;
      document.querySelectorAll(".doc-section").forEach((sec) => {
        const entries = sec.querySelectorAll(".entry");
        if (!entries.length) return; // skip install/requirements sections
        let secVisible = false;
        entries.forEach((e) => {
          const match = !q || (e.dataset.search || "").indexOf(q) >= 0;
          e.hidden = !match;
          if (match) {
            secVisible = true;
            anyVisible = true;
            if (q) openEntry(e);
          }
        });
        sec.hidden = !secVisible;
      });
      if (noRes) noRes.hidden = anyVisible || !q;
    });
  }

  function wireScrollSpy() {
    const links = Array.from(document.querySelectorAll(".side-nav a[href^='#'], .rail a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (!sec) return;
      if (!map.has(sec)) map.set(sec, []);
      map.get(sec).push(a);
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          const as = map.get(en.target);
          if (as && en.isIntersecting) {
            links.forEach((l) => l.classList.remove("active"));
            as.forEach((a) => a.classList.add("active"));
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    map.forEach((_, sec) => obs.observe(sec));
  }

  /* ---------- back to top ---------- */
  function wireBackTop() {
    const btn = document.getElementById("backTop");
    if (!btn) return;
    btn.title = t("back_top");
    if (!window.__backTopWired) {
      window.__backTopWired = true;
      window.addEventListener("scroll", () => {
        btn.classList.toggle("show", window.scrollY > 900);
      }, { passive: true });
      btn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  }

  /* ---------- footer ---------- */
  function renderFooter() {
    const f = document.getElementById("footer");
    if (f) f.innerHTML = `<p><span class="crewmate" aria-hidden="true"></span>${t("footer_note")}</p>`;
  }

  /* ---------- "Unknown's Collection" click-decode effect ----------
   * Text-only animation that fits the name: on click, the letters flicker as random
   * glyphs and resolve left-to-right back into "Unknown's Collection". Plays on any
   * link to the unknowns page (nav, mod row) before following it, replays on the
   * page's own hero title, and auto-plays once when the page is opened. */
  const UC_NAME_RE = /Unknown[’']s Collection/;
  const UC_GLYPHS = "#%&?$@*<>!/=+";

  function ucScramble(el, done, duration) {
    duration = duration || 700;
    if (!el || el.dataset.ucScrambling === "1") { if (done) done(); return; }
    const original = el.textContent;
    const m = original.match(UC_NAME_RE);
    if (!m) { if (done) done(); return; }
    el.dataset.ucScrambling = "1";
    el.classList.add("uc-scrambling");
    const from = m.index, to = m.index + m[0].length;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      let out = original.slice(0, from);
      for (let i = from; i < to; i++) {
        const ch = original[i];
        const reveal = (i - from) / (to - from); // left-to-right decode
        if (ch === " " || ch === "'" || ch === "’" || p >= reveal * 0.85 + 0.15)
          out += ch;
        else out += UC_GLYPHS[(Math.random() * UC_GLYPHS.length) | 0];
      }
      el.textContent = out + original.slice(to);
      if (p < 1) requestAnimationFrame(step);
      else {
        el.textContent = original;
        el.classList.remove("uc-scrambling");
        delete el.dataset.ucScrambling;
        if (done) done();
      }
    };
    requestAnimationFrame(step);
  }

  // Finds the deepest element inside root whose own text carries the mod name.
  function ucFindNameEl(root) {
    if (!root) return null;
    if (root.children.length === 0)
      return UC_NAME_RE.test(root.textContent) ? root : null;
    for (const n of root.querySelectorAll("*"))
      if (n.children.length === 0 && UC_NAME_RE.test(n.textContent)) return n;
    return null;
  }

  function wireUcScramble() {
    if (!window.__ucScrambleWired) {
      window.__ucScrambleWired = true; // renderAll re-runs on language switch - wire once
      document.addEventListener("click", (e) => {
        const a = e.target.closest('a[href$="unknowns.html"]');
        if (!a) return;
        const nameEl = ucFindNameEl(a);
        if (!nameEl) return;
        e.preventDefault();
        if (page === "unknowns") { ucScramble(nameEl); return; }
        ucScramble(nameEl, () => { location.href = a.href; });
      });
    }
    if (page === "unknowns") {
      // target the big title specifically - the hero kicker also contains the name
      const h1 = ucFindNameEl(document.querySelector(".hero h1")) ||
                 ucFindNameEl(document.querySelector(".hero"));
      if (h1) {
        ucScramble(h1, null, 900);
        h1.style.cursor = "pointer";
        h1.addEventListener("click", () => ucScramble(h1, null, 900));
      }
    }
  }

  /* ---------- test board: give prerelease.js's markup the shared shell ----------
   * prerelease.js renders a plain header plus the checklist; this wraps the header
   * into the framed hero (so hero.js can mount its scene) and the rest into the
   * reading column, without touching the board's own logic. */
  function dressTestPage() {
    const main = document.getElementById("content");
    const hero = main && main.querySelector(".test-hero");
    if (!hero || hero.classList.contains("hero")) return;
    hero.classList.add("hero");
    hero.dataset.scene = "test";
    const content = document.createElement("div");
    content.className = "hero-content";
    while (hero.firstChild) content.appendChild(hero.firstChild);
    const h1 = content.querySelector("h1");
    if (h1) h1.classList.add("hero-title");
    hero.insertAdjacentHTML("afterbegin", stripsHTML() + '<div class="hero-frame"><div class="hero-scene" aria-hidden="true"><canvas></canvas><div class="hero-grain"></div></div></div>');
    hero.querySelector(".hero-frame").appendChild(content);
    const layout = document.createElement("div");
    layout.className = "layout";
    layout.innerHTML = '<aside id="sidebar"></aside><div class="reading"></div>';
    const reading = layout.querySelector(".reading");
    while (hero.nextSibling) reading.appendChild(hero.nextSibling);
    main.appendChild(layout);
    renderSidebar(null);
    renderRail([]);
  }

  /* ---------- helpers ---------- */
  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }

  /* ---------- boot ---------- */
  function renderAll() {
    document.documentElement.lang = lang;
    applyTheme(document.documentElement.dataset.theme || "dark");
    renderTopbar();
    renderFooter();
    if (page === "home") renderHome();
    else if (page === "chance") renderModPage(CHANCE);
    else if (page === "useful") renderModPage(USEFUL);
    else if (page === "unknowns") renderModPage(UNKNOWNS);
    else if (page === "nightfall") renderModPage(NIGHTFALL);
    else if (page === "atlas") renderModPage(ATLAS);
    else if (page === "test" && window.TORTEST) { TORTEST.render(); dressTestPage(); } // hidden board, see wireSecretDoor
    wireBackTop();
    wireUcScramble();
    if (window.TORHERO) TORHERO.mount();
    applyFx(localStorage.getItem(FX_KEY) !== "off"); // effects are on by default
    if (window.TORFX) TORFX.refresh(); // re-observe the freshly rendered DOM
    if (window.__updateScrolled) window.__updateScrolled();
    // keep scroll position stable on language switch
  }

  document.addEventListener("DOMContentLoaded", renderAll);
})();
