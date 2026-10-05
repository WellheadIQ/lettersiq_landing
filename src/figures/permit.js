/**
 * Permit: a lease plat on a plinth, eight tracts and one tank battery. Three
 * of them pipe to the battery under one surface-commingling permit, so a
 * severance on any one of the three shuts in all three. The tract under the
 * pointer rises; when it is on the permit its co-members rise with it,
 * staggered outwards by distance, and the read-out counts the leases at risk.
 * At rest the shared battery's back tank is the bright mark. The slider is
 * the stagger, in ms.
 *
 * The pattern: one of many, stepped. Tweens, a stagger by distance, and a hit
 * test on each tract's own rest top, since the tracts stand at different heights.
 */
const {
  Cam, circ, facing, fit, poly, prism, proj, put, rings, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, register, solid,
} = HL;

// x0, y0, x1, y1, rest height, on the permit, wellhead x, y
const T = [
  [6, 6, 48, 48, 7, 0, 29, 25], [60, 6, 106, 48, 10, 0, 85, 24], [120, 6, 154, 48, 5, 0, 139, 22],
  [6, 60, 48, 106, 9, 0, 29, 80], [60, 60, 100, 100, 6, 1, 80, 80], [118, 60, 154, 98, 8, 1, 136, 78],
  [6, 120, 48, 154, 4, 0, 30, 134], [60, 118, 98, 154, 7, 1, 78, 136],
];
const LEASE = ["10450", "09112", "11318", "09876", "11234", "10977", "11102", "11235"];
// the battery takes the near corner, so every flowline to it runs in a lane the eye can see
const BAT = [124, 124, 154, 154], BH = 3, LIFT = 24, SHARE = 0.6, PB = 6;
// the co-members' flowlines, low strips on the ground back to front: a riser and header from the centre tract
// teeing into the trunk from the right one, and a run from the left one, each into the berm
const LINES = [[90, 98, 94, 114], [90, 110, 139, 114], [135, 96, 139, 127], [96, 135, 127, 139]];
const MEMBERS = T.filter((t) => t[5]).length;

const disc = (R, cx, cy) => circ(R, 22).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));
/** A stack of discs standing on a top, as [R, crease inset, height above the top, own height]. */
const stack = (cx, cy, segs) => ({ key: cx + cy, segs: segs.map(([R, b, z0, h]) => ({ rr: [disc(R, cx, cy), disc(R - b, cx, cy)], z0, h })) });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  // Fitted to the plinth and to the back tracts at full rise with their wellheads on top.
  const C = Cam(45, 0.5, 1.42);
  fit(C, [[-4, -4, -PB], [164, -4, -PB], [-4, 164, -PB], [164, 164, -PB], [6, 6, 40], [62, 6, 43], [6, 62, 42]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [pr, pi] = rings(-4, -4, 164, 164, 9, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));
  // painted before the tracts: a tract rising in front of a line covers it, as it would
  for (const [x0, y0, x1, y1] of LINES) {
    const [lr, li] = rings(x0, y0, x1, y1, 2, 0.6);
    put(solid(g), prism(P, front, lr, li, 0, 2));
  }

  const tracts = T.map(([x0, y0, x1, y1, h0, on, wx, wy], i) => {
    const parts = [stack(wx, wy, [[1.5, 0.5, 0, 7], [2.7, 0.8, 7, 1.6]])];
    if (!on) parts.push(stack(x0 + 10, y1 - 10, [[4, 1.1, 0, 9]]));
    parts.sort((a, b) => a.key - b.key);
    return { i, h0, on, wx, wy, parts, key: (x0 + x1 + y0 + y1) / 2, ring: rings(x0, y0, x1, y1, 3.5, 1.4), tw: tween(h0), drawn: NaN };
  });

  // Back to front by the tracts' centres, with the battery in its place among them.
  let tanks = null;
  const BKEY = (BAT[0] + BAT[1] + BAT[2] + BAT[3]) / 2;
  for (const t of tracts.slice().sort((a, b) => a.key - b.key)) {
    if (!tanks && t.key > BKEY) tanks = battery();
    const grp = mk("g", {}, g);
    t.el = solid(grp);
    t.pad = mk("path", { class: "nf lo" }, grp);
    for (const p of t.parts) for (const s of p.segs) s.el = solid(grp);
  }
  tanks ??= battery();

  function battery() {
    const grp = mk("g", {}, g), [br, bi] = rings(BAT[0], BAT[1], BAT[2], BAT[3], 4, 1.6);
    put(solid(grp), prism(P, front, br, bi, 0, BH));
    return [[133, 133, 5.6, 13], [147, 132, 4.2, 13], [132, 147, 4.2, 13], [147, 147, 2.4, 10]].map(([cx, cy, R, h]) => {
      const el = solid(grp);
      put(el, prism(P, front, disc(R, cx, cy), disc(R - 1.1, cx, cy), BH, BH + h));
      return el;
    });
  }

  function draw(t, h) {
    put(t.el, prism(P, front, t.ring[0], t.ring[1], 0, h));
    const { wx, wy } = t;
    t.pad.setAttribute("d", poly([[wx - 6, wy - 5], [wx + 6, wy - 5], [wx + 6, wy + 5], [wx - 6, wy + 5]].map(([x, y]) => P(x, y, h))));
    for (const p of t.parts) for (const s of p.segs) put(s.el, prism(P, front, s.rr[0], s.rr[1], h + s.z0, h + s.z0 + s.h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tracts) {
      const h = tval(t.tw, now);
      if (h !== t.drawn) { t.drawn = h; draw(t, h); }
      if (!tdone(t.tw, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The tract under the pointer, read on each tract's own rest top; 8 is the battery, -1 is nothing. */
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    const test = (i, x0, y0, x1, y1, z) => {
      const [x, y] = unproj(C, sx, sy, z), m = 3;
      if (x < x0 - m || x > x1 + m || y < y0 - m || y > y1 + m) return;
      const d = Math.hypot((x - (x0 + x1) / 2) / (x1 - x0), (y - (y0 + y1) / 2) / (y1 - y0));
      if (d < bd) { bd = d; best = i; }
    };
    T.forEach(([x0, y0, x1, y1, h0], i) => test(i, x0, y0, x1, y1, h0));
    test(8, BAT[0], BAT[1], BAT[2], BAT[3], BH);
    return best;
  }

  const mid = (i) => (i === 8 ? [139, 139] : [(T[i][0] + T[i][2]) / 2, (T[i][1] + T[i][3]) / 2]);
  let act = -2;
  /** Raises tract a and, when it is on the permit, its co-members (8 is the battery itself, -1 is rest). */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act, o = from >= 0 ? mid(from) : null;
    act = a;
    const permit = a === 8 || (a >= 0 && T[a][5] === 1);
    for (const t of tracts) {
      const m = mid(t.i), delay = o ? (Math.hypot(m[0] - o[0], m[1] - o[1]) / 40) * stag : 0;
      tset(t.tw, t.h0 + (t.i === a ? LIFT : permit && t.on ? LIFT * SHARE : 0), now, delay);
      t.el.sil.classList.toggle("hi", t.i === a);
    }
    tanks[0].sil.classList.toggle("hi", a < 0 || a === 8);
    read.textContent = a < 0 ? "rest" : `${a === 8 ? "battery" : LEASE[a]} · ${permit ? MEMBERS : 1} at risk`;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "permit",
  means: "Eight leases and one shared tank battery: point at a lease, and every lease on its commingling permit rises with it.",
  rules: [1, 2, 6, 10],
  range: [0, 50, 110],
  mount,
});
