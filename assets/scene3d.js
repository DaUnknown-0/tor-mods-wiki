/* ============================================================================
 * TOR Mods Wiki: the page backgrounds as real 3D scenes.
 * Every page has a scene built once in Blender (Assets/Branding/wiki_scenes/
 * <page>.py, Halloween: wiki_halloween/build_scene.py) and exported to
 * assets/scenes/<page>.glb. This module loads it, adds what lives in the
 * browser (sky, stars, moon or sun, light, mist, bats, fireflies, sparks, eyes
 * in the dark, glows around lit windows and lamps) and moves the camera along
 * the points the scene brings ("cam_0" ... with "cam_i_look") as you scroll.
 * Names the scenes use:  objects "spin_<axis>_<rpm>_*" turn, "bob_*" float,
 * "ghost" floats and fades, "*noshadow*" casts no shadow; materials "glow_*", "win_*", "pumpkin_glow",
 * "lantern_glow" flicker and get a halo, "screen_*" glow steadily.
 * Per page: haloScale shrinks the halos, lampLight scales the warm lamp lights.
 * bg3d.js keeps drawing the chapter emblem on its own transparent canvas above.
 * Motion needs FX on and no prefers-reduced-motion; otherwise one still frame
 * per scroll position. Without WebGL or the file the page stays as it was.
 * window.TORSCENE drives the background-only view (app.js, the scene button in
 * the top bar): the page hides, the camera follows a position of its own
 * (slider, wheel, keys) or travels the path by itself (tour).
 * ==========================================================================*/
import * as THREE from "./vendor/three.module.min.js";
import { GLTFLoader } from "./vendor/GLTFLoader.js";

const doc = document;
const root = doc.documentElement;
const PAGE = doc.body.dataset.page || "home";
const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
const mqFine = matchMedia("(pointer: fine)");
const moving = () => root.dataset.fx !== "off" && !mqReduce.matches;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const TAU = Math.PI * 2;

/* ------------------------------------------------------------- page setups */
const NIGHT = { stars: 900, hemi: [0x6a5a9a, 0x0c0a12, 0.55] };
export const CONFIG = {
  halloween: { ...NIGHT, file: "scenes/halloween.glb", sky: ["#04030a", "#1d0f2e", "#5a2236"], fog: ["#1a1028", 0.018], exposure: 1.05,
    dir: { color: 0xbfc8ff, i: 1.5, pos: [30, 40, -60], target: [0, 0, -20] },
    moon: { pos: [38, 46, -150], size: 44, halo: 190, disc: ["#fff1c8", "#f6c072", "#e39a52"], haloCol: "255,190,120" },
    bats: { center: [0, 0, -34], r: [7, 21], y: [14, 26], n: 16 }, mist: { n: 30, col: "190,170,230", area: [70, 60, 20] },
    embers: { n: 140, col: 0xffa040, area: [50, 12, 50, 15] } },
  home: { file: "scenes/home.glb", sky: ["#000003", "#03051a", "#0c1a44"], fog: ["#03061a", 0.0035], exposure: 1.1, stars: 1800,
    hemi: [0x5068b0, 0x05060c, 0.45], dir: { color: 0xfff2e0, i: 2.4, pos: [-80, 60, 40], target: [0, 0, 0] },
    glowPlanet: { pos: [0, -440, -380], r: 420, col: "110,170,255" }, shadows: false },
  chance: { file: "scenes/chance.glb", sky: ["#07050a", "#120c10", "#1c1212"], fog: ["#0e0a0c", 0.03], exposure: 1.0, stars: 0,
    hemi: [0x7a5a40, 0x0a0606, 0.35], dir: { color: 0xffe2b0, i: 0.6, pos: [6, 20, 8], target: [0, 0, 0] },
    spot: { pos: [0, 7.5, 0], target: [0, 1, 0], color: 0xffd9a0, i: 220, angle: 0.62 }, motes: { n: 80, col: 0xffe2a8, area: [10, 6, 10, 0] } },
  useful: { file: "scenes/useful.glb", sky: ["#05070a", "#0c1218", "#141c24"], fog: ["#0b1016", 0.024], exposure: 1.35, stars: 0,
    hemi: [0x90a0c0, 0x10141a, 0.85], dir: { color: 0xd0e0ff, i: 1.1, pos: [-6, 14, 10], target: [0, 0, 0] },
    sparks: { at: "sparks", n: 90 } },
  unknowns: { file: "scenes/unknowns.glb", sky: ["#05030a", "#120a22", "#1d1030"], fog: ["#130b22", 0.03], exposure: 1.05, stars: 0,
    hemi: [0x8a60d0, 0x0a0612, 0.45], dir: { color: 0xc8b0ff, i: 0.5, pos: [4, 20, 6], target: [0, 0, -10] },
    motes: { n: 120, col: 0xc9a0ff, area: [14, 6, 40, -12] } },
  nightfall: { ...NIGHT, file: "scenes/nightfall.glb", sky: ["#02030a", "#0a1430", "#22345e"], fog: ["#0d1630", 0.025], exposure: 1.05,
    dir: { color: 0xbcd0ff, i: 1.3, pos: [-30, 50, -80], target: [0, 0, -20] },
    moon: { pos: [-30, 55, -160], size: 46, halo: 200, disc: ["#f6f4ea", "#dedbcc", "#b9b7a8"], haloCol: "200,215,255" },
    fireflies: { n: 70, col: 0xd8ff8a, area: [30, 4, 50, 5] }, eyes: { n: 9, area: [34, 2.5, 50, -6] }, mist: { n: 22, col: "150,170,220", area: [50, 50, 10] },
    haloScale: 0.5, lampLight: 0.8 },
  atlas: { file: "scenes/atlas.glb", sky: ["#120e2c", "#c46a52", "#4a2c4c"], fog: ["#4a3050", 0.009], exposure: 1.05, stars: 300,
    hemi: [0xb0a0ff, 0x2a1a20, 0.6], dir: { color: 0xffc89a, i: 2.0, pos: [-60, 25, -50], target: [0, 0, 0] },
    motes: { n: 60, col: 0xffd0a0, area: [60, 20, 60, 0] } },
};
const CFG = CONFIG[PAGE];

