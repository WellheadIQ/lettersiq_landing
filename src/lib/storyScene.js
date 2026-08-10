import * as THREE from "three";
import { buildTexasShape, isInsideTexas } from "./texasOutline.js";
import { storyChapters } from "./storyChapters.js";

/**
 * The morning loop, rendered as one persistent world instead of a video.
 *
 * Eight dataset planes hang over a Texas ground plate carrying the operator's
 * leases. Scroll is the conductor: an overnight record ignites, joins run from
 * it across systems and down to the leases it actually touches, the findings
 * assemble into a ranked briefing, and the night grades into 7:00 AM.
 *
 * The scene never rebuilds between chapters. Every chapter is the same place
 * under different camera, light, and state values, interpolated from one
 * ledger, so any scroll position reproduces exactly one frame.
 */

const PALETTE = {
  ground: 0x152a4d,
  groundEdge: 0x8fb2ff,
  plane: 0x11213c,
  planeEdge: 0x4b74dd,
  record: 0x7aa0ff,
  lease: 0x6f97f5,
  alert: 0xff3b54,
  thread: 0xd51733,
  panel: 0xeeece6,
  night: 0x060d1b,
  dawn: 0x14203a,
};

const PLANE_COUNT = 8;
const PLANE_BASE_Y = 1.15;
const PLANE_GAP = 0.34;
const PLANE_W = 5.6;
const PLANE_D = 4.0;
const GROUND_SCALE = 0.026;

const planeY = (i) => PLANE_BASE_Y + i * PLANE_GAP;

// Where the story happens. The overnight record sits high in the stack; the
// P-17 record that makes it the operator's problem sits three planes below.
const CHANGE = { plane: 6, x: 1.28, z: -0.62 };
const JOIN = { plane: 3, x: 0.1, z: 0.44 };

// Leases the joined records resolve onto, in ground-plate coordinates.
const AFFECTED = [
  { x: -0.28, z: 0.32 },
  { x: 0.44, z: 0.86 },
  { x: -0.86, z: 1.02 },
];

const RANK_TONES = [PALETTE.alert, PALETTE.alert, 0x5b86ff, 0x5b86ff, 0x8ea0bd];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => t * t * (3 - 2 * t);

