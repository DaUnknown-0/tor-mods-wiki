/* ============================================================================
 * TOR Mods Wiki: TORFX, the optional effects engine
 * In the station-map design the effects stay on the floor: a task-bar scroll
 * meter under the top beam, crew floating in the side gutters (click one for the
 * ejection easter egg), staggered scroll reveals and a light tilt on the mod
 * rooms for fine pointers. No canvas, no WebGL.
 * Loaded before app.js; app.js calls TORFX.start()/stop()/refresh().
 * ==========================================================================*/
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mqMobile = matchMedia("(max-width: 880px)");
  const mqFine = matchMedia("(pointer: fine)");

  let running = false;
  let W = innerWidth, H = innerHeight;
  const cleanups = [];

  /* ------------------------------------------------- drifting crew layer */
  let layer = null;
  const CREW_COLORS = ["", "c-chance", "c-useful", "c-unknowns", "c-nightfall", "c-atlas"];

  // crew keeps to the side gutters next to the content column, never behind text
  function gutters() {
    const col = doc.querySelector(".layout") || doc.querySelector("main");
    if (!col) return { l: 0, r: 0 };
    const b = col.getBoundingClientRect();
    return { l: Math.max(0, b.left), r: Math.max(0, W - b.right) };
  }

  function placeDrift(el) {
    const g = gutters();
    const size = +el.dataset.size;
    const room = el.dataset.side === "r" ? g.r : g.l;
    if (room < size + 16) { el.style.display = "none"; return; }
    el.style.display = "";
    const x = 8 + +el.dataset.frac * (room - size - 16);
    el.style.left = (el.dataset.side === "r" ? W - room + x : x).toFixed(0) + "px";
  }

  function spawnDrift(side) {
    if (!layer) return;
    const el = doc.createElement("span");
    const col = CREW_COLORS[(Math.random() * CREW_COLORS.length) | 0];
    el.className = "crewmate fx-drift" + (col ? " " + col : "") +
      (Math.random() < 0.18 ? " rev" : "");
    const size = 18 + Math.random() * 34;
    el.dataset.size = size.toFixed(0);
    el.dataset.side = side || (Math.random() < 0.5 ? "l" : "r");
    el.dataset.frac = Math.random().toFixed(3);
    el.style.setProperty("--size", size.toFixed(0) + "px");
    const dur = 40 + Math.random() * 55;
    el.style.animationDuration = dur.toFixed(1) + "s";
    el.style.animationDelay = "-" + (Math.random() * dur).toFixed(1) + "s";
    el.addEventListener("click", () => ejectDrift(el));
    layer.appendChild(el);
    placeDrift(el);
  }

  function placeAllDrift() {
    if (layer) layer.querySelectorAll(".fx-drift").forEach(placeDrift);
  }

  function ejectDrift(el) {
    if (!layer || el.dataset.ejecting) return;
    el.dataset.ejecting = "1";
    const r = el.getBoundingClientRect();
    // freeze the drift at its current spot, then fling it off-screen
    el.style.left = r.left + "px";
    el.style.top = r.top + "px";
    el.style.animation = "fxejectout 1.5s cubic-bezier(.5,-.28,1,1) forwards";
    const msg = doc.createElement("span");
    msg.className = "fx-eject-msg";
    msg.textContent = ". was not the Impostor";
    msg.style.left = Math.min(Math.max(r.left - 40, 16), Math.max(16, W - 260)) + "px";
    msg.style.top = Math.max(r.top - 40, 12) + "px";
    layer.appendChild(msg);
    setTimeout(() => {
      el.remove(); msg.remove();
      if (running && layer) spawnDrift(el.dataset.side);
    }, 2600);
  }

  function buildLayer() {
    layer = doc.createElement("div");
    layer.className = "fx-layer";
    layer.setAttribute("aria-hidden", "true");
    doc.body.appendChild(layer);
    if (mqReduce.matches) return; // the walk is an animation
    if (mqMobile.matches) return; // phones have no side gutters
    for (let i = 0; i < 6; i++) spawnDrift(i % 2 ? "r" : "l");
  }

  /* ------------------------------------------- pointer fx: room tilt */
  let tiltCard = null, moveRaf = 0, lastMove = null;

  function resetTilt() {
    if (!tiltCard) return;
    tiltCard.style.transform = "";
    tiltCard = null;
  }

  function applyMove() {
    moveRaf = 0;
    const e = lastMove;
    if (!e || !running || !mqFine.matches) return;
    const card = e.target.closest ? e.target.closest(".mod-card") : null;
    if (tiltCard && tiltCard !== card) resetTilt();
    if (card) {
      tiltCard = card;
      const r = card.getBoundingClientRect();
      const rx = (e.clientX - r.left) / r.width;
      const ry = (e.clientY - r.top) / r.height;
      card.style.transform =
        "perspective(1000px) rotateX(" + ((0.5 - ry) * 5).toFixed(2) +
        "deg) rotateY(" + ((rx - 0.5) * 6).toFixed(2) + "deg) translateY(-4px)";
    }
  }

  function onPointerMove(e) {
    lastMove = e;
    if (!moveRaf) moveRaf = requestAnimationFrame(applyMove);
  }

  /* --------------------------------- scroll fx: reveals + task progress */
  let io = null, taskbar = null, taskFill = null, scrollRaf = 0;

  function buildTaskbar() {
    taskbar = doc.createElement("div");
    taskbar.className = "fx-taskbar";
    taskbar.setAttribute("aria-hidden", "true");
    taskFill = doc.createElement("div");
    taskFill.className = "fx-taskbar-fill";
    taskbar.appendChild(taskFill);
    doc.body.appendChild(taskbar);
    updateTaskbar();
  }

  function updateTaskbar() {
    if (!taskbar) return;
    const tb = doc.getElementById("topbar");
    taskbar.style.top = (tb ? tb.offsetHeight + 8 : 0) + "px"; // below the beam's front face
    const max = root.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, scrollY / max) : 0;
    taskFill.style.width = (p * 100).toFixed(2) + "%";
  }

  function revealNow(el) {
    el.classList.add("rv-in");
    const done = () => {
      // drop the reveal classes so base transitions (hover etc.) come back
      el.classList.remove("rv", "rv-in");
      el.style.removeProperty("--rvd");
      el.dataset.rvDone = "1";
    };
    el.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 1200); // fallback if the transition never fires
  }

  function observeAll() {
    if (!io) return;
    const els = doc.querySelectorAll(".entry, .mod-card, .hl, .test-item");
    const counts = new Map();
    els.forEach((el) => {
      if (el.dataset.rvDone || el.classList.contains("rv")) return;
      const p = el.parentElement;
      const i = counts.get(p) || 0;
      counts.set(p, i + 1);
      el.classList.add("rv");
      el.style.setProperty("--rvd", Math.min(i, 6) * 60 + "ms");
      io.observe(el);
    });
  }

  function setupReveals() {
    root.classList.add("fx-reveal");
    io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          revealNow(en.target);
          io.unobserve(en.target);
        }
      }
    }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });
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

  /* ------------------------------------------------------------ API */
  function start() {
    if (running) return;
    running = true;
    W = innerWidth; H = innerHeight;
    if (mqFine.matches) root.classList.add("fx-fine");
    buildLayer();
    buildTaskbar();
    if (!mqReduce.matches) setupReveals();
    const onResize = () => {
      W = innerWidth; H = innerHeight;
      updateTaskbar();
      placeAllDrift();
    };
    const onScroll = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updateTaskbar();
      });
    };
    addEventListener("resize", onResize);
    addEventListener("scroll", onScroll, { passive: true });
    doc.addEventListener("pointermove", onPointerMove, { passive: true });
    doc.addEventListener("pointerleave", resetTilt);
    cleanups.push(
      () => removeEventListener("resize", onResize),
      () => removeEventListener("scroll", onScroll),
      () => doc.removeEventListener("pointermove", onPointerMove),
      () => doc.removeEventListener("pointerleave", resetTilt)
    );
  }

  function stop() {
    if (!running) return;
    running = false;
    teardownReveals();
    resetTilt();
    if (layer) { layer.remove(); layer = null; }
    if (taskbar) { taskbar.remove(); taskbar = null; taskFill = null; }
    root.classList.remove("fx-fine");
    cleanups.splice(0).forEach((fn) => fn());
  }

  // re-observe fresh DOM after app.js re-renders (language switch)
  function refresh() {
    if (!running) return;
    resetTilt();
    if (io) observeAll();
    updateTaskbar();
  }

  // react to a live change of the reduced-motion preference
  mqReduce.addEventListener("change", () => {
    if (running) { stop(); start(); }
  });

  window.TORFX = { start, stop, refresh };
})();
