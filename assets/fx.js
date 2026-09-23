/* ============================================================================
 * TOR Mods Wiki: TORFX, the optional effects layer
 * The editorial design keeps the effects quiet: with FX on, the hero scene
 * reacts to the pointer and gets its animated film grain and extras (see
 * hero.js), entries and rows fade in on scroll, and the section rail at the
 * left edge grows a soft trail. With FX off, the hero still drifts on its own
 * and everything else is static.
 * Loaded before app.js; app.js calls TORFX.start()/stop()/refresh().
 * ==========================================================================*/
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  let running = false;
  let io = null;

  /* --------------------------------------------------------- scroll reveals */
  function revealNow(el) {
    el.classList.add("rv-in");
    const done = () => {
      el.classList.remove("rv", "rv-in");
      el.style.removeProperty("--rvd");
      el.dataset.rvDone = "1";
    };
    el.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 1100);
  }

  function observeAll() {
    if (!io) return;
    const els = doc.querySelectorAll(".entry, .mod-row, .hl, .test-item, .doc-section > h2, .intro-block, .map-viewer");
    const counts = new Map();
    els.forEach((el) => {
      if (el.dataset.rvDone || el.classList.contains("rv")) return;
      // anything already inside the viewport at start shows immediately
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.9 && r.bottom > 0) { el.dataset.rvDone = "1"; return; }
      const p = el.parentElement;
      const i = counts.get(p) || 0;
      counts.set(p, i + 1);
      el.classList.add("rv");
      el.style.setProperty("--rvd", Math.min(i, 5) * 55 + "ms");
      io.observe(el);
    });
    // safety net: nothing stays hidden if the observer never fires
    setTimeout(() => doc.querySelectorAll(".rv:not(.rv-in)").forEach(revealNow), 3000);
  }

  function setupReveals() {
    root.classList.add("fx-reveal");
    io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) { revealNow(en.target); io.unobserve(en.target); }
      }
    }, { threshold: 0.04, rootMargin: "0px 0px -6% 0px" });
    observeAll();
  }

  function teardownReveals() {
    if (io) { io.disconnect(); io = null; }
    root.classList.remove("fx-reveal");
    doc.querySelectorAll(".rv").forEach((el) => {
      el.classList.remove("rv", "rv-in");
      el.style.removeProperty("--rvd");
    });
  }

  /* ------------------------------------------------------------------ API */
  function start() {
    if (running) return;
    running = true;
    if (window.TORHERO) TORHERO.setFx(true);
    if (!mqReduce.matches) setupReveals();
  }

  function stop() {
    if (!running) return;
    running = false;
    if (window.TORHERO) TORHERO.setFx(false);
    teardownReveals();
  }

  // re-observe fresh DOM after app.js re-renders (language switch)
  function refresh() {
    if (!running) return;
    if (io) observeAll();
  }

  mqReduce.addEventListener("change", () => { if (running) { stop(); start(); } });

  window.TORFX = { start, stop, refresh };
})();
