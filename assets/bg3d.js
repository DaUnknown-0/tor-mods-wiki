/* ============================================================================
 * TOR Mods Wiki: the 3D background (three.js, loaded as an ES module)
 * A field of wireframe objects floating at real depth in the side gutters,
 * behind the reading column: crewmates in Among Us colours everywhere, plus
 * the page's own motifs (dice, gears and satellites, crystals, moon and pines,
 * museum columns). Dust drifts through the whole volume.
 * Scrolling moves the camera down through the field on a spring, so it lags a
 * little and settles; the scroll SPEED spins the objects up, pulls the dust
 * into streaks and rolls the camera. At rest everything keeps drifting slowly.
 * The canvas is the page background (clear colour = --bg, fog fades into it).
 * Motion needs FX on and no prefers-reduced-motion; otherwise one still frame.
 * scroll.js publishes the accent the glow should follow (TORSCROLL.accent()).
 * ==========================================================================*/
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js";

const doc = document;
const root = doc.documentElement;
const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
const mqFine = matchMedia("(pointer: fine)");
const PAGE = doc.body.dataset.page || "home";
const moving = () => root.dataset.fx !== "off" && !mqReduce.matches;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

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

function cssColor(el, name, fallback) {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
}

/* ------------------------------------------------------------ renderer */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
} catch (e) {
  renderer = null;
}

if (renderer) boot();