/** Deterministic scatter so the record and lease fields never shuffle. */
function pseudoRandom(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Reveals a tube from its start to `amount` of its length. TubeGeometry emits
 * indices segment by segment along the curve, so a draw range is a clean
 * progressive draw with no per-frame geometry work.
 */
function setTubeReveal(mesh, amount) {
  const total = mesh.geometry.index.count;
  const rings = mesh.userData.tubularSegments;
  const perRing = total / rings;
  const visible = Math.round(Math.floor(clamp01(amount) * rings) * perRing);
  mesh.geometry.setDrawRange(0, visible);
  mesh.visible = visible > 0;
}

/**
 * @param canvas      the sticky stage canvas
 * @param lowPower    trim geometry, particles, and pixel ratio for small devices
 */
export function initStoryScene(canvas, { reduceMotion = false, lowPower = false } = {}) {
  if (!canvas) return null;

  // Below the `lg` breakpoint the copy sits under the stage instead of beside
  // it, so the world composes centred. Recomputed on resize, not at init.
  let compact = true;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowPower,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;

  const nightColor = new THREE.Color(PALETTE.night);
  const dawnColor = new THREE.Color(PALETTE.dawn);
  const skyColor = nightColor.clone();

  const scene = new THREE.Scene();
  scene.background = skyColor;
  scene.fog = new THREE.FogExp2(skyColor, 0.052);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);

  const disposables = [];
  const track = (obj) => {
    disposables.push(obj);
    return obj;
  };

  const worldRoot = new THREE.Group();
  scene.add(worldRoot);

  // ---- Ground: the operator's Texas ----------------------------------------
  const groundShape = buildTexasShape(GROUND_SCALE);
  const groundGeometry = track(
    new THREE.ExtrudeGeometry(groundShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.016,
      bevelSegments: 2,
    })
  );
  groundGeometry.center();

  const ground = new THREE.Mesh(
    groundGeometry,
    track(
      new THREE.MeshStandardMaterial({
        color: PALETTE.ground,
        metalness: 0.62,
        roughness: 0.42,
        emissive: 0x081426,
        emissiveIntensity: 0.9,
      })
    )
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  worldRoot.add(ground);

  const groundEdges = new THREE.LineSegments(
    track(new THREE.EdgesGeometry(groundGeometry, 25)),
    track(
      new THREE.LineBasicMaterial({
        color: PALETTE.groundEdge,
        transparent: true,
        opacity: 0.55,
      })
    )
  );
  ground.add(groundEdges);

  // Leases: one pillar per operated property, scattered on land only.
  const leaseCount = lowPower ? 54 : 96;
  const leaseGeometry = track(new THREE.BoxGeometry(0.035, 0.11, 0.035));
  const leaseMesh = track(
    new THREE.InstancedMesh(
      leaseGeometry,
      track(
        new THREE.MeshStandardMaterial({
          color: PALETTE.lease,
          emissive: PALETTE.lease,
          emissiveIntensity: 0.7,
          metalness: 0.2,
          roughness: 0.5,
        })
      ),
      leaseCount
    )
  );

  const matrix = new THREE.Matrix4();
  let placed = 0;
  for (let seed = 0; placed < leaseCount && seed < leaseCount * 12; seed += 1) {
    const x = (pseudoRandom(seed * 2.7) - 0.5) * 4.9;
    const z = (pseudoRandom(seed * 2.7 + 55.4) - 0.5) * 4.4;
    // The plate is authored in the shape's XY, laid flat: shape-y maps to -z.
    if (!isInsideTexas(x, -z, GROUND_SCALE)) continue;
    matrix.setPosition(x, 0.13, z);
    leaseMesh.setMatrixAt(placed, matrix);
    placed += 1;
  }
  leaseMesh.count = placed;
  leaseMesh.instanceMatrix.needsUpdate = true;
  worldRoot.add(leaseMesh);

  // ---- Eight dataset planes -------------------------------------------------
  const planeGeometry = track(new THREE.BoxGeometry(PLANE_W, 0.018, PLANE_D));
  const planeEdgeGeometry = track(new THREE.EdgesGeometry(planeGeometry));
  const recordGeometry = track(new THREE.IcosahedronGeometry(0.032, 0));

  const planes = [];
  for (let i = 0; i < PLANE_COUNT; i += 1) {
    const group = new THREE.Group();
    group.position.y = planeY(i);
    worldRoot.add(group);

    const involved = i === CHANGE.plane || i === JOIN.plane;

    const slab = new THREE.Mesh(
      planeGeometry,
      track(
        new THREE.MeshStandardMaterial({
          color: PALETTE.plane,
          metalness: 0.45,
          roughness: 0.5,
          transparent: true,
          opacity: 0.3,
          emissive: 0x081324,
          emissiveIntensity: 0.7,
        })
      )
    );
    group.add(slab);

    const edges = new THREE.LineSegments(
      planeEdgeGeometry,
      track(
        new THREE.LineBasicMaterial({
          color: PALETTE.planeEdge,
          transparent: true,
          opacity: 0.36,
        })
      )
    );
    group.add(edges);

    const recordCount = lowPower ? 6 : 9 + Math.floor(pseudoRandom(i * 5.1) * 5);
    const records = track(
      new THREE.InstancedMesh(
        recordGeometry,
        track(
          new THREE.MeshStandardMaterial({
            color: PALETTE.record,
            emissive: PALETTE.record,
            emissiveIntensity: 0.8,
            metalness: 0.2,
            roughness: 0.5,
            transparent: true,
            opacity: 0.85,
          })
        ),
        recordCount
      )
    );

    for (let m = 0; m < recordCount; m += 1) {
      const seed = i * 23.9 + m * 6.3;
      matrix.setPosition(
        (pseudoRandom(seed) - 0.5) * (PLANE_W - 0.7),
        0.05,
        (pseudoRandom(seed + 77.1) - 0.5) * (PLANE_D - 0.6)
      );
      records.setMatrixAt(m, matrix);
    }
    records.instanceMatrix.needsUpdate = true;
    group.add(records);

    planes.push({ group, slab, edges, records, restY: planeY(i), involved });
  }

  // ---- The overnight change and the record that makes it yours --------------
  const alertMaterial = track(
    new THREE.MeshStandardMaterial({
      color: PALETTE.alert,
      emissive: PALETTE.alert,
      emissiveIntensity: 1.2,
      metalness: 0.1,
      roughness: 0.4,
      transparent: true,
      opacity: 0,
    })
  );

  const changeNode = new THREE.Mesh(
    track(new THREE.IcosahedronGeometry(0.12, 1)),
    alertMaterial
  );
  changeNode.position.set(CHANGE.x, planeY(CHANGE.plane) + 0.15, CHANGE.z);
  worldRoot.add(changeNode);

  // The ripple sits on the plane the record was filed against, so the node
  // reads as floating above a surface rather than in empty space.
  const halo = new THREE.Mesh(
    track(new THREE.RingGeometry(0.2, 0.27, 44)),
    track(
      new THREE.MeshBasicMaterial({
        color: PALETTE.alert,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      })
    )
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.set(CHANGE.x, planeY(CHANGE.plane) + 0.016, CHANGE.z);
  worldRoot.add(halo);

  const stem = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.006, 0.006, 0.15, 6, 1, true)),
    track(
      new THREE.MeshBasicMaterial({
        color: PALETTE.thread,
        transparent: true,
        opacity: 0,
      })
    )
  );
  stem.position.set(CHANGE.x, planeY(CHANGE.plane) + 0.075, CHANGE.z);
  worldRoot.add(stem);

  const joinNode = new THREE.Mesh(
    track(new THREE.IcosahedronGeometry(0.06, 1)),
    alertMaterial
  );
  joinNode.position.set(JOIN.x, planeY(JOIN.plane) + 0.07, JOIN.z);
  worldRoot.add(joinNode);

  const alertLight = new THREE.PointLight(PALETTE.alert, 0, 5.5, 2);
  alertLight.position.copy(changeNode.position);
  scene.add(alertLight);

  // ---- Joins: change -> commingle record -> affected leases -----------------
  const TUBULAR = lowPower ? 40 : 64;
  const threadMaterial = track(
    new THREE.MeshBasicMaterial({
      color: PALETTE.thread,
      transparent: true,
      opacity: 0.85,
    })
  );

  const makeJoin = (from, to, lift) => {
    const mid = from.clone().lerp(to, 0.5);
    mid.y += lift;
    const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
    const geometry = track(new THREE.TubeGeometry(curve, TUBULAR, 0.011, 6, false));
    const mesh = new THREE.Mesh(geometry, threadMaterial);
    mesh.userData.tubularSegments = TUBULAR;
    mesh.userData.curve = curve;
    mesh.visible = false;
    worldRoot.add(mesh);
    return mesh;
  };

  const joins = [
    makeJoin(changeNode.position, joinNode.position, 0.55),
    ...AFFECTED.map((lease, i) =>
      makeJoin(
        joinNode.position,
        new THREE.Vector3(lease.x, 0.2, lease.z),
        0.35 + i * 0.12
      )
    ),
  ];

  // The leases the joins land on, marked in the same red as the record.
  const affectedGeometry = track(new THREE.BoxGeometry(0.055, 0.2, 0.055));
  const affectedNodes = AFFECTED.map((lease) => {
    const mesh = new THREE.Mesh(affectedGeometry, alertMaterial);
    mesh.position.set(lease.x, 0.2, lease.z);
    worldRoot.add(mesh);
    return mesh;
  });

  const pulse = new THREE.Mesh(
    track(new THREE.IcosahedronGeometry(0.045, 1)),
    track(
      new THREE.MeshBasicMaterial({ color: 0xffe2e6, transparent: true, opacity: 0 })
    )
  );
  worldRoot.add(pulse);

  // ---- The briefing: findings assembled into a ranked list ------------------
  // Offset into the half of the frame the reading column leaves empty. On
  // mobile the copy sits below the stage, so the list stays centred.
  const briefing = new THREE.Group();
  briefing.position.set(0, 0, 1.85);
  worldRoot.add(briefing);

  const BAR_W = 2.0;
  const barGeometry = track(new THREE.BoxGeometry(BAR_W, 0.18, 0.05));
  const capGeometry = track(new THREE.BoxGeometry(0.085, 0.18, 0.058));
  const chipGeometry = track(new THREE.BoxGeometry(0.3, 0.075, 0.058));
  const chipMaterial = track(
    new THREE.MeshBasicMaterial({ color: 0x2b3448, transparent: true, opacity: 0 })
  );

  const bars = RANK_TONES.map((tone, i) => {
    const group = new THREE.Group();
    group.position.set(0, 1.95 - i * 0.26, 0);
    briefing.add(group);

    // A value chip at the far end turns each slab into a readable row:
    // severity, finding, and the number it hangs on.
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(BAR_W / 2 - 0.26, 0, 0);
    group.add(chip);

    const bar = new THREE.Mesh(
      barGeometry,
      track(
        new THREE.MeshStandardMaterial({
          color: PALETTE.panel,
          metalness: 0.05,
          roughness: 0.65,
          emissive: 0x2a3346,
          emissiveIntensity: 0.35,
          transparent: true,
          opacity: 0,
        })
      )
    );
    group.add(bar);

    const cap = new THREE.Mesh(
      capGeometry,
      track(
        new THREE.MeshStandardMaterial({
          color: tone,
          emissive: tone,
          emissiveIntensity: 0.85,
          metalness: 0.1,
          roughness: 0.5,
          transparent: true,
          opacity: 0,
        })
      )
    );
    cap.position.x = -(BAR_W / 2) + 0.043;
    group.add(cap);

    return { group, bar, cap, restY: group.position.y };
  });

  // ---- Atmosphere -----------------------------------------------------------
  const dustCount = lowPower ? 140 : 300;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dustPositions[i * 3] = (pseudoRandom(i * 9.7) - 0.5) * 14;
    dustPositions[i * 3 + 1] = pseudoRandom(i * 9.7 + 3.1) * 6.2;
    dustPositions[i * 3 + 2] = (pseudoRandom(i * 9.7 + 8.9) - 0.5) * 12;
  }
  const dustGeometry = track(new THREE.BufferGeometry());
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(
    dustGeometry,
    track(
      new THREE.PointsMaterial({
        color: 0x93b4ff,
        size: 0.022,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
  scene.add(dust);

  // ---- Lighting -------------------------------------------------------------
  const ambient = new THREE.AmbientLight(0xffffff, 0.34);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(4.2, 7.0, 5.0);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x3d6bff, 1.5);
  rim.position.set(-5.2, 2.4, -4.0);
  scene.add(rim);

  const keyNight = new THREE.Color(0xbcd2ff);
  const keyDawn = new THREE.Color(0xffd9b4);

  // ---- Conductor ------------------------------------------------------------
  const last = storyChapters.length - 1;
  const rig = { target: 0, smooth: 0 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const camPosition = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  const host = canvas.parentElement || canvas;

  const endpoint = (chapter) => {
    const override = compact ? chapter.camera.mobile : null;
    return {
      position: override?.position ?? chapter.camera.position,
      target: override?.target ?? chapter.camera.target,
      fov: override?.fov ?? chapter.camera.fov,
    };
  };

  function applyState(value) {
    const index = Math.min(last - 1, Math.max(0, Math.floor(value)));
    const t = smoothstep(clamp01(value - index));
    const a = storyChapters[index];
    const b = storyChapters[index + 1];
    const ca = endpoint(a);
    const cb = endpoint(b);

    camPosition.set(
      lerp(ca.position[0], cb.position[0], t),
      lerp(ca.position[1], cb.position[1], t),
      lerp(ca.position[2], cb.position[2], t)
    );
    camTarget.set(
      lerp(ca.target[0], cb.target[0], t),
      lerp(ca.target[1], cb.target[1], t),
      lerp(ca.target[2], cb.target[2], t)
    );

    // Parallax is a lean, not a second camera path: clamped, and blended out
    // wherever the authored composition is doing the precise work.
    camPosition.x += pointer.x * 0.34;
    camPosition.y += -pointer.y * 0.2;

    camera.position.copy(camPosition);
    camera.lookAt(camTarget);
    const fov = lerp(ca.fov, cb.fov, t);
    if (Math.abs(camera.fov - fov) > 0.001) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    const w = {
      key: lerp(a.world.key, b.world.key, t),
      rim: lerp(a.world.rim, b.world.rim, t),
      fog: lerp(a.world.fog, b.world.fog, t),
      alert: lerp(a.world.alert, b.world.alert, t),
      join: lerp(a.world.join, b.world.join, t),
      rank: lerp(a.world.rank, b.world.rank, t),
      dawn: lerp(a.world.dawn, b.world.dawn, t),
    };

    skyColor.copy(nightColor).lerp(dawnColor, w.dawn);
    // FogExp2 copies its colour on construction, so it needs the same update.
    scene.fog.color.copy(skyColor);
    scene.fog.density = w.fog;

    key.intensity = w.key * 1.7;
    key.color.copy(keyNight).lerp(keyDawn, w.dawn);
    rim.intensity = w.rim * 1.5;
    ambient.intensity = 0.34 + w.dawn * 0.16;

    alertMaterial.opacity = w.alert;
    alertMaterial.emissiveIntensity = 0.6 + w.alert * 1.4;
    halo.material.opacity = w.alert * 0.5;
    stem.material.opacity = w.alert * 0.8;
    alertLight.intensity = w.alert * 3.4;
    // The commingle record only exists in the story once the join reaches it.
    joinNode.visible = w.join > 0.08;

    affectedNodes.forEach((node, i) => {
      // Affected leases only light once the join actually reaches them.
      const reach = clamp01((w.join - 0.25 - i * 0.16) / 0.3);
      node.scale.setScalar(0.3 + reach * 0.7);
      node.visible = reach > 0.02;
    });

    joins.forEach((mesh, i) => {
      // Joins draw in sequence: first the cross-system link, then each lease.
      const span = 1 / joins.length;
      setTubeReveal(mesh, clamp01((w.join - i * span * 0.82) / span));
    });
    threadMaterial.opacity = 0.35 + clamp01(w.join) * 0.5;

    bars.forEach((entry, i) => {
      const local = clamp01((w.rank - i * 0.09) / 0.55);
      const eased = smoothstep(local);
      entry.group.position.y = entry.restY - (1 - eased) * 0.22;
      entry.group.position.x = (1 - eased) * -0.5;
      entry.bar.material.opacity = eased * 0.96;
      entry.cap.material.opacity = eased;
      entry.group.visible = eased > 0.01;
    });
    chipMaterial.opacity = clamp01((w.rank - 0.35) / 0.4) * 0.75;

    planes.forEach((entry) => {
      // The stack recedes as the story leaves it, so the briefing owns the
      // frame without any of the world being deleted.
      const recede = w.rank * 0.55;
      entry.slab.material.opacity = (entry.involved ? 0.42 : 0.3) * (1 - recede);
      entry.edges.material.opacity = (entry.involved ? 0.52 : 0.32) * (1 - recede);
      entry.records.material.opacity = 0.85 * (1 - recede);
    });

    dust.material.opacity = 0.34 * (1 - w.dawn * 0.5);

    return w;
  }

  // ---- Loop -----------------------------------------------------------------
  let rafId = 0;
  let visible = false;
  let lastTime = 0;

  function frame(now) {
    const dt = Math.min(1 / 30, lastTime ? (now - lastTime) / 1000 : 1 / 60);
    lastTime = now;
    const time = now * 0.001;

    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    // Exact progress is the story state; the damped value is only ever used
    // for rendering, so a reload at depth still composes the same frame.
    rig.smooth = reduceMotion
      ? rig.target
      : rig.smooth + (rig.target - rig.smooth) * (1 - Math.exp(-6.5 * dt));

    const w = applyState(rig.smooth);

    if (!reduceMotion) {
      planes.forEach((entry, i) => {
        entry.group.position.y =
          entry.restY + Math.sin(time * 0.45 + i * 0.6) * 0.012;
      });

      changeNode.rotation.y = time * 0.5;
      const beat = 0.9 + Math.sin(time * 2.4) * 0.1;
      changeNode.scale.setScalar(w.alert > 0.02 ? beat : 0.001);
      halo.scale.setScalar(1 + (Math.sin(time * 1.6) * 0.5 + 0.5) * 0.35);

      // One pulse runs the join every ~2.8s, but only once the path exists.
      const curve = joins[joins.length - 1].userData.curve;
      if (w.join > 0.85 && curve) {
        const cycle = (time % 2.8) / 2.8;
        const travel = clamp01(cycle / 0.6);
        pulse.position.copy(curve.getPointAt(travel));
        pulse.material.opacity = travel < 1 ? 0.85 : 0;
      } else {
        pulse.material.opacity = 0;
      }

      dust.rotation.y = time * 0.006;
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    // Reduced motion gets composed stills on demand rather than a render loop.
    if (reduceMotion) {
      renderOnce();
      return;
    }
    if (rafId || !visible || document.hidden) return;
    lastTime = 0;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;

    compact = width < 1024;
    briefing.position.x = compact ? 0 : 1.2;

    // A lens shift, not a second camera path: on wide viewports the reading
    // column owns the left third, so the whole frustum slides left and the
    // world composes into the space that is actually empty.
    if (compact) camera.clearViewOffset();
    else camera.setViewOffset(width, height, -width * 0.1, 0, width, height);

    camera.updateProjectionMatrix();
    renderOnce();
  }

  function renderOnce() {
    applyState(rig.smooth);
    renderer.render(scene, camera);
  }

  const onPointerMove = (event) => {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.tx = clamp01((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.ty = clamp01((event.clientY - rect.top) / rect.height) * 2 - 1;
  };
  const onPointerLeave = () => {
    pointer.tx = 0;
    pointer.ty = 0;
  };
  const onVisibilityChange = () => {
    if (document.hidden) stop();
    else start();
  };

  const resizeObserver = new ResizeObserver(resize);
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

  document.addEventListener("visibilitychange", onVisibilityChange);
  if (!reduceMotion && !lowPower) {
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
  }

  resize();
  renderOnce();

  return {
    /** @param {number} progress normalized 0..1 across the whole journey */
    setProgress(progress) {
      const exact = clamp01(progress) * last;
      // Reduced motion snaps to the nearest authored composition instead of
      // interpolating through the camera travel between them.
      rig.target = reduceMotion ? Math.round(exact) : exact;
      if (reduceMotion && rig.smooth !== rig.target) {
        rig.smooth = rig.target;
        renderOnce();
      }
    },
    dispose() {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      disposables.forEach((item) => item.dispose?.());
      renderer.dispose();
    },
  };
}
