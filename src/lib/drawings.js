import { createPen, polygonPath, rotatePoint } from "./ink.js";
import { solvePumpjack } from "./pumpjackKinematics.js";

/**
 * Layer kinds, painted in order:
 *   f  paper-coloured fill that hides whatever is behind a solid part
 *   l  primary ink line
 *   t  thin secondary line (seams, bolts, detail)
 *   h  hatching
 */
const L = (d, kind = "l") => ({ d, kind });

const arcPoints = (cx, cy, rx, ry, a0, a1, steps = 16) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / steps;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });

/* ------------------------------------------------------------------ */
/* Pumpjack                                                            */
/* ------------------------------------------------------------------ */

const PJ = { a: 100, R: 106, b: 78, eOff: 9, r: 22 };

export function pumpjack(seed) {
  const pen = createPen(seed, { wobble: 0.75 });
  const P = [PJ.R, -124];
  const C = [182, -44];
  const E0 = [P[0] + PJ.b, P[1] + PJ.eOff];
  const geom = {
    P,
    C,
    b: PJ.b,
    eOff: PJ.eOff,
    r: PJ.r,
    R: PJ.R,
    L: Math.hypot(E0[0] - C[0], E0[1] - C[1]),
    restY: -74,
  };

  const stat = [];

  // Wellhead stack: casing head, tubing head, flow tee, stuffing box.
  const stack = [
    [-10, -16, 20, 16],
    [-8, -26, 16, 10],
    [-6, -36, 12, 10],
    [-4, -46, 8, 10],
  ];
  stat.push(L(polygonPath([[-24, -34], [-6, -34], [-6, -28], [-24, -28]]), "f"));
  stat.push(L(pen.rect(-24, -34, 18, 6)));
  stat.push(L(pen.line(-24, -36, -24, -26, 0.3), "t"));
  stat.push(L(pen.poly([[-24, -33], [-35, -33], [-35, 0]], { w: 0.5 })));
  stat.push(L(pen.poly([[-24, -29], [-31, -29], [-31, 0]], { w: 0.5 })));
  for (const [x, y, w, h] of stack) {
    stat.push(L(polygonPath([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]), "f"));
    stat.push(L(pen.rect(x, y, w, h, { w: 0.5 })));
  }
  stat.push(L(pen.line(-12, -8, 12, -8, 0.3), "t"));

  // Skid.
  stat.push(L(polygonPath([[58, -9], [252, -9], [252, 0], [58, 0]]), "f"));
  stat.push(L(pen.rect(58, -9, 194, 9)));
  for (let x = 74; x < 250; x += 24) stat.push(L(pen.line(x, -9, x, 0, 0.2), "t"));

  // Belt guard and motor sit behind the gearbox.
  const guard = [[190, -58], [240, -42], [240, -28], [190, -40]];
  stat.push(L(polygonPath(guard), "f"), L(pen.poly(guard, { closed: true })));
  stat.push(L(polygonPath([[214, -34], [246, -34], [246, -9], [214, -9]]), "f"));
  stat.push(L(pen.rect(214, -34, 32, 25)));
  for (let x = 219; x < 244; x += 5) stat.push(L(pen.line(x, -31, x, -12, 0.2), "t"));

  // Samson post: two members meeting under the saddle, braced twice.
  const member = (foot, top, width) => {
    const dx = top[0] - foot[0];
    const dy = top[1] - foot[1];
    const len = Math.hypot(dx, dy);
    const nx = (-dy / len) * (width / 2);
    const ny = (dx / len) * (width / 2);
    return [
      [foot[0] + nx, foot[1] + ny],
      [top[0] + nx, top[1] + ny],
      [top[0] - nx, top[1] - ny],
      [foot[0] - nx, foot[1] - ny],
    ];
  };
  const front = member([70, -9], [101, -114], 7);
  const rear = member([142, -9], [111, -114], 7);
  const onLeg = (foot, top, y) => {
    const t = (y - foot[1]) / (top[1] - foot[1]);
    return foot[0] + (top[0] - foot[0]) * t;
  };
  for (const y of [-40, -76]) {
    const x1 = onLeg([70, -9], [101, -114], y);
    const x2 = onLeg([142, -9], [111, -114], y);
    const brace = [[x1, y - 2.5], [x2, y - 2.5], [x2, y + 2.5], [x1, y + 2.5]];
    stat.push(L(polygonPath(brace), "f"), L(pen.poly(brace, { closed: true, w: 0.4 })));
  }
  stat.push(L(pen.line(onLeg([70, -9], [101, -114], -40), -40, onLeg([142, -9], [111, -114], -76), -76, 0.3), "t"));
  for (const m of [front, rear]) {
    stat.push(L(polygonPath(m), "f"), L(pen.poly(m, { closed: true, w: 0.5 })));
  }
  // Ladder up the rear leg.
  for (let y = -20; y > -104; y -= 12) {
    const x = onLeg([142, -9], [111, -114], y);
    stat.push(L(pen.line(x + 4, y, x + 12, y, 0.2), "t"));
  }
  stat.push(L(pen.line(158, -9, 125, -104, 0.4), "t"));
  const saddle = [[96, -122], [116, -122], [113, -112], [99, -112]];
  stat.push(L(polygonPath(saddle), "f"), L(pen.poly(saddle, { closed: true, w: 0.4 })));

  // Gearbox: square body under a rounded housing.
  const box = [[159, -9], [205, -9], [205, -44], ...arcPoints(C[0], C[1], 23, 23, 0, -Math.PI, 14), [159, -44]];
  stat.push(L(polygonPath(box), "f"));
  stat.push(L(pen.poly([[159, -44], [159, -9], [205, -9], [205, -44]])));
  stat.push(L(pen.arc(C[0], C[1], 23, 23, 0, -Math.PI)));
  stat.push(L(pen.hatch([[194, -12], [203, -12], [203, -44], [194, -58]], { gap: 4.2 }), "h"));
  stat.push(L(pen.line(159, -30, 205, -30, 0.2), "t"));

  // Crank, drawn at angle 0 around its own origin.
  const crank = [];
  const cw = [...arcPoints(0, 0, 10, 10, -0.6, 0.6, 6), ...arcPoints(0, 0, 38, 38, 0.6, -0.6, 10)];
  crank.push(L(polygonPath(cw), "f"), L(pen.poly(cw, { closed: true, w: 0.5 })));
  crank.push(L(pen.hatch(cw, { gap: 4, angle: Math.PI / 5 }), "h"));
  const arm = [[-9, -5], [PJ.r + 6, -4], [PJ.r + 6, 4], [-9, 5]];
  crank.push(L(polygonPath(arm), "f"), L(pen.poly(arm, { closed: true, w: 0.4 })));
  crank.push(L(pen.circle(0, 0, 6, 6, { turns: 1 })), L(pen.circle(PJ.r, 0, 3, 3, { turns: 1 })));

  // Walking beam and horsehead, drawn level around the pivot.
  const beam = [];
  const head = PJ.R;
  const span = 0.32;
  const faceTop = [-Math.cos(span) * head, -Math.sin(span) * head];
  const faceBot = [-Math.cos(span) * head, Math.sin(span) * head];
  const horse = [
    faceTop,
    ...arcPoints(0, 0, head, head, Math.PI + span, Math.PI - span, 14).slice(1, -1),
    faceBot,
    [-60, 6],
    [-60, -6],
  ];
  const bar = [[-66, -5], [PJ.b + 8, -5], [PJ.b + 8, 5], [-66, 5]];
  beam.push(L(polygonPath(bar), "f"), L(pen.rect(-66, -5, PJ.b + 74, 10)));
  for (let x = -40; x < PJ.b; x += 22) beam.push(L(pen.line(x, -5, x, 5, 0.2), "t"));
  beam.push(L(polygonPath(horse), "f"));
  beam.push(L(pen.arc(0, 0, head, head, Math.PI + span, Math.PI - span)));
  beam.push(L(pen.line(faceTop[0], faceTop[1], -60, -6)));
  beam.push(L(pen.line(faceBot[0], faceBot[1], -60, 6)));
  beam.push(L(pen.arc(0, 0, head - 6, head - 6, Math.PI + span - 0.03, Math.PI - span + 0.03, { w: 0.3 }), "t"));
  beam.push(L(pen.hatch([[-94, -20], [-66, -8], [-66, 8], [-94, 20]], { gap: 5, angle: Math.PI / 3 }), "h"));
  const eq = [[PJ.b - 9, 4], [PJ.b + 9, 4], [PJ.b + 5, 12], [PJ.b - 5, 12]];
  beam.push(L(polygonPath(eq), "f"), L(pen.poly(eq, { closed: true, w: 0.3 })));
  beam.push(L(pen.circle(PJ.b, PJ.eOff, 2.6, 2.6, { turns: 1 })));
  beam.push(L(pen.circle(0, 0, 4.5, 4.5, { turns: 1 })));

  const carrier = [
    L(polygonPath([[-9, -2], [9, -2], [9, 2], [-9, 2]]), "f"),
    L(pen.rect(-9, -2, 18, 4, { w: 0.3 })),
    L(pen.rect(-3, -8, 6, 6, { w: 0.3 })),
  ];

  return { geom, stat, crank, beam, carrier, rodTop: -46 };
}

