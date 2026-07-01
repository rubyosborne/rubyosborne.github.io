import * as THREE from 'three/webgpu';
import {
  float,
  vec2,
  vec3,
  color,
  uniform,
  texture,
  uv,
  time,
  mix,
  smoothstep,
  clamp as tslClamp,
  max,
  pow,
  positionLocal,
  normalize,
} from 'three/tsl';

/**
 * Interactive photoreal canopy, flat-plane, fragment-shader parallax.
 *
 * Per deep-research findings: professionals do NOT vertex-displace a mesh from
 * a depth map (that tears/spikes at depth edges + periphery). Instead the depth
 * is faked entirely in the FRAGMENT SHADER by offsetting UVs by depth × gaze.
 * The plane stays flat, so there is no geometry to stretch. We also "cover-fit"
 * the UVs (CSS background-size:cover in a shader) so a portrait photo never
 * stretches on a wide plane.
 *
 *   finalUv = coverUv + gaze * (depth - pivot) * parallaxScale
 *   color   = texture(photo, finalUv)
 *
 * Sources: Codrops fake-3D / WebGPU depth-map, LearnOpenGL parallax,
 * r3f-image-cover. See chat for citations.
 *
 * Assets in /public: canopy.jpg (required), canopy-depth.jpg (optional, big
 * quality boost), floor.jpg (optional).
 */

const CANOPY_SRC = '/canopy.jpg';
const DEPTH_SRC = '/canopy-depth.jpg';

const FOV = 60;
const DIST = 2; // distance from camera to the canopy plane

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