function radialTexture(stops, size = 128) {
  const c = doc.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [p, col] of stops) gr.addColorStop(p, col);
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const rnd = (a, b) => a + Math.random() * (b - a);

function boot() {
  if (!CFG) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); } catch (e) { return; }
  const mob = innerWidth < 760 || matchMedia("(pointer: coarse)").matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mob ? 1.25 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = CFG.exposure || 1;
  renderer.shadowMap.enabled = !mob && CFG.shadows !== false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.id = "s3d";
  canvas.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(new THREE.Color(CFG.fog[0]), CFG.fog[1]);
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 1200);
  const updates = [];                    // (t, dt) => void, all animated extras

  /* ---------------------------------------------------- sky, stars, moon */
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(CFG.sky[0]) }, mid: { value: new THREE.Color(CFG.sky[1]) }, low: { value: new THREE.Color(CFG.sky[2]) } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top; uniform vec3 mid; uniform vec3 low; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.12 ? mix(mid, top, smoothstep(0.12, 0.7, h)) : mix(low, mid, smoothstep(-0.05, 0.12, h)); gl_FragColor = vec4(c, 1.0); }"
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), skyMat);
  scene.add(sky);
  if (CFG.stars) {
    const sp = [];
    for (let i = 0; i < CFG.stars; i++) {
      const a = Math.random() * TAU, h = PAGE === "home" ? rnd(-0.6, 1) : rnd(0.12, 1), r = 850, ch = Math.sqrt(1 - h * h);
      sp.push(Math.cos(a) * ch * r, h * r, Math.sin(a) * ch * r);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    const m = new THREE.PointsMaterial({ color: 0xfff4e0, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.85, fog: false, depthWrite: false });
    scene.add(new THREE.Points(g, m));
    updates.push((t) => { m.opacity = 0.7 + 0.15 * Math.sin(t * 0.9); });
  }
  if (CFG.moon) {
    const mo = CFG.moon, p = new THREE.Vector3(...mo.pos);
    const disc = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture([[0, mo.disc[0]], [0.55, mo.disc[1]], [0.68, mo.disc[2]], [0.7, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,0)"]], 256), fog: false, depthWrite: false }));
    disc.position.copy(p); disc.scale.setScalar(mo.size); scene.add(disc);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture([[0, "rgba(" + mo.haloCol + ",.55)"], [0.25, "rgba(" + mo.haloCol + ",.16)"], [1, "rgba(0,0,0,0)"]]), fog: false, depthWrite: false, blending: THREE.AdditiveBlending }));
    halo.position.copy(p).add(new THREE.Vector3(0, 0, 1)); halo.scale.setScalar(mo.halo); scene.add(halo);
  }
  if (CFG.glowPlanet) {                  // atmosphere rim around the planet
    const gp = CFG.glowPlanet;
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide, fog: false,
      uniforms: { col: { value: new THREE.Color("rgb(" + gp.col + ")") } },
      vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "uniform vec3 col; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 3.0); gl_FragColor = vec4(col * f * 1.6, f); }"
    });
    const atm = new THREE.Mesh(new THREE.SphereGeometry(gp.r * 1.06, 64, 32), m);
    atm.position.set(...gp.pos); scene.add(atm);
  }

  /* ---------------------------------------------------------------- light */
  scene.add(new THREE.HemisphereLight(CFG.hemi[0], CFG.hemi[1], CFG.hemi[2]));
  const dl = CFG.dir, sun = new THREE.DirectionalLight(dl.color, dl.i);
  sun.position.set(...dl.pos); sun.target.position.set(...dl.target);
  sun.castShadow = renderer.shadowMap.enabled;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 220 });
  sun.shadow.bias = -0.0008;
  scene.add(sun, sun.target);
  if (CFG.spot) {
    const s = CFG.spot, l = new THREE.SpotLight(s.color, s.i, 30, s.angle, 0.5, 1.6);
    l.position.set(...s.pos); l.target.position.set(...s.target); l.castShadow = renderer.shadowMap.enabled;
    l.shadow.mapSize.set(1024, 1024); scene.add(l, l.target);
  }
  const warm = [];
  function warmLight(p, power, dist, color) {
    const l = new THREE.PointLight(color || 0xffa850, power, dist, 2);
    l.position.copy(p); scene.add(l); warm.push({ l, base: power, ph: Math.random() * TAU });
  }

  /* ------------------------------------------------------- glow sprites */
  const texCache = {};
  function glowTex(col) {
    if (!texCache[col]) texCache[col] = radialTexture([[0, "rgba(" + col + ",1)"], [0.2, "rgba(" + col + ",.45)"], [1, "rgba(" + col + ",0)"]]);
    return texCache[col];
  }
  const glows = [];
  function glow(pos, size, group, col) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(col), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55, fog: true }));
    s.position.copy(pos); s.scale.setScalar(size);
    scene.add(s); glows.push({ s, group, base: 0.55, ph: Math.random() * TAU });
  }

  /* ----------------------------------------------------------- extras */
  function points(n, color, size, additive) {
    const g = new THREE.BufferGeometry(), arr = new Float32Array(n * 3);
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const m = new THREE.PointsMaterial({ color, size, sizeAttenuation: false, transparent: true, opacity: 0.8, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending });
    scene.add(new THREE.Points(g, m));
    return { g, m, arr };
  }
  if (CFG.mist) {
    const mi = CFG.mist, tex = radialTexture([[0, "rgba(" + mi.col + ",.55)"], [0.5, "rgba(" + mi.col + ",.18)"], [1, "rgba(" + mi.col + ",0)"]]);
    const list = [];
    for (let i = 0; i < (mob ? mi.n / 2 : mi.n); i++) {
      const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: rnd(0.2, 0.4), fog: true }));
      const x = rnd(-0.5, 0.5) * mi.area[0], z = -Math.random() * mi.area[1] + mi.area[2];
      m.position.set(x, 0.8, z); m.scale.set(rnd(18, 34), rnd(4, 7), 1);
      scene.add(m); list.push({ m, x, v: rnd(0.4, 1.2), ph: Math.random() * TAU });
    }
    updates.push((t) => { for (const e of list) e.m.position.x = e.x + Math.sin(t * 0.05 * e.v + e.ph) * 6; });
    updates.ground = list;
  }
  function drift(key, color, size, additive, rise) {
    const c = CFG[key]; if (!c) return;
    const n = mob ? c.n / 2 | 0 : c.n, P = points(n, color, size, additive), seed = [];
    for (let i = 0; i < n; i++) seed.push({ x: rnd(-0.5, 0.5) * c.area[0], y: Math.random() * c.area[1], z: -Math.random() * c.area[2] + c.area[3], v: rnd(0.3, 0.9), ph: Math.random() * TAU });
    updates.push((t) => {
      for (let i = 0; i < n; i++) {
        const e = seed[i];
        P.arr[i * 3] = e.x + Math.sin(t * 0.4 * e.v + e.ph) * 1.5;
        P.arr[i * 3 + 1] = rise ? (e.y + t * e.v * 0.35) % c.area[1] + 0.3 : e.y + Math.sin(t * 0.6 * e.v + e.ph) * 0.6;
        P.arr[i * 3 + 2] = e.z + Math.cos(t * 0.3 * e.v + e.ph) * 1.5;
      }
      P.g.attributes.position.needsUpdate = true;
      P.m.opacity = key === "fireflies" ? 0.5 + 0.45 * Math.sin(t * 2.2) : 0.55 + 0.25 * Math.sin(t * 2);
    });
  }
  drift("embers", CFG.embers && CFG.embers.col, 3, true, true);
  drift("fireflies", CFG.fireflies && CFG.fireflies.col, 3.5, true, false);
  drift("motes", CFG.motes && CFG.motes.col, 2, true, false);

  if (CFG.bats) {
    const b = CFG.bats, mat = new THREE.MeshBasicMaterial({ color: 0x07050b, side: THREE.DoubleSide, fog: true });
    const sh = new THREE.Shape();
    sh.moveTo(0, 0); sh.quadraticCurveTo(0.35, 0.25, 0.9, 0.12); sh.lineTo(0.72, -0.02); sh.lineTo(0.6, 0.06);
    sh.lineTo(0.48, -0.06); sh.lineTo(0.34, 0.02); sh.lineTo(0.2, -0.08); sh.closePath();
    const wingGeo = new THREE.ShapeGeometry(sh), bodyGeo = new THREE.SphereGeometry(0.12, 8, 6), list = [];
    for (let i = 0; i < (mob ? b.n / 2 : b.n); i++) {
      const g = new THREE.Group(), body = new THREE.Mesh(bodyGeo, mat); body.scale.set(1, 0.8, 1.6); g.add(body);
      const wl = new THREE.Mesh(wingGeo, mat), wr = new THREE.Mesh(wingGeo, mat);
      wl.rotation.x = -Math.PI / 2; wr.rotation.x = -Math.PI / 2; wr.scale.x = -1;
      const pl = new THREE.Group(), pr = new THREE.Group(); pl.add(wl); pr.add(wr); g.add(pl, pr);
      g.scale.setScalar(rnd(0.9, 1.8)); scene.add(g);
      list.push({ g, pl, pr, r: rnd(b.r[0], b.r[1]), y: rnd(b.y[0], b.y[1]), sp: rnd(0.25, 0.6) * (Math.random() < 0.5 ? -1 : 1), ph: Math.random() * TAU, fl: rnd(9, 14) });
    }
    updates.push((t) => {
      for (const e of list) {
        const a = t * e.sp + e.ph;
        e.g.position.set(b.center[0] + Math.cos(a) * e.r, e.y + Math.sin(t * 0.7 + e.ph) * 1.5, b.center[2] + Math.sin(a) * e.r * 0.6);
        e.g.rotation.y = -a + (e.sp > 0 ? Math.PI : 0);
        const f = Math.sin(t * e.fl + e.ph) * 0.9; e.pl.rotation.z = f; e.pr.rotation.z = -f;
      }
    });
  }
  if (CFG.eyes) {                         // pairs of red eyes in the dark that blink and vanish
    const c = CFG.eyes, tex = glowTex("255,50,40"), list = [];
    for (let i = 0; i < c.n; i++) {
      const g = new THREE.Group();
      for (const dx of [-0.16, 0.16]) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
        s.position.x = dx; s.scale.setScalar(0.55); g.add(s);
      }
      g.position.set(rnd(-0.5, 0.5) * c.area[0], rnd(0.6, c.area[1]), -Math.random() * c.area[2] + c.area[3]);
      scene.add(g); list.push({ g, ph: Math.random() * 40, per: rnd(6, 13) });
    }
    updates.push((t) => {
      for (const e of list) {
        const u = ((t + e.ph) % e.per) / e.per;
        let a = u < 0.08 ? u / 0.08 : u < 0.55 ? 1 : u < 0.62 ? 1 - (u - 0.55) / 0.07 : 0;
        if (Math.abs(u - 0.3) < 0.012) a = 0;                                  // blink
        for (const s of e.g.children) s.material.opacity = a * 0.9;
      }
    });
  }

  /* ------------------------------------------------------------ the model */
  const FLICK = /^(glow_|win_|pumpkin_glow|lantern_glow)/, flick = [];
  const spins = [], bobs = [];
  let ghost = null, ghostMats = [], ghostY = 0, sparkAt = null;
  const camKeys = [];
  let ready = false;

  function clusters(mesh, cell) {
    mesh.updateWorldMatrix(true, false);
    const pos = mesh.geometry.attributes.position, v = new THREE.Vector3(), map = new Map();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      const k = Math.round(v.x / cell) + "," + Math.round(v.y / cell) + "," + Math.round(v.z / cell);
      let e = map.get(k); if (!e) { e = new THREE.Vector3(); e.n = 0; map.set(k, e); }
      e.add(v); e.n++;
    }
    return [...map.values()].map((e) => e.multiplyScalar(1 / e.n));
  }
  const glowColor = (name) => /win_c|green|screen/.test(name) ? "150,240,180" : /thruster|window|blue|ice/.test(name) ? "140,210,255"
    : /beacon|red/.test(name) ? "255,80,70" : /violet|purple/.test(name) ? "190,140,255" : "255,175,90";

  new GLTFLoader().load("assets/" + CFG.file, (gltf) => {
    const m = gltf.scene;
    m.traverse((o) => {
      const nm = o.name || "";
      const sm = /^spin_([xyz])_(-?[\d.]+)_/.exec(nm);
      if (sm) spins.push({ o, axis: sm[1], rpm: parseFloat(sm[2]) });
      if (/^bob_/.test(nm)) bobs.push({ o, y: o.position.y, ph: Math.random() * TAU });
      if (nm === "ghost") ghost = o;
      if (nm === "sparks") sparkAt = o;
      if (!o.isMesh) return;
      const name = o.material && o.material.name || "";
      o.castShadow = !/terrain|ghost|planet|noshadow/.test((o.parent ? o.parent.name : "") + nm);
      o.receiveShadow = true;
      if (FLICK.test(name)) { o.material = o.material.clone(); flick.push({ mat: o.material, base: o.material.emissiveIntensity || 1, ph: Math.random() * TAU, name }); }
      if (/^ghost/.test(name)) { o.castShadow = false; o.material.transparent = true; ghostMats.push(o.material); }
    });
    scene.add(m);
    scene.updateMatrixWorld(true);
    let lights = 0;
    m.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const name = o.material.name || "";
      if (!FLICK.test(name)) return;
      const big = /lantern|lamp|thruster|beacon/.test(name), hs = CFG.haloScale || 1;
      for (const p of clusters(o, /thruster/.test(name) ? 4 : big ? 0.8 : 1.4)) {       // one halo per engine, not per vertex group
        glow(p, (/thruster/.test(name) ? 7 : big ? 3.8 : /pumpkin/.test(name) ? 2.4 : 3.6) * hs, name, glowColor(name));
        if (/lantern|lamp/.test(name) && !mob && lights < 8) { warmLight(p.clone().add(new THREE.Vector3(0, 0.3, 0)), 3.5 * (CFG.lampLight || 1), 8); lights++; }
      }
    });
    if (ghost) ghostY = ghost.position.y;
    for (let i = 0; i < 12; i++) {
      const a = m.getObjectByName("cam_" + i), b = m.getObjectByName("cam_" + i + "_look");
      if (a && b) camKeys.push({ p: a.getWorldPosition(new THREE.Vector3()), l: b.getWorldPosition(new THREE.Vector3()) });
    }
    if (camKeys.length < 2) camKeys.push({ p: new THREE.Vector3(0, 4, 24), l: new THREE.Vector3(0, 2, 0) }, { p: new THREE.Vector3(0, 8, 14), l: new THREE.Vector3(0, 2, 0) });
    if (updates.ground) {
      const terrainObj = m.getObjectByName("terrain"), ray = new THREE.Raycaster(), down = new THREE.Vector3(0, -1, 0);
      if (terrainObj) for (const e of updates.ground) {
        ray.set(new THREE.Vector3(e.m.position.x, 80, e.m.position.z), down);
        const hit = ray.intersectObject(terrainObj, true)[0];
        if (hit) e.m.position.y = hit.point.y + 0.8;
      }
    }
    if (CFG.sparks && sparkAt) {
      // welding sparks: short bursts from the torch tip, each spark lives well under a second, cools from white to
      // orange to nothing, falls with gravity and skitters on the bench top; a blue-white flash sits at the tip
      const c = CFG.sparks, n = c.n, g = new THREE.BufferGeometry(), arr = new Float32Array(n * 3), col = new Float32Array(n * 3);
      g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      g.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const pm = new THREE.PointsMaterial({ size: 2.6, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const pts = new THREE.Points(g, pm); pts.frustumCulled = false; scene.add(pts);
      const base = sparkAt.getWorldPosition(new THREE.Vector3()), floor = base.y - 0.08, seed = [];
      for (let i = 0; i < n; i++) {
        const a = Math.random() * TAU, sp = rnd(0.25, 1.1);
        seed.push({ vx: Math.cos(a) * sp, vz: Math.sin(a) * sp, vy: rnd(0.3, 1.6), life: rnd(0.25, 0.75), ph: Math.random() });
      }
      const on = (tt) => (tt % 2.3) < 1.6 && Math.sin(tt * 9.0) > -0.6;            // welding on and off in bursts
      const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("200,225,255"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
      flash.position.copy(base); scene.add(flash);
      const fl = new THREE.PointLight(0xbfd8ff, 0, 5, 2); fl.position.copy(base).add(new THREE.Vector3(0, 0.15, 0)); scene.add(fl);
      updates.push((t) => {
        for (let i = 0; i < n; i++) {
          const e = seed[i], age = ((t / e.life + e.ph) % 1), born = t - age * e.life, s = age * e.life;
          let y = base.y + e.vy * s - 4.9 * s * s, f = 1;
          if (y < floor) { y = floor; f = 0.55; }                                    // landed: lies on the bench and cools
          arr[i * 3] = base.x + e.vx * s * f; arr[i * 3 + 1] = y; arr[i * 3 + 2] = base.z + e.vz * s * f;
          const k = on(born) ? Math.pow(1 - age, 1.6) : 0;
          col[i * 3] = k; col[i * 3 + 1] = k * (0.95 - 0.55 * age); col[i * 3 + 2] = k * 0.75 * (1 - age) * (1 - age);
        }
        g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
        const lit = on(t);
        flash.material.opacity = lit ? 0.6 + Math.random() * 0.4 : 0;
        flash.scale.setScalar(lit ? rnd(0.35, 0.6) : 0.01);
        fl.intensity = lit ? 3 + Math.random() * 3 : 0;
      });
    }
    ready = true;
    doc.body.prepend(canvas);
    root.classList.add("has-s3d");
    resize(); loop(performance.now());
    dispatchEvent(new Event("torscene:ready"));
  }, undefined, () => { /* keep the page as it was */ });

  /* -------------------------------------------------------- camera by scroll */
  const tmpP = new THREE.Vector3(), tmpL = new THREE.Vector3(), off = new THREE.Vector3();
  let progress = 0, shown = 0, ptx = 0, pty = 0, cpx = 0, cpy = 0;
  function readScroll() {
    const max = Math.max(1, doc.documentElement.scrollHeight - innerHeight);
    progress = clamp(scrollY / max, 0, 1);
  }
  function sampleCam(p, outP, outL) {
    const n = camKeys.length - 1, f = p * n, i = Math.min(n - 1, Math.floor(f)), t = f - i;
    const s = t * t * (3 - 2 * t);
    outP.lerpVectors(camKeys[i].p, camKeys[i + 1].p, s);
    outL.lerpVectors(camKeys[i].l, camKeys[i + 1].l, s);
  }

  /* ---------------------------------------------------------------- loop */
  let W = 0, H = 0, last = 0, t = 0, raf = 0;
  function resize() {
    W = innerWidth; H = innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.fov = W / H < 1 ? 58 : 44;
    camera.updateProjectionMatrix();
  }
  const axisMap = { x: "x", y: "z", z: "y" };        // Blender axis -> three.js axis (Y up)
  function loop(now) {
    raf = 0;
    if (!ready) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
    last = now;
    const anim = moving() && !doc.hidden;
    if (anim) t += dt;
    if (view.on) {
      if (view.tour && anim) {                   // the tour runs the path back and forth, about a minute each way
        view.p += dt * 0.017 * view.dir;
        if (view.p >= 1) { view.p = 1; view.dir = -1; } else if (view.p <= 0) { view.p = 0; view.dir = 1; }
      }
      progress = view.p;
    } else readScroll();
    shown += (progress - shown) * (anim ? 1 - Math.pow(0.002, dt) : 1);
    cpx += (ptx - cpx) * Math.min(1, dt * 3); cpy += (pty - cpy) * Math.min(1, dt * 3);
    sampleCam(shown, tmpP, tmpL);
    const pk = view.on ? 2.5 : 1;                // the pointer looks around further when nothing else is on screen
    off.set(cpx * 1.2 * pk + Math.sin(t * 0.21) * 0.25, -cpy * 0.6 * pk + Math.sin(t * 0.17) * 0.15, 0);
    camera.position.copy(tmpP).add(off); camera.lookAt(tmpL);

    const fl = (ph, sp) => 0.78 + 0.22 * Math.sin(t * sp + ph) * Math.sin(t * sp * 0.37 + ph * 2);
    const speed = (n) => /pumpkin|thruster/.test(n) ? 7 : /lantern|lamp|beacon/.test(n) ? 2 : 1.3;
    for (const e of flick) {
      const drop = /^win_/.test(e.name) && Math.sin(t * 13 + e.ph * 5) > 0.985 ? 0.35 : 1;
      const blink = /beacon/.test(e.name) ? (Math.sin(t * 3) > 0.3 ? 1 : 0.1) : 1;
      e.mat.emissiveIntensity = e.base * fl(e.ph, speed(e.name)) * drop * blink;
    }
    for (const g of glows) g.s.material.opacity = g.base * fl(g.ph, speed(g.group)) * (/beacon/.test(g.group) ? (Math.sin(t * 3) > 0.3 ? 1 : 0.1) : 1);
    for (const w of warm) w.l.intensity = w.base * fl(w.ph, 3);
    for (const s of spins) s.o.rotation[axisMap[s.axis]] += (anim ? dt : 0) * s.rpm / 60 * TAU * (s.axis === "y" ? -1 : 1);
    for (const b of bobs) b.o.position.y = b.y + Math.sin(t * 0.6 + b.ph) * 0.35;
    if (ghost) {
      ghost.position.y = ghostY + Math.sin(t * 0.9) * 0.35;
      ghost.rotation.y += anim ? dt * 0.15 : 0;
      for (const gm of ghostMats) gm.opacity = (gm.name === "ghost" ? 0.5 : 0.7) + Math.sin(t * 0.8) * 0.12;
    }
    for (const u of updates) u(t, dt);

    renderer.render(scene, camera);
    if (anim) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf && ready) raf = requestAnimationFrame(loop); }

  /* ------------------------------------------------- background-only view */
  const view = { on: false, p: 0, tour: false, dir: 1 };
  window.TORSCENE = {
    setView(on) {
      view.on = !!on;
      if (view.on) { readScroll(); view.p = progress; view.dir = 1; } else view.tour = false;
      root.classList.toggle("s3d-view", view.on);
      kick();
    },
    setProgress(p) { view.p = clamp(p, 0, 1); kick(); },
    setTour(on) { view.tour = !!on; kick(); },
    get progress() { return view.on ? view.p : progress; },
    get tour() { return view.tour; },
  };
  addEventListener("resize", () => { resize(); kick(); });
  addEventListener("scroll", kick, { passive: true });
  doc.addEventListener("visibilitychange", kick);
  addEventListener("pointermove", (e) => {
    if (!mqFine.matches || !moving()) return;
    ptx = (e.clientX / innerWidth - 0.5) * 2; pty = (e.clientY / innerHeight - 0.5) * 2; kick();
  }, { passive: true });
  new MutationObserver(kick).observe(root, { attributes: true, attributeFilter: ["data-fx", "data-theme"] });
}

if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot); else boot();