export function pumpjackPose(geom, theta) {
  return solvePumpjack(theta, geom);
}

/* ------------------------------------------------------------------ */
/* Tank battery — the shared P-17 commingle                            */
/* ------------------------------------------------------------------ */

export function tankBattery(seed) {
  const pen = createPen(seed, { wobble: 0.8 });
  const layers = [];
  const tankW = 46;
  const tankH = 118;

  // Stairs behind the first tank's walkway.
  layers.push(L(pen.line(212, 0, 166, -124, 0.5)));
  layers.push(L(pen.line(224, 0, 178, -124, 0.5)));
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    layers.push(L(pen.line(212 - 46 * t, -124 * t, 224 - 46 * t, -124 * t, 0.2), "t"));
  }
  layers.push(L(pen.line(224, -30, 224, 0, 0.3), "t"));

  for (let i = 0; i < 3; i++) {
    const x = i * (tankW + 10);
    const top = -tankH;
    const cx = x + tankW / 2;
    const body = [[x, 0], [x, top], ...arcPoints(cx, top, tankW / 2, 5, Math.PI, 0, 10), [x + tankW, 0]];
    layers.push(L(polygonPath(body), "f"));
    layers.push(L(pen.line(x, 0, x, top)));
    layers.push(L(pen.line(x + tankW, 0, x + tankW, top)));
    layers.push(L(pen.circle(cx, top, tankW / 2, 5, { turns: 1.02, w: 0.4 })));
    for (const y of [-40, -80]) layers.push(L(pen.arc(cx, y, tankW / 2, 4, 0, Math.PI, { w: 0.3 }), "t"));
    layers.push(L(pen.hatch([[x + tankW * 0.68, -2], [x + tankW - 1, -2], [x + tankW - 1, top + 2], [x + tankW * 0.68, top + 4]], { gap: 3.6, angle: -1.2 }), "h"));
    // Thief hatch and vent on the roof.
    layers.push(L(pen.rect(cx - 5, top - 9, 10, 5, { w: 0.2 }), "t"));
    layers.push(L(pen.line(x + 8, top - 2, x + 8, top - 18, 0.2), "t"));
    layers.push(L(pen.line(x + 4, top - 18, x + 12, top - 18, 0.2), "t"));
    // Nameplate.
    layers.push(L(pen.rect(cx - 8, -70, 16, 10, { w: 0.2 }), "t"));
  }

  // Walkway and handrail across the roofs.
  layers.push(L(pen.line(-8, -124, 180, -124)));
  layers.push(L(pen.line(-8, -146, 180, -146, 0.5)));
  for (let x = -6; x <= 180; x += 23) layers.push(L(pen.line(x, -124, x, -146, 0.3), "t"));

  // Load line with valves.
  layers.push(L(pen.line(-14, -16, 170, -16, 0.4), "t"));
  layers.push(L(pen.line(-14, -12, 170, -12, 0.4), "t"));
  for (const x of [23, 79, 135]) {
    layers.push(L(pen.poly([[x - 5, -20], [x + 5, -8], [x + 5, -20], [x - 5, -8]], { closed: true, w: 0.2 }), "t"));
  }

  // Heater-treater.
  const htX = 240;
  const ht = [[htX, 0], [htX, -86], ...arcPoints(htX + 14, -86, 14, 14, Math.PI, 2 * Math.PI, 10), [htX + 28, 0]];
  layers.push(L(polygonPath(ht), "f"));
  layers.push(L(pen.line(htX, 0, htX, -86)));
  layers.push(L(pen.line(htX + 28, 0, htX + 28, -86)));
  layers.push(L(pen.arc(htX + 14, -86, 14, 14, Math.PI, 2 * Math.PI)));
  layers.push(L(pen.line(htX + 14, -100, htX + 14, -128, 0.3), "t"));
  layers.push(L(pen.hatch([[htX + 19, -2], [htX + 27, -2], [htX + 27, -86], [htX + 19, -86]], { gap: 3.6, angle: -1.2 }), "h"));
  layers.push(L(pen.circle(htX + 14, -40, 5, 5, { turns: 1 }), "t"));

  // Sign on two posts.
  layers.push(L(pen.line(300, 0, 300, -52, 0.3)));
  layers.push(L(pen.line(336, 0, 336, -52, 0.3)));
  layers.push(L(polygonPath([[292, -74], [344, -74], [344, -46], [292, -46]]), "f"));
  layers.push(L(pen.rect(292, -74, 52, 28, { w: 0.4 })));

  return { layers, width: 344, inlets: [20, 60, 250], sign: [318, -58] };
}

