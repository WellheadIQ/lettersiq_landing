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
  panel: 0xf4f6fb,
  night: 0x060d1b,
  dawn: 0x14203a,
};

// Artifact ink, in CSS so it can be written straight into a 2D context. These
// are the tokens the page already uses for its one light inset panel.
const INK = { body: "#0A1428", muted: "#4A5568" };

/** Bottom of the stack to the top; the two the story touches sit at 3 and 6. */
const DATASETS = [
  "PURCHASER FILINGS",
  "DRILLING PERMITS",
  "PRORATION / W-10",
  "P-17 COMMINGLES",
  "RULE 15 INACTIVE",
  "P-5 ORGANIZATION",
  "CERTIFIED LETTERS",
  "SEVERANCE ORDERS",
];

/** The ranked briefing, in the site's consequence → record → number pattern. */
const FINDINGS = [
  { tone: "#B00C28", consequence: "Production stopped", title: "Commingle severance — Clam Lake", meta: "2 leases" },
  { tone: "#B00C28", consequence: "Production at risk", title: "P-5 renewal — Brazos Bend Operating", meta: "14 days" },
  { tone: "#2F55D4", consequence: "First sales blocked", title: "W-12 missing — Well 08-11234", meta: "1 filing" },
  { tone: "#2F55D4", consequence: "Allowable blocked", title: "Proration delinquent — DLQ W-10", meta: "3 wells" },
  { tone: "#5A6883", consequence: "Permit lapses", title: "Drilling permit expiry — W-1", meta: "22 days" },
];

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

  // The stage region the reading column leaves empty, in canvas CSS pixels.
  // Published by the DOM, which is the only place that knows where the copy
  // landed. Null until measured: the world composes centred.
  let safeArea = null;
  // Narrow viewports also get the wider authored camera endpoints.
  let compact = true;
  // How many briefing rows the free area can hold at a readable size.
  let barLimit = 5;

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

  const anisotropy = renderer.capabilities.getMaxAnisotropy();

  const nightColor = new THREE.Color(PALETTE.night);
  const dawnColor = new THREE.Color(PALETTE.dawn);
  const skyColor = nightColor.clone();

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(skyColor, 0.052);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);

  const disposables = [];
  const track = (obj) => {
    disposables.push(obj);
    return obj;
  };

  const SANS = "Archivo, system-ui, sans-serif";
  const MONO = '"JetBrains Mono", ui-monospace, monospace';

  /**
   * The world's own signage. Everything the story claims — eight named systems,
   * a ranked list of real findings — is drawn as type into a texture, so the
   * scene shows the artifact rather than a grey stand-in for it.
   */
  const repaints = [];
  function makeLabel(widthPx, heightPx, draw) {
    const surface = document.createElement("canvas");
    const scale = lowPower ? 2 : 3;
    surface.width = Math.round(widthPx * scale);
    surface.height = Math.round(heightPx * scale);
    const ctx = surface.getContext("2d");

    const texture = track(new THREE.CanvasTexture(surface));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;

    const paint = () => {
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, widthPx, heightPx);
      // Text state survives between paints, so every run starts from the same
      // baseline, alignment, and tracking as the first one.
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.letterSpacing = "0em";
      draw(ctx, widthPx, heightPx);
      texture.needsUpdate = true;
    };

    paint();
    repaints.push(paint);
    texture.repaint = paint;
    return texture;
  }

  /** Unlit so type stays exactly as legible as it was drawn. */
  const labelMaterial = (map, opacity = 0) =>
    track(
      new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        opacity,
        depthWrite: false,
        toneMapped: false,
      })
    );

  const worldRoot = new THREE.Group();
  scene.add(worldRoot);

  // ---- Sky: the thing that actually makes 7:00 AM feel like 7:00 AM --------
  // A flat clear colour gives the dawn chapter nowhere to go. A horizon
  // gradient lets the bottom of the frame warm up while the top stays night.
  const skyHigh = new THREE.Color(0x060d1b);
  const skyLow = new THREE.Color(0x0d1830);
  const skyMaterial = track(
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        high: { value: skyHigh },
        low: { value: skyLow },
      },
      vertexShader: `
        varying float vHeight;
        void main() {
          vHeight = normalize(position).y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 high;
        uniform vec3 low;
        varying float vHeight;
        void main() {
          gl_FragColor = vec4(mix(low, high, smoothstep(-0.32, 0.62, vHeight)), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    })
  );
  const sky = new THREE.Mesh(track(new THREE.SphereGeometry(70, 24, 14)), skyMaterial);
  scene.add(sky);

  // Dawn lifts the horizon toward slate blue, not toward sunrise. Red is the
  // one thing on this page that means "critical"; a red sky spends it.
  const nightHigh = new THREE.Color(0x050b17);
  const nightLow = new THREE.Color(0x0c1730);
  const dawnHigh = new THREE.Color(0x0e1a33);
  const dawnLow = new THREE.Color(0x2c3d60);

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
        transparent: true,
        opacity: 1,
      })
    )
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  worldRoot.add(ground);

  // A survey graticule, clipped to the state boundary. The plate is a map, so
  // the ruling is instrumentation rather than decoration — and it gives the
  // ground something to catch light on at this scale.
  const gridPoints = [];
  const STEP = 0.42;
  for (let x = -2.6; x <= 2.6; x += STEP) {
    for (let z = -2.4; z <= 2.4; z += STEP / 3) {
      if (isInsideTexas(x, -z, GROUND_SCALE) && isInsideTexas(x, -(z + STEP / 3), GROUND_SCALE)) {
        gridPoints.push(x, 0.163, z, x, 0.163, z + STEP / 3);
      }
    }
  }
  for (let z = -2.4; z <= 2.4; z += STEP) {
    for (let x = -2.6; x <= 2.6; x += STEP / 3) {
      if (isInsideTexas(x, -z, GROUND_SCALE) && isInsideTexas(x + STEP / 3, -z, GROUND_SCALE)) {
        gridPoints.push(x, 0.163, z, x + STEP / 3, 0.163, z);
      }
    }
  }
  const graticuleGeometry = track(new THREE.BufferGeometry());
  graticuleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(gridPoints, 3)
  );
  const graticule = new THREE.LineSegments(
    graticuleGeometry,
    track(
      new THREE.LineBasicMaterial({
        color: 0x4f7bd6,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      })
    )
  );
  worldRoot.add(graticule);

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
          transparent: true,
          opacity: 1,
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

    // A named tab off the right edge of every sheet. Eight systems the copy
    // only asserts; here they are, readable.
    const labelTexture = makeLabel(300, 32, (ctx, w, h) => {
      ctx.fillStyle = involved ? "rgba(255,59,84,0.95)" : "rgba(159,192,255,0.5)";
      ctx.fillRect(0, h / 2 - 7, 2, 14);
      ctx.font = `500 14px ${MONO}`;
      ctx.letterSpacing = "0.13em";
      ctx.fillStyle = involved ? "#FF6B7E" : "#A9C6FF";
      ctx.fillText(DATASETS[i], 11, h / 2 + 1);
    });

    const label = new THREE.Mesh(
      track(new THREE.PlaneGeometry(1.5, 0.16)),
      labelMaterial(labelTexture, 0)
    );
    // On the sheet rather than tagged off its edge, so the stack's silhouette
    // stays inside the frame when the composition slides right of the copy.
    label.position.set(PLANE_W / 2 - 0.82, 0.055, PLANE_D / 2 - 0.16);
    group.add(label);

    planes.push({ group, slab, edges, records, label, restY: planeY(i), involved });
  }

  // ---- The nightly read -----------------------------------------------------
  // "Read while you sleep" was the one claim the world never showed. A bar of
  // light climbs the stack and each sheet answers as it passes.
  const scanGradient = makeLabel(128, 128, (ctx, w, h) => {
    const fill = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    fill.addColorStop(0, "rgba(158,196,255,0.68)");
    fill.addColorStop(0.55, "rgba(122,160,255,0.26)");
    fill.addColorStop(1, "rgba(122,160,255,0)");
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, w, h);
  });

  const scan = new THREE.Mesh(
    track(new THREE.PlaneGeometry(PLANE_W + 1.6, PLANE_D + 1.2)),
    track(
      new THREE.MeshBasicMaterial({
        map: scanGradient,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
    )
  );
  scan.rotation.x = -Math.PI / 2;
  scan.position.set(0, PLANE_BASE_Y, 0);
  worldRoot.add(scan);

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
  // Low enough that it clearly belongs to its own sheet rather than the one
  // above it — which is the whole point of naming the sheets.
  changeNode.position.set(CHANGE.x, planeY(CHANGE.plane) + 0.09, CHANGE.z);
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
  stem.position.set(CHANGE.x, planeY(CHANGE.plane) + 0.045, CHANGE.z);
  worldRoot.add(stem);

  const joinNode = new THREE.Mesh(
    track(new THREE.IcosahedronGeometry(0.06, 1)),
    alertMaterial
  );
  joinNode.position.set(JOIN.x, planeY(JOIN.plane) + 0.07, JOIN.z);
  worldRoot.add(joinNode);

  // Tight enough to read as the record glowing, not as a light leak across
  // the whole sheet.
  const alertLight = new THREE.PointLight(PALETTE.alert, 0, 2.6, 2.4);
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

  // A soft bloom around the ignited record and the leases it reaches, so the
  // red has presence on a dark plate instead of reading as flat vector art.
  const glowTexture = makeLabel(128, 128, (ctx, w, h) => {
    const fill = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    fill.addColorStop(0, "rgba(255,110,130,0.9)");
    fill.addColorStop(0.35, "rgba(226,42,70,0.35)");
    fill.addColorStop(1, "rgba(200,16,46,0)");
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, w, h);
  });

  const makeGlow = (size, position) => {
    const sprite = new THREE.Sprite(
      track(
        new THREE.SpriteMaterial({
          map: glowTexture,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        })
      )
    );
    sprite.scale.setScalar(size);
    sprite.position.copy(position);
    worldRoot.add(sprite);
    return sprite;
  };

  const changeGlow = makeGlow(1.1, changeNode.position);
  const leaseGlows = AFFECTED.map((lease) =>
    makeGlow(0.62, new THREE.Vector3(lease.x, 0.22, lease.z))
  );

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
  // In front of the plane stack, not inside it: the sheets are 4 units deep,
  // and a briefing sharing that volume gets sliced by them.
  const briefing = new THREE.Group();
  briefing.position.set(0, 0, 3.05);
  worldRoot.add(briefing);

  const BAR_W = 2.0;
  const BAR_H = 0.23;
  const ROW_GAP = 0.3;
  const TEX_W = 560;
  const TEX_H = Math.round((TEX_W * BAR_H) / BAR_W);

  const barGeometry = track(new THREE.BoxGeometry(BAR_W, BAR_H, 0.05));
  const capGeometry = track(new THREE.BoxGeometry(0.075, BAR_H, 0.058));
  const rowFaceGeometry = track(new THREE.PlaneGeometry(BAR_W, BAR_H));

  const bars = RANK_TONES.map((tone, i) => {
    const finding = FINDINGS[i];
    const group = new THREE.Group();
    group.position.set(0, 1.62 - i * ROW_GAP, 0);
    briefing.add(group);

    // Unlit, like the type on it: the briefing is the one surface in the scene
    // that has to be the colour of paper rather than the colour of the hour.
    const bar = new THREE.Mesh(
      barGeometry,
      track(
        new THREE.MeshBasicMaterial({
          color: PALETTE.panel,
          transparent: true,
          opacity: 0,
        })
      )
    );
    group.add(bar);

    const cap = new THREE.Mesh(
      capGeometry,
      track(
        new THREE.MeshBasicMaterial({
          color: tone,
          transparent: true,
          opacity: 0,
        })
      )
    );
    cap.position.x = -(BAR_W / 2) + 0.038;
    group.add(cap);

    // Consequence, then the record it came from, then the number it hangs on —
    // the same three-part line the rest of the site uses.
    const face = new THREE.Mesh(
      rowFaceGeometry,
      labelMaterial(
        makeLabel(TEX_W, TEX_H, (ctx, w, h) => {
          ctx.textAlign = "right";
          ctx.font = `500 15px ${MONO}`;
          ctx.letterSpacing = "0.02em";
          ctx.fillStyle = INK.body;
          ctx.fillText(finding.meta, w - 18, h / 2 + 1);

          ctx.textAlign = "left";
          ctx.font = `600 12px ${MONO}`;
          ctx.letterSpacing = "0.15em";
          ctx.fillStyle = finding.tone;
          ctx.fillText(finding.consequence.toUpperCase(), 34, h * 0.31);

          ctx.font = `600 17px ${SANS}`;
          ctx.letterSpacing = "-0.01em";
          ctx.fillStyle = INK.body;
          ctx.fillText(finding.title, 34, h * 0.68);
        })
      )
    );
    // The briefing is the payoff of the whole section, so its type is drawn
    // last and unconditionally: no depth test, above every other pass.
    face.position.z = 0.055;
    face.material.depthTest = false;
    face.renderOrder = 12;
    bar.renderOrder = 10;
    cap.renderOrder = 11;
    group.add(face);

    return { group, bar, cap, face, restY: group.position.y };
  });

  // The briefing's own masthead, so the last chapter resolves on a document
  // rather than on a stack of rows.
  // The item count follows however many rows the viewport can actually hold, so
  // the masthead never promises five findings above a list of three.
  let headCount = FINDINGS.length;
  const headTexture = makeLabel(TEX_W, 50, (ctx, w, h) => {
    ctx.font = `600 17px ${MONO}`;
    ctx.letterSpacing = "0.16em";
    ctx.fillStyle = "#FAFBFF";
    ctx.fillText("07:00 · MORNING BRIEFING", 10, h / 2);

    ctx.textAlign = "right";
    ctx.font = `500 15px ${MONO}`;
    ctx.letterSpacing = "0.1em";
    ctx.fillStyle = "#9AA6BC";
    ctx.fillText(`${headCount} ITEMS · 1 CRITICAL`, w - 10, h / 2);
  });
  const briefingHead = new THREE.Mesh(
    track(new THREE.PlaneGeometry(BAR_W, 0.2)),
    labelMaterial(headTexture)
  );
  briefingHead.position.set(0, bars[0].restY + 0.32, 0.055);
  briefingHead.material.depthTest = false;
  briefingHead.renderOrder = 12;
  briefing.add(briefingHead);

  // The claim the last chapter makes in words — everything else stays out of
  // your morning — stated as the number of records that didn't make the list.
  const footTexture = makeLabel(TEX_W, 46, (ctx, w, h) => {
    ctx.font = `500 14px ${MONO}`;
    ctx.letterSpacing = "0.12em";
    ctx.fillStyle = "#7C8AA5";
    ctx.fillText("1,204 RECORDS REVIEWED OVERNIGHT", 10, h / 2);

    ctx.textAlign = "right";
    ctx.fillStyle = "#C6D0E2";
    ctx.fillText(`${headCount} NEED YOU`, w - 10, h / 2);
  });
  const briefingFoot = new THREE.Mesh(
    track(new THREE.PlaneGeometry(BAR_W, 0.185)),
    labelMaterial(footTexture)
  );
  briefingFoot.position.z = 0.055;
  briefingFoot.material.depthTest = false;
  briefingFoot.renderOrder = 12;
  briefing.add(briefingFoot);

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

    // Dataset tabs turn on their own axis to stay square to the lens; the
    // stack reads as sheets with labels rather than as stickers.
    const labelYaw = Math.atan2(
      camPosition.x - (PLANE_W / 2 - 0.82),
      camPosition.z - (PLANE_D / 2 - 0.16)
    );
    planes.forEach((entry) => {
      entry.label.rotation.y = labelYaw;
    });
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

    // How much of the world survives the last chapter. Once the briefing is the
    // subject, the map and everything standing on it withdraw.
    const mapFade = 1 - smoothstep(clamp01((w.rank - 0.25) / 0.5));

    skyHigh.copy(nightHigh).lerp(dawnHigh, w.dawn);
    skyLow.copy(nightLow).lerp(dawnLow, w.dawn);
    // The horizon is what the world dissolves into, so fog tracks the low
    // band. FogExp2 copies its colour on construction and needs it set again.
    skyColor.copy(nightColor).lerp(dawnColor, w.dawn * 0.8);
    scene.fog.color.copy(skyColor);
    scene.fog.density = w.fog;
    sky.position.copy(camera.position);

    key.intensity = w.key * 1.7;
    key.color.copy(keyNight).lerp(keyDawn, w.dawn);
    rim.intensity = w.rim * 1.5;
    ambient.intensity = 0.34 + w.dawn * 0.16;

    alertMaterial.opacity = w.alert;
    alertMaterial.emissiveIntensity = 0.6 + w.alert * 1.4;
    halo.material.opacity = w.alert * 0.5;
    stem.material.opacity = w.alert * 0.8;
    alertLight.intensity = w.alert * 1.5;
    // The commingle record only exists in the story once the join reaches it.
    joinNode.visible = w.join > 0.08;

    changeGlow.material.opacity = w.alert * 0.85;

    affectedNodes.forEach((node, i) => {
      // Affected leases only light once the join actually reaches them.
      const reach = clamp01((w.join - 0.25 - i * 0.16) / 0.3);
      node.scale.setScalar(0.3 + reach * 0.7);
      node.visible = reach > 0.02 && mapFade > 0.02;
      leaseGlows[i].material.opacity = reach * 0.7 * mapFade;
      leaseGlows[i].visible = node.visible;
    });

    joins.forEach((mesh, i) => {
      // Joins draw in sequence: first the cross-system link, then each lease.
      const span = 1 / joins.length;
      setTubeReveal(mesh, clamp01((w.join - i * span * 0.82) / span));
    });
    // The provenance threads outlast the map a little — the briefing should
    // still look drawn from somewhere — but they don't cross the document.
    threadMaterial.opacity = (0.35 + clamp01(w.join) * 0.5) * (0.25 + 0.75 * mapFade);

    bars.forEach((entry, i) => {
      // Where the free area can't hold the full list, the lowest-consequence
      // rows drop rather than every row shrinking below reading size.
      if (i >= barLimit) {
        entry.group.visible = false;
        return;
      }
      const local = clamp01((w.rank - i * 0.09) / 0.55);
      const eased = smoothstep(local);
      entry.group.position.y = entry.restY - (1 - eased) * 0.22;
      entry.group.position.x = (1 - eased) * -0.5;
      // Fully opaque once landed: at 0.97 the emissive lease pillars behind
      // the list ghost straight through the paper.
      entry.bar.material.opacity = eased;
      entry.cap.material.opacity = eased;
      entry.face.material.opacity = smoothstep(clamp01((local - 0.45) / 0.55));
      entry.group.visible = eased > 0.01;
    });
    // Masthead and footer arrive with the light, not with the ranking, so the
    // fourth chapter is the list being ordered and the fifth is it being
    // delivered — two beats instead of the same frame twice.
    const delivered = smoothstep(clamp01((w.dawn - 0.32) / 0.5));
    briefingHead.material.opacity = delivered * 0.92;
    briefingFoot.material.opacity = delivered * 0.85;

    planes.forEach((entry) => {
      // The stack all but withdraws once the briefing exists — that is the
      // claim of the last chapter, and it keeps eight sheets of geometry from
      // showing through a document that should read as opaque.
      const recede = w.rank * 0.95;
      entry.slab.material.opacity = (entry.involved ? 0.42 : 0.32) * (1 - recede);
      // Stored so the scan sweep can lift each sheet above its resting value
      // without having to re-derive the chapter state.
      entry.edgeRest = (entry.involved ? 0.56 : 0.4) * (1 - recede);
      entry.edges.material.opacity = entry.edgeRest;
      entry.records.material.opacity = 0.85 * (1 - recede);
      // Signage fades up with the establishing shot and away with the stack.
      entry.label.material.opacity = (entry.involved ? 1 : 0.9) * (1 - w.rank);
    });

    // The map goes with the stack. A briefing that has to read as paper can't
    // have a lit state plate and ninety lease pillars glowing through it.
    ground.material.opacity = mapFade;
    ground.visible = mapFade > 0.02;
    groundEdges.material.opacity = 0.55 * mapFade;
    graticule.material.opacity = 0.16 * mapFade;
    leaseMesh.material.opacity = mapFade;
    leaseMesh.visible = mapFade > 0.02;

    dust.material.opacity = 0.34 * (1 - w.dawn * 0.5) * (0.35 + 0.65 * mapFade);

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
      // The read only belongs to the chapters before the record moves; once
      // the story is about one finding, the sweep would be noise.
      const reading = clamp01(1 - Math.max(w.join, w.rank) * 1.6);
      const top = planeY(PLANE_COUNT - 1);
      const sweep = (time % 5.2) / 5.2;
      const scanY = lerp(PLANE_BASE_Y - 0.5, top + 0.5, sweep);
      scan.position.y = scanY;
      scan.material.opacity = reading * 0.85 * Math.sin(sweep * Math.PI) ** 0.5;

      planes.forEach((entry, i) => {
        entry.group.position.y =
          entry.restY + Math.sin(time * 0.45 + i * 0.6) * 0.012;
        // Each sheet lights as the bar crosses it: eight systems being read,
        // one after another, all night.
        const proximity = clamp01(1 - Math.abs(scanY - entry.restY) / 0.5);
        entry.records.material.emissiveIntensity = 0.8 + proximity * reading * 2.6;
        entry.edges.material.opacity =
          entry.edgeRest + proximity * reading * 0.45;
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

  /**
   * A lens shift, not a second camera path. The authored composition is always
   * built around the origin; the frustum then slides — and widens, when the
   * free space is genuinely small — so the world lands in the part of the
   * stage the copy isn't using. One mechanism covers the side column on
   * desktop, the bottom band on phones, and every awkward size between.
   */
  function applyFraming() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    camera.aspect = width / height;

    const usable =
      safeArea && safeArea.width > 120 && safeArea.height > 120
        ? safeArea
        : { x: 0, y: 0, width, height };

    // Damped: pushing the world dead-centre in the free area over-corrects and
    // leaves the composition hugging one edge.
    const dx = (usable.x + usable.width / 2 - width / 2) * 0.78;
    const dy = (usable.y + usable.height / 2 - height / 2) * 0.8;

    // A virtual frame smaller than the canvas fits the same fov into fewer
    // pixels, which widens the view. Only genuinely tight free areas need it;
    // a desktop side column doesn't, since the world may sit behind the scrim.
    const fit = Math.max(0.34, Math.min(usable.width / width, usable.height / height));
    const spread = 1 + Math.max(0, 0.55 - fit) * 1.7;
    const fullWidth = width / spread;
    const fullHeight = height / spread;

    // The briefing is the one thing in the world that has to be *read*, so it
    // gets the free area exactly rather than the world's damped share of it,
    // and it stops growing at document size — past that a ranked list on a
    // 27-inch display is a billboard, not a morning email.
    const room = {
      width: Math.min(usable.width * 0.92, 760),
      height: Math.min(usable.height * 0.88, 520),
    };
    const finale = endpoint(storyChapters[storyChapters.length - 1]);
    const reach = Math.hypot(finale.position[1] - 1.2, finale.position[2] - briefing.position.z);
    const seenHeight = 2 * reach * Math.tan((finale.fov * Math.PI) / 360) * spread;
    const seenWidth = seenHeight * (width / height);

    // Type is baked into the row textures, so the only way to make a finding
    // bigger is to carry fewer of them. Five rows is the story; three is the
    // concession, taken only when five would land under reading size.
    const READABLE_ROW_PX = 42;
    const fitFor = (count) => {
      const top = bars[0].restY + 0.42;
      const bottom = bars[count - 1].restY - 0.31 - 0.09;
      const scale = Math.max(
        0.5,
        Math.min(
          (room.height / height) * (seenHeight / (top - bottom)),
          (room.width / width) * (seenWidth / BAR_W)
        )
      );
      return { count, scale, bottom, top, rowPx: (ROW_GAP * scale * height) / seenHeight };
    };
    const full = fitFor(bars.length);
    const best = full.rowPx >= READABLE_ROW_PX ? full : fitFor(3);
    const { count: shown, scale: listScale, top: listTop, bottom: listBottom } = best;

    barLimit = shown;
    if (shown !== headCount) {
      headCount = shown;
      headTexture.repaint();
      footTexture.repaint();
    }
    briefingFoot.position.y = bars[shown - 1].restY - 0.31;

    briefing.scale.setScalar(listScale);
    // The lens shift lands the world axis here; the briefing then makes up the
    // difference itself, so a damped world shift can't push the document under
    // the reading column.
    const axisX = width / 2 + dx;
    const axisY = height / 2 + dy;
    briefing.position.x = ((usable.x + usable.width / 2 - axisX) * seenWidth) / width;
    briefing.position.y =
      1.2 -
      ((listTop + listBottom) / 2) * listScale -
      ((usable.y + usable.height / 2 - axisY) * seenHeight) / height;

    camera.setViewOffset(
      fullWidth,
      fullHeight,
      (fullWidth - width) / 2 - dx,
      (fullHeight - height) / 2 - dy,
      width,
      height
    );
    camera.updateProjectionMatrix();
  }

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
    renderer.setSize(width, height, false);

    compact = width < 1024;
    applyFraming();
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

  // Webfonts usually resolve after the scene's first paint; redraw the signage
  // once they land so it isn't stuck on a fallback face.
  document.fonts?.ready.then(() => {
    repaints.forEach((paint) => paint());
    renderOnce();
  });

  resize();
  renderOnce();

  const api = {
    /** Test hook: the briefing's real screen box, for verifying the fit maths. */
    measureBriefing() {
      const shown = Math.min(barLimit, bars.length);
      const box = new THREE.Box3();
      const corner = new THREE.Vector3();
      bars.slice(0, shown).forEach((entry) => {
        entry.group.updateWorldMatrix(true, false);
        box.expandByPoint(entry.group.localToWorld(corner.set(-BAR_W / 2, BAR_H / 2, 0)));
        box.expandByPoint(entry.group.localToWorld(corner.set(BAR_W / 2, -BAR_H / 2, 0)));
      });
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const project = (point) => {
        const p = point.project(camera);
        return { x: ((p.x + 1) / 2) * width, y: ((1 - p.y) / 2) * height };
      };
      const a = project(new THREE.Vector3(box.min.x, box.max.y, box.max.z));
      const b = project(new THREE.Vector3(box.max.x, box.min.y, box.max.z));
      return {
        left: Math.round(a.x),
        right: Math.round(b.x),
        top: Math.round(a.y),
        bottom: Math.round(b.y),
        rows: shown,
        safeArea,
      };
    },
    /** @param {{x:number,y:number,width:number,height:number}} area canvas CSS px the copy leaves free */
    setSafeArea(area) {
      const same =
        safeArea &&
        Math.abs(safeArea.x - area.x) < 2 &&
        Math.abs(safeArea.y - area.y) < 2 &&
        Math.abs(safeArea.width - area.width) < 2 &&
        Math.abs(safeArea.height - area.height) < 2;
      if (same) return;
      safeArea = area;
      applyFraming();
      renderOnce();
    },
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

  // Seam for the responsive checks, which need the briefing's real screen box
  // rather than a screenshot guess.
  canvas.storyScene = api;
  return api;
}
