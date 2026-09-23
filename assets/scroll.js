/* ============================================================================
 * TOR Mods Wiki: TORSCROLL, scroll choreography and the page background
 * - Background: one fixed canvas behind the reading area with a faint star
 *   chart in three parallax layers, a few constellation lines, two soft glows
 *   in the page accent (on the home page the glow follows the mod row in view)
 *   and crewmates floating in the side gutters, turning as you scroll.
 * - Hero exit: sets --hp (0 at the top, 1 once the hero is gone) on .hero; the
 *   CSS shrinks the frame into a card and slides the collage strips outwards.
 * - Headings and mod rows get --sp (0 below the fold, 1 once well in view) for
 *   the heading rise and the accent rule; the topbar gets --rp (read progress).
 * Everything is redrawn only on scroll, resize or a theme/accent change, never
 * in an idle loop. Motion needs FX on and no prefers-reduced-motion; otherwise
 * the background is drawn once, still, and the CSS falls back to static.
 * ==========================================================================*/
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const moving = () => root.dataset.fx !== "off" && !mqReduce.matches;

  function mulberry(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function parseColor(str) {
    const s = str.trim();
    let m = s.match(/^#([0-9a-f]{6})$/i);
    if (m) {
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    m = s.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
    return m ? [+m[1], +m[2], +m[3]] : [200, 50, 63];
  }
  const cssVar = (el, name) => getComputedStyle(el).getPropertyValue(name);

  /* ------------------------------------------------------------ canvas */
  const canvas = doc.createElement("canvas");
  canvas.id = "bgfx";
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, dpr = 1, mob = false;
  let stars = [], links = [], tileH = 1;
  let col = { l: 0, r: 0 };                 // reading column in viewport px
  let theme = "light", ink = [25, 24, 22];
  let accent = [200, 50, 63], target = [200, 50, 63], tweening = 0;
  const SPEED = [0.04, 0.1, 0.19];          // parallax factor per layer

  function build() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    mob = W < 760;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    tileH = Math.round(H * 1.6);
    const rand = mulberry(1905);
    const n = Math.round((W * tileH) / (mob ? 16000 : 9000));
    stars = [];
    for (let i = 0; i < n; i++) {
      const layer = rand() < 0.55 ? 0 : rand() < 0.7 ? 1 : 2;
      stars.push({
        x: rand() * W, y: rand() * tileH, layer,
        r: (layer === 0 ? 0.6 : layer === 1 ? 0.9 : 1.3) * (0.7 + rand() * 0.6),
        a: 0.35 + rand() * 0.65,
        cross: layer === 2 && rand() < 0.35
      });
    }
    // constellation lines between near mid-layer stars (star-chart look)
    links = [];
    const mid = stars.filter((s) => s.layer === 1);
    for (let i = 0; i < mid.length && links.length < (mob ? 8 : 26); i++) {
      for (let j = i + 1; j < mid.length; j++) {
        const dx = mid[i].x - mid[j].x, dy = mid[i].y - mid[j].y;
        const d = Math.hypot(dx, dy);
        if (d > 40 && d < 120 && rand() < 0.5) { links.push([mid[i], mid[j]]); break; }
      }
    }
    measure();
  }

  // where the reading column sits, so the decor stays out of the text
  function measure() {
    const reading = doc.querySelector(".reading") || doc.querySelector(".layout");
    const side = doc.getElementById("sidebar");
    if (!reading) { col = { l: W * 0.2, r: W * 0.8 }; return; }
    const r = reading.getBoundingClientRect();
    let l = r.left;
    if (side && side.offsetParent && getComputedStyle(side).position !== "fixed") {
      l = Math.min(l, side.getBoundingClientRect().left);
    }
    col = { l: l - 24, r: r.right + 24 };
  }

  function readTheme() {
    theme = root.dataset.theme === "dark" ? "dark" : "light";
    ink = parseColor(cssVar(root, "--ink") || "#191816");
    if (theme === "dark") ink = [241, 236, 225];
    target = parseColor(cssVar(doc.body, "--accent"));
    accent = target.slice();
    crewSprite = null;
  }

  /* ------------------------------------------------ crewmate sprite */
  let crewSprite = null;
  function makeCrew() {
    const s = 64, c = doc.createElement("canvas");
    c.width = s * 1.4; c.height = s * 1.4;
    const g = c.getContext("2d");
    const x = c.width / 2 + 4, y = c.height / 2;
    g.fillStyle = "rgb(" + accent.join(",") + ")";
    g.beginPath(); g.roundRect(x - 0.62 * s, y - 0.2 * s, 0.26 * s, 0.62 * s, 0.1 * s); g.fill();   // backpack
    g.beginPath(); g.roundRect(x - 0.42 * s, y - 0.6 * s, 0.84 * s, 1.08 * s, [0.42 * s, 0.42 * s, 0.1 * s, 0.1 * s]); g.fill();
    g.beginPath(); g.roundRect(x - 0.42 * s, y + 0.3 * s, 0.36 * s, 0.34 * s, 0.1 * s); g.fill(); // legs
    g.beginPath(); g.roundRect(x + 0.06 * s, y + 0.3 * s, 0.36 * s, 0.34 * s, 0.1 * s); g.fill();
    g.globalCompositeOperation = "destination-out";
    g.globalAlpha = 0.62;
    g.beginPath(); g.ellipse(x + 0.12 * s, y - 0.24 * s, 0.3 * s, 0.17 * s, 0, 0, Math.PI * 2); g.fill();
    crewSprite = c;
  }

  // three drifters: one per side plus a far one; dir = direction against scroll
  const CREW = [
    { side: "l", fx: 0.5, y0: 0.18, speed: 0.34, rot: 0.0016, size: 46, alpha: 0.2, sway: 18 },
    { side: "r", fx: 0.42, y0: 0.62, speed: -0.22, rot: -0.0012, size: 38, alpha: 0.16, sway: 26 },
    { side: "r", fx: 0.75, y0: 0.05, speed: 0.12, rot: 0.0022, size: 22, alpha: 0.12, sway: 10 }
  ];

  /* -------------------------------------------------------------- draw */
  function heroBottom() {
    const hero = doc.querySelector(".hero");
    return hero ? hero.getBoundingClientRect().bottom : 0;
  }

  function draw() {
    const y = moving() ? Math.max(0, scrollY) : 0;
    const hb = heroBottom();
    if (hb >= H) return;                               // the hero still fills the screen
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const dark = theme === "dark";
    const acc = accent.map(Math.round).join(",");

    // soft accent glows, drifting slowly with the scroll
    const glowA = dark ? 0.13 : 0.085;
    const glows = [
      [W * 0.08, H * (0.35 + 0.18 * Math.sin(y / 900)), Math.max(W, H) * 0.42],
      [W * 0.94, H * (0.7 + 0.16 * Math.cos(y / 1150)), Math.max(W, H) * 0.38]
    ];
    for (const [gx, gy, gr] of glows) {
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      g.addColorStop(0, "rgba(" + acc + "," + glowA + ")");
      g.addColorStop(1, "rgba(" + acc + ",0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // star chart: three layers, wrapped vertically; quieter over the text column
    const inkS = ink.join(",");
    const base = dark ? 0.55 : 0.26;
    const off = (layer) => (((y * SPEED[layer]) % tileH) + tileH) % tileH;
    const place = (s) => {
      let sy = s.y - off(s.layer);
      if (sy < -(tileH - H) / 2) sy += tileH;
      return sy;
    };
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(" + inkS + "," + (dark ? 0.1 : 0.07) + ")";
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    for (const [a, b] of links) {
      if ((a.x > col.l && a.x < col.r) || (b.x > col.l && b.x < col.r)) continue;
      const ay = place(a), by = place(b);
      if (Math.abs(ay - by) > 140) continue;          // one end wrapped
      ctx.moveTo(a.x, ay); ctx.lineTo(b.x, by);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    for (const s of stars) {
      const sy = place(s);
      if (sy < -4 || sy > H + 4 || sy < hb - 4) continue;
      const inCol = s.x > col.l && s.x < col.r;
      const a = base * s.a * (inCol ? 0.3 : 1);
      ctx.fillStyle = "rgba(" + inkS + "," + a.toFixed(3) + ")";
      if (s.cross && !inCol) {
        const r = s.r * 2.4;
        ctx.fillRect(s.x - r, sy - 0.5, r * 2, 1);
        ctx.fillRect(s.x - 0.5, sy - r, 1, r * 2);
      } else {
        ctx.beginPath(); ctx.arc(s.x, sy, s.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    // crewmates in the gutters, turning with the scroll
    const gl = col.l, gr = W - col.r;
    if (!crewSprite) makeCrew();
    for (const c of CREW) {
      const room = c.side === "l" ? gl : gr;
      if (room < c.size * 2.2) continue;
      const span = H + c.size * 3;
      let cy = ((c.y0 * span - y * c.speed) % span + span) % span - c.size * 1.5;
      const cx = (c.side === "l" ? room * c.fx : col.r + room * c.fx) + Math.sin(y / 420 + c.y0 * 9) * c.sway;
      if (cy < hb - c.size) continue;
      ctx.save();
      ctx.globalAlpha = c.alpha * (dark ? 1.25 : 1);
      ctx.translate(cx, cy);
      ctx.rotate(y * c.rot + c.y0 * 4);
      const k = c.size / 64;
      ctx.drawImage(crewSprite, -crewSprite.width * k / 2, -crewSprite.height * k / 2, crewSprite.width * k, crewSprite.height * k);
      ctx.restore();
    }
  }

  /* ----------------------------------------------- scroll-linked vars */
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
    const els = doc.querySelectorAll(".doc-section > h2, .mod-row");
    for (const el of els) {
      if (!on) { el.style.removeProperty("--sp"); continue; }
      const top = el.getBoundingClientRect().top;
      const v = clamp((innerHeight - top) / (innerHeight * 0.3), 0, 1);
      el.style.setProperty("--sp", v.toFixed(3));
    }
    // home page: the glow takes the colour of the mod row nearest the middle
    if (doc.body.dataset.page === "home") {
      let best = null, bd = Infinity;
      for (const row of doc.querySelectorAll(".mod-row")) {
        const r = row.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const d = Math.abs((r.top + r.bottom) / 2 - innerHeight / 2);
        if (d < bd) { bd = d; best = row; }
      }
      setTarget(parseColor(cssVar(best || doc.body, "--accent")));
    }
  }

  function setTarget(c) {
    if (c.every((v, i) => v === target[i])) return;
    target = c;
    if (!moving()) { accent = c.slice(); crewSprite = null; return; }
    if (!tweening) tweening = requestAnimationFrame(tween);
  }
  function tween() {
    tweening = 0;
    let done = true;
    accent = accent.map((v, i) => {
      const d = target[i] - v;
      if (Math.abs(d) > 0.8) { done = false; return v + d * 0.12; }
      return target[i];
    });
    crewSprite = null;
    draw();
    if (!done) tweening = requestAnimationFrame(tween);
  }

  let raf = 0;
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; vars(); draw(); });
  }

  /* --------------------------------------------------------------- boot */
  function start() {
    doc.body.prepend(canvas);
    readTheme();
    build();
    vars();
    draw();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", () => { build(); schedule(); });
    // theme / FX switches and re-renders (language switch) change colours and layout
    new MutationObserver(() => { readTheme(); measure(); schedule(); })
      .observe(root, { attributes: true, attributeFilter: ["data-theme", "data-fx"] });
    const content = doc.getElementById("content");
    if (content) new MutationObserver(() => { measure(); schedule(); }).observe(content, { childList: true });
    mqReduce.addEventListener("change", schedule);
    // fonts and images shift the column after load
    addEventListener("load", () => { measure(); schedule(); });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();

  window.TORSCROLL = { refresh: () => { measure(); schedule(); } };
})();
