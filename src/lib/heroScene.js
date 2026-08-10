import * as THREE from "three";
import { buildTexasShape } from "./texasOutline.js";

/**
 * Hero instrument scene — "eight datasets, one briefing" rendered as real geometry.
 *
 * Eight translucent slabs stack above an extruded Texas base plate. A red thread
 * pierces two of them where a risk only visible across two systems correlates,
 * and a pulse runs the thread down to the lease on the ground.
 *
 * Loaded dynamically so Three.js never lands in the critical path.
 */

const PALETTE = {
  slab: 0x16294a,
  slabEdge: 0x5b86ff,
  base: 0x1a2f52,
  baseEdge: 0x9dbaff,
  marker: 0x7aa0ff,
  alert: 0xff3b54,
  thread: 0xc8102e,
};

const RIG_REST_Y = -0.34;
const SLAB_COUNT = 8;
const SLAB_GAP = 0.3;
const SLAB_W = 3.05;
const SLAB_D = 2.15;

// The two planes the correlated signal threads through, and where it lands.
const ALERT_UPPER = 6;
const ALERT_LOWER = 2;
const ALERT_X = 0.62;
const ALERT_Z = -0.34;

/** Deterministic scatter so the marker field is identical on every load. */
function pseudoRandom(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function initHeroScene(canvas, { reduceMotion = false } = {}) {
  if (!canvas) return () => {};

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    return () => {};
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.9, 6.6);
  camera.lookAt(0, 0.05, 0);

  const rig = new THREE.Group();
  // Composed to sit behind and below the briefing panel: the stack is the work,
  // the panel is the output.
  rig.position.set(0.95, RIG_REST_Y, 0);
  rig.scale.setScalar(0.72);
  rig.rotation.x = -0.4;
  rig.rotation.y = -0.62;
  scene.add(rig);

  const disposables = [];
  const track = (obj) => {
    disposables.push(obj);
    return obj;
  };

  // ---- Texas base plate: the ground the datasets describe -------------------
  const baseGeometry = track(
    new THREE.ExtrudeGeometry(buildTexasShape(), {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.012,
      bevelSegments: 2,
    })
  );
  baseGeometry.center();

  const base = new THREE.Mesh(
    baseGeometry,
    track(
      new THREE.MeshStandardMaterial({
        color: PALETTE.base,
        metalness: 0.66,
        roughness: 0.32,
        emissive: 0x0c1a33,
        emissiveIntensity: 0.9,
      })
    )
  );
  base.rotation.x = -Math.PI / 2;
  base.position.y = -(SLAB_COUNT * SLAB_GAP) / 2 - 0.34;
  rig.add(base);

  const baseEdges = new THREE.LineSegments(
    track(new THREE.EdgesGeometry(baseGeometry, 25)),
    track(
      new THREE.LineBasicMaterial({
        color: PALETTE.baseEdge,
        transparent: true,
        opacity: 0.75,
      })
    )
  );
  base.add(baseEdges);

  // ---- Eight dataset slabs --------------------------------------------------
  const slabGeometry = track(new THREE.BoxGeometry(SLAB_W, 0.022, SLAB_D));
  const slabEdgeGeometry = track(new THREE.EdgesGeometry(slabGeometry));
  const markerGeometry = track(new THREE.IcosahedronGeometry(0.028, 0));
  const alertGeometry = track(new THREE.IcosahedronGeometry(0.05, 1));

  const slabs = [];

  for (let i = 0; i < SLAB_COUNT; i += 1) {
    const y = (i - (SLAB_COUNT - 1) / 2) * SLAB_GAP;
    const involved = i === ALERT_UPPER || i === ALERT_LOWER;

    const group = new THREE.Group();
    group.position.y = y;
    rig.add(group);

    const slab = new THREE.Mesh(
      slabGeometry,
      track(
        new THREE.MeshStandardMaterial({
          color: PALETTE.slab,
          metalness: 0.5,
          roughness: 0.42,
          transparent: true,
          opacity: 0,
          emissive: involved ? 0x1b2440 : 0x0a1224,
          emissiveIntensity: 0.6,
        })
      )
    );
    group.add(slab);

    const edges = new THREE.LineSegments(
      slabEdgeGeometry,
      track(
        new THREE.LineBasicMaterial({
          color: involved ? PALETTE.alert : PALETTE.slabEdge,
          transparent: true,
          opacity: 0,
        })
      )
    );
    group.add(edges);

    // Sparse marker field — records on this dataset, not decoration.
    const markerCount = 5 + Math.floor(pseudoRandom(i * 3.3) * 4);
    const markers = new THREE.InstancedMesh(
      markerGeometry,
      track(
        new THREE.MeshStandardMaterial({
          color: PALETTE.marker,
          emissive: PALETTE.marker,
          emissiveIntensity: 0.85,
          metalness: 0.2,
          roughness: 0.5,
          transparent: true,
          opacity: 0,
        })
      ),
      markerCount
    );

    const matrix = new THREE.Matrix4();
    for (let m = 0; m < markerCount; m += 1) {
      const seed = i * 17.7 + m * 4.1;
      matrix.setPosition(
        (pseudoRandom(seed) - 0.5) * (SLAB_W - 0.5),
        0.045,
        (pseudoRandom(seed + 91.3) - 0.5) * (SLAB_D - 0.4)
      );
      markers.setMatrixAt(m, matrix);
    }
    markers.instanceMatrix.needsUpdate = true;
    group.add(markers);
    track(markers);

    slabs.push({ group, slab, edges, markers, restY: y, involved });
  }

  // ---- The correlated signal ------------------------------------------------
  const upperY = (ALERT_UPPER - (SLAB_COUNT - 1) / 2) * SLAB_GAP;
  const lowerY = (ALERT_LOWER - (SLAB_COUNT - 1) / 2) * SLAB_GAP;
  const groundY = base.position.y + 0.16;

  const signal = new THREE.Group();
  signal.position.set(ALERT_X, 0, ALERT_Z);
  rig.add(signal);

  const threadHeight = upperY - groundY;
  const thread = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.0075, 0.0075, threadHeight, 6, 1, true)),
    track(
      new THREE.MeshBasicMaterial({
        color: PALETTE.thread,
        transparent: true,
        opacity: 0,
      })
    )
  );
  thread.position.y = groundY + threadHeight / 2;
  signal.add(thread);

  const alertMaterial = track(
    new THREE.MeshStandardMaterial({
      color: PALETTE.alert,
      emissive: PALETTE.alert,
      emissiveIntensity: 1.4,
      metalness: 0.1,
      roughness: 0.4,
      transparent: true,
      opacity: 0,
    })
  );

  const alertNodes = [upperY, lowerY, groundY].map((y) => {
    const node = new THREE.Mesh(alertGeometry, alertMaterial);
    node.position.y = y;
    signal.add(node);
    return node;
  });

  const pulse = new THREE.Mesh(
    track(new THREE.IcosahedronGeometry(0.036, 1)),
    track(
      new THREE.MeshBasicMaterial({
        color: 0xffd9de,
        transparent: true,
        opacity: 0,
      })
    )
  );
  signal.add(pulse);

  // ---- Lighting -------------------------------------------------------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.42));

  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(3.2, 5.4, 4.1);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x3d6bff, 1.45);
  rim.position.set(-4.4, 1.6, -3.2);
  scene.add(rim);

  const grounding = new THREE.PointLight(0xc8102e, 6, 7, 2);
  grounding.position.set(1.4, -1.9, 1.2);
  scene.add(grounding);

  // ---- Interaction + loop ---------------------------------------------------
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const host = canvas.parentElement || canvas;

  const onPointerMove = (event) => {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.ty = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  };
  const onPointerLeave = () => {
    pointer.tx = 0;
    pointer.ty = 0;
  };

  let visible = true;
  let rafId = 0;
  let bootStart = 0;
  const BOOT_MS = 1500;

  // Cached so the render loop can derive scroll progress from scrollY alone,
  // without measuring layout every frame.
  let hostTop = 0;
  let hostHeight = 1;

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const rect = host.getBoundingClientRect();
    hostTop = rect.top + window.scrollY;
    hostHeight = rect.height || 1;
  }

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  function frame(now) {
    if (!bootStart) bootStart = now;
    const t = now * 0.001;
    const boot = reduceMotion ? 1 : clamp01((now - bootStart) / BOOT_MS);

    pointer.x += (pointer.tx - pointer.x) * 0.055;
    pointer.y += (pointer.ty - pointer.y) * 0.055;

    if (!reduceMotion) {
      // Scrolling the hero away tips the stack further back and sinks it, so
      // the object belongs to the page rather than looping behind it.
      const scrolled = clamp01((window.scrollY - hostTop) / hostHeight);

      rig.rotation.y = -0.62 + Math.sin(t * 0.14) * 0.16 + pointer.x * 0.26;
      rig.rotation.x = -0.4 + pointer.y * 0.1 - scrolled * 0.22;
      rig.position.y = RIG_REST_Y - scrolled * 0.55;
    }

    slabs.forEach((entry, i) => {
      // Slabs settle bottom-up, so the stack assembles like a boot sequence.
      const stagger = (i / SLAB_COUNT) * 0.45;
      const local = easeOut(clamp01((boot - stagger) / (1 - stagger)));
      const drift = reduceMotion ? 0 : Math.sin(t * 0.5 + i * 0.55) * 0.012;

      entry.group.position.y = entry.restY + drift + (1 - local) * 0.85;
      entry.slab.material.opacity = local * (entry.involved ? 0.62 : 0.44);
      entry.edges.material.opacity = local * (entry.involved ? 0.7 : 0.4);
      entry.markers.material.opacity = local * 0.9;
    });

    const signalIn = easeOut(clamp01((boot - 0.55) / 0.45));
    thread.material.opacity = signalIn * 0.7;
    alertMaterial.opacity = signalIn;

    if (reduceMotion) {
      pulse.material.opacity = 0;
    } else {
      // One pulse every ~3.4s: the correlation resolving down to the lease.
      const cycle = (t % 3.4) / 3.4;
      const travel = clamp01(cycle / 0.55);
      pulse.position.y = upperY + (groundY - upperY) * easeOut(travel);
      pulse.material.opacity = signalIn * (travel < 1 ? 0.9 : 0);

      const flare = travel >= 1 ? Math.max(0, 1 - (cycle - 0.55) / 0.2) : 0;
      alertMaterial.emissiveIntensity = 1.4 + flare * 2.6;
      alertNodes[2].scale.setScalar(1 + flare * 0.5);
    }

    renderer.render(scene, camera);
    // Reduced motion gets one composed still frame instead of a render loop.
    rafId = reduceMotion ? 0 : requestAnimationFrame(frame);
  }

  function start() {
    if (rafId || !visible) return;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    start();
  });
  resizeObserver.observe(canvas);

  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    },
    { threshold: 0 }
  );
  intersectionObserver.observe(canvas);

  const onVisibilityChange = () => {
    if (document.hidden) stop();
    else start();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  if (!reduceMotion) {
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
  }

  resize();
  start();

  return () => {
    stop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    host.removeEventListener("pointermove", onPointerMove);
    host.removeEventListener("pointerleave", onPointerLeave);
    disposables.forEach((item) => item.dispose?.());
    renderer.dispose();
  };
}
