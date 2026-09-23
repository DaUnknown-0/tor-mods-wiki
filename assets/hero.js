/* ============================================================================
 * TOR Mods Wiki: TORHERO, the live hero scenes
 * One Canvas2D scene per page, drawn by hand (no libraries): a deep-space
 * planet horizon with the Skeld drifting past (home), tumbling dice (Chance),
 * a station hull under repair (Forgotten Fixes), a purple nebula with a lone
 * crewmate (Unknown's Collection), a moonlit ridge with a werewolf (Nightfall)
 * and the two Atlas maps as one landscape (Atlas).
 * Static backdrops are rendered once per resize into offscreen canvases; the
 * per-frame work is stars, particles and a few moving shapes. The loop pauses
 * when the hero leaves the viewport or the tab is hidden, and under
 * prefers-reduced-motion a single frame is drawn instead.
 * API: TORHERO.mount() after every render, TORHERO.setFx(bool).
 * ==========================================================================*/
(function () {
  "use strict";

  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mqCoarse = matchMedia("(pointer: coarse)");
  const mqFine = matchMedia("(pointer: fine)");
  const TAU = Math.PI * 2;
  let fx = document.documentElement.dataset.fx !== "off";
  let inst = null;

  /* ------------------------------------------------------------ helpers */
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
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);

  // 1D value noise for ridges and hills
  function noise1(rand, n) {
    const pts = [];
    for (let i = 0; i <= n + 1; i++) pts.push(rand());
    return (x) => {
      const i = Math.floor(x), f = smooth(x - i);
      const a = pts[((i % (n + 1)) + n + 1) % (n + 1)];
      const b = pts[(((i + 1) % (n + 1)) + n + 1) % (n + 1)];
      return lerp(a, b, f);
    };
  }
  function fbm(rand, octaves) {
    const fns = [];
    for (let o = 0; o < octaves; o++) fns.push(noise1(rand, 64));
    return (x) => {
      let v = 0, amp = 1, fr = 1, norm = 0;
      for (let o = 0; o < fns.length; o++) {
        v += fns[o](x * fr) * amp; norm += amp; amp *= 0.5; fr *= 2.1;
      }
      return v / norm;
    };
  }

  function rrect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function offscreen(w, h) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  }

  function makeStars(rand, n, spread) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      const big = rand() < 0.08;
      arr.push({
        x: rand() * (1 + spread * 2) - spread,
        y: rand() * (1 + spread * 2) - spread,
        r: big ? 1.2 + rand() * 1.1 : 0.5 + rand() * 0.7,
        a: 0.35 + rand() * 0.6,
        tw: 0.4 + rand() * 1.6,
        ph: rand() * TAU,
        d: 0.3 + rand() * 0.7,         // parallax depth
        warm: rand() < 0.18
      });
    }
    return arr;
  }

  function drawStars(ctx, stars, w, h, t, ox, oy, limitY) {
    ctx.save();
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const x = s.x * w + ox * s.d, y = s.y * h + oy * s.d;
      if (limitY && y > limitY(x)) continue;
      const a = s.a * (0.72 + 0.28 * Math.sin(t * s.tw + s.ph));
      ctx.globalAlpha = a;
      ctx.fillStyle = s.warm ? "#ffe2bf" : "#eef3ff";
      if (s.r > 1.1) {
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, TAU); ctx.fill();
      } else {
        ctx.fillRect(x, y, s.r + 0.6, s.r + 0.6);
      }
    }
    ctx.restore();
  }

  // crewmate silhouette, 100 x 120 units, facing right
  const CREW_BODY = "M26 60C26 22 42 8 60 8c20 0 32 16 32 44v50q0 10-10 10H66q-6 0-6-6V96h-8v10q0 6-6 6H34q-8 0-8-8z";
  const CREW_PACK = "M15 40h6a9 9 0 0 1 9 9v32a9 9 0 0 1-9 9h-6a9 9 0 0 1-9-9V49a9 9 0 0 1 9-9z";
  const CREW_VISOR = "M48 44c0-12 14-16 28-16 16 0 22 8 22 18 0 10-8 14-22 14-16 0-28-4-28-16z";
  let pBody = null, pPack = null, pVisor = null;
  function crewPaths() {
    if (!pBody) {
      pBody = new Path2D(CREW_BODY); pPack = new Path2D(CREW_PACK); pVisor = new Path2D(CREW_VISOR);
    }
  }
  /* draws a crewmate whose box is size wide; opts: fill, visor, rim (stroke), flip, ears, tail */
  function drawCrew(ctx, x, y, size, opts) {
    crewPaths();
    const k = size / 100;
    ctx.save();
    ctx.translate(x, y);
    if (opts.flip) { ctx.scale(-k, k); ctx.translate(-100, 0); } else ctx.scale(k, k);
    if (opts.rot) { ctx.translate(55, 60); ctx.rotate(opts.rot); ctx.translate(-55, -60); }
    ctx.fillStyle = opts.fill || "#0a0b12";
    if (opts.tail) { // bushy tail behind the pack
      ctx.beginPath();
      ctx.moveTo(14, 96); ctx.quadraticCurveTo(-18, 100, -16, 72);
      ctx.quadraticCurveTo(-12, 56, 4, 62); ctx.quadraticCurveTo(-6, 76, 10, 84); ctx.closePath();
      ctx.fill();
    }
    ctx.fill(pPack);
    ctx.fill(pBody);
    if (opts.ears) {
      ctx.beginPath(); ctx.moveTo(38, 22); ctx.lineTo(30, -6); ctx.lineTo(52, 12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(66, 12); ctx.lineTo(74, -8); ctx.lineTo(84, 18); ctx.closePath(); ctx.fill();
    }
    if (opts.rim) {
      ctx.strokeStyle = opts.rim; ctx.lineWidth = opts.rimW || 1.6; ctx.lineJoin = "round";
      ctx.stroke(pBody); ctx.stroke(pPack);
    }
    ctx.fillStyle = opts.visor || "#1d2a45";
    ctx.fill(pVisor);
    if (opts.glint) {
      ctx.fillStyle = opts.glint;
      ctx.beginPath(); ctx.ellipse(66, 36, 9, 4.5, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  /* ============================================================ scenes
   * Every scene: init(w, h, q), build(w, h) for cached layers, draw(ctx, w, h, t, dt, px, py)
   * px/py: parallax offsets in px for the far layer (scenes scale them). */

  /* ------------------------------------------------ space / planet horizon */
  function SpaceScene(variant) {
    const rand = mulberry(variant === "test" ? 77 : 11);
    const amber = variant === "test";
    let stars, dust, bg, horizonAt, W, H, ship, shoot = null, crew;
    const s = {};
    s.init = (w, h, q) => {
      stars = makeStars(rand, q.stars, 0.08);
      dust = [];
      for (let i = 0; i < q.particles; i++) dust.push({
        x: rand(), y: rand(), r: 0.6 + rand() * 1.4, a: 0.15 + rand() * 0.35,
        vx: -0.004 - rand() * 0.008, vy: -0.002 + rand() * 0.004, d: 0.6 + rand() * 0.8
      });
      ship = { on: variant !== "test", ph: rand() * 100 };
      crew = { x: 0.08 + rand() * 0.06, y: 0.5 + rand() * 0.1, rot: rand() * TAU, size: 0 };
    };
    s.build = (w, h) => {
      W = w; H = h;
      bg = offscreen(w * 1.08, h * 1.08);
      const c = bg.getContext("2d");
      const bw = bg.width, bh = bg.height;
      const sky = c.createLinearGradient(0, 0, 0, bh);
      if (amber) {
        sky.addColorStop(0, "#07060a"); sky.addColorStop(0.4, "#181120"); sky.addColorStop(0.68, "#3a2a2a"); sky.addColorStop(0.72, "#6b4a30");
      } else {
        sky.addColorStop(0, "#04050b"); sky.addColorStop(0.38, "#0b1631"); sky.addColorStop(0.62, "#16315f"); sky.addColorStop(0.72, "#3b5b8f");
      }
      c.fillStyle = sky; c.fillRect(0, 0, bw, bh);
      const R = Math.max(bw * 1.35, bh * 1.6);
      const cx = bw * 0.5, cy = bh * 0.7 + R;
      horizonAt = (x) => {
        const dx = x - cx; const v = R * R - dx * dx;
        return v > 0 ? cy - Math.sqrt(v) : bh;
      };
      // atmosphere ring
      const r0 = R * 0.9, r1 = R * 1.3;
      const g = c.createRadialGradient(cx, cy, r0, cx, cy, r1);
      const f = (r) => clamp((r - r0) / (r1 - r0), 0, 1);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(f(R * 0.982), "rgba(255,120,60,0)");
      g.addColorStop(f(R * 0.998), amber ? "rgba(255,190,90,.95)" : "rgba(255,150,80,.95)");
      g.addColorStop(f(R * 1.008), amber ? "rgba(255,140,50,.75)" : "rgba(255,92,40,.78)");
      g.addColorStop(f(R * 1.04), amber ? "rgba(200,110,50,.35)" : "rgba(205,86,64,.36)");
      g.addColorStop(f(R * 1.1), amber ? "rgba(120,80,60,.2)" : "rgba(84,112,182,.28)");
      g.addColorStop(f(R * 1.3), "rgba(20,40,100,0)");
      c.fillStyle = g; c.fillRect(0, 0, bw, bh);
      // planet body
      const p = c.createRadialGradient(cx, cy, R * 0.94, cx, cy, R);
      p.addColorStop(0, "#030304"); p.addColorStop(0.7, "#060506"); p.addColorStop(0.97, "#1c110d"); p.addColorStop(1, amber ? "#7a4a20" : "#6e3a22");
      c.fillStyle = p; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
      // city lights on the night side, faint
      c.fillStyle = amber ? "rgba(255,200,120,.35)" : "rgba(255,190,130,.3)";
      const lr = mulberry(5);
      for (let i = 0; i < 90; i++) {
        const x = lr() * bw, y = horizonAt(x) + 6 + lr() * (bh * 0.3);
        c.globalAlpha = lr() * 0.6;
        c.fillRect(x, y, 1.2, 1.2);
      }
      c.globalAlpha = 1;
      crew.size = clamp(w * 0.035, 22, 46);
    };
    function drawShip(ctx, x, y, size, t) {
      const k = size / 100;
      ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(-0.05 + Math.sin(t * 0.17) * 0.012);
      const parts = () => {
        rrect(ctx, 0, 0, 24, 11, 5); ctx.fill();
        rrect(ctx, 0, 33, 24, 11, 5); ctx.fill();
        rrect(ctx, 10, 13, 24, 18, 4); ctx.fill();
        rrect(ctx, 26, 3, 46, 38, 12); ctx.fill();
        rrect(ctx, 66, 10, 30, 24, 12); ctx.fill();
        ctx.beginPath(); ctx.ellipse(94, 22, 7, 8, 0, 0, TAU); ctx.fill();
      };
      ctx.fillStyle = amber ? "rgba(255,190,110,.55)" : "rgba(255,150,90,.55)";
      ctx.save(); ctx.translate(0, 1.6); parts(); ctx.restore();
      ctx.fillStyle = "#0a0b12"; parts();
      // engines
      for (const ey of [5.5, 38.5]) {
        const g = ctx.createRadialGradient(-1, ey, 0, -1, ey, 9);
        g.addColorStop(0, "rgba(140,190,255,.9)"); g.addColorStop(1, "rgba(80,130,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(-1, ey, 9, 0, TAU); ctx.fill();
      }
      // windows
      ctx.fillStyle = "rgba(255,214,160,.9)";
      const win = [[34, 12], [40, 12], [46, 12], [34, 30], [40, 30], [52, 30], [58, 20], [74, 16], [80, 16], [86, 24], [64, 8], [70, 34]];
      for (let i = 0; i < win.length; i++) {
        ctx.globalAlpha = 0.55 + 0.45 * Math.sin(t * 0.9 + i * 1.7);
        ctx.fillRect(win[i][0], win[i][1], 2.2, 1.6);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    s.draw = (ctx, w, h, t, dt, px, py, live) => {
      ctx.drawImage(bg, -w * 0.04 + px * 0.25, -h * 0.04 + py * 0.25);
      drawStars(ctx, stars, w, h, t, px * 0.5, py * 0.5, (x) => horizonAt(x + w * 0.04) - h * 0.04 - 2);
      // dust
      ctx.fillStyle = "#cfd8ff";
      for (const d of dust) {
        d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.x < -0.02) d.x = 1.02; if (d.y < -0.02) d.y = 1.02; if (d.y > 1.02) d.y = -0.02;
        ctx.globalAlpha = d.a;
        ctx.fillRect(d.x * w + px * d.d, d.y * h + py * d.d, d.r, d.r);
      }
      ctx.globalAlpha = 1;
      // shooting star (fx only)
      if (fx && live) {
        if (!shoot && Math.random() < dt * 0.12) shoot = { x: 0.15 + Math.random() * 0.7, y: 0.05 + Math.random() * 0.3, life: 0, len: 0.9 + Math.random() * 0.6 };
        if (shoot) {
          shoot.life += dt;
          const p = shoot.life / shoot.len;
          if (p >= 1) shoot = null;
          else {
            const x = shoot.x * w + p * 260, y = shoot.y * h + p * 90;
            const g = ctx.createLinearGradient(x - 90, y - 31, x, y);
            g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(255,255,255," + (0.9 * Math.sin(p * Math.PI)) + ")");
            ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 90, y - 31); ctx.lineTo(x, y); ctx.stroke();
          }
        }
      }
      // the Skeld, backlit, drifting from right to left just above the rim
      if (ship.on) {
        const size = clamp(w * 0.15, 120, 230);
        const cycle = 140;
        const p = ((t + ship.ph) % cycle) / cycle;
        const x = w * 1.1 - p * (w * 1.2 + size);
        const y = h * 0.1 + Math.sin(t * 0.25) * 6 + (x / w - 0.5) * h * 0.05;
        drawShip(ctx, x + px * 0.8, y + py * 0.8, size, t);
      }
      // a small crewmate tumbling far away
      const cx = crew.x * w + px * 1.1 + Math.sin(t * 0.13) * 30;
      const cy = crew.y * h + py * 1.1 + Math.cos(t * 0.11) * 18;
      drawCrew(ctx, cx, cy, crew.size, { fill: "#0c0d14", visor: "#24365c", rim: "rgba(255,170,110,.35)", rimW: 2.4, rot: crew.rot + t * 0.12 });
    };
    return s;
  }

  /* ---------------------------------------------------------- dice in space */
  function DiceScene() {
    const rand = mulberry(23);
    let stars, dust, bg, dice;
    const V = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
    // faces with outward normals and pip counts (opposite faces sum to 7)
    const F = [
      { i: [4, 5, 6, 7], n: [0, 0, 1], pips: 1 }, { i: [1, 0, 3, 2], n: [0, 0, -1], pips: 6 },
      { i: [5, 1, 2, 6], n: [1, 0, 0], pips: 2 }, { i: [0, 4, 7, 3], n: [-1, 0, 0], pips: 5 },
      { i: [3, 7, 6, 2], n: [0, 1, 0], pips: 3 }, { i: [0, 1, 5, 4], n: [0, -1, 0], pips: 4 }
    ];
    const PIPS = {
      1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]],
      4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
      6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]
    };
    const s = {};
    s.init = (w, h, q) => {
      stars = makeStars(rand, q.stars, 0.08);
      dust = [];
      for (let i = 0; i < q.particles; i++) dust.push({ x: rand(), y: rand(), r: 0.8 + rand() * 1.6, a: 0.1 + rand() * 0.3, vy: -0.006 - rand() * 0.01, vx: (rand() - 0.5) * 0.004, d: 0.5 + rand() });
      dice = [];
      const n = q.mob ? 3 : 4;
      const spots = [[0.11, 0.3], [0.89, 0.27], [0.13, 0.78], [0.87, 0.74], [0.5, 0.08]];
      for (let i = 0; i < n; i++) dice.push({
        x: spots[i][0], y: spots[i][1], size: 0.05 + rand() * 0.035,
        ax: rand() * TAU, ay: rand() * TAU, az: rand() * TAU,
        vx: (0.15 + rand() * 0.25) * (rand() < 0.5 ? 1 : -1), vy: (0.15 + rand() * 0.25) * (rand() < 0.5 ? 1 : -1), vz: (0.05 + rand() * 0.15),
        bob: rand() * TAU, d: 0.8 + rand() * 0.8
      });
    };
    s.build = (w, h) => {
      bg = offscreen(w * 1.08, h * 1.08);
      const c = bg.getContext("2d"), bw = bg.width, bh = bg.height;
      const sky = c.createLinearGradient(0, 0, 0, bh);
      sky.addColorStop(0, "#06050c"); sky.addColorStop(0.45, "#150d1c"); sky.addColorStop(0.8, "#2c1614"); sky.addColorStop(1, "#4a2412");
      c.fillStyle = sky; c.fillRect(0, 0, bw, bh);
      const g = c.createRadialGradient(bw * 0.68, bh * 1.12, 0, bw * 0.68, bh * 1.12, bh * 0.95);
      g.addColorStop(0, "rgba(255,170,80,.85)"); g.addColorStop(0.25, "rgba(255,110,50,.45)"); g.addColorStop(0.6, "rgba(160,60,40,.15)"); g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g; c.fillRect(0, 0, bw, bh);
      const g2 = c.createRadialGradient(bw * 0.15, bh * 0.15, 0, bw * 0.15, bh * 0.15, bh * 0.7);
      g2.addColorStop(0, "rgba(90,60,140,.28)"); g2.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g2; c.fillRect(0, 0, bw, bh);
    };
    function rot(v, ax, ay, az) {
      let [x, y, z] = v;
      let c = Math.cos(ax), s_ = Math.sin(ax); [y, z] = [y * c - z * s_, y * s_ + z * c];
      c = Math.cos(ay); s_ = Math.sin(ay); [x, z] = [x * c + z * s_, -x * s_ + z * c];
      c = Math.cos(az); s_ = Math.sin(az); [x, y] = [x * c - y * s_, x * s_ + y * c];
      return [x, y, z];
    }
    function drawDie(ctx, d, cx, cy, size) {
      const P = V.map((v) => rot(v, d.ax, d.ay, d.az));
      const proj = (p) => { const z = 1 / (1 + p[2] * 0.12); return [cx + p[0] * size * z, cy + p[1] * size * z]; };
      const L = [-0.45, -0.6, 0.66];
      const faces = F.map((f) => ({ f, n: rot(f.n, d.ax, d.ay, d.az) })).filter((o) => o.n[2] > 0.02);
      faces.sort((a, b) => a.n[2] - b.n[2]);
      // shadow blob behind the die
      const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 2.3);
      sg.addColorStop(0, "rgba(255,140,60,.22)"); sg.addColorStop(1, "rgba(255,140,60,0)");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, size * 2.3, 0, TAU); ctx.fill();
      for (const o of faces) {
        const pts = o.f.i.map((i) => proj(P[i]));
        const lam = clamp(o.n[0] * L[0] + o.n[1] * L[1] + o.n[2] * L[2], 0, 1);
        const sh = 0.5 + 0.5 * lam;
        ctx.fillStyle = "rgb(" + Math.round(246 * sh) + "," + Math.round(232 * sh) + "," + Math.round(208 * sh) + ")";
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let k = 1; k < 4; k++) ctx.lineTo(pts[k][0], pts[k][1]);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(40,20,15,.35)"; ctx.lineWidth = 1; ctx.stroke();
        // pips: face basis vectors from corner points
        const c0 = P[o.f.i[0]], c1 = P[o.f.i[1]], c3 = P[o.f.i[3]];
        const u = [(c1[0] - c0[0]) / 2, (c1[1] - c0[1]) / 2, (c1[2] - c0[2]) / 2];
        const v = [(c3[0] - c0[0]) / 2, (c3[1] - c0[1]) / 2, (c3[2] - c0[2]) / 2];
        const mid = [(c0[0] + P[o.f.i[2]][0]) / 2, (c0[1] + P[o.f.i[2]][1]) / 2, (c0[2] + P[o.f.i[2]][2]) / 2];
        ctx.fillStyle = "rgba(38,22,18," + (0.6 + 0.4 * lam) + ")";
        for (const pp of PIPS[o.f.pips]) {
          const q3 = [mid[0] + u[0] * pp[0] * 0.55 + v[0] * pp[1] * 0.55, mid[1] + u[1] * pp[0] * 0.55 + v[1] * pp[1] * 0.55, mid[2] + u[2] * pp[0] * 0.55 + v[2] * pp[1] * 0.55];
          const q = proj(q3);
          ctx.beginPath(); ctx.ellipse(q[0], q[1], size * 0.13, size * 0.13 * (0.35 + 0.65 * o.n[2]), 0, 0, TAU); ctx.fill();
        }
      }
    }
    s.draw = (ctx, w, h, t, dt, px, py) => {
      ctx.drawImage(bg, -w * 0.04 + px * 0.25, -h * 0.04 + py * 0.25);
      drawStars(ctx, stars, w, h, t, px * 0.5, py * 0.5);
      ctx.fillStyle = "#ffc890";
      for (const d of dust) {
        d.y += d.vy * dt; d.x += d.vx * dt;
        if (d.y < -0.02) { d.y = 1.02; d.x = rand(); }
        ctx.globalAlpha = d.a; ctx.fillRect(d.x * w + px * d.d, d.y * h + py * d.d, d.r, d.r);
      }
      ctx.globalAlpha = 1;
      for (const d of dice) {
        d.ax += d.vx * dt; d.ay += d.vy * dt; d.az += d.vz * dt;
        const size = clamp(d.size * w, 24, 60);
        drawDie(ctx, d, d.x * w + px * d.d + Math.sin(t * 0.3 + d.bob) * 14, d.y * h + py * d.d + Math.cos(t * 0.23 + d.bob) * 10, size);
      }
    };
    return s;
  }

  /* --------------------------------------------------- station under repair */
  function StationScene() {
    const rand = mulberry(41);
    let stars, bg, station, W, H, sparks = [], flick = [], q0;
    const s = {};
    s.init = (w, h, q) => { q0 = q; stars = makeStars(rand, q.stars, 0.08); };
    s.build = (w, h) => {
      W = w; H = h;
      bg = offscreen(w * 1.08, h * 1.08);
      let c = bg.getContext("2d"), bw = bg.width, bh = bg.height;
      const sky = c.createLinearGradient(0, 0, 0, bh);
      sky.addColorStop(0, "#04060b"); sky.addColorStop(0.55, "#071120"); sky.addColorStop(1, "#0b2330");
      c.fillStyle = sky; c.fillRect(0, 0, bw, bh);
      const g = c.createRadialGradient(bw * 0.5, bh * 0.95, 0, bw * 0.5, bh * 0.95, bw * 0.7);
      g.addColorStop(0, "rgba(40,190,175,.32)"); g.addColorStop(0.5, "rgba(20,120,120,.12)"); g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g; c.fillRect(0, 0, bw, bh);
      // the station, drawn once
      station = offscreen(w, h);
      c = station.getContext("2d");
      const y0 = h * 0.76, hh = clamp(h * 0.15, 64, 140);
      c.save(); c.translate(w * 0.5, y0); c.rotate(-0.035); c.translate(-w * 0.5, -y0);
      // hull
      const hull = c.createLinearGradient(0, y0 - hh / 2, 0, y0 + hh / 2);
      hull.addColorStop(0, "#2a3242"); hull.addColorStop(0.35, "#1a2130"); hull.addColorStop(1, "#080b12");
      c.fillStyle = hull; rrect(c, -w * 0.1, y0 - hh / 2, w * 1.2, hh, hh * 0.45); c.fill();
      // panel seams
      c.strokeStyle = "rgba(0,0,0,.45)"; c.lineWidth = 1.5;
      for (let x = -w * 0.1; x < w * 1.1; x += hh * 0.9) { c.beginPath(); c.moveTo(x, y0 - hh / 2 + 4); c.lineTo(x, y0 + hh / 2 - 4); c.stroke(); }
      c.strokeStyle = "rgba(120,150,170,.18)"; c.beginPath(); c.moveTo(-w * 0.1, y0 - hh * 0.18); c.lineTo(w * 1.1, y0 - hh * 0.18); c.stroke();
      // docking module + antenna
      c.fillStyle = "#151b27"; rrect(c, w * 0.3, y0 - hh * 1.05, hh * 0.9, hh * 0.6, 8); c.fill();
      rrect(c, w * 0.62, y0 - hh * 0.95, hh * 0.5, hh * 0.5, 6); c.fill();
      c.strokeStyle = "#3c4a5c"; c.lineWidth = 2;
      c.beginPath(); c.moveTo(w * 0.34, y0 - hh * 1.05); c.lineTo(w * 0.34, y0 - hh * 1.75); c.stroke();
      c.beginPath(); c.moveTo(w * 0.34, y0 - hh * 1.6); c.lineTo(w * 0.34 + 16, y0 - hh * 1.7); c.stroke();
      // solar wings
      const wing = (x, dir) => {
        c.save(); c.translate(x, y0 - hh * 0.1); c.rotate(dir * 0.12);
        c.fillStyle = "#101a2e"; c.fillRect(0, -hh * 0.55, dir * w * 0.22, hh * 1.1);
        c.strokeStyle = "rgba(90,150,210,.35)"; c.lineWidth = 1;
        for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(dir * (w * 0.22 * i / 6), -hh * 0.55); c.lineTo(dir * (w * 0.22 * i / 6), hh * 0.55); c.stroke(); }
        for (let i = 1; i < 3; i++) { c.beginPath(); c.moveTo(0, -hh * 0.55 + hh * 1.1 * i / 3); c.lineTo(dir * w * 0.22, -hh * 0.55 + hh * 1.1 * i / 3); c.stroke(); }
        c.fillStyle = "rgba(120,180,255,.06)"; c.fillRect(0, -hh * 0.55, dir * w * 0.22, hh * 0.35);
        c.restore();
      };
      wing(w * 0.08, -1); wing(w * 0.92, 1);
      // windows
      flick = [];
      const wr = mulberry(9);
      for (let x = w * 0.02; x < w * 0.98; x += 18) {
        const lit = wr();
        if (lit < 0.55) {
          const teal = wr() < 0.45;
          c.fillStyle = teal ? "rgba(120,235,220,.85)" : "rgba(255,214,160,.85)";
          c.fillRect(x, y0 - hh * 0.05, 6, 4);
          if (wr() < 0.12) flick.push({ x, y: y0 - hh * 0.05, ph: wr() * TAU, teal });
        }
        if (wr() < 0.35) { c.fillStyle = "rgba(255,214,160,.55)"; c.fillRect(x + 4, y0 + hh * 0.18, 5, 3); }
      }
      c.restore();
      sparks = [];
    };
    s.draw = (ctx, w, h, t, dt, px, py, live) => {
      ctx.drawImage(bg, -w * 0.04 + px * 0.2, -h * 0.04 + py * 0.2);
      drawStars(ctx, stars, w, h * 0.72, t, px * 0.5, py * 0.5);
      ctx.drawImage(station, px * 0.9, py * 0.9);
      const y0 = h * 0.76, hh = clamp(h * 0.15, 64, 140);
      // flickering windows
      for (const f of flick) {
        ctx.globalAlpha = 0.3 + 0.7 * (Math.sin(t * 7 + f.ph) > 0.6 ? 1 : 0.3);
        ctx.fillStyle = f.teal ? "#7aebdc" : "#ffd6a0";
        ctx.fillRect(f.x + px * 0.9 - (y0 - f.y) * 0.035, f.y + py * 0.9 + (f.x - w * 0.5) * 0.035, 6, 4);
      }
      ctx.globalAlpha = 1;
      // beacons
      const beacon = (x, y, col, sp, ph) => {
        const a = Math.max(0, Math.sin(t * sp + ph));
        const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
        g.addColorStop(0, col.replace("A", (a * 0.9).toFixed(2))); g.addColorStop(1, col.replace("A", "0"));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill();
      };
      beacon(w * 0.34 + px * 0.9, y0 - hh * 1.75 + py * 0.9 + (w * 0.34 - w * 0.5) * 0.035, "rgba(255,70,70,A)", 2.2, 0);
      beacon(w * 0.905 + px * 0.9, y0 - hh * 0.2 + py * 0.9 + (w * 0.4) * 0.035, "rgba(80,255,150,A)", 1.6, 2);
      // EVA crewmate welding a hull plate: sparks
      const ex = w * 0.56 + px * 0.9, ey = y0 - hh * 0.5 + py * 0.9 + (w * 0.06) * 0.035;
      const csize = clamp(hh * 0.42, 26, 60);
      drawCrew(ctx, ex - csize * 1.05, ey - csize * 1.02, csize, { fill: "#0b0f18", visor: "#2a5d6b", rim: "rgba(120,235,220,.3)", rimW: 2, glint: "rgba(200,255,250,.5)" });
      const burst = Math.sin(t * 1.3) > 0.55;
      if (burst && live) {
        for (let i = 0; i < (q0.mob ? 2 : 4); i++) sparks.push({ x: ex, y: ey, vx: (Math.random() - 0.3) * 120, vy: -Math.random() * 90, life: 0.4 + Math.random() * 0.5, age: 0 });
        const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 60);
        g.addColorStop(0, "rgba(220,255,250," + (0.5 + Math.random() * 0.4) + ")"); g.addColorStop(1, "rgba(120,235,220,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, 60, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = "#ffe9b0";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.age += dt; if (sp.age > sp.life) { sparks.splice(i, 1); continue; }
        sp.x += sp.vx * dt; sp.y += sp.vy * dt; sp.vy += 60 * dt;
        ctx.globalAlpha = 1 - sp.age / sp.life; ctx.fillRect(sp.x, sp.y, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;
    };
    return s;
  }

  /* -------------------------------------------------- nebula + lone crewmate */
  function NebulaScene() {
    const rand = mulberry(97);
    let stars, far, dust, neb, glow;
    const s = {};
    s.init = (w, h, q) => {
      stars = makeStars(rand, q.stars, 0.1);
      far = makeStars(rand, Math.round(q.stars * 0.8), 0.1).map((x) => ({ ...x, r: 0.45, a: x.a * 0.5, d: 0.2 }));
      dust = [];
      for (let i = 0; i < q.particles; i++) dust.push({ x: rand(), y: rand(), r: 0.8 + rand() * 1.4, a: 0.15 + rand() * 0.3, vx: (rand() - 0.5) * 0.006, vy: -0.003 - rand() * 0.005, d: 0.7 + rand() * 0.8 });
    };
    s.build = (w, h) => {
      const sc = 0.28;
      neb = offscreen(w * 1.16 * sc, h * 1.16 * sc);
      const c = neb.getContext("2d"), bw = neb.width, bh = neb.height;
      c.fillStyle = "#050409"; c.fillRect(0, 0, bw, bh);
      const nr = mulberry(3);
      const blob = (x, y, r, col, a) => {
        const g = c.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, col.replace("A", a)); g.addColorStop(0.55, col.replace("A", a * 0.35)); g.addColorStop(1, col.replace("A", 0));
        c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
      };
      const cols = ["rgba(96,48,170,A)", "rgba(150,50,140,A)", "rgba(60,60,170,A)", "rgba(120,40,110,A)", "rgba(70,30,120,A)"];
      for (let i = 0; i < 46; i++) {
        const ang = nr() * TAU, dist = nr() * 0.42;
        const x = bw * (0.5 + Math.cos(ang) * dist * 1.3), y = bh * (0.42 + Math.sin(ang) * dist * 0.9);
        blob(x, y, bw * (0.08 + nr() * 0.22), cols[i % cols.length], 0.1 + nr() * 0.18);
      }
      blob(bw * 0.58, bh * 0.36, bw * 0.16, "rgba(235,200,255,A)", 0.32);
      blob(bw * 0.36, bh * 0.5, bw * 0.1, "rgba(255,170,230,A)", 0.22);
      // dark dust lanes
      for (let i = 0; i < 12; i++) blob(bw * nr(), bh * (0.2 + nr() * 0.6), bw * (0.05 + nr() * 0.12), "rgba(5,4,10,A)", 0.35 + nr() * 0.3);
      // backlight behind the crewmate
      glow = offscreen(w, h);
      const g = glow.getContext("2d");
      const rg = g.createRadialGradient(w * 0.5, h * 0.62, 0, w * 0.5, h * 0.62, h * 0.42);
      rg.addColorStop(0, "rgba(190,140,255,.42)"); rg.addColorStop(0.5, "rgba(120,70,200,.16)"); rg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = rg; g.fillRect(0, 0, w, h);
    };
    s.draw = (ctx, w, h, t, dt, px, py) => {
      const breathe = 1 + Math.sin(t * 0.15) * 0.012;
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5); ctx.scale(breathe, breathe);
      ctx.drawImage(neb, -w * 0.58 + px * 0.3, -h * 0.58 + py * 0.3, w * 1.16, h * 1.16);
      ctx.restore();
      drawStars(ctx, far, w, h, t, px * 0.2, py * 0.2);
      drawStars(ctx, stars, w, h, t, px * 0.55, py * 0.55);
      ctx.fillStyle = "#e6d4ff";
      for (const d of dust) {
        d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.y < -0.02) { d.y = 1.02; d.x = rand(); }
        if (d.x < -0.02) d.x = 1.02; if (d.x > 1.02) d.x = -0.02;
        ctx.globalAlpha = d.a; ctx.fillRect(d.x * w + px * d.d, d.y * h + py * d.d, d.r, d.r);
      }
      ctx.globalAlpha = 0.9 + Math.sin(t * 0.5) * 0.1;
      ctx.drawImage(glow, px * 0.6, py * 0.6);
      ctx.globalAlpha = 1;
      const size = clamp(h * 0.19, 90, 190);
      const x = w * 0.5 - size * 0.55 + px * 1.2, y = h * 0.62 - size * 0.6 + py * 1.2 + Math.sin(t * 0.55) * 5;
      drawCrew(ctx, x, y, size, { fill: "#0b0814", visor: "#191434", rim: "rgba(214,170,255,.55)", rimW: 1.8, glint: "rgba(220,190,255,.28)", rot: Math.sin(t * 0.3) * 0.03 });
    };
    return s;
  }

  /* ------------------------------------------------ moonlit ridge, werewolf */
  function MoonScene() {
    const rand = mulberry(59);
    let stars, bg, layers, clouds, flies, W, H, q0;
    const s = {};
    s.init = (w, h, q) => {
      q0 = q;
      stars = makeStars(rand, Math.round(q.stars * 0.8), 0.08);
      clouds = [];
      for (let i = 0; i < (q.mob ? 4 : 7); i++) clouds.push({ x: rand() * 1.4 - 0.2, y: 0.12 + rand() * 0.38, w: 0.18 + rand() * 0.3, h: 0.03 + rand() * 0.05, a: 0.08 + rand() * 0.12, v: 0.006 + rand() * 0.01 });
      flies = [];
      for (let i = 0; i < (q.mob ? 10 : 22); i++) flies.push({ x: rand(), y: 0.66 + rand() * 0.3, ph: rand() * TAU, sp: 0.4 + rand() * 0.8, r: 1 + rand() * 1.2 });
    };
    s.build = (w, h) => {
      W = w; H = h;
      bg = offscreen(w * 1.08, h * 1.08);
      let c = bg.getContext("2d"), bw = bg.width, bh = bg.height;
      const sky = c.createLinearGradient(0, 0, 0, bh);
      sky.addColorStop(0, "#03040c"); sky.addColorStop(0.5, "#0a1228"); sky.addColorStop(0.82, "#1a2a4d"); sky.addColorStop(1, "#2b3d63");
      c.fillStyle = sky; c.fillRect(0, 0, bw, bh);
      // moon + halo
      const portrait = bh > bw;
      const mx = bw * (portrait ? 0.85 : 0.72), my = bh * (portrait ? 0.112 : 0.3), mr = clamp(bw * (portrait ? 0.075 : 0.07), 26, 110);
      const halo = c.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 5);
      halo.addColorStop(0, "rgba(210,220,255,.35)"); halo.addColorStop(0.3, "rgba(160,180,240,.12)"); halo.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = halo; c.fillRect(0, 0, bw, bh);
      const disc = c.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.2, mx, my, mr);
      disc.addColorStop(0, "#f4f2e8"); disc.addColorStop(0.8, "#dedbcc"); disc.addColorStop(1, "#b9b7a8");
      c.fillStyle = disc; c.beginPath(); c.arc(mx, my, mr, 0, TAU); c.fill();
      const cr = [[-0.35, -0.2, 0.2], [0.25, 0.1, 0.28], [-0.1, 0.45, 0.14], [0.45, -0.4, 0.12], [-0.5, 0.3, 0.1], [0.05, -0.55, 0.09], [0.55, 0.45, 0.08]];
      for (const k of cr) {
        const g = c.createRadialGradient(mx + k[0] * mr, my + k[1] * mr, 0, mx + k[0] * mr, my + k[1] * mr, k[2] * mr);
        g.addColorStop(0, "rgba(120,118,105,.35)"); g.addColorStop(0.8, "rgba(120,118,105,.22)"); g.addColorStop(1, "rgba(120,118,105,0)");
        c.fillStyle = g; c.beginPath(); c.arc(mx + k[0] * mr, my + k[1] * mr, k[2] * mr, 0, TAU); c.fill();
      }
      // hill layers with parallax factors
      layers = [];
      const spec = [
        { base: 0.62, amp: 0.1, col: "#111a34", d: 0.35, trees: 0, seed: 1 },
        { base: 0.72, amp: 0.09, col: "#0a1024", d: 0.6, trees: 0.5, seed: 2 },
        { base: 0.84, amp: 0.07, col: "#04060d", d: 1.0, trees: 1, seed: 3 }
      ];
      for (const sp of spec) {
        const lc = offscreen(w * 1.16, h * 1.16);
        const lctx = lc.getContext("2d");
        const lw = lc.width, lh = lc.height;
        const f = fbm(mulberry(sp.seed * 17), 3);
        const ridge = (x) => lh * (sp.base + (f(x / lw * 6) - 0.5) * sp.amp * 2);
        lctx.fillStyle = sp.col; lctx.beginPath(); lctx.moveTo(0, lh);
        for (let x = 0; x <= lw; x += 4) lctx.lineTo(x, ridge(x));
        lctx.lineTo(lw, lh); lctx.closePath(); lctx.fill();
        if (sp.trees) {
          const tr = mulberry(sp.seed * 31);
          for (let x = 0; x < lw; x += 6 + tr() * 10) {
            if (tr() > sp.trees * 0.9) continue;
            const th = (18 + tr() * 30) * (sp.trees) * (w / 1000 + 0.5);
            const y = ridge(x) + 4;
            lctx.beginPath(); lctx.moveTo(x, y - th); lctx.lineTo(x - th * 0.3, y); lctx.lineTo(x + th * 0.3, y); lctx.closePath(); lctx.fill();
            lctx.beginPath(); lctx.moveTo(x, y - th * 0.7); lctx.lineTo(x - th * 0.38, y - th * 0.1); lctx.lineTo(x + th * 0.38, y - th * 0.1); lctx.closePath(); lctx.fill();
          }
        }
        layers.push({ c: lc, d: sp.d, ridge, sp });
      }
      // fog band baked into the mid layer offset
      const fog = offscreen(w * 1.16, h * 0.2);
      const fc = fog.getContext("2d");
      const fg = fc.createLinearGradient(0, 0, 0, fog.height);
      fg.addColorStop(0, "rgba(110,130,190,0)"); fg.addColorStop(0.5, "rgba(110,130,190,.16)"); fg.addColorStop(1, "rgba(110,130,190,0)");
      fc.fillStyle = fg; fc.fillRect(0, 0, fog.width, fog.height);
      layers.fog = fog;
    };
    s.draw = (ctx, w, h, t, dt, px, py) => {
      ctx.drawImage(bg, -w * 0.04 + px * 0.2, -h * 0.04 + py * 0.2);
      drawStars(ctx, stars, w, h * 0.7, t, px * 0.4, py * 0.4);
      // clouds
      for (const cl of clouds) {
        cl.x += cl.v * dt; if (cl.x > 1.3) cl.x = -0.35;
        const cx = cl.x * w + px * 0.3, cy = cl.y * h + py * 0.3, cw = cl.w * w, ch = cl.h * h;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cw);
        g.addColorStop(0, "rgba(170,185,225," + cl.a + ")"); g.addColorStop(0.6, "rgba(170,185,225," + (cl.a * 0.4) + ")"); g.addColorStop(1, "rgba(170,185,225,0)");
        ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ch / cw); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, cw, 0, TAU); ctx.fill(); ctx.restore();
      }
      const off = (d) => [-w * 0.08 + px * d, -h * 0.08 + py * d];
      let o = off(layers[0].d); ctx.drawImage(layers[0].c, o[0], o[1]);
      o = off(layers[1].d); ctx.drawImage(layers[1].c, o[0], o[1]);
      ctx.drawImage(layers.fog, -w * 0.08 + px * 0.7 + Math.sin(t * 0.1) * 20, h * 0.66 + py * 0.7);
      // fireflies between mid and near layers
      for (const f of flies) {
        const fx_ = (f.x + Math.sin(t * f.sp * 0.3 + f.ph) * 0.03) * w + px * 0.9;
        const fy = (f.y + Math.cos(t * f.sp * 0.4 + f.ph) * 0.02) * h + py * 0.9;
        const a = Math.max(0, Math.sin(t * f.sp * 1.7 + f.ph));
        if (a < 0.05) continue;
        const g = ctx.createRadialGradient(fx_, fy, 0, fx_, fy, f.r * 5);
        g.addColorStop(0, "rgba(210,255,140," + (a * 0.9) + ")"); g.addColorStop(0.3, "rgba(190,240,100," + (a * 0.35) + ")"); g.addColorStop(1, "rgba(190,240,100,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx_, fy, f.r * 5, 0, TAU); ctx.fill();
      }
      // werewolf on the near ridge, looking up at the moon
      const near = layers[2];
      o = off(near.d);
      const wx = w * 0.28, size = clamp(h * 0.15, 70, 150);
      const ry = near.ridge(wx + w * 0.08 - px * near.d) + o[1];
      drawCrew(ctx, wx + o[0] + w * 0.08 - size * 0.5, ry - size * 1.17, size, {
        fill: "#04060d", visor: "rgba(60,20,30,1)", rim: "rgba(190,205,245,.45)", rimW: 1.4, ears: true, tail: true,
        glint: "rgba(255,70,60,.75)", rot: -0.06 + Math.sin(t * 0.8) * 0.01
      });
      ctx.drawImage(near.c, o[0], o[1]);
    };
    return s;
  }

  /* ------------------------------------------- the two Atlas maps as one land */
  function AtlasScene() {
    const rand = mulberry(83);
    let stars, bg, far, mid, near, smoke = [], embers = [], flies, q0, geo;
    const s = {};
    s.init = (w, h, q) => {
      q0 = q; stars = makeStars(rand, Math.round(q.stars * 0.6), 0.06);
      flies = [];
      for (let i = 0; i < (q.mob ? 8 : 16); i++) flies.push({ x: 0.3 + rand() * 0.7, y: 0.72 + rand() * 0.2, ph: rand() * TAU, sp: 0.4 + rand() * 0.8 });
    };
    s.build = (w, h) => {
      bg = offscreen(w * 1.08, h * 1.08);
      let c = bg.getContext("2d"), bw = bg.width, bh = bg.height;
      const sky = c.createLinearGradient(0, 0, 0, bh);
      sky.addColorStop(0, "#070a18"); sky.addColorStop(0.45, "#152040"); sky.addColorStop(0.72, "#3b3f66"); sky.addColorStop(0.86, "#8a5a4a");
      c.fillStyle = sky; c.fillRect(0, 0, bw, bh);
      const g = c.createRadialGradient(bw * 0.2, bh * 0.86, 0, bw * 0.2, bh * 0.86, bw * 0.55);
      g.addColorStop(0, "rgba(255,160,90,.55)"); g.addColorStop(0.4, "rgba(230,110,70,.2)"); g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g; c.fillRect(0, 0, bw, bh);

      geo = { hor: h * 0.72 };
      // far: museum on its hill + tree line
      far = offscreen(w * 1.12, h * 1.12);
      c = far.getContext("2d");
      const fw = far.width, fh = far.height;
      const f1 = fbm(mulberry(5), 3);
      c.fillStyle = "#151a30"; c.beginPath(); c.moveTo(0, fh);
      for (let x = 0; x <= fw; x += 4) c.lineTo(x, fh * (0.7 + (f1(x / fw * 4) - 0.5) * 0.12));
      c.lineTo(fw, fh); c.closePath(); c.fill();
      // the Vesper Museum, after closing time
      const mx = fw * 0.22, my = fh * 0.66, mw = clamp(fw * 0.2, 150, 300), mh = mw * 0.34;
      c.fillStyle = "#0d1122";
      c.fillRect(mx - mw / 2, my - mh, mw, mh);                        // main block
      c.beginPath(); c.moveTo(mx - mw * 0.36, my - mh); c.lineTo(mx, my - mh - mw * 0.13); c.lineTo(mx + mw * 0.36, my - mh); c.closePath(); c.fill(); // pediment
      c.beginPath(); c.arc(mx, my - mh - mw * 0.06, mw * 0.14, Math.PI, TAU); c.fill(); // dome
      c.fillRect(mx - mw * 0.02, my - mh - mw * 0.24, mw * 0.04, mw * 0.06);
      c.fillRect(mx - mw * 0.6, my - mh * 0.55, mw * 1.2, mh * 0.55);   // wings
      c.fillStyle = "#151a30";
      for (let i = 0; i < 6; i++) c.fillRect(mx - mw * 0.32 + i * mw * 0.116, my - mh * 0.92, mw * 0.035, mh * 0.85); // column gaps
      c.fillStyle = "rgba(255,200,120,.85)"; c.fillRect(mx + mw * 0.44, my - mh * 0.34, mw * 0.05, mh * 0.16); // one lit window
      c.fillStyle = "rgba(255,200,120,.25)"; c.fillRect(mx - mw * 0.02, my - mh * 0.7, mw * 0.04, mh * 0.5);
      // steps
      c.fillStyle = "#0d1122"; c.fillRect(mx - mw * 0.42, my - 3, mw * 0.84, 3); c.fillRect(mx - mw * 0.46, my, mw * 0.92, 3);

      // mid: the clearing with the station
      mid = offscreen(w * 1.12, h * 1.12);
      c = mid.getContext("2d");
      const f2 = fbm(mulberry(8), 3);
      c.fillStyle = "#0a0f1c"; c.beginPath(); c.moveTo(0, fh);
      for (let x = 0; x <= fw; x += 4) c.lineTo(x, fh * (0.78 + (f2(x / fw * 5) - 0.5) * 0.06));
      c.lineTo(fw, fh); c.closePath(); c.fill();
      // pine line on the mid ridge
      const tr = mulberry(12);
      for (let x = 0; x < fw; x += 5 + tr() * 8) {
        const y = fh * (0.78 + (f2(x / fw * 5) - 0.5) * 0.06) + 3, th = (14 + tr() * 26) * (w / 1000 + 0.5);
        c.beginPath(); c.moveTo(x, y - th); c.lineTo(x - th * 0.32, y); c.lineTo(x + th * 0.32, y); c.closePath(); c.fill();
      }
      const gy = fh * 0.86;
      c.fillStyle = "#0b1220"; c.fillRect(0, gy - 20, fw, fh);
      // cabins
      const cabin = (x, y, cw, ch, lit) => {
        c.fillStyle = "#07090f"; c.fillRect(x, y - ch, cw, ch);
        c.beginPath(); c.moveTo(x - cw * 0.08, y - ch); c.lineTo(x + cw / 2, y - ch - cw * 0.32); c.lineTo(x + cw * 1.08, y - ch); c.closePath(); c.fill();
        c.strokeStyle = "rgba(120,90,60,.25)"; c.lineWidth = 1;
        for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(x, y - ch * i / 5); c.lineTo(x + cw, y - ch * i / 5); c.stroke(); }
        c.fillStyle = "#0a0c12"; c.fillRect(x + cw * 0.7, y - ch - cw * 0.26, cw * 0.09, cw * 0.14); // chimney
        for (const wnd of lit) { c.fillStyle = "rgba(255,190,110,.9)"; c.fillRect(x + cw * wnd[0], y - ch * wnd[1], cw * 0.14, ch * 0.22); }
      };
      const cb = clamp(w * 0.11, 80, 150);
      cabin(fw * 0.52, gy, cb, cb * 0.5, [[0.18, 0.7], [0.62, 0.7]]);
      cabin(fw * 0.7, gy + 10, cb * 0.8, cb * 0.42, [[0.4, 0.66]]);
      cabin(fw * 0.36, gy + 6, cb * 0.7, cb * 0.38, [[0.2, 0.62]]);
      // radio mast
      const rx = fw * 0.84, mhh = clamp(h * 0.34, 120, 260);
      c.strokeStyle = "#0b0e16"; c.lineWidth = 2;
      c.beginPath(); c.moveTo(rx - 9, gy); c.lineTo(rx, gy - mhh); c.lineTo(rx + 9, gy); c.stroke();
      c.lineWidth = 1;
      for (let i = 1; i < 9; i++) { const yy = gy - mhh * i / 9, hw = 9 * (1 - i / 9); c.beginPath(); c.moveTo(rx - hw, yy); c.lineTo(rx + hw, yy); c.stroke(); }
      // water tower
      const wx = fw * 0.93, wy = gy - clamp(h * 0.16, 60, 120);
      c.fillStyle = "#07090f";
      c.fillRect(wx - 12, wy - 22, 24, 22); c.beginPath(); c.ellipse(wx, wy - 22, 12, 4, 0, 0, TAU); c.fill();
      c.strokeStyle = "#07090f"; c.lineWidth = 2;
      c.beginPath(); c.moveTo(wx - 10, wy); c.lineTo(wx - 14, gy); c.moveTo(wx + 10, wy); c.lineTo(wx + 14, gy); c.moveTo(wx - 12, wy + 18); c.lineTo(wx + 12, wy + 18); c.stroke();
      // fence
      c.strokeStyle = "rgba(20,24,36,1)"; c.lineWidth = 2;
      for (let x = fw * 0.3; x < fw * 0.98; x += 14) { c.beginPath(); c.moveTo(x, gy + 22); c.lineTo(x, gy + 8); c.stroke(); }
      c.beginPath(); c.moveTo(fw * 0.3, gy + 13); c.lineTo(fw * 0.98, gy + 13); c.stroke();
      geo.cabinTop = { x: (fw * 0.52 + cb * 0.745) / 1.12, y: (gy - cb * 0.5 - cb * 0.26) / 1.12 };
      geo.mast = { x: rx / 1.12, y: (gy - mhh) / 1.12 };
      geo.fire = { x: fw * 0.62 / 1.12, y: (gy + 34) / 1.12 };

      // near: dark grass with tufts
      near = offscreen(w * 1.12, h * 1.12);
      c = near.getContext("2d");
      const f3 = fbm(mulberry(21), 2);
      c.fillStyle = "#03050a"; c.beginPath(); c.moveTo(0, fh);
      for (let x = 0; x <= fw; x += 3) c.lineTo(x, fh * (0.93 + (f3(x / fw * 8) - 0.5) * 0.03));
      c.lineTo(fw, fh); c.closePath(); c.fill();
      const gr = mulberry(33);
      c.strokeStyle = "#03050a"; c.lineWidth = 1.4;
      for (let i = 0; i < fw / 3; i++) {
        const x = gr() * fw, y = fh * (0.93 + (f3(x / fw * 8) - 0.5) * 0.03) + 2, th = 5 + gr() * 12;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + (gr() - 0.5) * 6, y - th); c.stroke();
      }
      smoke = []; embers = [];
    };
    s.draw = (ctx, w, h, t, dt, px, py, live) => {
      ctx.drawImage(bg, -w * 0.04 + px * 0.15, -h * 0.04 + py * 0.15);
      drawStars(ctx, stars, w, h * 0.55, t, px * 0.3, py * 0.3);
      ctx.drawImage(far, -w * 0.06 + px * 0.35, -h * 0.06 + py * 0.35);
      ctx.drawImage(mid, -w * 0.06 + px * 0.7, -h * 0.06 + py * 0.7);
      const ox = -w * 0.06 + px * 0.7, oy = -h * 0.06 + py * 0.7;
      // chimney smoke
      if (live && Math.random() < dt * 3) smoke.push({ x: 0, y: 0, r: 3 + Math.random() * 3, age: 0, life: 4 + Math.random() * 3, drift: 8 + Math.random() * 10 });
      for (let i = smoke.length - 1; i >= 0; i--) {
        const sm = smoke[i]; sm.age += dt; if (sm.age > sm.life) { smoke.splice(i, 1); continue; }
        const p = sm.age / sm.life;
        const x = geo.cabinTop.x * 1.12 + ox + sm.drift * sm.age + Math.sin(sm.age * 1.3) * 4, y = geo.cabinTop.y * 1.12 + oy - 22 * sm.age;
        ctx.fillStyle = "rgba(170,175,190," + (0.22 * (1 - p)) + ")";
        ctx.beginPath(); ctx.arc(x, y, sm.r + p * 16, 0, TAU); ctx.fill();
      }
      // mast beacon
      const ba = Math.max(0, Math.sin(t * 2.4));
      let g = ctx.createRadialGradient(geo.mast.x * 1.12 + ox, geo.mast.y * 1.12 + oy, 0, geo.mast.x * 1.12 + ox, geo.mast.y * 1.12 + oy, 12);
      g.addColorStop(0, "rgba(255,70,60," + ba + ")"); g.addColorStop(1, "rgba(255,70,60,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(geo.mast.x * 1.12 + ox, geo.mast.y * 1.12 + oy, 12, 0, TAU); ctx.fill();
      // campfire
      const fxp = geo.fire.x * 1.12 + ox, fyp = geo.fire.y * 1.12 + oy;
      const fl = 0.75 + Math.sin(t * 9) * 0.12 + Math.sin(t * 23) * 0.08;
      g = ctx.createRadialGradient(fxp, fyp, 0, fxp, fyp, 90 * fl);
      g.addColorStop(0, "rgba(255,190,90,.55)"); g.addColorStop(0.35, "rgba(255,120,50,.22)"); g.addColorStop(1, "rgba(255,90,40,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fxp, fyp, 90 * fl, 0, TAU); ctx.fill();
      ctx.fillStyle = "#ffd27a";
      ctx.beginPath(); ctx.moveTo(fxp - 5, fyp); ctx.quadraticCurveTo(fxp - 6, fyp - 10 * fl, fxp, fyp - 16 * fl); ctx.quadraticCurveTo(fxp + 6, fyp - 10 * fl, fxp + 5, fyp); ctx.closePath(); ctx.fill();
      if (live && Math.random() < dt * 6) embers.push({ x: fxp, y: fyp - 6, vx: (Math.random() - 0.5) * 14, vy: -18 - Math.random() * 20, age: 0, life: 1.2 + Math.random() * 1.4 });
      ctx.fillStyle = "#ffb060";
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]; e.age += dt; if (e.age > e.life) { embers.splice(i, 1); continue; }
        e.x += e.vx * dt + Math.sin(e.age * 5) * 0.3; e.y += e.vy * dt;
        ctx.globalAlpha = 1 - e.age / e.life; ctx.fillRect(e.x, e.y, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;
      // fireflies
      for (const f of flies) {
        const a = Math.max(0, Math.sin(t * f.sp * 1.6 + f.ph));
        if (a < 0.05) continue;
        const x = (f.x + Math.sin(t * f.sp * 0.3 + f.ph) * 0.02) * w + px * 0.9, y = (f.y + Math.cos(t * f.sp * 0.5 + f.ph) * 0.015) * h + py * 0.9;
        g = ctx.createRadialGradient(x, y, 0, x, y, 6);
        g.addColorStop(0, "rgba(220,255,150," + a * 0.9 + ")"); g.addColorStop(0.4, "rgba(200,240,110," + a * 0.3 + ")"); g.addColorStop(1, "rgba(200,240,110,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill();
      }
      ctx.drawImage(near, -w * 0.06 + px * 1.1, -h * 0.06 + py * 1.1);
    };
    return s;
  }

  const SCENES = {
    home: () => SpaceScene("home"), test: () => SpaceScene("test"),
    chance: DiceScene, useful: StationScene, unknowns: NebulaScene, nightfall: MoonScene, atlas: AtlasScene
  };

  /* ================================================================ engine */
  function quality() {
    const mob = innerWidth < 760 || mqCoarse.matches;
    const dpr = Math.min(devicePixelRatio || 1, mob ? 1.5 : 1.75);
    return { mob, scale: dpr * (mob ? 0.6 : 0.9), stars: mob ? 110 : 280, particles: mob ? 18 : 60, fps: mob ? 30 : 60 };
  }

  function Hero(root, sceneKey) {
    const scene = (SCENES[sceneKey] || SCENES.home)();
    let holder = root.querySelector(".hero-scene");
    if (!holder) {
      holder = document.createElement("div");
      holder.className = "hero-scene";
      holder.setAttribute("aria-hidden", "true");
      holder.innerHTML = "<canvas></canvas><div class=\"hero-grain\"></div>";
      root.prepend(holder);
    }
    const canvas = holder.querySelector("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    const content = root.querySelector(".hero-content");
    let q = quality(), W = 0, H = 0, raf = 0, last = 0, t = 0, visible = true, dead = false;
    let ptx = 0, pty = 0, cpx = 0, cpy = 0, frameGap = 1000 / q.fps, acc = 0;
    scene.init(0, 0, q);

    function size() {
      const r = holder.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * q.scale)), h = Math.max(1, Math.round(r.height * q.scale));
      if (w === W && h === H) return;
      W = w; H = h; canvas.width = w; canvas.height = h;
      scene.build(w, h);
      if (mqReduce.matches || !visible) frame(0, true);
    }
    function frame(now, single) {
      raf = 0;
      if (dead) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      if (!single && q.fps < 60) {
        acc += dt * 1000;
        if (acc < frameGap) { raf = requestAnimationFrame(frame); return; }
        acc = 0;
      }
      t += dt;
      const ease = 1 - Math.pow(0.001, dt);
      cpx += (ptx - cpx) * ease * 0.5; cpy += (pty - cpy) * ease * 0.5;
      const px = cpx * 18 * q.scale, py = cpy * 12 * q.scale;
      scene.draw(ctx, W, H, t, dt, px, py, !single);
      if (!single && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }
    function play() {
      if (dead || raf || mqReduce.matches || !visible || document.hidden) return;
      last = 0; raf = requestAnimationFrame(frame);
    }
    function pause() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    const io = new IntersectionObserver((en) => {
      visible = en[0].isIntersecting;
      if (visible) { play(); onScroll(); } else pause();
    }, { threshold: 0.02 });
    io.observe(root);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => { q = quality(); frameGap = 1000 / q.fps; size(); });
    ro.observe(holder);
    const onMove = (e) => {
      if (!fx || !mqFine.matches) { ptx = pty = 0; return; }
      ptx = (e.clientX / innerWidth - 0.5) * 2; pty = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    let sraf = 0;
    const onScroll = () => {
      if (sraf) return;
      sraf = requestAnimationFrame(() => {
        sraf = 0;
        const y = Math.max(0, scrollY);
        holder.style.transform = "translate3d(0," + (y * 0.35).toFixed(1) + "px,0)";
        if (content) {
          content.style.transform = "translate3d(0," + (y * 0.18).toFixed(1) + "px,0)";
          content.style.opacity = String(clamp(1 - y / (root.offsetHeight * 0.9), 0, 1));
        }
      });
    };
    if (!mqReduce.matches) window.addEventListener("scroll", onScroll, { passive: true });
    size();
    play();
    onScroll();

    return {
      destroy() {
        dead = true; pause(); io.disconnect(); ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
      },
      play, pause
    };
  }

  function mount() {
    if (inst) { inst.destroy(); inst = null; }
    const root = document.querySelector(".hero");
    if (!root) return;
    inst = Hero(root, root.dataset.scene || document.body.dataset.page || "home");
  }
  function setFx(on) { fx = !!on; }
  mqReduce.addEventListener("change", mount);

  window.TORHERO = { mount, setFx };
})();
