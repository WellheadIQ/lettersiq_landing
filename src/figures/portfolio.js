/**
 * Portfolio: seventy lease pillars on three terraces, one terrace per plan.
 * The pointer is projected onto the field, and every lease up to the one under
 * it is watched: those pillars stand up on their own springs, the rest sit as
 * stubs, so the watched set grows and shrinks behind the pointer. The terrace
 * that holds the last watched lease takes the bright edge, and a 3 × 3 dot mark
 * rides that lease's lid. At rest the field holds 240 leases on the middle
 * terrace. The slider is the height a watched lease stands, in units.
 *
 * The pattern: a field. Springs, a hit test on a fixed plane, and a rest that
 * already says which plan most operators are on.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  flatDot, mk, place, pointer, put, register, disposer, solid,
} = HL;

const NX = 10, NY = 7, CELL = 12, FOOT = 9, TG = 7, PB = 5, STUB = 2, PLANE = 6, REST = 24;
// the rows of each terrace: Essential holds 100 leases, Operator up to 500, Enterprise the rest
const TIERS = [[0, 0, "essential"], [1, 4, "operator"], [5, 6, "enterprise"]];
const rowY = (j) => j * CELL + (j >= 1 ? TG : 0) + (j >= 5 ? TG : 0);
const tierOf = (n) => (n <= 10 ? 0 : n <= 50 ? 1 : 2);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, count = REST, over = false;

  const C = Cam(45, 0.5, 2.0);
  const Y1 = rowY(NY - 1) + CELL;
  fit(C, [[-2, -2, -PB], [NX * CELL + 2, -2, -PB], [-2, Y1 + 2, -PB], [NX * CELL + 2, Y1 + 2, -PB], [0, 0, 30], [NX * CELL, 0, 30], [0, Y1, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const slabs = TIERS.map(([j0, j1]) => {
    const el = solid(g), [ring, inner] = rings(-2, rowY(j0) - 2, NX * CELL + 2, rowY(j1) + CELL + 2, 4, 1.5);
    put(el, prism(P, front, ring, inner, -PB, 0));
    return el;
  });

  // Diagonal by diagonal from the back corner, so appending is painting back to front.
  const cols = [];
  for (let s = 0; s <= NX + NY - 2; s++) for (let i = 0; i < NX; i++) {
    const j = s - i;
    if (j < 0 || j >= NY) continue;
    const u = i / (NX - 1), v = j / (NY - 1);
    const w = 0.55 + 0.3 * Math.exp(-((u - 0.25) ** 2 + (v - 0.3) ** 2) / 0.08) + 0.18 * Math.exp(-((u - 0.75) ** 2 + (v - 0.7) ** 2) / 0.05);
    const x0 = i * CELL + (CELL - FOOT) / 2, y0 = rowY(j) + (CELL - FOOT) / 2;
    const [ring, inner] = rings(x0, y0, x0 + FOOT, y0 + FOOT, 2.4, 0.9);
    const n = j * NX + i + 1;
    cols.push({ i, j, n, w, ring, inner, sp: spring(n <= REST ? R * w : STUB, { eps: 0.04 }), el: solid(g), drawn: NaN });
  }
  const byN = new Map(cols.map((c) => [c.n, c]));

  // the mark: a 3 × 3 of dots on the lid of the last watched lease, moved in the paint order to just after it
  const mark = mk("g", {}, g), md = [];
  for (let k = 0; k < 9; k++) md.push(flatDot(mark, C, 0.55, "dot m"));
  let mc = null;

  function drawCol(c) {
    const h = Math.max(0.6, c.sp.x);
    if (h === c.drawn) return;
    c.drawn = h;
    put(c.el, prism(P, front, c.ring, c.inner, 0, h));
  }
  function drawMark() {
    const want = byN.get(count);
    if (want !== mc) { mc = want; mc.el.g.after(mark); }
    const cx = (mc.i + 0.5) * CELL, cy = rowY(mc.j) + CELL / 2, h = Math.max(0.6, mc.sp.x);
    md.forEach((el, k) => place(el, P(cx + ((k % 3) - 1) * 2.2, cy + (Math.floor(k / 3) - 1) * 2.2, h)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const c of cols) { if (stepS(c.sp, dt)) m = true; drawCol(c); }
    drawMark();
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    for (const c of cols) c.sp.t = c.n <= count ? R * c.w : STUB;
    const t = tierOf(count);
    slabs.forEach((el, k) => el.sil.classList.toggle("hi", k === t));
    read.textContent = over ? `${count * 10} leases · ${TIERS[t][2]}` : "rest";
    B.wake();
  }

  /** The lease under a point on the fixed plane: its row from the terrace bands, its column from x; 0 when off the field. */
  function under([x, y]) {
    if (x < -6 || x > NX * CELL + 6 || y < -6 || y > Y1 + 6) return 0;
    let j = 0;
    for (let k = 0; k < NY; k++) if (y >= rowY(k) - (k === 1 || k === 5 ? TG / 2 : 0)) j = k;
    return j * NX + clamp(Math.floor(x / CELL), 0, NX - 1) + 1;
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const n = under(unproj(C, p[0], p[1], PLANE));
      over = n > 0; count = over ? n : REST;
      retarget();
    },
    leave: () => { over = false; count = REST; retarget(); },
  }));
  retarget();
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "portfolio",
  means: "Seventy leases on three plan terraces: every lease up to the pointer stands up, and the plan that holds them lights.",
  rules: [1, 3, 4, 5],
  range: [12, 20, 30],
  mount,
});
