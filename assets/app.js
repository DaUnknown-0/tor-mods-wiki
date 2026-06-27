/* ============================================================================
 * TOR Mods Wiki — app logic: i18n, rendering, search, accordion, nav
 * ==========================================================================*/
(function () {
  "use strict";

  const LANG_KEY = "tormods-lang";
  let lang = localStorage.getItem(LANG_KEY) || "en";
  if (lang !== "en" && lang !== "de") lang = "en";

  const page = document.body.dataset.page; // "home" | "chance" | "useful"
  const t = (key) => (UI[lang] && UI[lang][key]) || (UI.en[key] || key);
  const L = (obj) => (obj ? (obj[lang] != null ? obj[lang] : obj.en) : "");

  /* ---------- top bar (shared) ---------- */
  function renderTopbar() {
    const el = document.getElementById("topbar");
    if (!el) return;
    const link = (p, key) =>
      `<a href="${p}" class="nav-link${page === navKey(p) ? " active" : ""}">${t(key)}</a>`;
    el.innerHTML = `
      <div class="topbar-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark">⬢</span>
          <span class="brand-text">TOR&nbsp;Mods</span>
        </a>
        <nav class="topnav">
          ${link("index.html", "nav_home")}
          ${link("chance.html", "nav_chance")}
          ${link("useful.html", "nav_useful")}
          ${link("unknowns.html", "nav_unknowns")}
        </nav>
        <div class="lang-switch" role="group" aria-label="Language">
          <button data-lang="en" class="${lang === "en" ? "on" : ""}">EN</button>
          <button data-lang="de" class="${lang === "de" ? "on" : ""}">DE</button>
        </div>
        <button class="menu-toggle" aria-label="Menu">☰</button>
      </div>`;
    el.querySelectorAll(".lang-switch button").forEach((b) =>
      b.addEventListener("click", () => setLang(b.dataset.lang))
    );
    const mt = el.querySelector(".menu-toggle");
    if (mt) mt.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
  }
  function navKey(p) {
    return p.indexOf("chance") >= 0 ? "chance"
      : p.indexOf("useful") >= 0 ? "useful"
      : p.indexOf("unknowns") >= 0 ? "unknowns"
      : "home";
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    renderAll();
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
          <span class="chevron" aria-hidden="true">›</span>
        </button>
        <p class="entry-summary">${L(entry.summary)}</p>
        <div class="entry-body">${L(entry.body)}</div>
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
    main.innerHTML = `
      <header class="mod-hero ${mod.key}">
        <div class="mod-hero-inner">
          <p class="kicker">${L(mod.fullName)}</p>
          <h1>${mod.name}</h1>
          <p class="lead">${L(mod.tagline)}</p>
          <div class="meta-row">
            <span class="chip">${t("version")} ${mod.version}</span>
            ${allClients}
            <a class="btn primary" href="${mod.download}" target="_blank" rel="noopener">${t("download")}</a>
            <a class="btn ghost" href="${mod.repo}" target="_blank" rel="noopener">${t("repo")}</a>
          </div>
        </div>
      </header>

      <div class="intro-block">${L(mod.intro)}</div>

      <div class="toolbar">
        <input type="search" id="search" placeholder="${escapeAttr(t("search_placeholder"))}" autocomplete="off" />
        <button class="btn small" id="expandAll">${t("expand_all")}</button>
        <button class="btn small" id="collapseAll">${t("collapse_all")}</button>
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
    `;
    renderSidebar(mod);
    wireEntries();
    wireSearch();
    wireToolbar();
    wireScrollSpy();
  }

  function renderSidebar(mod) {
    const side = document.getElementById("sidebar");
    if (!side) return;
    const items = mod.sections
      .map((s) => `<li><a href="#${s.id}">${L(s.title)}</a></li>`)
      .join("");
    side.innerHTML = `
      <div class="sidebar-inner">
        <p class="side-title">${t("on_this_page")}</p>
        <p class="side-intro">${t("toc_intro")}</p>
        <ul class="side-nav">
          ${items}
          <li><a href="#install">${t("install_title")}</a></li>
          <li><a href="#requirements">${t("deps_title")}</a></li>
        </ul>
      </div>`;
  }

  /* ---------- home page ---------- */
  function renderHome() {
    const main = document.getElementById("content");
    const side = document.getElementById("sidebar");
    if (side) side.innerHTML = "";

    const card = (mod) => `
      <a class="mod-card ${mod.key}" href="${mod.key}.html">
        <div class="mod-card-top">
          <h3>${mod.name}</h3>
          <span class="chip">v${mod.version}</span>
        </div>
        <p>${L(mod.tagline)}</p>
        <span class="mod-card-cta">${t("open_mod")} →</span>
      </a>`;

    // a few hand-picked highlights pulled from both mods
    const highlights = [
      { mod: "chance", de: "Zufällige Stats: Speed, Cooldown, Sicht, Aufgaben, Stimmen", en: "Randomized stats: speed, cooldown, vision, tasks, votes" },
      { mod: "chance", de: "Chaos Mode — Rollen-Reroll nach jedem Meeting", en: "Chaos Mode — role reroll after every meeting" },
      { mod: "useful", de: "Sheriff verhindert Killer-Parity-Win (host-autoritativ)", en: "Sheriff prevents killer parity win (host-authoritative)" },
      { mod: "useful", de: "Dynamische Meeting-Dauer nach Spielerzahl", en: "Dynamic meeting duration by player count" },
      { mod: "useful", de: "Bloody Lag-Drosselung & Killer-Map-Fix", en: "Bloody lag throttle & killer-map fix" },
      { mod: "useful", de: "In-Game Mod Manager mit Update-All", en: "In-game Mod Manager with Update-All" },
      { mod: "unknowns", de: "The Tesla — lade ein +/−-Paar, das bei Nähe stirbt", en: "The Tesla — charge a +/− pair that dies when too close" },
      { mod: "unknowns", de: "Eigene Rollen ohne Änderung an TORs Quellcode", en: "Custom roles without touching TOR's source" },
    ];
    const hl = highlights
      .map(
        (h) =>
          `<li class="hl ${h.mod}"><span class="hl-tag">${MODS[h.mod].name}</span>${h[lang] || h.en}</li>`
      )
      .join("");

    main.innerHTML = `
      <header class="home-hero">
        <p class="kicker">${t("home_hero_kicker")}</p>
        <h1>${t("home_hero_title")}</h1>
        <p class="lead">${t("home_hero_sub")}</p>
      </header>

      <h2 class="center">${t("home_explore")}</h2>
      <div class="mod-cards">
        ${card(CHANCE)}
        ${card(USEFUL)}
        ${card(UNKNOWNS)}
      </div>

      <h2 class="center">${t("home_combined")}</h2>
      <ul class="highlights">${hl}</ul>

      <p class="disclaimer">${t("disclaimer")}</p>
    `;
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
    const links = Array.from(document.querySelectorAll(".side-nav a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          const a = map.get(en.target);
          if (a && en.isIntersecting) {
            links.forEach((l) => l.classList.remove("active"));
            a.classList.add("active");
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
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 600);
    });
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- footer ---------- */
  function renderFooter() {
    const f = document.getElementById("footer");
    if (f) f.innerHTML = `<p>${t("footer_note")}</p>`;
  }

  /* ---------- helpers ---------- */
  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }

  /* ---------- boot ---------- */
  function renderAll() {
    document.documentElement.lang = lang;
    renderTopbar();
    renderFooter();
    if (page === "home") renderHome();
    else if (page === "chance") renderModPage(CHANCE);
    else if (page === "useful") renderModPage(USEFUL);
    else if (page === "unknowns") renderModPage(UNKNOWNS);
    wireBackTop();
    // keep scroll position stable on language switch
  }

  document.addEventListener("DOMContentLoaded", renderAll);
})();