/* ------------------------------------------------------------------ */
/* Landscape                                                           */
/* ------------------------------------------------------------------ */

export const WORLD = { W: 2000, H: 1000, ground: 760 };

export const groundY = (x) =>
  WORLD.ground + 3.2 * Math.sin(x / 210) + 1.6 * Math.sin(x / 71 + 1.3);

export function buildWorld(seed = 7) {
  const pen = createPen(seed, { wobble: 1 });
  const { W } = WORLD;
  const gy = groundY;

  const ground = pen.path(Array.from({ length: W / 25 + 1 }, (_, i) => [i * 25, gy(i * 25)]));
  const hills = pen.path(
    Array.from({ length: W / 40 + 1 }, (_, i) => {
      const x = i * 40;
      return [x, WORLD.ground - 44 - 26 * Math.sin(x / 330 + 0.6) - 12 * Math.sin(x / 120) - (x > 1200 && x < 1700 ? 30 * Math.sin(((x - 1200) / 500) * Math.PI) : 0)];
    }),
    0.5
  );
  const farHills = pen.path(
    Array.from({ length: W / 50 + 1 }, (_, i) => {
      const x = i * 50;
      return [x, WORLD.ground - 92 - 20 * Math.sin(x / 260 + 2) - 9 * Math.sin(x / 90)];
    }),
    0.4
  );

  // Soil strata and grass.
  let strata = "";
  for (let i = 0; i < 70; i++) {
    const x = pen.rand() * W;
    const y = gy(x) + 14 + pen.rand() * 150;
    const len = 8 + pen.rand() * 26;
    strata += pen.line(x, y, x + len, y + pen.r(1), 0.3);
  }
  let tufts = "";
  for (let i = 0; i < 90; i++) {
    const x = pen.rand() * W;
    const y = gy(x);
    for (let k = -1; k <= 1; k++) tufts += pen.line(x + k * 2, y, x + k * 4 + pen.r(1.5), y - 5 - pen.rand() * 6, 0.2);
  }

  const shrub = (cx, size) => {
    let d = "";
    const base = gy(cx);
    for (let i = 0; i < 16; i++) {
      const a = Math.PI + (i / 15) * Math.PI;
      const rr = size * (0.6 + pen.rand() * 0.45);
      const x = cx + Math.cos(a) * rr * 1.4;
      const y = base - 2 + Math.sin(a) * rr;
      d += pen.arc(x, y, 5 + pen.rand() * 4, 3 + pen.rand() * 3, Math.PI * (0.9 + pen.rand() * 0.3), Math.PI * (2 + pen.rand() * 0.2), { w: 0.3 });
    }
    d += pen.line(cx - 2, base, cx + pen.r(4), base - size * 0.7, 0.3);
    d += pen.line(cx + 3, base, cx + size * 0.5, base - size * 0.6, 0.3);
    return d;
  };
  const shrubs = [80, 590, 985, 1390, 1540, 1980].map((x, i) => shrub(x, 16 + (i % 3) * 5)).join("");

  // Power line on H-poles.
  const poleXs = [110, 960, 1470, 1990];
  const poleTop = (x) => gy(x) - 238;
  let poles = "";
  for (const x of poleXs) {
    const g = gy(x);
    poles += pen.line(x, g, x, poleTop(x), 0.5);
    poles += pen.line(x - 34, poleTop(x) + 12, x + 34, poleTop(x) + 12, 0.4);
    poles += pen.line(x - 20, poleTop(x) + 44, x + 20, poleTop(x) + 44, 0.3);
    for (const dx of [-28, 0, 28]) poles += pen.line(x + dx, poleTop(x) + 12, x + dx, poleTop(x) + 4, 0.2);
  }
  let wires = "";
  for (let i = 0; i < poleXs.length - 1; i++) {
    const x1 = poleXs[i];
    const x2 = poleXs[i + 1];
    for (const dx of [-28, 0, 28]) {
      const pts = [];
      for (let k = 0; k <= 12; k++) {
        const t = k / 12;
        const y1 = poleTop(x1) + 4;
        const y2 = poleTop(x2) + 4;
        pts.push([x1 + dx + (x2 - x1) * t, y1 + (y2 - y1) * t + 30 * 4 * t * (1 - t)]);
      }
      wires += pen.path(pts, 0.3);
    }
  }

  // Lease line and a short run of fence.
  const leaseX = 1420;
  const leaseLine = pen.dashed([[leaseX, gy(leaseX) + 150], [leaseX, gy(leaseX) - 300]], { dash: 12, gap: 8 });
  let fence = "";
  for (let x = 1360; x <= 1540; x += 30) {
    fence += pen.line(x, gy(x) + 2, x + pen.r(1), gy(x) - 38, 0.4);
  }
  for (const h of [12, 23, 34]) {
    const pts = [];
    for (let x = 1360; x <= 1540; x += 15) {
      const k = ((x - 1360) % 30) / 30;
      pts.push([x, gy(x) - h + 2.2 * 4 * k * (1 - k)]);
    }
    fence += pen.path(pts, 0.25);
  }

  // Sky.
  let stars = "";
  const starPts = [];
  for (let i = 0; i < 120; i++) {
    const x = pen.rand() * W;
    const y = -800 + Math.pow(pen.rand(), 0.8) * 1280;
    const s = 1.5 + pen.rand() * 3.5;
    starPts.push([x, y]);
    if (i % 3 === 0) {
      stars += pen.line(x - s, y, x + s, y, 0.1) + pen.line(x, y - s, x, y + s, 0.1);
    } else {
      stars += pen.line(x - 0.8, y, x + 0.8, y + 0.4, 0.1);
    }
  }
  const [mx, my] = [1180, 40];
  const moon = pen.circle(mx, my, 38, 38, { turns: 1.06 }) + pen.arc(mx - 16, my - 8, 34, 38, -1.3, 1.45, { w: 0.4 });
  const moonHatch = pen.hatch(
    [...arcPoints(mx, my, 37, 37, -1.1, 1.1, 10), ...arcPoints(mx - 16, my - 8, 32, 36, 1.3, -1.2, 10)],
    { gap: 4, angle: -0.7 }
  );
  const [sx, sy] = [980, 120];
  let sunRays = "";
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r1 = 54 + (i % 2) * 4;
    const r2 = r1 + 16 + (i % 2 ? 0 : 10);
    sunRays += pen.line(sx + Math.cos(a) * r1, sy + Math.sin(a) * r1, sx + Math.cos(a) * r2, sy + Math.sin(a) * r2, 0.3);
  }
  const sun = pen.circle(sx, sy, 44, 44, { turns: 1.05 });

  // Wells, battery and the buried lines between them.
  const batteryX = 1010;
  const batteryS = 1.25;
  const jacks = [
    { id: "a", wellX: 230, s: 1.3, flip: false, seed: seed * 3 + 1, speed: 1 },
    { id: "b", wellX: 660, s: 1.08, flip: false, seed: seed * 3 + 2, speed: 0.86 },
    { id: "c", wellX: 1880, s: 1.3, flip: true, seed: seed * 3 + 3, speed: 1.12 },
  ].map((j) => ({ ...j, y: gy(j.wellX), data: pumpjack(j.seed) }));

  const battery = { x: batteryX, y: gy(batteryX + 150), s: batteryS, data: tankBattery(seed + 11) };
  const inlet = (i) => batteryX + battery.data.inlets[i] * batteryS;
  const outlet = (j) => j.wellX + (j.flip ? 33 : -33) * j.s;

  const route = (j, i, depth) => {
    const ox = outlet(j);
    const ix = inlet(i);
    return [
      [ox, gy(ox)],
      [ox, gy(ox) + depth],
      [ix, gy(ix) + depth],
      [ix, gy(ix)],
    ];
  };
  const routes = {
    a: route(jacks[0], 0, 34),
    b: route(jacks[1], 1, 22),
    c: route(jacks[2], 2, 28),
  };
  const buried = Object.values(routes).map((pts) => pen.dashed(pts, { dash: 8, gap: 6 })).join("");

  // Red tracer paths for the blast-radius beat: out of the neighbour's well,
  // into the battery, and back out to each of the operator's own wells.
  const red = createPen(seed + 99, { wobble: 1.3 });
  const trace = (pts, lift = 0) => red.path(pts.map(([x, y], i) => [x, y + (i === 0 || i === pts.length - 1 ? lift : 0)]), 1.4);
  const wellTop = (j) => [j.wellX, j.y - 46 * j.s];
  const tracers = {
    c: trace([wellTop(jacks[2]), [outlet(jacks[2]), jacks[2].y - 30 * jacks[2].s], ...routes.c]),
    a: trace([...[...routes.a].reverse(), [outlet(jacks[0]), jacks[0].y - 30 * jacks[0].s], wellTop(jacks[0])]),
    b: trace([...[...routes.b].reverse(), [outlet(jacks[1]), jacks[1].y - 30 * jacks[1].s], wellTop(jacks[1])]),
  };

  return {
    ground,
    hills,
    farHills,
    strata,
    tufts,
    shrubs,
    poles,
    wires,
    leaseLine,
    leaseX,
    fence,
    stars,
    starPts,
    moon,
    moonHatch,
    sun,
    sunRays,
    jacks,
    battery,
    buried,
    tracers,
  };
}

