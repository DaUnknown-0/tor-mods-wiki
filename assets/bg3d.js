/* ============================================================================
 * TOR Mods Wiki: the 3D background (three.js 0.169, self-hosted in vendor/)
 * One engine, one scene per page, all drawn as fine wireframes in the side
 * gutters so the reading column stays clear:
 *   home       a field of crewmates and the other mods' motifs drifting past
 *   chance     a roulette wheel the scroll spins, dice tumbling down beside it
 *   useful     gear trains in mesh, driven by the scroll like a crank
 *   unknowns   a crewmate made of points that scatters when you scroll fast
 *   nightfall  a walk through a night forest, moon above, eyes in the dark
 *   atlas      two dioramas (museum rotunda, forest cabin) that build up as
 *              you read and turn with the scroll
 *   test       the home field with crewmates and rocks
 * Over every page stands the emblem: a point cloud in the shape of the chapter
 * being read (a knife for an Impostor role, the rotunda for the maps) that
 * flies over into the next shape when the section changes, while the
 * background picks up a faint tint of that chapter. The cloud gives way around
 * the pointer; a click on an empty part of the page sends a ring and a wave
 * through dust and cloud and turns the emblem into the next shape.
 * The engine owns the renderer, theme colours, dust, the scroll spring (the
 * camera lags a little and settles), the scroll speed (spin-up, dust streaks,
 * camera roll) and the render loop (every frame while moving, ~30 fps at rest,
 * nothing while the hero fills the screen). Motion needs FX on and no
 * prefers-reduced-motion; otherwise one still frame. The accent colour comes
 * from scroll.js (TORSCROLL.accent(): on the home page the mod row in view).
 * ==========================================================================*/
import * as THREE from "./vendor/three.module.min.js";

const doc = document;
const root = doc.documentElement;
const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
const mqFine = matchMedia("(pointer: fine)");
const PAGE = doc.body.dataset.page || "home";
const moving = () => root.dataset.fx !== "off" && !mqReduce.matches;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const TAU = Math.PI * 2;

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
const rand = mulberry(PAGE.length * 7919 + 17);
const pick = (arr) => arr[(rand() * arr.length) | 0];
const wrap = (v, span) => ((((v + span / 2) % span) + span) % span) - span / 2;

function cssColor(el, name, fallback) {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
}

let renderer = null;
try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" }); } catch (e) { renderer = null; }
if (renderer) boot();