export async function initForest() {
  const canvas = document.getElementById('forest') as HTMLCanvasElement | null;
  const host = document.getElementById('scene') || canvas;
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0e0c08, 1);
  await renderer.init();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 0); // static, parallax is in the shader, not the camera

  // --- Load textures first -------------------------------------------------
  const loader = new THREE.TextureLoader();
  const loadTex = (src: string): Promise<THREE.Texture | null> =>
    new Promise((resolve) => {
      loader.load(
        src,
        (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          resolve(t);
        },
        undefined,
        () => resolve(null)
      );
    });

  let [cTex, dTex] = await Promise.all([loadTex(CANOPY_SRC), loadTex(DEPTH_SRC)]);
  if (!cTex) {
    cTex = makeFallbackCanopy();
    cTex.colorSpace = THREE.SRGBColorSpace;
    const hintEl = document.getElementById('assetHint');
    if (hintEl) hintEl.style.display = 'block';
  }
  if (dTex) dTex.colorSpace = THREE.LinearSRGBColorSpace; // depth is data, not color

  const imgAspect = (cTex.image?.width || 4) / (cTex.image?.height || 3);

  // --- Uniforms ------------------------------------------------------------
  const uGaze = uniform(new THREE.Vector2(0, 0));
  const uCover = uniform(new THREE.Vector2(1, 1)); // cover-fit scale, recomputed on resize
  const uParallax = uniform(0.05);
  const uWind = uniform(reduceMotion ? 0 : 1);

  // --- Sky sphere (golden-hour, shows through the keyed-out gaps) ----------
  const skyDir = normalize(positionLocal);
  const skyBase = mix(color(0xd9974a), color(0xf6ead0), smoothstep(0.0, 0.72, skyDir.y.mul(0.5).add(0.5)));
  const sun = pow(max(skyDir.dot(normalize(vec3(0.32, 0.42, -1.0))), float(0.0)), float(7.0));
  const skyMat = new THREE.MeshBasicNodeMaterial();
  skyMat.colorNode = mix(skyBase, color(0xfff7e6), sun.mul(0.9));
  skyMat.side = THREE.BackSide;
  skyMat.depthWrite = false;
  const sky = new THREE.Mesh(new THREE.SphereGeometry(40, 48, 24), skyMat);
  sky.renderOrder = -10;
  scene.add(sky);

  // --- Canopy: FLAT plane, fragment-shader parallax ------------------------
  // cover-fit UVs (zoomed in slightly to leave margin for the parallax offset)
  const coverUv = uv().sub(0.5).mul(uCover).add(0.5);

  // depth: real depth map if provided, else luminance of the photo
  const preCol = texture(cTex, coverUv);
  const lumPre = preCol.r.mul(0.299).add(preCol.g.mul(0.587)).add(preCol.b.mul(0.114));
  const depth = dTex
    ? texture(dTex as THREE.Texture, coverUv).r
    : float(1.0).sub(lumPre); // near branches (dark) = high depth

  // parallax + a little idle breeze, all as a UV offset (no geometry moves)
  const breeze = vec2(
    time.mul(0.5).sin().mul(0.0018),
    time.mul(0.37).cos().mul(0.0014)
  ).mul(uWind);
  const offset = uGaze.mul(depth.sub(0.35)).mul(uParallax).add(breeze.mul(depth));
  const finalUv = tslClamp(coverUv.add(offset), float(0.0), float(1.0));

  const col = texture(cTex, finalUv);

  // Natural grade: trust the photo (it's already golden-hour with a sun-flare).
  // Just a whisper of a vignette to settle the edges.
  const dCenter = uv().sub(vec2(0.5, 0.5)).length();
  const vignette = float(1.0).sub(smoothstep(0.62, 1.0, dCenter).mul(0.25));
  const canopyColor = col.rgb.mul(vignette);

  const canopyMat = new THREE.MeshBasicNodeMaterial();
  canopyMat.colorNode = canopyColor; // opaque full-frame background, no sky keying
  const canopy = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), canopyMat); // flat, 1 quad
  canopy.position.set(0, 0, -DIST);
  scene.add(canopy);

  // (Floor removed, canopy-only scene.)

  // --- Sizing: make the plane fill the frustum, recompute cover on resize --
  let planeH = 1;
  function fit() {
    const aspect = window.innerWidth / window.innerHeight;
    const visH = 2 * Math.tan((FOV * Math.PI) / 180 / 2) * DIST;
    planeH = visH * 1.1; // small over-scan so edges never gap (less zoom than before)
    const planeW = planeH * aspect;
    canopy.scale.set(planeW, planeH, 1);

    // cover-fit: sample a centered sub-rect of the image, only a hair of margin
    const planeAspect = planeW / planeH;
    const sx = Math.min(planeAspect / imgAspect, 1) * 0.98;
    const sy = Math.min(imgAspect / planeAspect, 1) * 0.98;
    uCover.value.set(sx, sy);
  }
  fit();

  // --- Gaze input (mouse / drag / gyro / drift) ----------------------------
  let tgx = 0,
    tgy = 0,
    gx = 0,
    gy = 0;
  let dragX = 0,
    dragY = 0,
    lastX = 0,
    lastY = 0,
    dragging = false;
  let tiltX = 0,
    tiltY = 0,
    gyroOn = false,
    interacted = false,
    leanX = 0;

  const hint = document.getElementById('hint');
  const mark = () => {
    if (interacted) return;
    interacted = true;
    if (hint) hint.style.opacity = '0';
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      tgx = (e.clientX / window.innerWidth) * 2 - 1;
      tgy = (e.clientY / window.innerHeight) * 2 - 1;
      mark();
      proximity(e.clientX, e.clientY);
    },
    { passive: true }
  );
  host!.addEventListener('touchstart', (e: any) => {
    dragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }, { passive: true });
  host!.addEventListener('touchmove', (e: any) => {
    if (!dragging) return;
    dragX = clamp(dragX + (e.touches[0].clientX - lastX) / window.innerWidth, -1, 1);
    dragY = clamp(dragY + (e.touches[0].clientY - lastY) / window.innerHeight, -1, 1);
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    mark();
  }, { passive: true });
  host!.addEventListener('touchend', () => (dragging = false), { passive: true });

  function onOrient(e: DeviceOrientationEvent) {
    if (e.gamma == null || e.beta == null) return;
    gyroOn = true;
    tiltX = clamp(e.gamma / 35, -1, 1);
    tiltY = clamp((e.beta - 70) / 45, -1, 1);
  }
  const DOE = (window as any).DeviceOrientationEvent;
  if (DOE && typeof DOE.requestPermission === 'function') {
    window.addEventListener('touchend', function ask() {
      DOE.requestPermission()
        .then((s: string) => s === 'granted' && window.addEventListener('deviceorientation', onOrient, true))
        .catch(() => {});
      window.removeEventListener('touchend', ask);
    }, { once: true });
  } else if (DOE) {
    window.addEventListener('deviceorientation', onOrient, true);
  }

  // --- Labels --------------------------------------------------------------
  const labelMe = document.getElementById('labelMe') as HTMLAnchorElement | null;
  const labelWork = document.getElementById('labelWork') as HTMLAnchorElement | null;
  let nearL = false,
    nearR = false;
  const activate = (label: HTMLElement | null, side: number, on: boolean) => {
    if (!label) return;
    label.classList.toggle('is-active', on);
    leanX = on ? side * 0.5 : 0;
  };
  function proximity(px: number, py: number) {
    const near = (el: HTMLElement | null) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2)) < Math.max(190, r.width * 1.4);
    };
    const l = near(labelMe),
      r = near(labelWork);
    if (l !== nearL) { nearL = l; activate(labelMe, -1, l); }
    if (r !== nearR) { nearR = r; activate(labelWork, 1, r); }
  }
  ([[labelMe, -1], [labelWork, 1]] as const).forEach(([label, side]) => {
    if (!label) return;
    label.addEventListener('mouseenter', () => activate(label, side, true));
    label.addEventListener('mouseleave', () => activate(label, side, false));
    label.addEventListener('focus', () => activate(label, side, true));
    label.addEventListener('blur', () => activate(label, side, false));
    label.addEventListener('touchend', (e) => {
      e.preventDefault();
      activate(label, side, true);
      const href = label.getAttribute('href') || '/';
      setTimeout(() => (window.location.href = href), 600);
    }, { passive: false });
  });
  setTimeout(() => {
    labelMe?.classList.remove('is-quiet');
    labelWork?.classList.remove('is-quiet');
  }, 600);

  // --- Animation loop ------------------------------------------------------
  const t0 = performance.now();
  function animate() {
    const t = (performance.now() - t0) / 1000;
    const driftX = reduceMotion ? 0 : Math.sin(t * 0.25) * 0.12;
    const driftY = reduceMotion ? 0 : Math.cos(t * 0.2) * 0.1;

    let ax: number, ay: number;
    if (gyroOn) {
      ax = clamp(tiltX + driftX * 0.5, -1, 1);
      ay = clamp(tiltY + driftY * 0.5, -1, 1);
    } else if (Math.abs(dragX) > 0.001 || Math.abs(dragY) > 0.001) {
      ax = clamp(dragX + driftX * 0.4, -1, 1);
      ay = clamp(dragY + driftY * 0.4, -1, 1);
    } else if (interacted) {
      ax = clamp(tgx, -1, 1);
      ay = clamp(tgy, -1, 1);
    } else {
      ax = driftX;
      ay = driftY;
    }
    if (reduceMotion) { ax = 0; ay = -0.2; }

    gx += (ax + leanX - gx) * 0.06;
    gy += (ay - gy) * 0.06;

    // Parallax via shader uniform (note: y inverted so "look up" pushes correctly).
    uGaze.value.set(gx, -gy);

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  document.addEventListener('visibilitychange', () => {
    renderer.setAnimationLoop(document.hidden ? null : animate);
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    fit();
  });

  // --- Procedural fallbacks (only if a photo is missing) -------------------
  function makeFallbackCanopy(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 768;
    const x = c.getContext('2d')!;
    const g = x.createRadialGradient(660, 200, 40, 512, 384, 760);
    g.addColorStop(0, '#fff7e6');
    g.addColorStop(0.3, '#f6ead0');
    g.addColorStop(0.65, '#e8b96a');
    g.addColorStop(1, '#d9974a');
    x.fillStyle = g;
    x.fillRect(0, 0, 1024, 768);
    x.strokeStyle = '#0e0c08';
    x.lineCap = 'round';
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const limb = (x0: number, y0: number, ang: number, len: number, w: number, depth: number) => {
      if (depth <= 0 || len < 18) return;
      const ex = x0 + Math.cos(ang) * len,
        ey = y0 + Math.sin(ang) * len;
      x.lineWidth = w;
      x.beginPath();
      x.moveTo(x0, y0);
      x.quadraticCurveTo((x0 + ex) / 2 + (rnd() - 0.5) * len * 0.4, (y0 + ey) / 2 + (rnd() - 0.5) * len * 0.4, ex, ey);
      x.stroke();
      if (depth <= 2) {
        x.fillStyle = rnd() > 0.5 ? 'rgba(40,54,33,0.85)' : 'rgba(20,30,18,0.9)';
        x.beginPath();
        x.arc(ex, ey, 14 + rnd() * 26, 0, Math.PI * 2);
        x.fill();
        x.strokeStyle = '#0e0c08';
      }
      const n = rnd() > 0.7 ? 3 : 2;
      for (let i = 0; i < n; i++) limb(ex, ey, ang + (i / (n - 1) - 0.5) * 0.9 + (rnd() - 0.5) * 0.3, len * 0.7, w * 0.6, depth - 1);
    };
    for (const [rx, ry] of [[40, 40], [980, 30], [30, 740], [990, 750], [512, 0], [0, 384], [1024, 400], [512, 768]] as const)
      limb(rx, ry, Math.atan2(360 - ry, 512 - rx), 150, 22, 5);
    return new THREE.CanvasTexture(c);
  }
}