/* ------------------------------------------------------------------ */
/* Small plates                                                        */
/* ------------------------------------------------------------------ */

export function envelope(seed, { w = 120, h = 78 } = {}) {
  const pen = createPen(seed, { wobble: 0.7 });
  return {
    fill: polygonPath([[0, 0], [w, 0], [w, h], [0, h]]),
    body: pen.rect(0, 0, w, h),
    flap: pen.poly([[0, 0], [w / 2, h * 0.55], [w, 0]]) + pen.line(0, h, w * 0.38, h * 0.42, 0.4) + pen.line(w, h, w * 0.62, h * 0.42, 0.4),
    band: pen.rect(8, h - 20, w * 0.52, 12, { w: 0.4 }),
    stamp: pen.rect(w - 26, 7, 18, 20, { w: 0.3 }) + pen.circle(w - 17, 17, 5, 5, { turns: 1 }),
    lines: pen.line(w * 0.36, h * 0.66, w * 0.8, h * 0.66, 0.3) + pen.line(w * 0.36, h * 0.78, w * 0.72, h * 0.78, 0.3),
  };
}

export function clockFace(seed, r = 44) {
  const pen = createPen(seed, { wobble: 0.6 });
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r1 = i % 3 === 0 ? r - 10 : r - 6;
    ticks += pen.line(Math.cos(a) * r1, Math.sin(a) * r1, Math.cos(a) * (r - 2), Math.sin(a) * (r - 2), 0.2);
  }
  return {
    rim: pen.circle(0, 0, r, r, { turns: 1.05 }),
    ticks,
    hour: pen.line(0, 3, 0, -r * 0.5, 0.2),
    minute: pen.line(0, 5, 0, -r * 0.78, 0.2),
    hub: pen.circle(0, 0, 2.5, 2.5, { turns: 1 }),
  };
}

