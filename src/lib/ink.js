/**
 * A seeded pen. Every figure on the site is generated at build time from these
 * primitives, so the same seed always produces the same drawing and the HTML
 * ships finished path data — the browser only animates the strokes.
 */

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const q = (n) => Math.round(n * 10) / 10;
const pt = ([x, y]) => `${q(x)} ${q(y)}`;

/** Catmull-Rom through points, emitted as cubic Béziers. */
export function smooth(points) {
  if (points.length < 2) return "";
  let d = `M${pt(points[0])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d;
}

export const polygonPath = (points) =>
  `M${points.map(pt).join("L")}Z`;

export function rotatePoint([x, y], angle, [cx, cy] = [0, 0]) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

export function createPen(seed = 1, { wobble = 1 } = {}) {
  const rand = mulberry32(seed);
  const r = (amount = 1) => (rand() * 2 - 1) * amount;

  function strokePoints(x1, y1, x2, y2, w = wobble) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const amp = Math.min(len * 0.011, 2.1) * w;
    const segs = Math.max(2, Math.min(7, Math.round(len / 55)));
    const bow = r(amp);
    // A hand overshoots and undershoots its endpoints a little.
    const lead = r(0.9 * w) / len;
    const tail = r(1.2 * w) / len;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const t = -lead + (i / segs) * (1 + lead + tail);
      const env = Math.sin(Math.PI * Math.min(1, Math.max(0, i / segs)));
      const off = bow * env + (i > 0 && i < segs ? r(amp * 0.3) : r(0.35 * w));
      pts.push([x1 + dx * t + nx * off, y1 + dy * t + ny * off]);
    }
    return pts;
  }

  const line = (x1, y1, x2, y2, w) => smooth(strokePoints(x1, y1, x2, y2, w));

  /** Each edge is its own stroke, so corners cross the way a pen's do. */
  function poly(points, { closed = false, w } = {}) {
    const edges = [];
    const n = points.length;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = points[i];
      const b = points[(i + 1) % n];
      edges.push(line(a[0], a[1], b[0], b[1], w));
    }
    return edges.join("");
  }

  const rect = (x, y, w, h, opts) =>
    poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { closed: true, ...opts });

  /** One continuous stroke through many points, e.g. a ground line. */
  function path(points, w = wobble) {
    return smooth(points.map(([x, y]) => [x + r(0.4 * w), y + r(0.4 * w)]));
  }

  /**
   * A drawn loop. `turns` above 1 leaves the overlapping tail a hand leaves
   * when circling something on paper.
   */
  function circle(cx, cy, rx, ry = rx, { turns = 1.04, w = wobble, start, tilt = 0 } = {}) {
    const a0 = start ?? rand() * Math.PI * 2;
    const steps = Math.max(18, Math.round(Math.max(rx, ry) / 2.2));
    const total = Math.round(steps * turns);
    const phase = rand() * Math.PI * 2;
    const drift = r(0.06) * w;
    const pts = [];
    for (let i = 0; i <= total; i++) {
      const t = i / steps;
      const a = a0 + t * Math.PI * 2;
      const k = 1 + 0.028 * w * Math.sin(2 * a + phase) + drift * t;
      const p = [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
      pts.push(tilt ? rotatePoint(p, tilt, [cx, cy]) : p);
    }
    return smooth(pts);
  }

  function arc(cx, cy, rx, ry, a0, a1, { w = wobble } = {}) {
    const steps = Math.max(6, Math.round((Math.abs(a1 - a0) * Math.max(rx, ry)) / 9));
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      pts.push([cx + Math.cos(a) * rx + r(0.3 * w), cy + Math.sin(a) * ry + r(0.3 * w)]);
    }
    return smooth(pts);
  }

  /** Parallel hatching clipped to any simple polygon. */
  function hatch(polygon, { angle = -Math.PI / 4, gap = 6, inset = 1.2, w = 0.6 } = {}) {
    const rot = polygon.map((p) => rotatePoint(p, -angle));
    const ys = rot.map((p) => p[1]);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    let d = "";
    for (let y = minY + gap * (0.5 + rand() * 0.3); y < maxY; y += gap * (0.85 + rand() * 0.3)) {
      const xs = [];
      for (let i = 0; i < rot.length; i++) {
        const [ax, ay] = rot[i];
        const [bx, by] = rot[(i + 1) % rot.length];
        if ((ay <= y && by > y) || (by <= y && ay > y)) {
          xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
        }
      }
      xs.sort((m, n) => m - n);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const xa = xs[i] + inset + rand() * 1.5;
        const xb = xs[i + 1] - inset - rand() * 1.5;
        if (xb - xa < 2) continue;
        const a = rotatePoint([xa, y], angle);
        const b = rotatePoint([xb, y], angle);
        d += line(a[0], a[1], b[0], b[1], w);
      }
    }
    return d;
  }

  /** A gently bowed arrow with a two-stroke head. */
  function arrow(x1, y1, x2, y2, { bend = 0.18, head = 9, w = wobble } = {}) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const off = Math.sin(Math.PI * t) * len * bend;
      pts.push([x1 + dx * t + nx * off + r(0.4 * w), y1 + dy * t + ny * off + r(0.4 * w)]);
    }
    const [px, py] = pts[5];
    const ang = Math.atan2(y2 - py, x2 - px);
    const h1 = [x2 - Math.cos(ang - 0.5) * head, y2 - Math.sin(ang - 0.5) * head];
    const h2 = [x2 - Math.cos(ang + 0.45) * head, y2 - Math.sin(ang + 0.45) * head];
    return (
      smooth(pts) +
      line(h1[0], h1[1], x2, y2, 0.4) +
      line(x2, y2, h2[0], h2[1], 0.4)
    );
  }

  function dashed(points, { dash = 9, gap = 6 } = {}) {
    let d = "";
    for (let i = 0; i < points.length - 1; i++) {
      const [ax, ay] = points[i];
      const [bx, by] = points[i + 1];
      const len = Math.hypot(bx - ax, by - ay);
      for (let s = 0; s < len; s += dash + gap) {
        const e = Math.min(len, s + dash * (0.8 + rand() * 0.4));
        const t0 = s / len;
        const t1 = e / len;
        d += line(ax + (bx - ax) * t0, ay + (by - ay) * t0, ax + (bx - ax) * t1, ay + (by - ay) * t1, 0.3);
      }
    }
    return d;
  }

  /** A quick loose underline, the kind drawn under a word for emphasis. */
  function scribble(x1, x2, y, { passes = 2, w = wobble } = {}) {
    const pts = [];
    for (let p = 0; p < passes; p++) {
      const dir = p % 2 === 0;
      const from = dir ? x1 : x2;
      const to = dir ? x2 : x1;
      const yy = y + p * 3.2;
      for (let i = 0; i <= 5; i++) {
        const t = i / 5;
        pts.push([from + (to - from) * t + r(1.5 * w), yy + Math.sin(t * Math.PI) * 1.4 + r(0.7 * w)]);
      }
    }
    return smooth(pts);
  }

  return { rand, r, line, poly, rect, path, circle, arc, hatch, arrow, dashed, scribble };
}
