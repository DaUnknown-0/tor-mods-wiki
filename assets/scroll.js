/* ============================================================================
 * TOR Mods Wiki: TORSCROLL, the scroll choreography
 * - Hero exit: sets --hp (0 at the top, 1 once the hero is gone) on .hero; the
 *   CSS shrinks the frame into a card and slides the collage strips outwards.
 * - Headings and mod rows get --sp (0 below the fold, 1 once well in view) for
 *   the heading rise and the accent rule; the body gets --rp (read progress).
 * - The accent the 3D background (bg3d.js) should glow in: the page accent, on
 *   the home page the accent of the mod row nearest the middle of the screen.
 * Motion needs FX on and no prefers-reduced-motion; otherwise the vars stay
 * unset and the CSS falls back to the resting state.
 * ==========================================================================*/
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const moving = () => root.dataset.fx !== "off" && !mqReduce.matches;

  function parseColor(str) {
    const s = (str || "").trim();
    let m = s.match(/^#([0-9a-f]{6})$/i);
    if (m) {
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    m = s.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
    return m ? [+m[1], +m[2], +m[3]] : null;
  }
  const accentOf = (el) => parseColor(getComputedStyle(el).getPropertyValue("--accent"));

  let accent = null;

  function vars() {
    const on = moving();
    const hero = doc.querySelector(".hero");
    if (hero) {
      const h = hero.offsetHeight || 1;
      hero.style.setProperty("--hp", on ? clamp(scrollY / h, 0, 1).toFixed(4) : "0");
    }
    const max = root.scrollHeight - innerHeight;
    doc.body.style.setProperty("--rp", max > 0 ? clamp(scrollY / max, 0, 1).toFixed(4) : "0");
    // headings / rows: 0 at the bottom edge, 1 once 30 % into the viewport
    for (const el of doc.querySelectorAll(".doc-section > h2, .mod-row")) {
      if (!on) { el.style.removeProperty("--sp"); continue; }
      const top = el.getBoundingClientRect().top;
      el.style.setProperty("--sp", clamp((innerHeight - top) / (innerHeight * 0.3), 0, 1).toFixed(3));
    }
    // home page: follow the mod row nearest the middle
    let src = doc.body;
    if (doc.body.dataset.page === "home") {
      let bd = Infinity;
      for (const row of doc.querySelectorAll(".mod-row")) {
        const r = row.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const d = Math.abs((r.top + r.bottom) / 2 - innerHeight / 2);
        if (d < bd) { bd = d; src = row; }
      }
    }
    accent = accentOf(src);
  }

  let raf = 0;
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; vars(); });
  }

  function start() {
    vars();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    new MutationObserver(schedule).observe(root, { attributes: true, attributeFilter: ["data-theme", "data-fx"] });
    const content = doc.getElementById("content");
    if (content) new MutationObserver(schedule).observe(content, { childList: true });
    mqReduce.addEventListener("change", schedule);
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();

  window.TORSCROLL = { refresh: schedule, accent: () => accent };
})();