/** Circles, underlines and arrows used as annotations over HTML. */
export function annotation(seed) {
  const pen = createPen(seed, { wobble: 1.2 });
  return pen;
}

/* ------------------------------------------------------------------ */
/* Glyphs for the eight monitored systems (64 × 64)                     */
/* ------------------------------------------------------------------ */

export function glyphs(seed = 31) {
  const pen = createPen(seed, { wobble: 0.55 });
  const g = {};

  // Severance and seal: a chained, padlocked gate valve.
  g.severance =
    pen.line(4, 44, 22, 44) + pen.line(4, 52, 22, 52) + pen.line(42, 44, 60, 44) + pen.line(42, 52, 60, 52) +
    pen.poly([[22, 40], [42, 56], [42, 40], [22, 56]], { closed: true }) +
    pen.line(32, 48, 32, 24) + pen.circle(32, 20, 14, 4, { turns: 1.02 }) +
    pen.arc(46, 30, 5, 6, Math.PI, 2 * Math.PI) + pen.rect(40, 30, 12, 10) +
    pen.hatch([[40, 30], [52, 30], [52, 40], [40, 40]], { gap: 3 });

  // Certified letter.
  g.certified =
    pen.rect(6, 16, 52, 34) + pen.poly([[6, 16], [32, 36], [58, 16]]) +
    pen.rect(44, 20, 9, 10, { w: 0.3 }) + pen.line(10, 44, 30, 44) + pen.line(10, 40, 30, 40, 0.2);

  // Proration schedule: a ledger with one row circled.
  g.proration =
    pen.rect(12, 6, 40, 52) +
    [16, 24, 32, 40, 48].map((y) => pen.line(17, y, 47, y, 0.3)).join("") +
    pen.line(26, 12, 26, 52, 0.2) +
    pen.circle(32, 32, 24, 6, { turns: 1.15 });

  // P-5: a calendar page counting down.
  g.p5 =
    pen.rect(8, 12, 48, 44) + pen.line(8, 22, 56, 22) +
    pen.line(20, 6, 20, 16) + pen.line(44, 6, 44, 16) +
    [30, 38, 46].flatMap((y) => [16, 26, 36, 46].map((x) => pen.line(x, y, x + 3, y, 0.2))).join("") +
    pen.circle(47.5, 46, 6, 6, { turns: 1.2 });

  // Rule 15: a shut-in wellhead beside an hourglass.
  g.rule15 =
    pen.rect(12, 44, 18, 12) + pen.rect(14, 34, 14, 10) + pen.rect(17, 24, 8, 10) + pen.line(10, 20, 32, 20) + pen.line(21, 20, 21, 24) +
    pen.line(38, 16, 56, 16) + pen.line(38, 56, 56, 56) +
    pen.poly([[40, 16], [54, 16], [47, 36], [54, 56], [40, 56], [47, 36]], { closed: true, w: 0.4 }) +
    pen.hatch([[42, 50], [52, 50], [54, 56], [40, 56]], { gap: 2.4, angle: 0 });

  // P-17: three lines into one tank.
  g.commingle =
    pen.poly([[4, 14], [22, 14], [30, 34]]) + pen.line(4, 34, 30, 34) + pen.poly([[4, 54], [22, 54], [30, 34]]) +
    pen.line(30, 34, 38, 34) + pen.rect(38, 14, 20, 42) + pen.circle(48, 14, 10, 2.5, { turns: 1 }) +
    pen.hatch([[50, 16], [57, 16], [57, 55], [50, 55]], { gap: 2.6, angle: -1.2 });

  // W-1: a tricone bit.
  g.drilling =
    pen.rect(24, 4, 16, 18) + pen.poly([[22, 22], [42, 22], [46, 34], [18, 34]], { closed: true }) +
    pen.circle(22, 44, 9, 11, { turns: 1 }) + pen.circle(42, 44, 9, 11, { turns: 1 }) + pen.circle(32, 50, 8, 9, { turns: 1 }) +
    [0, 1, 2].map((i) => pen.line(18 + i * 3, 38 + i * 4, 26 + i * 2, 38 + i * 4, 0.2)).join("");

  // P-4: a line running to a purchaser's meter.
  g.purchaser =
    pen.line(4, 40, 30, 40) + pen.line(4, 48, 30, 48) +
    pen.circle(42, 30, 14, 14, { turns: 1.02 }) + pen.line(42, 30, 50, 22, 0.3) +
    pen.line(42, 44, 42, 56) + pen.line(30, 44, 36, 44) +
    pen.arrow(8, 60, 32, 60, { bend: 0, head: 5 });

  return g;
}