function boot() {
  const canvas = renderer.domElement;
  canvas.id = "bg3d";
  canvas.setAttribute("aria-hidden", "true");
  doc.body.prepend(canvas);
  root.classList.add("has-bg3d");

  const scene = new THREE.Scene();
  const FOV = 48;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 140);
  const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  scene.fog = new THREE.Fog(0xffffff, 8, 34);

  /* ------------------------------------------------------ materials */
  const mats = [];
  function lineMat(kind, color, k = 1) {
    const m = new THREE.LineBasicMaterial({ color, transparent: true, depthWrite: false, fog: true });
    m.userData.kind = kind; m.userData.k = k;
    mats.push(m);
    return m;
  }
  function pointMat(kind, size, k = 1, fog = true) {
    const m = new THREE.PointsMaterial({ size, sizeAttenuation: false, transparent: true, depthWrite: false, fog });
    m.userData.kind = kind; m.userData.k = k;
    mats.push(m);
    return m;
  }
  const CREW = ["#c51111", "#132ed1", "#117f2d", "#ed54ba", "#ef7d0d", "#f5f557", "#38fedc", "#6b2fbb", "#71491e", "#50ef39"];
  const M = {
    crew: CREW.map((c) => lineMat("crew", new THREE.Color(c))),
    visor: lineMat("visor", new THREE.Color("#7fc8e8"), 1.1),
    ink: lineMat("ink", new THREE.Color(), 0.8),
    inkSoft: lineMat("ink", new THREE.Color(), 0.55),
    acc: lineMat("accent", new THREE.Color(), 1.05),
    accSoft: lineMat("accent", new THREE.Color(), 0.7),
    moon: lineMat("moon", new THREE.Color(), 0.9),
    dust: pointMat("dust", 2, 1),
    cloud: pointMat("accent", 2.2, 1.9),
    cloudVisor: pointMat("visor", 2.2, 2.2),
    firefly: pointMat("firefly", 3, 2.4),
    eyes: pointMat("eyes", 4, 0, false),
  };
  const streakMat = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false, fog: true });

  let W = 1, H = 1, mob = innerWidth < 760, narrow = false, dark = false, sMin = 0.62;
  const ink = new THREE.Color(), bg = new THREE.Color(), bgNow = new THREE.Color(), accent = new THREE.Color(), accentTarget = new THREE.Color();

  function applyTheme() {
    dark = root.dataset.theme === "dark";
    bg.copy(cssColor(doc.body, "--bg", dark ? "#141312" : "#f6f3ec"));
    ink.copy(cssColor(doc.body, "--ink", dark ? "#f1ece1" : "#191816"));
    accentTarget.copy(cssColor(doc.body, "--accent", "#c8323f"));
    accent.copy(accentTarget);
    bgNow.copy(bg);
    renderer.setClearColor(bgNow, 1);
    scene.fog.color.copy(bgNow);
    const a = (dark ? 0.42 : 0.3) * (narrow ? 0.45 : 1);
    for (const m of mats) {
      const k = m.userData.k, kind = m.userData.kind;
      if (kind === "crew") m.opacity = a * 0.95;
      else if (kind === "visor") { m.opacity = a * k; m.color.set(dark ? "#9fdcf5" : "#2f86ad"); }
      else if (kind === "ink") { m.opacity = a * k; m.color.copy(ink); }
      else if (kind === "accent") { m.opacity = clamp(a * k, 0, 1); m.color.copy(accent); }
      else if (kind === "moon") { m.opacity = a * k; m.color.set(dark ? "#e9e4d2" : "#8a8470"); }
      else if (kind === "dust") { m.color.copy(ink); m.opacity = (dark ? 0.55 : 0.32) * (narrow ? 0.6 : 1); }
      else if (kind === "firefly") { m.color.set(dark ? "#f4d77a" : "#b98a16"); m.opacity = clamp(a * k, 0, 1); }
      else if (kind === "eyes") { m.color.set("#ff3b3b"); }
    }
    streakMat.color.copy(ink); streakMat.opacity = dark ? 0.2 : 0.13;
    dirty = true;
  }

  /* ------------------------------------------------------ geometry kit */
  const wire = (geo) => new THREE.WireframeGeometry(geo);
  const edges = (geo, deg = 20) => new THREE.EdgesGeometry(geo, deg);
  function part(group, lines, mat, pos, scale) {
    const l = new THREE.LineSegments(lines, mat);
    if (pos) l.position.set(pos[0], pos[1], pos[2]);
    if (scale) l.scale.set(scale[0], scale[1], scale[2]);
    group.add(l);
    return l;
  }
  // crewmate solids (shared by the wire model and the point cloud)
  function crewSolids() {
    return [
      { geo: new THREE.CapsuleGeometry(0.42, 0.5, 3, 10), pos: [0, 0.08, 0], visor: false, w: 3 },
      { geo: new THREE.SphereGeometry(0.24, 10, 6), pos: [0, 0.32, 0.36], scale: [1.3, 0.72, 0.7], visor: true, w: 0.6 },
      { geo: new THREE.BoxGeometry(0.46, 0.56, 0.24), pos: [0, 0.02, -0.46], visor: false, w: 0.8 },
      { geo: new THREE.CylinderGeometry(0.16, 0.16, 0.36, 8), pos: [-0.2, -0.5, 0], visor: false, w: 0.4 },
      { geo: new THREE.CylinderGeometry(0.16, 0.16, 0.36, 8), pos: [0.2, -0.5, 0], visor: false, w: 0.4 },
    ];
  }
  function crewmate(mat) {
    const g = new THREE.Group();
    const m = mat || pick(M.crew);
    crewSolids().forEach((s, i) => {
      const lines = i < 2 ? wire(s.geo) : edges(s.geo, i > 2 ? 1 : 20);
      part(g, lines, s.visor ? M.visor : m, s.pos, s.scale);
    });
    g.userData.r = 0.75;
    return g;
  }
  function asteroid() {
    const geo = new THREE.IcosahedronGeometry(0.7, 1);
    const p = geo.attributes.position, v = new THREE.Vector3(), jit = new Map();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const key = v.x.toFixed(3) + v.y.toFixed(3) + v.z.toFixed(3);
      if (!jit.has(key)) jit.set(key, 0.78 + rand() * 0.4);
      v.multiplyScalar(jit.get(key));
      p.setXYZ(i, v.x, v.y, v.z);
    }
    const g = new THREE.Group();
    part(g, edges(geo, 8), M.ink);
    g.userData.r = 0.8;
    return g;
  }
  function dice(mat) {
    const g = new THREE.Group(), m = mat || M.acc;
    part(g, edges(new THREE.BoxGeometry(1, 1, 1)), m);
    const pip = edges(new THREE.CircleGeometry(0.08, 8), 1);
    [[0, 0]].forEach(([a, b]) => part(g, pip, m, [a, b, 0.501]));
    [[-0.25, -0.25], [0.25, 0.25]].forEach(([a, b]) => { part(g, pip, m, [0.501, a, b]).rotation.y = Math.PI / 2; });
    [[-0.25, -0.25], [0, 0], [0.25, 0.25]].forEach(([a, b]) => { part(g, pip, m, [a, 0.501, b]).rotation.x = -Math.PI / 2; });
    [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]].forEach(([a, b]) => { part(g, pip, m, [-0.501, a, b]).rotation.y = Math.PI / 2; });
    g.userData.r = 0.9;
    return g;
  }
  function gearSolid(radius, teeth, depth = 0.22, holeK = 0.28, tooth = 0.18) {
    const s = new THREE.Shape(), r0 = radius - tooth * 0.72, r1 = radius + tooth * 0.28;
    for (let i = 0; i < teeth * 2; i++) {
      const a0 = (i / (teeth * 2)) * TAU, a1 = ((i + 1) / (teeth * 2)) * TAU;
      const r = i % 2 ? r0 : r1;
      if (i === 0) s.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
      else s.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
      s.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
    }
    const hole = new THREE.Path(); hole.absarc(0, 0, radius * holeK, 0, TAU, true); s.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 12 });
    geo.translate(0, 0, -depth / 2);
    return geo;
  }
  const gearGeo = (radius, teeth, depth) => edges(gearSolid(radius, teeth, depth), 25);
  function gear(radius = 0.6, mat) {
    const g = new THREE.Group();
    part(g, gearGeo(radius, Math.max(8, Math.round(radius * 16))), mat || (rand() < 0.5 ? M.acc : M.ink));
    // spokes
    const sp = new THREE.BufferGeometry().setFromPoints(
      [0, 1, 2, 3, 4, 5].flatMap((i) => { const a = (i / 6) * TAU; return [new THREE.Vector3(Math.cos(a) * radius * 0.28, Math.sin(a) * radius * 0.28, 0), new THREE.Vector3(Math.cos(a) * radius * 0.78, Math.sin(a) * radius * 0.78, 0)]; })
    );
    part(g, sp, M.inkSoft);
    g.userData.r = radius + 0.1;
    return g;
  }
  function satellite() {
    const g = new THREE.Group();
    part(g, edges(new THREE.BoxGeometry(0.45, 0.45, 0.7)), M.ink);
    part(g, wire(new THREE.PlaneGeometry(1.1, 0.36, 4, 1)), M.acc, [-0.82, 0, 0]);
    part(g, wire(new THREE.PlaneGeometry(1.1, 0.36, 4, 1)), M.acc, [0.82, 0, 0]);
    part(g, edges(new THREE.ConeGeometry(0.18, 0.22, 8, 1, true), 1), M.ink, [0, 0, 0.46]).rotation.x = Math.PI / 2;
    g.userData.r = 1.3;
    return g;
  }
  function crystal() {
    const g = new THREE.Group();
    part(g, edges(new THREE.OctahedronGeometry(0.55, 0), 1), M.acc, null, [0.8, 1.5, 0.8]);
    g.userData.r = 0.8;
    return g;
  }
  function pine(mat, h = 1) {
    const g = new THREE.Group(), m = mat || (rand() < 0.5 ? M.acc : M.ink);
    part(g, edges(new THREE.ConeGeometry(0.55, 0.7, 7), 1), m, [0, 0.1 * h, 0], [1, h, 1]);
    part(g, edges(new THREE.ConeGeometry(0.42, 0.6, 7), 1), m, [0, 0.5 * h, 0], [1, h, 1]);
    part(g, edges(new THREE.ConeGeometry(0.28, 0.5, 7), 1), m, [0, 0.85 * h, 0], [1, h, 1]);
    part(g, edges(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6), 1), M.ink, [0, -0.4, 0]);
    g.userData.r = 0.8;
    return g;
  }
  function column() {
    const g = new THREE.Group();
    part(g, edges(new THREE.CylinderGeometry(0.2, 0.22, 1.6, 10), 1), M.ink);
    part(g, edges(new THREE.BoxGeometry(0.62, 0.14, 0.62)), M.acc, [0, 0.87, 0]);
    part(g, edges(new THREE.BoxGeometry(0.62, 0.14, 0.62)), M.acc, [0, -0.87, 0]);
    g.userData.r = 0.95;
    return g;
  }
  const lines = (pts) => new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])));

  // area-weighted random points on a geometry's surface
  function samplePoints(geo, n, matrix, out) {
    const pos = geo.attributes.position, idx = geo.index;
    const tri = idx ? idx.count / 3 : pos.count / 3;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    const areas = new Float32Array(tri); let total = 0;
    const vi = (t, k) => (idx ? idx.getX(t * 3 + k) : t * 3 + k);
    for (let t = 0; t < tri; t++) {
      a.fromBufferAttribute(pos, vi(t, 0)); b.fromBufferAttribute(pos, vi(t, 1)); c.fromBufferAttribute(pos, vi(t, 2));
      total += b.clone().sub(a).cross(c.clone().sub(a)).length() / 2;
      areas[t] = total;
    }
    for (let i = 0; i < n; i++) {
      const r = rand() * total;
      let lo = 0, hi = tri - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (areas[mid] < r) lo = mid + 1; else hi = mid; }
      a.fromBufferAttribute(pos, vi(lo, 0)); b.fromBufferAttribute(pos, vi(lo, 1)); c.fromBufferAttribute(pos, vi(lo, 2));
      let u = rand(), v = rand();
      if (u + v > 1) { u = 1 - u; v = 1 - v; }
      const p = a.clone().multiplyScalar(1 - u - v).add(b.clone().multiplyScalar(u)).add(c.clone().multiplyScalar(v)).applyMatrix4(matrix);
      out.push(p);
    }
  }

  /* ------------------------------------------------------ engine state */
  const E = {
    THREE, scene, camera, M, rand, pick, part, wire, edges, lines,
    t: 0, dt: 0.016, camY: 0, camZ: 0, vel: 0, speed: 0, spin: 0, rp: 0, cpx: 0, cpy: 0,
    hh: (d) => d * TAN,
    hw: (d) => d * TAN * camera.aspect,
    // world x for something at depth d in a gutter; u 0..1 across the gutter, r keeps it off the text
    gx(side, u, d, r = 0) {
      const hw = d * TAN * camera.aspect;
      if (narrow) return side * (0.25 + u * 0.8) * hw;
      const s = sMin + u * Math.max(0.05, 1.05 - sMin);
      return side * (s * hw + r);
    },
    // the free gutter at depth d: its width and its centre, in world units
    gw(d) { const hw = d * TAN * camera.aspect; return narrow ? hw * 0.6 : Math.max(0.05, 1 - sMin) * hw; },
    gc(side, d) { const hw = d * TAN * camera.aspect; return side * (narrow ? 0.62 : sMin + Math.max(0.05, 1 - sMin) / 2) * hw; },
    get narrow() { return narrow; }, get mob() { return mob; }, get dark() { return dark; },
  };

  /* ================================================================ scenes */
  const SCENES = {};

  /* ---- home / test: the drifting field */
  function fieldScene(set) {
    const objs = [];
    return {
      init() {
        const bag = [];
        for (const [fn, n] of set) for (let i = 0; i < n; i++) bag.push(fn);
        const n = mob ? 12 : 26;
        for (let i = 0; i < n; i++) {
          const o = pick(bag)();
          const u = o.userData;
          u.side = i % 3 ? -1 : 1; u.su = rand(); u.by = (rand() - 0.5) * 2;   // a third on the right: that is the emblem's side
          u.d = u.side > 0 ? 17 + rand() * 7 : 7 + rand() * 17;
          u.par = 0.55 + (24 - u.d) / 24 * 0.7;
          u.spinV = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.5);
          u.rot0 = new THREE.Euler(rand() * 6, rand() * 6, rand() * 6); u.bob = rand() * 6;
          u.sc = 0.8 + rand() * 0.7; o.scale.setScalar(u.sc);
          scene.add(o); objs.push(o);
        }
      },
      update() {
        for (const o of objs) {
          const u = o.userData, hh = E.hh(u.d);
          const span = hh * 2 + u.r * 2 * u.sc + 2;
          const y = E.camY + wrap(u.by * span * 0.5 - E.camY * u.par, span);
          o.position.set(E.gx(u.side, u.su, u.d, u.r * u.sc), y + Math.sin(E.t * 0.5 + u.bob) * 0.12, -u.d);
          o.rotation.set(u.rot0.x + E.spin * u.spinV.x * 4, u.rot0.y + E.spin * u.spinV.y * 4, u.rot0.z + E.spin * u.spinV.z * 3);
        }
      },
    };
  }
  SCENES.home = () => fieldScene([[crewmate, 5], [asteroid, 3], [satellite, 1], [dice, 1], [gear, 1], [crystal, 1], [pine, 1]]);
  SCENES.test = () => fieldScene([[crewmate, 5], [asteroid, 4]]);

  /* ---- chance: roulette wheel + tumbling dice */
  SCENES.chance = () => {
    const wheel = new THREE.Group(), spinner = new THREE.Group(), dices = [];
    let angle = 0, ballA = 0;
    const ball = new THREE.LineSegments(wire(new THREE.SphereGeometry(0.12, 8, 5)), M.ink);
    return {
      init() {
        const R = 2.4, n = 18;
        part(spinner, wire(new THREE.TorusGeometry(R, 0.06, 4, 72)), M.ink);
        part(spinner, wire(new THREE.TorusGeometry(R * 0.72, 0.04, 4, 60)), M.inkSoft);
        const spokes = [], pockets = [];
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU;
          spokes.push([Math.cos(a) * R * 0.72, Math.sin(a) * R * 0.72, 0], [Math.cos(a) * R, Math.sin(a) * R, 0]);
          if (i % 2 === 0) {
            const a1 = ((i + 1) / n) * TAU;
            pockets.push([Math.cos(a) * R * 0.86, Math.sin(a) * R * 0.86, 0.02], [Math.cos(a1) * R * 0.86, Math.sin(a1) * R * 0.86, 0.02]);
          }
        }
        part(spinner, lines(spokes), M.inkSoft);
        part(spinner, lines(pockets), M.acc);
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * TAU;
          part(spinner, lines([[0, 0, 0.3], [Math.cos(a) * R * 0.6, Math.sin(a) * R * 0.6, 0]]), M.acc);
        }
        part(spinner, wire(new THREE.ConeGeometry(0.3, 0.5, 8, 1)), M.acc, [0, 0, 0.25]).rotation.x = Math.PI / 2;
        wheel.add(spinner);
        spinner.add(ball);
        scene.add(wheel);
        const n2 = mob ? 5 : 9;
        for (let i = 0; i < n2; i++) {
          const d = dice(i % 3 === 0 ? M.ink : M.acc);
          const u = d.userData;
          u.d = 17 + rand() * 7; u.su = rand(); u.by = (rand() - 0.5) * 2; u.par = 0.9 + rand() * 0.6;
          u.sc = 0.6 + rand() * 0.6; d.scale.setScalar(u.sc);
          u.rv = new THREE.Vector3(rand() + 0.3, rand() + 0.3, rand() * 0.5);
          scene.add(d); dices.push(d);
        }
      },
      update() {
        // the scroll is the croupier: scrolling down spins it on, up spins it back
        angle += (0.15 + E.vel * 0.0011) * E.dt;
        ballA -= (0.5 + Math.abs(E.vel) * 0.002) * E.dt;
        spinner.rotation.z = angle;
        const R = 2.4 * 0.93;
        ball.position.set(Math.cos(ballA - angle) * R, Math.sin(ballA - angle) * R, 0.1);
        const d = 15;
        wheel.scale.setScalar(clamp(E.gw(d) * 1.05 / 4.8, 0.3, 1.2));
        wheel.position.set(E.gc(1, d), E.camY + 0.8 + Math.sin(E.camY * 0.05) * 1.2, -d);
        wheel.rotation.set(-0.95 + E.cpy * 0.05, -0.35 + Math.sin(E.t * 0.2) * 0.06, 0);
        for (const o of dices) {
          const u = o.userData, span = E.hh(u.d) * 2 + 3;
          const y = E.camY + wrap(u.by * span * 0.5 - E.camY * u.par - E.t * 0.25 * u.par, span);
          o.position.set(E.gx(1, u.su, u.d, 0.6 * u.sc), y, -u.d);
          const k = E.spin * 2 + E.camY * 0.3;
          o.rotation.set(k * u.rv.x, k * u.rv.y, k * u.rv.z);
        }
      },
    };
  };

  /* ---- useful: gear trains cranked by the scroll */
  SCENES.useful = () => {
    const trains = [];
    let theta = 0;
    function train(side, d, radii, yOff) {
      const g = new THREE.Group(), gears = [];
      let x = 0, y = 0, dir = 1, prev = null;
      radii.forEach((r, i) => {
        const gr = gear(r, i % 2 ? M.ink : M.acc);
        if (prev) {
          const ang = -Math.PI / 2 + (i % 2 ? 0.35 : -0.35);
          const dist = prev.r + r + 0.02;
          x += Math.cos(ang) * dist; y += Math.sin(ang) * dist;
          dir = -dir;
        }
        gr.position.set(x, y, 0);
        gr.userData.ratio = dir * (radii[0] / r);
        gr.userData.phase = i % 2 ? Math.PI / Math.round(r * 16) : 0;
        g.add(gr); gears.push(gr);
        prev = { r };
      });
      // centre the train on its own bounding box
      const box = new THREE.Box3().setFromObject(g), c = box.getCenter(new THREE.Vector3());
      g.children.forEach((ch) => ch.position.sub(c));
      g.userData = { side, d, yOff, gears, w: Math.max(box.max.x - box.min.x, 1) };
      scene.add(g);
      trains.push(g);
    }
    const bolts = [];
    return {
      init() {
        train(-1, 13, [1.1, 0.6, 0.9, 0.5, 0.75], 0.4);
        const n = mob ? 4 : 8;
        for (let i = 0; i < n; i++) {
          const b = new THREE.Group();
          part(b, edges(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 6), 1), M.ink);
          part(b, edges(new THREE.CylinderGeometry(0.09, 0.09, 0.7, 8), 1), M.inkSoft, [0, -0.4, 0]);
          const u = b.userData;
          u.d = 7 + rand() * 12; u.side = i % 2 ? 1 : -1; u.su = rand(); u.by = (rand() - 0.5) * 2; u.par = 1.1 + rand() * 0.5;
          u.rv = new THREE.Vector3(rand(), rand(), rand());
          scene.add(b); bolts.push(b);
        }
      },
      update() {
        theta += (0.12 + E.vel * 0.0014) * E.dt;          // the crank
        for (const g of trains) {
          const u = g.userData;
          g.scale.setScalar(clamp(E.gw(u.d) * 0.95 / u.w, 0.3, 1.3));
          g.position.set(E.gc(u.side, u.d), E.camY + u.yOff * E.hh(u.d) + Math.sin(E.camY * 0.04 + u.d) * 1.1, -u.d);
          g.rotation.set(0.25 + E.cpy * 0.04, u.side * -0.45 + E.cpx * 0.05, 0);
          for (const gr of u.gears) gr.rotation.z = theta * gr.userData.ratio + gr.userData.phase;
        }
        for (const b of bolts) {
          const u = b.userData, span = E.hh(u.d) * 2 + 2;
          const y = E.camY + wrap(u.by * span * 0.5 - E.camY * u.par, span);
          b.position.set(E.gx(u.side, u.su, u.d, 0.4), y, -u.d);
          const k = E.spin * 3;
          b.rotation.set(k * u.rv.x + u.by, k * u.rv.y, k * u.rv.z);
        }
      },
    };
  };

  /* ---- unknowns: a crewmate of points that scatters with the scroll */
  SCENES.unknowns = () => {
    const clouds = [], crystals = [];
    let scatter = 0;
    function cloud(side, d, size, n) {
      const home = [], visorHome = [];
      crewSolids().forEach((s) => {
        const m = new THREE.Matrix4().compose(
          new THREE.Vector3(...s.pos), new THREE.Quaternion(), new THREE.Vector3(...(s.scale || [1, 1, 1])));
        samplePoints(s.geo, Math.round(n * s.w / 5.2), m, s.visor ? visorHome : home);
      });
      const mk = (pts, mat) => {
        const arr = new Float32Array(pts.length * 3), dirs = new Float32Array(pts.length * 3);
        pts.forEach((p, i) => {
          arr.set([p.x, p.y, p.z], i * 3);
          const v = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(0.25 + rand() * 0.75);
          dirs.set([v.x, v.y, v.z], i * 3);
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(arr.slice(), 3));
        const p = new THREE.Points(geo, mat);
        p.userData = { home: arr, dirs };
        return p;
      };
      const g = new THREE.Group();
      g.add(mk(home, M.cloud), mk(visorHome, M.cloudVisor));
      g.scale.setScalar(size);
      g.userData = { side, d, size };
      scene.add(g); clouds.push(g);
    }
    return {
      init() {
        if (!mob) cloud(-1, 18, 1.6, 900);
        const n = mob ? 4 : 8;
        for (let i = 0; i < n; i++) {
          const c = crystal();
          const u = c.userData;
          u.d = 7 + rand() * 14; u.side = i % 2 ? -1 : 1; u.su = rand(); u.by = (rand() - 0.5) * 2; u.par = 0.8 + rand() * 0.6;
          u.rv = rand() * 2 + 0.5;
          scene.add(c); crystals.push(c);
        }
      },
      update() {
        // fast scrolling blows it apart, at rest it pulls itself together
        const want = clamp(E.speed * 0.0004, 0, 0.9) + 0.03 + Math.sin(E.t * 0.8) * 0.02;
        scatter += (want - scatter) * Math.min(1, E.dt * (want > scatter ? 6 : 1.6));
        for (const g of clouds) {
          const u = g.userData;
          g.scale.setScalar(clamp(E.gw(u.d) * 0.8 / 1.4, 0.5, u.size));
          g.position.set(E.gc(u.side, u.d), E.camY + Math.sin(E.camY * 0.05 + u.d) * 1.2, -u.d);
          g.rotation.set(0.1, u.side * -0.5 + E.camY * 0.08 + E.t * 0.1, Math.sin(E.t * 0.3) * 0.05);
          for (const p of g.children) {
            const { home, dirs } = p.userData, arr = p.geometry.attributes.position.array;
            for (let i = 0; i < arr.length; i++) arr[i] = home[i] + dirs[i] * scatter;
            p.geometry.attributes.position.needsUpdate = true;
          }
        }
        for (const c of crystals) {
          const u = c.userData, span = E.hh(u.d) * 2 + 2;
          c.position.set(E.gx(u.side, u.su, u.d, 0.6), E.camY + wrap(u.by * span * 0.5 - E.camY * u.par, span), -u.d);
          c.rotation.set(0.3, E.spin * u.rv + u.by * 3, Math.sin(E.t * 0.4 + u.by) * 0.2);
        }
      },
    };
  };

  /* ---- nightfall: walking through a night forest */
  SCENES.nightfall = () => {
    const trees = [], flies = [];
    const DEPTH = 60;
    let moonG = null, eyes = null, eyeA = 0, flyPts = null;
    return {
      fog: [10, 55],
      camera() {
        camera.position.set(E.cpx * 0.3, 0.2 - E.cpy * 0.15 + Math.sin(E.camZ * 1.6) * 0.04, E.camZ);
        camera.rotation.set(0, 0, clamp(E.vel * -0.00001, -0.04, 0.04));
      },
      init() {
        const n = mob ? 26 : 56;
        for (let i = 0; i < n; i++) {
          const t = pine(rand() < 0.25 ? M.acc : M.ink, 1 + rand() * 0.6);
          const u = t.userData;
          u.side = i % 2 ? 1 : -1; u.su = rand(); u.z0 = rand() * DEPTH; u.sc = 2.2 + rand() * 1.6;
          t.scale.setScalar(u.sc); u.rot = rand() * TAU;
          scene.add(t); trees.push(t);
        }
        moonG = new THREE.Group();
        part(moonG, wire(new THREE.SphereGeometry(4, 20, 14)), M.moon);
        part(moonG, edges(new THREE.CircleGeometry(0.9, 12), 1), M.moon, [1.2, 1.1, 3.9]);
        part(moonG, edges(new THREE.CircleGeometry(0.6, 10), 1), M.moon, [-1.4, -0.6, 3.8]);
        moonG.children.forEach((c) => { c.material = M.moon; });
        scene.add(moonG);
        M.moon.fog = false;
        const fp = new Float32Array((mob ? 30 : 70) * 3);
        for (let i = 0; i < fp.length / 3; i++) flies.push({ side: i % 2 ? 1 : -1, su: rand(), z0: rand() * DEPTH, y0: rand() * 2.6 - 2.2, ph: rand() * TAU });
        const fg = new THREE.BufferGeometry(); fg.setAttribute("position", new THREE.BufferAttribute(fp, 3));
        flyPts = new THREE.Points(fg, M.firefly); flyPts.frustumCulled = false; scene.add(flyPts);
        const eg = new THREE.BufferGeometry(); eg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
        eyes = new THREE.Points(eg, M.eyes); eyes.frustumCulled = false; scene.add(eyes);
      },
      update() {
        const ground = -2.6;
        for (const t of trees) {
          const u = t.userData;
          const dz = ((u.z0 - (-E.camZ)) % DEPTH + DEPTH) % DEPTH + 4;   // distance ahead of the walker
          const z = E.camZ - dz;
          t.position.set(E.gx(u.side, u.su, dz, 0.8 * u.sc) , ground + 0.4 * u.sc, z);
          t.rotation.set(0, u.rot, Math.sin(E.t * 0.6 + u.rot) * 0.015);
        }
        const fp = flyPts.geometry.attributes.position.array;
        flies.forEach((f, i) => {
          const dz = ((f.z0 + E.camZ * -1) % DEPTH + DEPTH) % DEPTH + 3;
          fp[i * 3] = E.gx(f.side, f.su, dz, 0.4) + Math.sin(E.t * 0.7 + f.ph) * 0.3;
          fp[i * 3 + 1] = f.y0 + Math.sin(E.t * 0.9 + f.ph * 2) * 0.25;
          fp[i * 3 + 2] = E.camZ - dz;
        });
        flyPts.geometry.attributes.position.needsUpdate = true;
        M.firefly.opacity = clamp((dark ? 0.8 : 0.5) * (0.75 + Math.sin(E.t * 2.3) * 0.25), 0, 1);
        // the moon keeps its place in the sky
        const md = 70;
        moonG.position.set(E.gx(1, 0.3, md, 4) + camera.position.x, E.hh(md) * 0.55, E.camZ - md);
        moonG.rotation.set(0.2, E.t * 0.03 + E.camZ * 0.004, 0);
        // something watches from between the trees when you hurry
        const want = clamp((E.speed - 900) / 1600, 0, 1);
        eyeA += (want - eyeA) * Math.min(1, E.dt * (want > eyeA ? 4 : 0.8));
        const ez = 24, ex = E.gx(-1, 0.55, ez, 0.3);
        const ea = eyes.geometry.attributes.position.array;
        ea.set([ex - 0.14, -0.9, E.camZ - ez, ex + 0.14, -0.9, E.camZ - ez]);
        eyes.geometry.attributes.position.needsUpdate = true;
        M.eyes.opacity = eyeA * (dark ? 0.95 : 0.7);
        eyes.visible = eyeA > 0.01;
      },
    };
  };

  /* ---- atlas: two dioramas that build up as you read */
  SCENES.atlas = () => {
    const dios = [];
    function museum() {
      const g = new THREE.Group(), grow = [];
      part(g, edges(new THREE.BoxGeometry(4.2, 0.08, 4.2)), M.ink, [0, -0.04, 0]);
      part(g, wire(new THREE.RingGeometry(1.2, 1.5, 24, 1)), M.inkSoft, [0, 0.01, 0]).rotation.x = -Math.PI / 2;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        const c = column(); c.scale.set(0.55, 0.55, 0.55);
        c.position.set(Math.cos(a) * 1.55, 0.45, Math.sin(a) * 1.55);
        g.add(c); grow.push(c);
      }
      const dome = part(g, wire(new THREE.SphereGeometry(1.6, 16, 6, 0, TAU, 0, Math.PI / 2)), M.accSoft, [0, 0.95, 0]);
      grow.push(dome);
      // the skeleton in the middle: spine, ribs, skull
      const spine = [[-0.9, 0.45, 0], [-0.4, 0.55, 0], [0.1, 0.6, 0], [0.55, 0.62, 0], [0.9, 0.75, 0]];
      const segs = [];
      for (let i = 0; i < spine.length - 1; i++) segs.push(spine[i], spine[i + 1]);
      for (let i = 1; i < 4; i++) { const [x, y] = spine[i]; segs.push([x, y, 0], [x, y - 0.3, 0.18], [x, y, 0], [x, y - 0.3, -0.18]); }
      segs.push([-0.9, 0.45, 0], [-1.35, 0.25, 0]);
      const skel = part(g, lines(segs), M.acc);
      part(skel, edges(new THREE.BoxGeometry(0.28, 0.16, 0.14)), M.acc, [1.02, 0.78, 0]);
      grow.push(skel);
      // wall stubs of the halls around
      [[-2.1, 0, 0.08, 4.2], [2.1, 0, 0.08, 4.2], [0, -2.1, 4.2, 0.08]].forEach(([x, z, w, dd]) => {
        const wl = part(g, edges(new THREE.BoxGeometry(w, 0.7, dd)), M.inkSoft, [x, 0.35, z]); grow.push(wl);
      });
      return { g, grow };
    }
    function cabin() {
      const g = new THREE.Group(), grow = [];
      part(g, edges(new THREE.BoxGeometry(4.2, 0.08, 4.2)), M.ink, [0, -0.04, 0]);
      const house = new THREE.Group();
      part(house, edges(new THREE.BoxGeometry(1.6, 0.9, 1.2)), M.ink, [0, 0.45, 0]);
      for (let i = 0; i < 5; i++) part(house, lines([[-0.8, 0.12 + i * 0.18, 0.61], [0.8, 0.12 + i * 0.18, 0.61]]), M.inkSoft);
      const roof = new THREE.Shape(); roof.moveTo(-0.95, 0); roof.lineTo(0.95, 0); roof.lineTo(0, 0.7); roof.lineTo(-0.95, 0);
      const rg = new THREE.ExtrudeGeometry(roof, { depth: 1.4, bevelEnabled: false }); rg.translate(0, 0.9, -0.7);
      part(house, edges(rg, 1), M.acc);
      part(house, edges(new THREE.BoxGeometry(0.22, 0.5, 0.22)), M.ink, [0.45, 1.45, 0.1]);
      house.position.set(-0.4, 0, -0.3);
      g.add(house); grow.push(house);
      [[1.3, 1.2, 1.1], [1.5, -1.2, 0.9], [-1.5, 1.4, 1.2], [0.6, 1.6, 0.8], [-1.6, -1.4, 1]].forEach(([x, z, s]) => {
        const t = pine(M.acc, 1); t.scale.setScalar(s); t.position.set(x, 0.42 * s, z); g.add(t); grow.push(t);
      });
      const fire = part(g, edges(new THREE.ConeGeometry(0.18, 0.3, 6), 1), M.acc, [0.8, 0.15, 0.4]);
      grow.push(fire);
      part(g, lines([[-2.1, 0.01, 1.9], [-0.6, 0.01, 0.4], [0.2, 0.01, 0.3], [2.1, 0.01, -0.5]]), M.inkSoft);
      return { g, grow };
    }
    return {
      init() {
        [[museum(), -1, 14, 0.2]].forEach(([dio, side, d, yOff]) => {
          dio.g.userData = { side, d, yOff, grow: dio.grow };
          dio.grow.forEach((o, i) => { o.userData.sy = o.scale.y; o.userData.delay = i / dio.grow.length; });
          scene.add(dio.g); dios.push(dio.g);
        });
      },
      update() {
        // the dioramas rise with the reading progress (fully built by about a third of the page)
        const build = clamp(E.rp * 3.2 + 0.08, 0, 1);
        for (const g of dios) {
          const u = g.userData;
          g.scale.setScalar(clamp(E.gw(u.d) * 1.0 / 4.6, 0.3, 1.2));
          g.position.set(E.gc(u.side, u.d), E.camY + u.yOff * E.hh(u.d) + Math.sin(E.camY * 0.045 + u.d) * 1.0, -u.d);
          g.rotation.set(0.55 + E.cpy * 0.05, u.side * 0.5 + E.camY * -0.06 + E.t * 0.04, 0);
          for (const o of u.grow) {
            const k = clamp((build - o.userData.delay * 0.6) / 0.4, 0, 1);
            const e = k * k * (3 - 2 * k);
            o.scale.y = Math.max(0.001, o.userData.sy * e);
            o.visible = e > 0.01;
          }
        }
      },
    };
  };

  /* ================================================================ emblem
   * One point cloud per page that belongs to the chapter you are reading: a
   * knife for an Impostor role, a shield for the shield features, the rotunda
   * for the maps. When the section in the middle of the screen changes, the
   * points fly over into the next shape and take on the chapter colour (on
   * Unknown's the team colour of the role), and the page background takes a
   * faint tint of it. The cloud gives way around the pointer; a click on an
   * empty part of the page sends a shock wave through it and turns it into the
   * next shape. A small caption in the gutter names the figure like a label. */
  const TONE_HI = new THREE.Color(), TONE_INK = new THREE.Color();
  const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  const HALF = Math.PI / 2;
  function P(geo, tone = 0, w = 1, pos, rot, scl, keep) {
    const m = new THREE.Matrix4().compose(V(pos || [0, 0, 0]),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...(rot || [0, 0, 0]))), V(scl || [1, 1, 1]));
    return { geo, tone, w, m, keep };
  }
  function tilt(parts, rot) {
    const t = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rot));
    for (const p of parts) p.m.premultiply(t);
    return parts;
  }
  function extrude(shape, depth, tone = 0, w = 1) {
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 16 });
    g.translate(0, 0, -depth / 2);
    return P(g, tone, w);
  }
  const shapeOf = (pts) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); s.closePath(); return s; };
  const Cyl = (r, h, seg = 12, open = false) => new THREE.CylinderGeometry(r, r, h, seg, 1, open);
  const Box = (x, y, z) => new THREE.BoxGeometry(x, y, z);
  const Torus = (r, t, rs, ts, arc) => new THREE.TorusGeometry(r, t, rs, ts, arc);

  // tone: 0 = chapter colour, 1 = ink, 2 = highlight (visor blue, moonlight); w = point density
  const SHAPES = {
    crewmate: () => crewSolids().map((s) => P(s.geo, s.visor ? 2 : 0, s.visor ? 1.6 : 1, s.pos, null, s.scale)),
    dice: () => {
      const parts = [P(Box(1.2, 1.2, 1.2), 0, 1)];
      const o = 0.3, f = 0.602;
      const faces = [
        [[0, 0]], [[-o, -o], [o, o]], [[-o, -o], [0, 0], [o, o]], [[-o, -o], [o, -o], [-o, o], [o, o]],
        [[-o, -o], [o, -o], [0, 0], [-o, o], [o, o]], [[-o, -o], [o, -o], [-o, 0], [o, 0], [-o, o], [o, o]],
      ];
      const place = [
        (a, b) => [[a, b, f], [0, 0, 0]], (a, b) => [[f, a, b], [0, HALF, 0]], (a, b) => [[a, f, b], [-HALF, 0, 0]],
        (a, b) => [[-f, a, b], [0, -HALF, 0]], (a, b) => [[a, -f, b], [HALF, 0, 0]], (a, b) => [[a, b, -f], [0, Math.PI, 0]],
      ];
      faces.forEach((pips, i) => pips.forEach(([a, b]) => {
        const [pos, rot] = place[i](a, b);
        parts.push(P(new THREE.CircleGeometry(0.11, 12), 1, 6, pos, rot));
      }));
      return tilt(parts, [0.5, 0.6, 0]);
    },
    gear: () => [P(gearSolid(1, 12, 0.3, 0.62, 0.36), 0, 1), P(Cyl(0.2, 0.4, 16, true), 1, 1.5, null, [HALF, 0, 0]),
      ...[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * TAU; return P(Box(0.5, 0.1, 0.12), 0, 1.5, [Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0], [0, 0, a]); })],
    wheel: () => {
      const parts = [P(Torus(1, 0.06, 6, 64), 0, 1), P(Torus(0.68, 0.04, 6, 48), 1, 1),
        P(new THREE.ConeGeometry(0.16, 0.34, 12), 0, 2, [0, 0, 0.17], [HALF, 0, 0])];
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * TAU;
        parts.push(P(Box(0.32, 0.025, 0.025), 1, 2, [Math.cos(a) * 0.84, Math.sin(a) * 0.84, 0], [0, 0, a]));
        if (i % 2 === 0) parts.push(P(new THREE.CircleGeometry(0.07, 8), 0, 3, [Math.cos(a + 0.17) * 0.84, Math.sin(a + 0.17) * 0.84, 0.02]));
      }
      return tilt(parts, [-0.9, 0, 0]);
    },
    knife: () => tilt([
      extrude(shapeOf([[0, -0.13], [1.15, -0.13], [1.6, 0.12], [0, 0.22]]), 0.06, 2, 1.2),
      P(Box(0.08, 0.55, 0.22), 1, 2, [-0.02, 0.04, 0]),
      P(Box(0.75, 0.22, 0.16), 0, 1, [-0.43, 0.04, 0]),
    ], [0, 0, 0.6]),
    shield: () => {
      const s = new THREE.Shape();
      s.moveTo(0, 1.1); s.bezierCurveTo(0.45, 1.1, 0.85, 1.0, 0.9, 0.9); s.lineTo(0.9, 0.2);
      s.bezierCurveTo(0.9, -0.5, 0.4, -0.9, 0, -1.15); s.bezierCurveTo(-0.4, -0.9, -0.9, -0.5, -0.9, 0.2);
      s.lineTo(-0.9, 0.9); s.bezierCurveTo(-0.85, 1.0, -0.45, 1.1, 0, 1.1);
      return [extrude(s, 0.2, 0, 1), P(Box(0.14, 1.3, 0.05), 1, 3, [0, 0, 0.12]), P(Box(1.0, 0.14, 0.05), 1, 3, [0, 0.3, 0.12])];
    },
    eye: () => {
      const path = new THREE.CurvePath();
      path.add(new THREE.QuadraticBezierCurve3(V([-1.25, 0, 0]), V([0, 1.1, 0]), V([1.25, 0, 0])));
      path.add(new THREE.QuadraticBezierCurve3(V([1.25, 0, 0]), V([0, -1.1, 0]), V([-1.25, 0, 0])));
      return [P(new THREE.TubeGeometry(path, 80, 0.045, 5, true), 1, 2),
        P(Torus(0.44, 0.05, 6, 40), 0, 2), P(new THREE.RingGeometry(0.2, 0.44, 32, 2), 0, 0.7),
        P(new THREE.CircleGeometry(0.2, 20), 1, 3)];
    },
    moon: () => [
      P(new THREE.SphereGeometry(1, 32, 20), 2, 1, null, null, [1, 1, 0.3], (p) => Math.hypot(p.x - 0.52, p.y - 0.24) > 0.84),
      P(new THREE.OctahedronGeometry(0.09), 0, 8, [0.72, 0.62, 0]), P(new THREE.OctahedronGeometry(0.06), 0, 8, [0.35, -0.2, 0]),
    ],
    ghost: () => {
      const prof = [[0.001, 1.1], [0.35, 1.05], [0.6, 0.85], [0.72, 0.5], [0.75, 0], [0.78, -0.6], [0.82, -1.0]].map(([x, y]) => new THREE.Vector2(x, y));
      return [P(new THREE.LatheGeometry(prof, 28), 0, 1, null, null, null, (p) => p.y > -0.8 + 0.16 * Math.sin(Math.atan2(p.z, p.x) * 6)),
        P(new THREE.CircleGeometry(0.12, 12), 1, 6, [-0.22, 0.5, 0.7]), P(new THREE.CircleGeometry(0.12, 12), 1, 6, [0.22, 0.5, 0.7])];
    },
    skull: () => {
      const sockets = [[-0.33, -0.02], [0.33, -0.02]];
      return [P(new THREE.SphereGeometry(0.85, 28, 20), 0, 1, [0, 0.1, 0], null, [1, 0.95, 1.05],
        (p) => !(p.z > 0.35 && (sockets.some(([x, y]) => Math.hypot(p.x - x, p.y - y) < 0.22) || (Math.abs(p.x) < 0.1 && p.y < -0.25 && p.y > -0.45)))),
        ...sockets.map(([x, y]) => P(Torus(0.22, 0.025, 4, 24), 1, 3, [x, y, 0.72])),
        P(Box(0.85, 0.32, 0.65), 0, 1, [0, -0.78, 0.15]),
        ...[-0.24, -0.08, 0.08, 0.24].map((x) => P(Box(0.1, 0.2, 0.03), 1, 4, [x, -0.72, 0.49]))];
    },
    hourglass: () => [
      P(new THREE.ConeGeometry(0.72, 0.95, 24, 1, true), 0, 1, [0, 0.5, 0], [Math.PI, 0, 0]),
      P(new THREE.ConeGeometry(0.72, 0.95, 24, 1, true), 0, 1, [0, -0.5, 0]),
      P(Cyl(0.88, 0.1, 28), 1, 1, [0, 1.03, 0]), P(Cyl(0.88, 0.1, 28), 1, 1, [0, -1.03, 0]),
      ...[0, 1, 2].map((i) => P(Cyl(0.035, 2.0, 6), 1, 2, [Math.cos(i * TAU / 3) * 0.8, 0, Math.sin(i * TAU / 3) * 0.8])),
      P(new THREE.ConeGeometry(0.5, 0.34, 20), 2, 3, [0, -0.8, 0]),
    ],
    bolt: () => [extrude(shapeOf([[0.25, 1.3], [-0.5, 0.02], [-0.04, 0.02], [-0.38, -1.3], [0.55, 0.22], [0.08, 0.22], [0.5, 1.3]]), 0.22, 0, 1)],
    crown: () => {
      const parts = [P(new THREE.CylinderGeometry(0.9, 0.82, 0.45, 36, 1, true), 0, 1)];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * TAU;
        parts.push(P(new THREE.ConeGeometry(0.2, 0.62, 10, 1, true), 0, 1, [Math.cos(a) * 0.86, 0.53, Math.sin(a) * 0.86]));
        parts.push(P(new THREE.SphereGeometry(0.08, 8, 6), 2, 6, [Math.cos(a) * 0.86, 0.88, Math.sin(a) * 0.86]));
        parts.push(P(new THREE.SphereGeometry(0.07, 8, 6), 1, 6, [Math.cos(a + 0.63) * 0.88, 0, Math.sin(a + 0.63) * 0.88]));
      }
      return tilt(parts, [0.35, 0, 0]);
    },
    dome: () => {
      const parts = [P(new THREE.SphereGeometry(1, 28, 12, 0, TAU, 0, HALF), 0, 1, [0, 0.15, 0]),
        P(Torus(0.99, 0.05, 4, 48), 1, 2, [0, 0.15, 0], [HALF, 0, 0]),
        P(Cyl(1.18, 0.12, 36), 1, 1, [0, -0.7, 0]), P(Cyl(0.14, 0.24, 10), 0, 2, [0, 1.25, 0])];
      for (let i = 0; i < 10; i++) { const a = (i / 10) * TAU; parts.push(P(Cyl(0.06, 0.8, 8), 1, 2, [Math.cos(a) * 0.95, -0.25, Math.sin(a) * 0.95])); }
      return tilt(parts, [0.3, 0, 0]);
    },
    tree: () => [
      P(new THREE.ConeGeometry(0.95, 0.9, 12), 0, 1, [0, -0.25, 0]), P(new THREE.ConeGeometry(0.72, 0.8, 12), 0, 1, [0, 0.3, 0]),
      P(new THREE.ConeGeometry(0.48, 0.7, 12), 0, 1, [0, 0.8, 0]), P(Cyl(0.13, 0.5, 8), 1, 2, [0, -0.95, 0]),
    ],
    tower: () => {
      const parts = [
        P(Box(0.95, 0.6, 0.95), 0, 1, [0, 0.62, 0], null, null, (p) => !(p.z > 0.4 && Math.abs(p.x) < 0.32 && p.y > 0.6 && p.y < 0.85)),
        P(new THREE.ConeGeometry(0.82, 0.45, 4, 1), 0, 1, [0, 1.15, 0], [0, Math.PI / 4, 0]),
      ];
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([x, z]) => parts.push(P(Cyl(0.04, 1.55, 6), 1, 2, [x * 0.4, -0.45, z * 0.4], [z * -0.06, 0, x * 0.06])));
      [-0.18, 0.18].forEach((x) => parts.push(P(Cyl(0.025, 1.45, 5), 1, 2, [x, -0.45, 0.78], [-0.28, 0, 0])));
      for (let i = 0; i < 6; i++) parts.push(P(Box(0.36, 0.03, 0.03), 1, 3, [0, -1.1 + i * 0.24, 0.96 - i * 0.068]));
      return tilt(parts, [0.15, -0.5, 0]);
    },
    ferris: () => {
      const parts = [P(Torus(1, 0.035, 5, 72), 0, 1.4), P(Cyl(0.1, 0.18, 10), 1, 2, null, [HALF, 0, 0])];
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU, c = Math.cos(a), s = Math.sin(a);
        parts.push(P(Box(0.9, 0.02, 0.02), 1, 2, [c * 0.5, s * 0.5, 0], [0, 0, a]));
        parts.push(P(Box(0.15, 0.17, 0.15), 0, 3, [c, s - 0.13, 0]));
      }
      [-1, 1].forEach((x) => parts.push(P(Cyl(0.035, 1.45, 6), 1, 2, [x * 0.33, -0.62, 0], [0, 0, x * 0.45])));
      return parts;
    },
    globe: () => [
      P(new THREE.SphereGeometry(1, 24, 16), 0, 0.35), P(Torus(1.01, 0.02, 4, 64), 1, 3, null, [HALF, 0, 0]),
      ...[0, 1, 2].map((i) => P(Torus(1.01, 0.02, 4, 64), 1, 2, null, [0, (i / 3) * Math.PI, 0])),
      P(Torus(0.72, 0.018, 4, 48), 1, 2, [0, 0.69, 0], [HALF, 0, 0]),
      P(Torus(0.72, 0.018, 4, 48), 1, 2, [0, -0.69, 0], [HALF, 0, 0]),
    ],
    sliders: () => [-0.6, 0, 0.6].flatMap((y, i) => [
      P(Cyl(0.035, 2.1, 6), 1, 2, [0, y, 0], [0, 0, HALF]),
      P(Cyl(0.17, 0.3, 18), 0, 2, [[-0.5, 0.45, -0.1][i], y, 0], [HALF, 0, 0]),
    ]),
    arrow: () => [
      extrude(shapeOf([[-0.2, 1.1], [0.2, 1.1], [0.2, 0.05], [0.6, 0.05], [0, -0.6], [-0.6, 0.05], [-0.2, 0.05]]), 0.2, 0, 1),
      P(Box(1.8, 0.1, 0.3), 1, 2, [0, -1.0, 0]), P(Box(0.1, 0.45, 0.3), 1, 2, [-0.85, -0.8, 0]), P(Box(0.1, 0.45, 0.3), 1, 2, [0.85, -0.8, 0]),
    ],
    plug: () => {
      const cable = new THREE.CatmullRomCurve3([V([0, -0.45, 0]), V([0, -0.8, 0]), V([0.4, -1.1, 0]), V([0.9, -1.1, 0.1])]);
      return tilt([P(Box(0.7, 0.8, 0.5), 0, 1),
        P(Box(0.1, 0.5, 0.08), 2, 3, [-0.17, 0.64, 0]), P(Box(0.1, 0.5, 0.08), 2, 3, [0.17, 0.64, 0]),
        P(new THREE.TubeGeometry(cable, 40, 0.06, 6), 1, 2)], [0, 0, -0.25]);
    },
    heart: () => {
      const s = new THREE.Shape();
      s.moveTo(0, -0.9); s.bezierCurveTo(-0.2, -0.6, -1.1, -0.2, -1.1, 0.35); s.bezierCurveTo(-1.1, 0.85, -0.55, 1.05, 0, 0.6);
      s.bezierCurveTo(0.55, 1.05, 1.1, 0.85, 1.1, 0.35); s.bezierCurveTo(1.1, -0.2, 0.2, -0.6, 0, -0.9);
      return [extrude(s, 0.35, 0, 1)];
    },
    bug: () => {
      const parts = [P(new THREE.SphereGeometry(0.62, 22, 14), 0, 1, [0, 0, -0.1], null, [0.85, 0.5, 1.1]),
        P(new THREE.SphereGeometry(0.3, 14, 10), 1, 1.5, [0, 0.02, 0.72]),
        P(Box(0.02, 0.05, 1.3), 1, 4, [0, 0.31, -0.1])];
      [-1, 1].forEach((x) => {
        [-0.35, 0, 0.35].forEach((z) => parts.push(P(Cyl(0.02, 0.7, 5), 1, 3, [x * 0.62, -0.15, z], [0, 0, x * 1.1])));
        parts.push(P(Cyl(0.015, 0.5, 5), 1, 3, [x * 0.14, 0.25, 1.05], [1.0, 0, x * -0.4]));
        parts.push(P(new THREE.CircleGeometry(0.09, 10), 1, 5, [x * 0.24, 0.3, -0.25], [-HALF, 0, 0]));
      });
      return tilt(parts, [0.45, -0.6, 0]);
    },
    magnifier: () => [P(Torus(0.62, 0.08, 8, 48), 0, 1.4), P(new THREE.CircleGeometry(0.56, 28), 2, 0.25),
      P(new THREE.CylinderGeometry(0.08, 0.11, 0.95, 10), 1, 1.5, [0.78, -0.78, 0], [0, 0, Math.PI / 4])],
    target: () => [P(Torus(1, 0.03, 4, 64), 0, 2), P(Torus(0.6, 0.03, 4, 48), 0, 2), P(new THREE.CircleGeometry(0.12, 14), 1, 5),
      ...[0, 1, 2, 3].map((i) => { const a = (i / 4) * TAU; return P(Box(0.55, 0.04, 0.04), 1, 3, [Math.cos(a), Math.sin(a), 0], [0, 0, a]); })],
    portal: () => [P(Torus(1, 0.08, 8, 64), 1, 1.2),
      P(new THREE.CircleGeometry(0.95, 64), 0, 3, null, null, null, (p) => {
        const r = Math.hypot(p.x, p.y), s = TAU / 3;
        return (((Math.atan2(p.y, p.x) + r * 5) % s) + s) % s < 0.55;
      })],
    flask: () => {
      const prof = [[0.001, -1], [0.7, -0.95], [0.9, -0.55], [0.8, -0.1], [0.26, 0.3], [0.22, 0.9], [0.3, 1]].map(([x, y]) => new THREE.Vector2(x, y));
      return [P(new THREE.LatheGeometry(prof, 28), 1, 0.6, null, null, null, (p) => p.y > -0.35),
        P(new THREE.LatheGeometry(prof, 28), 0, 2, null, null, null, (p) => p.y <= -0.35),
        P(new THREE.SphereGeometry(0.07, 8, 6), 0, 6, [0.05, 0.5, 0]), P(new THREE.SphereGeometry(0.05, 8, 6), 0, 6, [-0.05, 0.72, 0])];
    },
    crystal: () => [P(new THREE.OctahedronGeometry(1, 0), 0, 1, [0, 0.1, 0], null, [0.55, 1.1, 0.55]),
      P(new THREE.OctahedronGeometry(0.5, 0), 2, 1.3, [0.55, -0.45, 0.1], [0, 0, -0.4], [0.5, 1, 0.5])],
    lock: () => [P(Box(1.1, 0.85, 0.4), 0, 1, [0, -0.35, 0]),
      P(Torus(0.36, 0.07, 8, 24, Math.PI), 1, 2, [0, 0.08, 0]),
      P(Cyl(0.07, 0.3, 8), 1, 2, [-0.36, -0.02, 0]), P(Cyl(0.07, 0.3, 8), 1, 2, [0.36, -0.02, 0]),
      P(new THREE.CircleGeometry(0.1, 12), 1, 6, [0, -0.28, 0.21]), P(Box(0.07, 0.22, 0.02), 1, 6, [0, -0.43, 0.21])],
    clock: () => {
      const parts = [P(Torus(1, 0.06, 6, 64), 0, 1.5), P(new THREE.CircleGeometry(0.95, 40), 0, 0.15),
        P(Box(0.06, 0.55, 0.04), 1, 4, [0, 0.26, 0.03]), P(Box(0.42, 0.06, 0.04), 1, 4, [0.2, 0, 0.03], [0, 0, -0.5])];
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        parts.push(P(Box(i % 3 ? 0.04 : 0.07, 0.16, 0.03), 1, 4, [Math.sin(a) * 0.8, Math.cos(a) * 0.8, 0.02], [0, 0, -a]));
      }
      return parts;
    },
  };
  const SHAPE_NAMES = {
    crewmate: ["Crewmate", "Crewmate"], dice: ["Die", "Würfel"], gear: ["Gear", "Zahnrad"], wheel: ["Roulette wheel", "Roulette"],
    knife: ["Knife", "Messer"], shield: ["Shield", "Schild"], eye: ["Eye", "Auge"], moon: ["Moon", "Mond"], ghost: ["Ghost", "Geist"],
    skull: ["Skull", "Schädel"], hourglass: ["Hourglass", "Sanduhr"], bolt: ["Lightning", "Blitz"], crown: ["Crown", "Krone"],
    dome: ["Rotunda", "Rotunde"], tree: ["Pine", "Kiefer"], tower: ["Hunting stand", "Hochsitz"], ferris: ["Ferris wheel", "Riesenrad"],
    globe: ["Globe", "Globus"], sliders: ["Sliders", "Regler"], arrow: ["Download", "Download"], plug: ["Plug", "Stecker"],
    heart: ["Heart", "Herz"], bug: ["Beetle", "Käfer"], magnifier: ["Magnifier", "Lupe"], target: ["Crosshair", "Fadenkreuz"],
    portal: ["Vortex", "Strudel"], flask: ["Poison", "Gift"], crystal: ["Crystal", "Kristall"], lock: ["Lock", "Schloss"], clock: ["Clock", "Uhr"],
  };
  // section id -> shape (first match wins); the rest falls back on the team in the title, then on the page's cycle
  const SHAPE_RULES = [
    [/tesla/, "bolt"], [/saboteur|sabotage/, "clock"], [/siphon/, "hourglass"], [/witness|sixth|stalker/, "eye"], [/poison/, "flask"],
    [/illusion|colorblind|collector|uc-fx/, "crystal"], [/maniac|killcutscene/, "knife"], [/shade|poltergeist/, "ghost"],
    [/manipulator|auditor|settings|webconfig|controls|tasks/, "sliders"], [/scout/, "magnifier"], [/beacon/, "tower"],
    [/^bug$/, "bug"], [/bugfix|stability|manager|versioning|configuration/, "gear"], [/werewolf|sleepwalker|how-it-works/, "moon"],
    [/hunter/, "target"], [/gambler|chance-modifier|assignment|roledraft/, "dice"], [/chaos/, "bolt"], [/void/, "portal"],
    [/king|uc-hats/, "crown"], [/necromancer|last-words/, "skull"], [/lover/, "heart"], [/shield|early-death/, "shield"],
    [/security|gate/, "lock"], [/modsync|requirements/, "plug"], [/localization|selection|submerged/, "globe"], [/install|download/, "arrow"],
    [/^maps$|^mods$/, "dome"], [/eject|^crewmate$|follower|copycat|highlights/, "crewmate"], [/^impostor$/, "knife"], [/neutral/, "dice"],
  ];
  const PAGE_CYCLE = {
    home: ["crewmate"], test: ["crewmate", "crystal"], chance: ["dice", "wheel", "lock"], useful: ["gear", "shield", "sliders", "plug"],
    unknowns: ["crewmate", "knife", "crystal"], nightfall: ["moon", "tree", "eye"], atlas: ["dome", "tower", "ferris", "clock"],
  };
  const PAGE_RULES = { nightfall: [[/world/, "tree"]], atlas: [[/world/, "tower"], [/ejections/, "ferris"]] };
  const HOME_SHAPE = { chance: "dice", useful: "gear", unknowns: "crewmate", nightfall: "moon", atlas: "dome" };
  // team colours of Unknown's roles as [light, dark], plus the fallback shape of that team
  const TEAM = [
    [/impostor/i, ["#b8323c", "#ff6b6b"], "knife"], [/crew/i, ["#2f7fa8", "#6fc6ec"], "crewmate"], [/neutral/i, ["#a87a10", "#f2c14e"], "dice"],
    [/ghost|geist/i, ["#6e52c4", "#b49cff"], "ghost"], [/modifier/i, ["#3b8c57", "#7ddc9b"], "crystal"],
  ];

  function sampleShape(parts, N) {
    const tmp = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    const infos = parts.map((p) => {
      const g = p.geo.index ? p.geo.toNonIndexed() : p.geo, pos = g.attributes.position, tri = pos.count / 3;
      const cum = new Float32Array(tri); let total = 0;
      for (let t = 0; t < tri; t++) {
        a.fromBufferAttribute(pos, t * 3).applyMatrix4(p.m); b.fromBufferAttribute(pos, t * 3 + 1).applyMatrix4(p.m); c.fromBufferAttribute(pos, t * 3 + 2).applyMatrix4(p.m);
        total += b.sub(a).cross(c.sub(a)).length() / 2; cum[t] = total;
      }
      return { p, pos, tri, cum, total, weight: total * p.w };
    });
    const sum = infos.reduce((s, i) => s + i.weight, 0);
    const counts = infos.map((i) => Math.floor((N * i.weight) / sum));
    let rest = N - counts.reduce((s, n) => s + n, 0);
    for (let k = 0; rest > 0; k = (k + 1) % counts.length, rest--) counts[k]++;
    const out = new Float32Array(N * 3), tone = new Uint8Array(N);
    let n = 0;
    infos.forEach((info, k) => {
      let made = 0, tries = 0;
      while (made < counts[k] && tries < counts[k] * 30) {
        tries++;
        const r = rand() * info.total;
        let lo = 0, hi = info.tri - 1;
        while (lo < hi) { const mid = (lo + hi) >> 1; if (info.cum[mid] < r) lo = mid + 1; else hi = mid; }
        a.fromBufferAttribute(info.pos, lo * 3); b.fromBufferAttribute(info.pos, lo * 3 + 1); c.fromBufferAttribute(info.pos, lo * 3 + 2);
        let u = rand(), v = rand();
        if (u + v > 1) { u = 1 - u; v = 1 - v; }
        tmp.set(0, 0, 0).addScaledVector(a, 1 - u - v).addScaledVector(b, u).addScaledVector(c, v).applyMatrix4(info.p.m);
        if (info.p.keep && !info.p.keep(tmp)) continue;
        out[n * 3] = tmp.x; out[n * 3 + 1] = tmp.y; out[n * 3 + 2] = tmp.z; tone[n] = info.p.tone; n++; made++;
      }
    });
    // a part whose filter threw away too much: repeat points we already have
    for (let i = n; i < N; i++) { const j = (rand() * n) | 0; out.copyWithin(i * 3, j * 3, j * 3 + 3); tone[i] = tone[j]; }
    // centre on the bounding box, largest half-extent = 1
    const box = new THREE.Box3().setFromArray(out), ctr = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
    const k = 2 / Math.max(size.x, size.y, size.z, 0.001);
    for (let i = 0; i < N; i++) {
      out[i * 3] = (out[i * 3] - ctr.x) * k; out[i * 3 + 1] = (out[i * 3 + 1] - ctr.y) * k; out[i * 3 + 2] = (out[i * 3 + 2] - ctr.z) * k;
    }
    // sorted by height, neighbours travel to neighbours: the morph reads as reshaping, not as a swarm
    const order = [...Array(N).keys()].sort((i, j) => out[i * 3 + 1] - out[j * 3 + 1]);
    const pos = new Float32Array(N * 3), tn = new Uint8Array(N);
    order.forEach((src, dst) => { pos[dst * 3] = out[src * 3]; pos[dst * 3 + 1] = out[src * 3 + 1]; pos[dst * 3 + 2] = out[src * 3 + 2]; tn[dst] = tone[src]; });
    return { pos, tone: tn };
  }

  const emblem = (() => {
    const N = mob ? 1300 : 2600;
    const cache = new Map();
    const get = (k) => { if (!cache.has(k)) cache.set(k, sampleShape((SHAPES[k] || SHAPES.crewmate)(), N)); return cache.get(k); };
    const from = new Float32Array(N * 3), cur = new Float32Array(N * 3), off = new Float32Array(N * 3), vel = new Float32Array(N * 3);
    const swirl = new Float32Array(N * 3), dirs = new Float32Array(N * 3), delay = new Float32Array(N), fromTone = new Uint8Array(N);
    const v = new THREE.Vector3();
    for (let i = 0; i < N; i++) {
      v.set(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
      swirl[i * 3] = v.x * 0.9; swirl[i * 3 + 1] = v.y * 0.45; swirl[i * 3 + 2] = v.z * 0.9;
      v.set(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(0.3 + rand() * 0.7);
      dirs[i * 3] = v.x; dirs[i * 3 + 1] = v.y; dirs[i * 3 + 2] = v.z;
      delay[i] = rand() * 0.35 + (i / N) * 0.25;
    }
    const geo = new THREE.BufferGeometry(), colors = new Float32Array(N * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(cur, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 2.3, sizeAttenuation: false, transparent: true, depthWrite: false, vertexColors: true, fog: false });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    const group = new THREE.Group();
    group.add(pts);
    let key = "", target = null, morphT = 1, scatter = 0, override = null, overrideCh = -2;
    const col = new THREE.Color(), colTarget = new THREE.Color(), tones = [col, TONE_INK, TONE_HI], ca = new THREE.Color();
    const inv = new THREE.Matrix4(), ray = new THREE.Ray();
    const conf = { chance: [-1, 12], nightfall: [1, 13], atlas: [1, 13] }[PAGE] || [1, 12];

    function setShape(k, snap) {
      if (k === key) return;
      key = k; target = get(k);
      if (snap) { cur.set(target.pos); from.set(target.pos); fromTone.set(target.tone); morphT = 1; return; }
      // start from where the points are now (a morph can be interrupted by the next one)
      for (let i = 0; i < N * 3; i++) from[i] = cur[i] - off[i];
      morphT = 0;
    }
    function localRay(worldRay) {
      group.updateMatrixWorld();
      inv.copy(group.matrixWorld).invert();
      ray.copy(worldRay).applyMatrix4(inv);
      ray.direction.normalize();
      return ray;
    }
    return {
      group, side: conf[0], d: conf[1],
      get key() { return key; },
      color: col,
      setShape,
      setColor(c, snap) { colTarget.copy(c); if (snap) col.copy(c); },
      // the chapter asks for a shape; a click override holds until the chapter changes
      want(k, ch, snap) {
        if (ch !== overrideCh) { overrideCh = ch; override = null; }
        setShape(override || k, snap);
      },
      next() {
        const cyc = PAGE_CYCLE[PAGE] || PAGE_CYCLE.home;
        const list = cyc.concat(Object.keys(SHAPES).filter((s) => !cyc.includes(s)));
        override = list[(list.indexOf(key) + 1) % list.length];
        setShape(override);
      },
      burst(worldRay, strength) {
        const r = localRay(worldRay);
        for (let i = 0; i < N; i++) {
          const j = i * 3;
          const wx = cur[j] - r.origin.x, wy = cur[j + 1] - r.origin.y, wz = cur[j + 2] - r.origin.z;
          const t = wx * r.direction.x + wy * r.direction.y + wz * r.direction.z;
          const dx = wx - r.direction.x * t, dy = wy - r.direction.y * t, dz = wz - r.direction.z * t;
          const dl = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1, f = strength / (0.6 + dl * 1.6);
          vel[j] += (dx / dl + dirs[j] * 0.6) * f;
          vel[j + 1] += (dy / dl + dirs[j + 1] * 0.6) * f;
          vel[j + 2] += (dz / dl + dirs[j + 2] * 0.6) * f;
        }
      },
      busy() { return morphT < 1 || scatter > 0.03; },
      update(dt, liveDt, pointerRay) {
        col.lerp(colTarget, Math.min(1, dt * 2.5));
        TONE_HI.set(key === "moon" ? (dark ? "#efe8cf" : "#8a8470") : (dark ? "#9fdcf5" : "#2f86ad"));
        TONE_INK.copy(ink).lerp(bg, 0.42);
        morphT = liveDt ? Math.min(1, morphT + liveDt / 1.5) : 1;
        const wantS = clamp(E.speed * 0.00028, 0, 0.7);
        scatter += (wantS - scatter) * Math.min(1, dt * (wantS > scatter ? 5 : 1.5));
        const pr = pointerRay ? localRay(pointerRay) : null;
        const R = 0.5, sdt = Math.min(liveDt, 0.033);
        const tp = target.pos, tt = target.tone;
        for (let i = 0; i < N; i++) {
          const j = i * 3;
          let e = clamp((morphT - delay[i]) / 0.4, 0, 1);
          e = e * e * (3 - 2 * e);
          const lift = Math.sin(e * Math.PI);
          const x = from[j] + (tp[j] - from[j]) * e + swirl[j] * lift;
          const y = from[j + 1] + (tp[j + 1] - from[j + 1]) * e + swirl[j + 1] * lift;
          const z = from[j + 2] + (tp[j + 2] - from[j + 2]) * e + swirl[j + 2] * lift;
          if (sdt > 0) {
            // a damped spring back to rest; the pointer pushes points off its ray
            let fx = -off[j] * 38 - vel[j] * 7, fy = -off[j + 1] * 38 - vel[j + 1] * 7, fz = -off[j + 2] * 38 - vel[j + 2] * 7;
            if (pr) {
              const wx = x + off[j] - pr.origin.x, wy = y + off[j + 1] - pr.origin.y, wz = z + off[j + 2] - pr.origin.z;
              const t = wx * pr.direction.x + wy * pr.direction.y + wz * pr.direction.z;
              const dx = wx - pr.direction.x * t, dy = wy - pr.direction.y * t, dz = wz - pr.direction.z * t;
              const dl = Math.sqrt(dx * dx + dy * dy + dz * dz);
              if (dl < R && dl > 1e-4) { const f = ((R - dl) / R) * 60 / dl; fx += dx * f; fy += dy * f; fz += dz * f; }
            }
            vel[j] += fx * sdt; vel[j + 1] += fy * sdt; vel[j + 2] += fz * sdt;
            off[j] += vel[j] * sdt; off[j + 1] += vel[j + 1] * sdt; off[j + 2] += vel[j + 2] * sdt;
          }
          cur[j] = x + off[j] + dirs[j] * scatter;
          cur[j + 1] = y + off[j + 1] + dirs[j + 1] * scatter;
          cur[j + 2] = z + off[j + 2] + dirs[j + 2] * scatter;
          ca.copy(tones[fromTone[i]]).lerp(tones[tt[i]], e);
          colors[j] = ca.r; colors[j + 1] = ca.g; colors[j + 2] = ca.b;
        }
        if (morphT >= 1) { from.set(tp); fromTone.set(tt); }
        geo.attributes.position.needsUpdate = true;
        geo.attributes.color.needsUpdate = true;
        mat.opacity = clamp((dark ? 0.8 : 0.66) * (narrow ? 0.34 : 1), 0, 1);
      },
    };
  })();

  /* ---- chapters: which section is being read, and what it asks for */
  let chapterEls = [], chapterInfo = [], chapterIdx = -2;
  function collectChapters() {
    chapterEls = [...doc.querySelectorAll(PAGE === "home" ? ".mod-row" : ".doc-section")];
    const cyc = PAGE_CYCLE[PAGE] || PAGE_CYCLE.home;
    chapterInfo = chapterEls.map((el, i) => {
      if (PAGE === "home") {
        const k = Object.keys(HOME_SHAPE).find((m) => el.classList.contains(m));
        return { shape: HOME_SHAPE[k] || "crewmate", team: null };
      }
      const id = el.id || "", h = el.querySelector("h2"), title = h ? h.textContent : "";
      let shape = null, team = null;
      for (const [re, s] of (PAGE_RULES[PAGE] || []).concat(SHAPE_RULES)) if (re.test(id)) { shape = s; break; }
      if (PAGE === "unknowns") for (const tm of TEAM) if (tm[0].test(title)) { team = tm; break; }
      if (!shape && team) shape = team[2];
      if (!shape) shape = cyc[i % cyc.length];
      return { shape, team: team ? team[1] : null };
    });
    chapterIdx = -2;
  }
  function currentChapter() {
    const line = innerHeight * 0.45;
    let idx = -1;
    for (let i = 0; i < chapterEls.length; i++) {
      if (chapterEls[i].getBoundingClientRect().top <= line) idx = i; else break;
    }
    return idx;
  }
  const chCol = new THREE.Color();
  function chapterColor(idx) {
    const info = chapterInfo[idx];
    if (info && info.team) return chCol.set(info.team[dark ? 1 : 0]);
    const want = window.TORSCROLL && TORSCROLL.accent ? TORSCROLL.accent() : null;
    if (want) chCol.setRGB(want[0] / 255, want[1] / 255, want[2] / 255); else chCol.copy(accentTarget);
    // neighbouring chapters drift a little apart in hue, so every section feels like its own room
    if (PAGE !== "home" && idx >= 0) chCol.offsetHSL((((idx * 3) % 7) - 3) * 0.02, 0, 0);
    return chCol;
  }
  function updateChapter(force, snap) {
    const idx = currentChapter();
    if (idx !== chapterIdx || force) {
      chapterIdx = idx;
      const info = chapterInfo[idx];
      emblem.want(info ? info.shape : (PAGE_CYCLE[PAGE] || PAGE_CYCLE.home)[0], idx, snap);
      updateCaption();
    }
    emblem.setColor(chapterColor(idx), snap);
  }

  /* ---- the caption under the emblem */
  const cap = doc.createElement("div");
  cap.id = "bg3d-cap";
  cap.setAttribute("aria-hidden", "true");
  cap.innerHTML = '<span class="n"></span><span class="h"></span>';
  canvas.after(cap);
  const HINT_KEY = "tormods-bg-poked";
  let poked = false;
  try { poked = localStorage.getItem(HINT_KEY) === "1"; } catch (e) { poked = false; }
  function updateCaption() {
    const de = (root.lang || "en").toLowerCase().startsWith("de");
    const name = (SHAPE_NAMES[emblem.key] || ["", ""])[de ? 1 : 0];
    const num = String(Math.max(0, chapterIdx + 1)).padStart(2, "0");
    cap.firstChild.textContent = `Fig. ${num} · ${name}`;
    cap.lastChild.textContent = poked ? "" : mqFine.matches
      ? (de ? "Klick auf den Hintergrund" : "Click the background")
      : (de ? "Tipp auf den Hintergrund" : "Tap the background");
  }
  const capV = new THREE.Vector3();
  function placeCaption(show) {
    if (!show || narrow) { cap.classList.remove("on"); return; }
    capV.set(0, -1.22, 0).applyMatrix4(emblem.group.matrixWorld).project(camera);
    const x = (capV.x * 0.5 + 0.5) * W, y = (-capV.y * 0.5 + 0.5) * H;
    if (capV.z > 1 || y > H - 30 || y < 70) { cap.classList.remove("on"); return; }
    cap.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translateX(-50%)`;
    cap.classList.add("on");
  }

  /* ---- a ring that spreads where the page was clicked */
  const ripples = [];
  const ringGeo = new THREE.RingGeometry(0.97, 1, 72, 1);
  for (let i = 0; i < 4; i++) {
    const r = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, fog: false, side: THREE.DoubleSide }));
    r.visible = false; r.userData.t = 1;
    ripples.push(r);
  }
  function ripple(worldRay) {
    const r = ripples.find((o) => o.userData.t >= 1) || ripples[0];
    worldRay.at(9 / Math.max(0.2, -worldRay.direction.z), r.position);
    r.quaternion.copy(camera.quaternion);
    r.userData.t = 0; r.visible = true;
    r.material.color.copy(emblem.color);
  }
  function updateRipples(dt) {
    for (const r of ripples) {
      if (r.userData.t >= 1) { r.visible = false; continue; }
      r.userData.t = Math.min(1, r.userData.t + dt / 0.9);
      const t = r.userData.t, e = 1 - Math.pow(1 - t, 3);
      r.scale.setScalar(0.1 + e * 2.6);
      r.material.opacity = (1 - t) * (dark ? 0.7 : 0.5);
    }
  }

  /* ------------------------------------------------------ dust (all pages) */
  const DUST = 1100, STREAKS = 220;
  const dustPos = new Float32Array(DUST * 3), dustBase = new Float32Array(DUST * 3);
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, M.dust);
  dust.frustumCulled = false;
  scene.add(dust);
  const streakPos = new Float32Array(STREAKS * 6);
  const streakGeo = new THREE.BufferGeometry();
  streakGeo.setAttribute("position", new THREE.BufferAttribute(streakPos, 3));
  const streaks = new THREE.LineSegments(streakGeo, streakMat);
  streaks.frustumCulled = false;
  scene.add(streaks);
  for (let i = 0; i < DUST; i++) {
    dustBase[i * 3] = rand(); dustBase[i * 3 + 1] = rand(); dustBase[i * 3 + 2] = 3 + rand() * 26;
  }
  let pokeT = 1;
  const pokeN = new THREE.Vector2();
  function updateDust() {
    const zMode = PAGE === "nightfall";
    const streak = clamp(E.vel * 0.00022, -0.7, 0.7);
    const hover = pointerOn && !zMode && mqFine.matches, wave = pokeT < 1 && !zMode;
    const cx = camera.position.x, cy = camera.position.y;
    for (let i = 0; i < DUST; i++) {
      const d = dustBase[i * 3 + 2], side = i % 2 ? 1 : -1;
      const x = E.gx(side, dustBase[i * 3], d);
      let y, z;
      if (zMode) {
        const dz = ((d * 2 - (-E.camZ) * 0.6) % 55 + 55) % 55 + 2;
        z = E.camZ - dz; y = (dustBase[i * 3 + 1] - 0.5) * E.hh(dz) * 2.2 + camera.position.y;
        dustPos[i * 3] = E.gx(side, dustBase[i * 3], dz);
      } else {
        const span = E.hh(d) * 2.2;
        y = E.camY + wrap(dustBase[i * 3 + 1] * span - E.camY * (1.5 - d / 29), span);
        z = -d;
        let xx = x;
        if (hover || wave) {
          const hw = E.hw(d), hh = E.hh(d);
          if (hover) {
            const dx = xx - (cx + ndcP.x * hw), dy = y - (cy + ndcP.y * hh), dl = Math.hypot(dx, dy), R = 0.12 * d;
            if (dl < R && dl > 1e-4) { const f = (1 - dl / R) * 0.05 * d / dl; xx += dx * f; y += dy * f; }
          }
          if (wave) {
            const dx = xx - (cx + pokeN.x * hw), dy = y - (cy + pokeN.y * hh), dl = Math.hypot(dx, dy) || 1;
            const g = dl - pokeT * 0.9 * d, f = Math.exp(-(g * g) / (0.006 * d * d)) * (1 - pokeT) * 0.06 * d / dl;
            xx += dx * f; y += dy * f;
          }
        }
        dustPos[i * 3] = xx;
      }
      dustPos[i * 3 + 1] = y; dustPos[i * 3 + 2] = z;
      if (i < STREAKS) {
        const j = i * 6;
        streakPos[j] = dustPos[i * 3]; streakPos[j + 1] = y; streakPos[j + 2] = z;
        streakPos[j + 3] = dustPos[i * 3];
        streakPos[j + 4] = zMode ? y : y - streak * (12 / d);
        streakPos[j + 5] = zMode ? z - streak * 3 : z;
      }
    }
    dustGeo.attributes.position.needsUpdate = true;
    streakGeo.attributes.position.needsUpdate = true;
    streaks.visible = Math.abs(streak) > 0.04;
  }

  /* ------------------------------------------------------ layout */
  let active = null;
  scene.add(emblem.group, ...ripples);
  const keep = new Set([dust, streaks, emblem.group, ...ripples]);
  function measure() {
    const reading = doc.querySelector(".reading") || doc.querySelector(".layout");
    if (!reading) { sMin = 0.62; return; }
    const r = reading.getBoundingClientRect();
    const side = doc.getElementById("sidebar");
    let l = r.left;
    if (side && side.offsetParent && getComputedStyle(side).position !== "fixed") l = Math.min(l, side.getBoundingClientRect().left);
    const half = Math.max(W / 2 - l, r.right - W / 2) + 20;
    sMin = clamp(half / (W / 2), 0.3, 1.2);
  }
  function build() {
    // throw away the old scene objects (keep dust + streaks)
    for (const o of [...scene.children]) if (!keep.has(o)) scene.remove(o);
    active = (SCENES[PAGE] || SCENES.home)();
    const [fn, ff] = active.fog || [8, 34];
    scene.fog.near = fn; scene.fog.far = ff;
    active.init();
  }
  function resize() {
    W = innerWidth; H = innerHeight;
    const newMob = W < 760;
    narrow = W < 900;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, newMob ? 1.25 : 1.5));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    if (newMob !== mob || !active) { mob = newMob; build(); }
    measure();
    applyTheme();
  }

  /* ------------------------------------------------------ motion */
  let lastScroll = scrollY, px = 0, py = 0, last = 0, raf = 0, dirty = true, idleGap = 0;
  let pointerOn = false, pointerAt = -1e9, chapterAt = -1e9, chapterScroll = NaN;
  const ndcP = new THREE.Vector2(), rayc = new THREE.Raycaster(), tintTarget = new THREE.Color();
  const K = 0.01;                                     // world units per scrolled pixel
  E.camY = moving() ? -scrollY * K : 0;
  E.camZ = moving() ? -scrollY * K * 1.6 : 0;
  addEventListener("pointermove", (e) => {
    if (!mqFine.matches) return;
    px = (e.clientX / innerWidth - 0.5) * 2; py = (e.clientY / innerHeight - 0.5) * 2;
    ndcP.set(px, -py); pointerOn = true; pointerAt = performance.now();
    kick();
  }, { passive: true });
  doc.addEventListener("mouseout", (e) => { if (!e.relatedTarget) pointerOn = false; });

  // a click on an empty part of the page: a ring, a wave through the dust, the emblem turns into the next shape
  const QUIET = "a,button,input,textarea,select,summary,label,img,video,svg,p,li,td,th,h1,h2,h3,h4,pre,code,table,figure,"
    + ".entry-head,.hero,#topbar,#sidebar,nav,footer,.lightbox,.map-view,[role=button],[contenteditable]";
  doc.addEventListener("click", (e) => {
    if (!moving() || e.button !== 0 || heroCovers()) return;
    if (e.target.closest && e.target.closest(QUIET)) return;
    const sel = getSelection && getSelection();
    if (sel && String(sel).length) return;
    pokeN.set((e.clientX / W) * 2 - 1, -(e.clientY / H) * 2 + 1);
    rayc.setFromCamera(pokeN, camera);
    emblem.burst(rayc.ray, 3.2);
    ripple(rayc.ray);
    pokeT = 0;
    emblem.next();
    if (!poked) { poked = true; try { localStorage.setItem(HINT_KEY, "1"); } catch (err) { /* storage blocked */ } }
    updateCaption();
    kick();
  });

  function step(dt) {
    const live = moving();
    E.dt = live ? dt : 0;
    if (live) E.t += dt;
    const target = live ? -scrollY * K : 0;
    const sv = live ? (scrollY - lastScroll) / Math.max(dt, 1 / 120) : 0;
    lastScroll = scrollY;
    E.vel += (clamp(sv, -6000, 6000) - E.vel) * Math.min(1, dt * 6);
    E.speed = Math.abs(E.vel);
    E.camY += (target - E.camY) * Math.min(1, dt * 5);
    E.camZ += (target * 1.6 - E.camZ) * Math.min(1, dt * 5);
    E.spin += (0.18 + E.speed * 0.0016) * E.dt;
    E.cpx += (px - E.cpx) * Math.min(1, dt * 3); E.cpy += (py - E.cpy) * Math.min(1, dt * 3);
    const max = root.scrollHeight - innerHeight;
    E.rp = live ? (max > 0 ? clamp(scrollY / max, 0, 1) : 0) : 1;

    if (active.camera) active.camera();
    else {
      camera.position.set(E.cpx * 0.35, E.camY - E.cpy * 0.25, 0);
      camera.rotation.set(0, 0, clamp(E.vel * -0.000012, -0.05, 0.05));
    }
    active.update();

    // which chapter is in view: re-read when the page moved, and now and then for late layout changes
    const nowMs = performance.now();
    if (scrollY !== chapterScroll || nowMs - chapterAt > 500) { chapterScroll = scrollY; chapterAt = nowMs; updateChapter(false, !live); }
    const ed = emblem.d, cam = !!active.camera;
    emblem.group.scale.setScalar(clamp(E.gw(ed) * 0.42, 0.45, 2.4));
    emblem.group.position.set(E.gc(emblem.side, ed), (cam ? 0.2 : E.camY) - (narrow ? E.hh(ed) * 0.12 : 0), (cam ? E.camZ : 0) - ed);
    emblem.group.rotation.set(0.12 + E.cpy * 0.12, emblem.side * -0.35 + Math.sin(E.t * 0.25) * 0.45 + E.cpx * 0.25, Math.sin(E.t * 0.3) * 0.04);
    camera.updateMatrixWorld();
    let pray = null;
    if (pointerOn && live && mqFine.matches) { rayc.setFromCamera(ndcP, camera); pray = rayc.ray; }
    emblem.update(dt, E.dt, pray);
    updateRipples(E.dt || 1);
    pokeT = live ? Math.min(1, pokeT + dt / 1.1) : 1;

    // the background leans towards the chapter colour (not above the first chapter: the hero frame is --bg)
    const tint = chapterIdx >= 0 ? (dark ? 0.05 : 0.045) : 0;
    tintTarget.copy(bg).lerp(emblem.color, tint);
    bgNow.lerp(tintTarget, live ? Math.min(1, dt * 2) : 1);
    renderer.setClearColor(bgNow, 1);
    scene.fog.color.copy(bgNow);
    updateDust();

    const want = window.TORSCROLL && TORSCROLL.accent ? TORSCROLL.accent() : null;
    if (want) accentTarget.setRGB(want[0] / 255, want[1] / 255, want[2] / 255);
    accent.lerp(accentTarget, Math.min(1, dt * 3));
    for (const m of mats) if (m.userData.kind === "accent") m.color.copy(accent);

    const hot = emblem.busy() || pokeT < 1 || ripples.some((r) => r.visible) || nowMs - pointerAt < 1200
      || Math.abs(bgNow.r - tintTarget.r) + Math.abs(bgNow.g - tintTarget.g) + Math.abs(bgNow.b - tintTarget.b) > 0.002;
    return hot || E.speed > 4 || Math.abs(target - E.camY) > 0.002;
  }

  function heroCovers() {
    const hero = doc.querySelector(".hero");
    return hero ? hero.getBoundingClientRect().bottom >= innerHeight - 2 : false;
  }
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    const busy = step(dt);
    idleGap += dt;
    const covered = heroCovers();
    if (!covered && (busy || dirty || idleGap > 1 / 30)) {
      renderer.render(scene, camera);
      idleGap = 0; dirty = false;
    }
    placeCaption(!covered);
    if (moving() && !doc.hidden) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }

  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { resize(); dirty = true; kick(); });
  doc.addEventListener("visibilitychange", kick);
  mqReduce.addEventListener("change", () => { dirty = true; kick(); });
  new MutationObserver(() => { applyTheme(); measure(); kick(); })
    .observe(root, { attributes: true, attributeFilter: ["data-theme", "data-fx"] });
  const content = doc.getElementById("content");
  if (content) new MutationObserver(() => { measure(); collectChapters(); updateChapter(true, true); dirty = true; kick(); }).observe(content, { childList: true });
  new MutationObserver(() => updateCaption()).observe(root, { attributes: true, attributeFilter: ["lang"] });
  addEventListener("load", () => { measure(); collectChapters(); updateChapter(true, true); dirty = true; kick(); });

  resize();
  collectChapters();
  updateChapter(true, true);
  kick();
}
