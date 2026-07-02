/* ============================================================================
 * TOR Mods Wiki — TORFX: overdrive effects engine
 * Canvas starfield (parallax, twinkle, meteors / light-theme bokeh),
 * card tilt + glare, entry spotlight, scroll reveals, task progressbar,
 * aurora layer + drift-crew spawner with ejection easter egg.
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

  const theme = () => (root.dataset.theme === "light" ? "light" : "dark");
  const cssVar = (n) => getComputedStyle(root).getPropertyValue(n).trim();

  /* ------------------------------------------------------------- canvas */
  let canvas = null, ctx = null, raf = 0, lastT = 0, nextMeteor = 0;
  let stars = [], bokeh = [], meteors = [];
  const par = { x: 0, y: 0, tx: 0, ty: 0 }; // lerped parallax from pointer

  const LAYERS = [
    { n: 140, depth: 0.25, rmin: 0.4, rmax: 0.9 },
    { n: 90,  depth: 0.55, rmin: 0.6, rmax: 1.3 },
    { n: 50,  depth: 1.0,  rmin: 0.9, rmax: 1.8 },
  ];

  function buildParticles() {
    stars = []; bokeh = []; meteors = [];
    if (theme() === "dark") {
      const mob = mqMobile.matches;
      for (const L of LAYERS) {
        const n = mob ? (L.n >> 1) : L.n;
        for (let i = 0; i < n; i++) {
          const c = Math.random();
          stars.push({
            x: Math.random() * W, y: Math.random() * H,
            r: L.rmin + Math.random() * (L.rmax - L.rmin),
            d: L.depth,
            a: 0.35 + Math.random() * 0.55,
            tw: 0.6 + Math.random() * 1.8,
            ph: Math.random() * Math.PI * 2,
            col: c < 0.78 ? "237,241,251" : c < 0.92 ? "84,198,255" : "255,160,92",
          });
        }
      }
    } else {
      const n = mqMobile.matches ? 12 : 24;
      const cols = ["--chance", "--useful", "--unknowns", "--crew-red"]
        .map((v) => cssVar(v) || "#8899bb");
      for (let i = 0; i < n; i++) {
        bokeh.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 14 + Math.random() * 40,
          a: 0.05 + Math.random() * 0.07,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.12,
          col: cols[(Math.random() * cols.length) | 0],
        });
      }
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles();
  }

  function spawnMeteor() {
    meteors.push({
      x: Math.random() * W * 0.7, y: Math.random() * H * 0.35,
      vx: 6 + Math.random() * 4, vy: 2 + Math.random() * 1.6, life: 1,
    });
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(t - lastT, 50) / 16.67; // ~frames elapsed since last tick
    lastT = t;
    par.x += (par.tx - par.x) * 0.045 * dt;
    par.y += (par.ty - par.y) * 0.045 * dt;
    const sy = scrollY;
    ctx.clearRect(0, 0, W, H);

    if (theme() === "dark") {
      const ts = t / 1000;
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(ts * s.tw + s.ph);
        let x = s.x + par.x * 26 * s.d;
        let y = s.y + par.y * 16 * s.d - sy * 0.06 * s.d;
        x = ((x % W) + W) % W; y = ((y % H) + H) % H;
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = "rgb(" + s.col + ")";
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.2832); ctx.fill();
      }
      if (t > nextMeteor) {
        spawnMeteor();
        nextMeteor = t + 6000 + Math.random() * 8000;
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx * dt; m.y += m.vy * dt; m.life -= 0.014 * dt;
        if (m.life <= 0 || m.x > W + 220 || m.y > H + 220) { meteors.splice(i, 1); continue; }
        const tx = m.x - m.vx * 16, ty = m.y - m.vy * 16;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, "rgba(255,255,255," + 0.9 * m.life + ")");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.globalAlpha = 0.8 * m.life;
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(m.x, m.y, 1.6, 0, 6.2832); ctx.fill();
      }
    } else {
      for (const b of bokeh) {
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < -b.r) b.x = W + b.r; else if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r; else if (b.y > H + b.r) b.y = -b.r;
        const x = b.x + par.x * 20, y = b.y + par.y * 12;
        const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
        g.addColorStop(0, b.col);
        g.addColorStop(1, b.col + "00");
        ctx.globalAlpha = b.a;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, b.r, 0, 6.2832); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function startCanvas() {
    if (canvas || mqReduce.matches) return;
    canvas = doc.createElement("canvas");
    canvas.className = "fx-stars";
    canvas.setAttribute("aria-hidden", "true");
    ctx = canvas.getContext("2d");
    doc.body.appendChild(canvas);
    root.classList.add("fx-canvas");
    resizeCanvas();
    lastT = performance.now();
    nextMeteor = lastT + 3500 + Math.random() * 5000;
    raf = requestAnimationFrame(frame);
  }
  function stopCanvas() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (canvas) canvas.remove();
    canvas = ctx = null;
    stars = []; bokeh = []; meteors = [];
    root.classList.remove("fx-canvas");
  }
  function pauseCanvas() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  function resumeCanvas() {
    if (canvas && !raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); }
  }

  /* --------------------------------------- aurora layer + drift spawner */
  let layer = null;
  const CREW_COLORS = ["", "c-chance", "c-useful", "c-unknowns"];

  function spawnDrift() {
    if (!layer) return;
    const el = doc.createElement("span");
    const col = CREW_COLORS[(Math.random() * CREW_COLORS.length) | 0];
    el.className = "crewmate fx-drift" + (col ? " " + col : "") +
      (Math.random() < 0.18 ? " rev" : "");
    el.style.top = (8 + Math.random() * 78).toFixed(1) + "%";
    el.style.setProperty("--size", (14 + Math.random() * 34).toFixed(0) + "px");
    const dur = 40 + Math.random() * 55;
    el.style.animationDuration = dur.toFixed(1) + "s";
    el.style.animationDelay = "-" + (Math.random() * dur).toFixed(1) + "s";
    el.addEventListener("click", () => ejectDrift(el));
    layer.appendChild(el);
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
    msg.style.top = Math.max(r.top - 34, 12) + "px";
    layer.appendChild(msg);
    setTimeout(() => {
      el.remove(); msg.remove();
      if (running && layer) spawnDrift();
    }, 2600);
  }

  function buildLayer() {
    layer = doc.createElement("div");
    layer.className = "fx-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML =
      '<div class="fx-aurora a"></div><div class="fx-aurora b"></div><div class="fx-aurora c"></div>';
    doc.body.appendChild(layer);
    const n = mqMobile.matches ? 3 : 6;
    for (let i = 0; i < n; i++) spawnDrift();
  }

  /* --------------------------------- pointer fx: tilt, glare, spotlight */
  let tiltCard = null, moveRaf = 0, lastMove = null;

  function resetTilt() {
    if (!tiltCard) return;
    tiltCard.style.transform = "";
    tiltCard.style.removeProperty("--gx");
    tiltCard.style.removeProperty("--gy");
    tiltCard = null;
  }

  function applyMove() {
    moveRaf = 0;
    const e = lastMove;
    if (!e || !running) return;
    par.tx = (e.clientX / W - 0.5) * 2;
    par.ty = (e.clientY / H - 0.5) * 2;
    if (!mqFine.matches) return;
    const card = e.target.closest ? e.target.closest(".mod-card") : null;
    if (tiltCard && tiltCard !== card) resetTilt();
    if (card) {
      tiltCard = card;
      const r = card.getBoundingClientRect();
      const rx = (e.clientX - r.left) / r.width;
      const ry = (e.clientY - r.top) / r.height;
      card.style.transform =
        "perspective(1000px) rotateX(" + ((0.5 - ry) * 8).toFixed(2) +
        "deg) rotateY(" + ((rx - 0.5) * 10).toFixed(2) + "deg) translateY(-4px)";
      card.style.setProperty("--gx", (rx * 100).toFixed(1) + "%");
      card.style.setProperty("--gy", (ry * 100).toFixed(1) + "%");
    }
    const entry = e.target.closest ? e.target.closest(".entry") : null;
    if (entry) {
      const r = entry.getBoundingClientRect();
      entry.style.setProperty("--mx", (e.clientX - r.left).toFixed(0) + "px");
      entry.style.setProperty("--my", (e.clientY - r.top).toFixed(0) + "px");
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
    taskbar.style.top = (tb ? tb.offsetHeight : 0) + "px";
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
    const els = doc.querySelectorAll(".entry, .doc-section > h2, .mod-card, .hl");
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
    if (!mqReduce.matches) {
      startCanvas();
      setupReveals();
    }
    const onResize = () => {
      W = innerWidth; H = innerHeight;
      resizeCanvas();
      updateTaskbar();
    };
    const onScroll = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updateTaskbar();
      });
    };
    const onVis = () => { doc.hidden ? pauseCanvas() : resumeCanvas(); };
    addEventListener("resize", onResize);
    addEventListener("scroll", onScroll, { passive: true });
    doc.addEventListener("pointermove", onPointerMove, { passive: true });
    doc.addEventListener("pointerleave", resetTilt);
    doc.addEventListener("visibilitychange", onVis);
    const themeObs = new MutationObserver(() => { if (canvas) buildParticles(); });
    themeObs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    cleanups.push(
      () => removeEventListener("resize", onResize),
      () => removeEventListener("scroll", onScroll),
      () => doc.removeEventListener("pointermove", onPointerMove),
      () => doc.removeEventListener("pointerleave", resetTilt),
      () => doc.removeEventListener("visibilitychange", onVis),
      () => themeObs.disconnect()
    );
  }

  function stop() {
    if (!running) return;
    running = false;
    stopCanvas();
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