function boot() {
  const canvas = renderer.domElement;
  canvas.id = "bg3d";
  canvas.setAttribute("aria-hidden", "true");
  doc.body.prepend(canvas);
  root.classList.add("has-bg3d");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
  const TAN = Math.tan(THREE.MathUtils.degToRad(48 / 2));
  scene.fog = new THREE.Fog(0xffffff, 8, 34);

  let W = 1, H = 1, mob = false;
  let sMin = 0.62;                 // gutters start here in normalised screen x
  let bg = new THREE.Color(), ink = new THREE.Color(), accent = new THREE.Color(), accentTarget = new THREE.Color();
  let dark = false;

  /* --------------------------------------------------------- materials */
  const mats = [];
  function lineMat(kind, color) {
    const m = new THREE.LineBasicMaterial({ color, transparent: true, depthWrite: false, fog: true });
    m.userData.kind = kind;
    mats.push(m);
    return m;
  }
  const CREW = ["#c51111", "#132ed1", "#117f2d", "#ed54ba", "#ef7d0d", "#f5f557", "#38fedc", "#6b2fbb", "#71491e", "#50ef39"];
  const crewMats = CREW.map((c) => lineMat("crew", new THREE.Color(c)));
  const visorMat = lineMat("visor", new THREE.Color("#7fc8e8"));
  const inkMat = lineMat("ink", new THREE.Color());
  const accMat = lineMat("accent", new THREE.Color());
  const pointsMat = new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, transparent: true, depthWrite: false, fog: true });
  const streakMat = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false, fog: true });

  function applyTheme() {
    dark = root.dataset.theme === "dark";
    bg = cssColor(doc.body, "--bg", dark ? "#141312" : "#f6f3ec");
    ink = cssColor(doc.body, "--ink", dark ? "#f1ece1" : "#191816");
    accentTarget = cssColor(doc.body, "--accent", "#c8323f");
    accent.copy(accentTarget);
    renderer.setClearColor(bg, 1);
    scene.fog.color.copy(bg);
    const narrow = W < 900;
    const a = (dark ? 0.42 : 0.3) * (narrow ? 0.45 : 1);
    for (const m of mats) {
      if (m.userData.kind === "crew") m.opacity = a * (dark ? 1 : 0.95);
      else if (m.userData.kind === "visor") { m.opacity = a * 1.1; m.color.set(dark ? "#9fdcf5" : "#2f86ad"); }
      else if (m.userData.kind === "ink") { m.opacity = a * 0.8; m.color.copy(ink); }
      else if (m.userData.kind === "accent") { m.opacity = a * 1.05; m.color.copy(accent); }
    }
    pointsMat.color.copy(ink); pointsMat.opacity = (dark ? 0.55 : 0.32) * (narrow ? 0.6 : 1);
    streakMat.color.copy(ink); streakMat.opacity = dark ? 0.2 : 0.13;
    dirty = true;
  }

  /* -------------------------------------------------------- the models */
  const wire = (geo) => new THREE.WireframeGeometry(geo);
  const edges = (geo, deg = 20) => new THREE.EdgesGeometry(geo, deg);
  function part(group, lines, mat, pos, scale) {
    const l = new THREE.LineSegments(lines, mat);
    if (pos) l.position.set(pos[0], pos[1], pos[2]);
    if (scale) l.scale.set(scale[0], scale[1], scale[2]);
    group.add(l);
    return l;
  }

  function crewmate() {
    const g = new THREE.Group();
    const m = pick(crewMats);
    part(g, wire(new THREE.CapsuleGeometry(0.42, 0.5, 3, 10)), m, [0, 0.08, 0]);
    part(g, wire(new THREE.SphereGeometry(0.24, 10, 6)), visorMat, [0, 0.32, 0.36], [1.3, 0.72, 0.7]);
    part(g, edges(new THREE.BoxGeometry(0.46, 0.56, 0.24)), m, [0, 0.02, -0.46]);
    part(g, edges(new THREE.CylinderGeometry(0.16, 0.16, 0.36, 8), 1), m, [-0.2, -0.5, 0]);
    part(g, edges(new THREE.CylinderGeometry(0.16, 0.16, 0.36, 8), 1), m, [0.2, -0.5, 0]);
    g.userData.r = 0.75;
    return g;
  }
  function asteroid() {
    const geo = new THREE.IcosahedronGeometry(0.7, 1);
    const p = geo.attributes.position, v = new THREE.Vector3();
    const jit = new Map();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const key = v.x.toFixed(3) + v.y.toFixed(3) + v.z.toFixed(3);
      if (!jit.has(key)) jit.set(key, 0.78 + rand() * 0.4);
      v.multiplyScalar(jit.get(key));
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    const g = new THREE.Group();
    part(g, edges(geo, 8), inkMat);
    g.userData.r = 0.8;
    return g;
  }
  function dice() {
    const g = new THREE.Group();
    part(g, edges(new THREE.BoxGeometry(1, 1, 1)), accMat);
    // pips as tiny rings on three faces (1, 2, 3)
    const pip = edges(new THREE.CircleGeometry(0.08, 8), 1);
    const faces = [
      [[0, 0]], [[-0.25, -0.25], [0.25, 0.25]], [[-0.25, -0.25], [0, 0], [0.25, 0.25]]
    ];
    faces[0].forEach(([a, b]) => { const l = part(g, pip, accMat, [a, b, 0.501]); });
    faces[1].forEach(([a, b]) => { const l = part(g, pip, accMat, [0.501, a, b]); l.rotation.y = Math.PI / 2; });
    faces[2].forEach(([a, b]) => { const l = part(g, pip, accMat, [a, 0.501, b]); l.rotation.x = -Math.PI / 2; });
    g.userData.r = 0.9;
    return g;
  }
  function gear() {
    const s = new THREE.Shape(), teeth = 10, r0 = 0.52, r1 = 0.68;
    for (let i = 0; i < teeth * 2; i++) {
      const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
      const r = i % 2 ? r0 : r1;
      if (i === 0) s.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
      else s.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
      s.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
    }
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.2, 0, Math.PI * 2, true); s.holes.push(hole);
    const g = new THREE.Group();
    part(g, edges(new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: false, curveSegments: 10 }), 25), rand() < 0.5 ? accMat : inkMat, [0, 0, -0.11]);
    g.userData.r = 0.75;
    return g;
  }
  function satellite() {
    const g = new THREE.Group();
    part(g, edges(new THREE.BoxGeometry(0.45, 0.45, 0.7)), inkMat);
    part(g, wire(new THREE.PlaneGeometry(1.1, 0.36, 4, 1)), accMat, [-0.82, 0, 0]);
    part(g, wire(new THREE.PlaneGeometry(1.1, 0.36, 4, 1)), accMat, [0.82, 0, 0]);
    part(g, edges(new THREE.ConeGeometry(0.18, 0.22, 8, 1, true), 1), inkMat, [0, 0, 0.46]).rotation.x = Math.PI / 2;
    g.userData.r = 1.3;
    return g;
  }
  function crystal() {
    const g = new THREE.Group();
    part(g, edges(new THREE.OctahedronGeometry(0.55, 0), 1), accMat, null, [0.8, 1.5, 0.8]);
    g.userData.r = 0.8;
    return g;
  }
  function pine() {
    const g = new THREE.Group();
    const m = rand() < 0.5 ? accMat : inkMat;
    part(g, edges(new THREE.ConeGeometry(0.55, 0.7, 7), 1), m, [0, 0.1, 0]);
    part(g, edges(new THREE.ConeGeometry(0.42, 0.6, 7), 1), m, [0, 0.5, 0]);
    part(g, edges(new THREE.ConeGeometry(0.28, 0.5, 7), 1), m, [0, 0.85, 0]);
    part(g, edges(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6), 1), inkMat, [0, -0.4, 0]);
    g.userData.r = 0.8; g.userData.upright = true;
    return g;
  }
  function column() {
    const g = new THREE.Group();
    part(g, edges(new THREE.CylinderGeometry(0.2, 0.22, 1.6, 10), 1), inkMat);
    part(g, edges(new THREE.BoxGeometry(0.62, 0.14, 0.62)), accMat, [0, 0.87, 0]);
    part(g, edges(new THREE.BoxGeometry(0.62, 0.14, 0.62)), accMat, [0, -0.87, 0]);
    g.userData.r = 0.95; g.userData.upright = true;
    return g;
  }
  function moon() {
    const g = new THREE.Group();
    part(g, wire(new THREE.SphereGeometry(2.4, 18, 12)), accMat);
    const ring = new THREE.EdgesGeometry(new THREE.RingGeometry(3.4, 3.42, 64, 1), 1);
    part(g, ring, inkMat).rotation.x = Math.PI / 2.4;
    g.userData.r = 3.4; g.userData.big = true;
    return g;
  }

  const SETS = {
    home: [[crewmate, 5], [asteroid, 3], [satellite, 1], [dice, 1], [gear, 1], [pine, 1]],
    chance: [[dice, 5], [crewmate, 4], [asteroid, 2]],
    useful: [[gear, 4], [satellite, 2], [crewmate, 4]],
    unknowns: [[crystal, 4], [crewmate, 5], [asteroid, 1]],
    nightfall: [[pine, 4], [crewmate, 3], [asteroid, 2]],
    atlas: [[pine, 4], [column, 3], [crewmate, 4]],
    test: [[crewmate, 5], [asteroid, 4]]
  };
  const bag = [];
  for (const [fn, n] of SETS[PAGE] || SETS.home) for (let i = 0; i < n; i++) bag.push(fn);

  /* ------------------------------------------------------------ field */
  const objs = [];
  const COUNT_DESK = 26, COUNT_MOB = 12;
  function makeField() {
    for (const o of objs) scene.remove(o);
    objs.length = 0;
    const n = mob ? COUNT_MOB : COUNT_DESK;
    for (let i = 0; i < n; i++) {
      const o = pick(bag)();
      const d = 7 + rand() * 17;                         // depth in front of the camera
      const side = i % 2 ? 1 : -1;
      o.userData.d = d;
      o.userData.side = side;
      o.userData.su = rand();                            // where in the gutter
      o.userData.by = (rand() - 0.5) * 2;                // base y, in units of the wrap span
      o.userData.par = 0.55 + (24 - d) / 24 * 0.7;       // near things move a bit faster
      o.userData.spin = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.5);
      o.userData.rot0 = new THREE.Euler(rand() * 6, rand() * 6, rand() * 6);
      o.userData.bob = rand() * 6;
      const sc = (0.8 + rand() * 0.7) * (o.userData.big ? 1 : 1);
      o.scale.setScalar(sc);
      o.userData.sc = sc;
      scene.add(o);
      objs.push(o);
    }
    if (PAGE === "nightfall") {                         // one moon, far and high
      const m = moon();
      m.userData.fixed = true; m.userData.d = 26; m.userData.side = 1; m.userData.su = 0.55;
      m.userData.by = 0.25; m.userData.par = 0.25; m.userData.spin = new THREE.Vector3(0, 0.12, 0);
      m.userData.rot0 = new THREE.Euler(0.3, 0, 0.2); m.userData.bob = 0; m.userData.sc = 1;
      scene.add(m); objs.push(m);
    }
  }

  // dust: points everywhere, a subset also draws a streak whose length follows the scroll speed
  const DUST = 1400, STREAKS = 260;
  const dustPos = new Float32Array(DUST * 3), dustBase = new Float32Array(DUST * 3);
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, pointsMat);
  dust.frustumCulled = false;
  scene.add(dust);
  const streakPos = new Float32Array(STREAKS * 6);
  const streakGeo = new THREE.BufferGeometry();
  streakGeo.setAttribute("position", new THREE.BufferAttribute(streakPos, 3));
  const streaks = new THREE.LineSegments(streakGeo, streakMat);
  streaks.frustumCulled = false;
  scene.add(streaks);
  for (let i = 0; i < DUST; i++) {
    const d = 3 + rand() * 26;
    dustBase[i * 3] = rand();                           // position inside the gutter (0..1)
    dustBase[i * 3 + 1] = rand();                       // wrap phase
    dustBase[i * 3 + 2] = d;
  }

  /* ------------------------------------------------------------ layout */
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
  function resize() {
    W = innerWidth; H = innerHeight;
    const newMob = W < 760;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, newMob ? 1.25 : 1.5));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    if (newMob !== mob || !objs.length) { mob = newMob; makeField(); }
    measure();
    applyTheme();
  }

  /* ------------------------------------------------------------ motion */
  let camY = -scrollY * 0.01, vel = 0, lastScroll = scrollY, spinAcc = 0;
  let px = 0, py = 0, cpx = 0, cpy = 0;
  let t = 0, last = 0, raf = 0, dirty = true, idleGap = 0;
  const K = 0.01;                                     // world units per scrolled pixel

  addEventListener("pointermove", (e) => {
    if (!mqFine.matches) return;
    px = (e.clientX / innerWidth - 0.5) * 2; py = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  function place(dt) {
    const live = moving();
    const target = live ? -scrollY * K : 0;
    const sv = live ? (scrollY - lastScroll) / Math.max(dt, 1 / 120) : 0;   // px per second
    lastScroll = scrollY;
    vel += (clamp(sv, -6000, 6000) - vel) * Math.min(1, dt * 6);
    camY += (target - camY) * Math.min(1, dt * 5);
    const speed = Math.abs(vel);
    spinAcc += (0.18 + speed * 0.0016) * dt;
    cpx += (px - cpx) * Math.min(1, dt * 3); cpy += (py - cpy) * Math.min(1, dt * 3);

    camera.position.set(cpx * 0.35, camY - cpy * 0.25, 0);
    camera.rotation.set(0, 0, clamp(vel * -0.000012, -0.05, 0.05));
    const narrow = W < 900;

    for (const o of objs) {
      const u = o.userData;
      const hh = u.d * TAN;                            // visible half height at this depth
      const hw = hh * camera.aspect;
      const span = hh * 2 + u.r * 2 * u.sc + 2;
      // wrap vertically around the camera, near objects with a touch more parallax
      const rel = u.by * span * 0.5 - camY * u.par;
      const y = camY + (((rel + span / 2) % span) + span) % span - span / 2;
      let s;
      if (narrow && !u.fixed) s = u.side * (0.2 + u.su * 0.9);
      else s = u.side * (sMin + u.su * Math.max(0.05, 1.05 - sMin));
      const margin = narrow ? 0 : (u.r * u.sc) / hw;
      const sx = Math.sign(s) * (Math.abs(s) + margin);
      o.position.set(sx * hw, y + Math.sin(t * 0.5 + u.bob) * 0.12, -u.d);
      if (u.upright) {
        o.rotation.set(Math.sin(t * 0.3 + u.bob) * 0.15, u.rot0.y + spinAcc * u.spin.y * 6, Math.sin(t * 0.4 + u.bob) * 0.1);
      } else {
        o.rotation.set(u.rot0.x + spinAcc * u.spin.x * 4, u.rot0.y + spinAcc * u.spin.y * 4, u.rot0.z + spinAcc * u.spin.z * 3);
      }
    }

    // dust + streaks
    const streak = clamp(vel * 0.00022, -0.7, 0.7);
    for (let i = 0; i < DUST; i++) {
      const d = dustBase[i * 3 + 2];
      const hh = d * TAN, hw = hh * camera.aspect, span = hh * 2.2;
      const rel = dustBase[i * 3 + 1] * span - camY * (1.5 - d / 29);
      const y = camY + ((rel % span) + span) % span - span / 2;
      // wide screens: dust stays in the gutters; narrow ones have none, so it spreads out
      const g = dustBase[i * 3], side = i % 2 ? 1 : -1;
      const x = (narrow ? side * g * 1.1 : side * (sMin + g * Math.max(0.05, 1.1 - sMin))) * hw;
      dustPos[i * 3] = x; dustPos[i * 3 + 1] = y; dustPos[i * 3 + 2] = -d;
      if (i < STREAKS) {
        const j = i * 6;
        streakPos[j] = x; streakPos[j + 1] = y; streakPos[j + 2] = -d;
        streakPos[j + 3] = x; streakPos[j + 4] = y - streak * (12 / d); streakPos[j + 5] = -d;
      }
    }
    dustGeo.attributes.position.needsUpdate = true;
    streakGeo.attributes.position.needsUpdate = true;
    streaks.visible = Math.abs(streak) > 0.04;

    // accent colour follows scroll.js (home: the mod row in view)
    const want = window.TORSCROLL && TORSCROLL.accent ? TORSCROLL.accent() : null;
    if (want) accentTarget.setRGB(want[0] / 255, want[1] / 255, want[2] / 255);
    accent.lerp(accentTarget, Math.min(1, dt * 3));
    accMat.color.copy(accent);

    return speed > 4 || Math.abs(target - camY) > 0.002;
  }

  function heroCovers() {
    const hero = doc.querySelector(".hero");
    return hero ? hero.getBoundingClientRect().bottom >= innerHeight - 2 : false;
  }

  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    const live = moving();
    if (live) t += dt;
    const busy = place(dt);
    // at rest the drift runs at ~30 fps; scrolling gets every frame
    idleGap += dt;
    if (!heroCovers() && (busy || dirty || idleGap > 1 / 30)) {
      renderer.render(scene, camera);
      idleGap = 0; dirty = false;
    }
    if (live && !doc.hidden) raf = requestAnimationFrame(frame);
  }
  function kick() {
    if (!raf) { last = 0; raf = requestAnimationFrame(frame); }
  }

  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { resize(); kick(); });
  doc.addEventListener("visibilitychange", kick);
  mqReduce.addEventListener("change", () => { dirty = true; kick(); });
  new MutationObserver(() => { applyTheme(); measure(); kick(); })
    .observe(root, { attributes: true, attributeFilter: ["data-theme", "data-fx"] });
  const content = doc.getElementById("content");
  if (content) new MutationObserver(() => { measure(); dirty = true; kick(); }).observe(content, { childList: true });
  addEventListener("load", () => { measure(); dirty = true; kick(); });

  resize();
  kick();
}
