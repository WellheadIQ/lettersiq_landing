/**
 * Cabinet: a card-catalog chest of eight drawers, one for each Railroad
 * Commission system LettersIQ reads. The drawer under the pointer slides out
 * on the lift curve and shows its index cards; the others ease shut, staggered
 * outwards from it. Each drawer's number is punched as dots in its label
 * holder. At rest the certified-letter drawer stands open and its pull is the
 * bright mark. The slider is the stagger, in ms.
 *
 * The pattern: one of many. Tweens, a stagger by distance across the grid, and
 * a hit test on the cabinet's front plane, which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, poly, prism, proj, rings, rrect, seg,
  tdone, tset, tval, tween, disposer, mk, place, pointer, put, register, solid,
} = HL;

const COLS = 4, DW = 28, DH = 24, GX = 3, GZ = 3, M = 5, Y1 = 44, ZB = 9;
const X1 = M * 2 + COLS * DW + (COLS - 1) * GX, ZT = ZB + 2 * DH + GZ + 4;
const OUT = 30, TK = 1.6, NC = 11, TW = 7, TH = 2;
const REST = [2, 15, 0, 4, 0, 6, 0, 3];
const NAMES = ["severance", "certified", "proration", "p-5", "rule 15", "p-17", "w-1", "p-4"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  // Fitted to the shut chest and to drawers at full reach, so a pulled drawer never leaves the frame.
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-2, -2, 0], [X1 + 2, -2, ZT + 4], [X1 + 2, Y1 + 2, 0], [-2, Y1 + 2, ZT + 4],
    [M, Y1 + OUT, ZB], [X1 - M, Y1 + OUT, ZB], [M, Y1 + OUT, ZT - 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (ring, y) => ring.map((q) => P(q.u, y, q.v));

  const g = mk("g", {}, svg);
  // plinth, carcass, and a cap that overhangs it: three solids, back to front by height
  for (const [x0, y0, x1, y1, r, b, z0, z1] of [
    [3, 3, X1 - 3, Y1 - 3, 2, 1, 0, 5], [0, 0, X1, Y1, 3, 1.2, 5, ZT], [-2, -2, X1 + 2, Y1 + 2, 3.5, 1.4, ZT, ZT + 4],
  ]) {
    const [ring, inner] = rings(x0, y0, x1, y1, r, b);
    put(solid(g), prism(P, front, ring, inner, z0, z1));
  }

  // Drawers left to right, the lower before the upper: a drawer pulled out only ever covers those to its left and below.
  const drawers = [];
  for (const i of [4, 0, 5, 1, 6, 2, 7, 3]) {
    const c = i % COLS, r = i < COLS ? 1 : 0;
    const x0 = M + c * (DW + GX), z0 = ZB + r * (DH + GZ), x1 = x0 + DW, z1 = z0 + DH, cx = (x0 + x1) / 2;
    const grp = mk("g", {}, g);
    mk("path", { d: poly(onFace(rrect(x0 - 0.9, z0 - 0.9, x1 + 0.9, z1 + 0.9, 2.6, 5), Y1)), class: "nf lo" }, grp);
    const el = {
      box: mk("path", { class: "fo" }, grp),
      far: mk("path", { class: "nf lo" }, grp),
      cards: Array.from({ length: NC }, () => mk("path", {}, grp)),
      wall: mk("path", { class: "fo" }, grp),
      edge: mk("path", { class: "nf sil" }, grp),
      lip: mk("path", { class: "nf lo" }, grp),
      back: mk("path", { class: "lo" }, grp),
      face: mk("path", { class: "sil" }, grp),
      pull: mk("path", { class: "nf" }, grp),
      label: mk("path", { class: "nf lo" }, grp),
      dots: Array.from({ length: 8 }, (_, k) => mk("circle", { r: 0.95, class: "dot " + (k === i ? "m" : "off") }, grp)),
    };
    // index cards stand across the drawer, their tabs stepping through three positions
    const u0 = x0 + 3, u1 = x1 - 3, v0 = z0 + 2, v1 = z1 - 7.2;
    const shapes = [0, 1, 2].map((k) => {
      const t = u0 + 1 + k * ((u1 - u0 - TW - 2) / 2);
      return fillet([[u0, v0], [u1, v0], [u1, v1], [t + TW, v1], [t + TW, v1 + TH], [t, v1 + TH], [t, v1], [u0, v1]],
        [0.5, 0.5, 1, 0.5, 0.8, 0.8, 0.5, 1]);
    });
    drawers[i] = { i, c, r, x0, x1, z0, z1, cx, el, shapes, front: rrect(x0, z0, x1, z1, 2, 5), tw: tween(REST[i]), drawn: NaN };
  }

  function draw(dr, d) {
    const { x0, x1, z0, z1, cx, el } = dr, yf = Y1 + d, yb = Y1 + Math.max(0, d - TK);
    const bx0 = x0 + 1.4, bx1 = x1 - 1.4, bz0 = z0 + 1.2, bz1 = z1 - 4.5, out = yb - Y1 > 0.6;
    const corners = [];
    for (const x of [bx0, bx1]) for (const y of [Y1, yb]) for (const z of [bz0, bz1]) corners.push(P(x, y, z));
    const sh = out ? poly(hull(corners)) : "";
    el.box.setAttribute("d", sh);
    el.edge.setAttribute("d", sh);
    el.far.setAttribute("d", out ? seg(P(bx0 + 0.9, Y1, bz1), P(bx0 + 0.9, yb, bz1)) + seg(P(bx0 + 0.9, Y1, bz0 + 0.8), P(bx0 + 0.9, yb, bz0 + 0.8)) : "");
    el.cards.forEach((card, k) => {
      const yc = yb - 2.4 - k * 3.4;
      card.setAttribute("d", out && yc > Y1 + 1.2 ? poly(dr.shapes[k % 3].map(([u, v]) => P(u, yc, v))) : "");
    });
    el.wall.setAttribute("d", out ? poly([P(bx1, Y1, bz0), P(bx1, yb, bz0), P(bx1, yb, bz1), P(bx1, Y1, bz1)]) : "");
    el.lip.setAttribute("d", out ? seg(P(bx1 - 0.9, Y1, bz1), P(bx1 - 0.9, yb, bz1)) : "");
    el.back.setAttribute("d", d > 0.3 ? poly(onFace(dr.front, yb)) : "");
    el.face.setAttribute("d", poly(onFace(dr.front, yf)));
    el.pull.setAttribute("d", poly(onFace(rrect(cx - 6, z0 + 5, cx + 6, z0 + 8.4, 1.7, 4), yf)) + poly(onFace(rrect(cx - 4.4, z0 + 6.1, cx + 4.4, z0 + 7.3, 0.6, 3), yf)));
    el.label.setAttribute("d", poly(onFace(rrect(cx - 7, z0 + 12, cx + 7, z0 + 19, 1.2, 4), yf)));
    el.dots.forEach((dot, k) => place(dot, P(cx + ((k % 4) - 1.5) * 2.8, yf, z0 + 15.5 + (0.5 - Math.floor(k / 4)) * 2.6)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const dr of drawers) {
      const d = tval(dr.tw, now);
      if (d !== dr.drawn) { dr.drawn = d; draw(dr, d); }
      if (!tdone(dr.tw, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  // The hit test reads the front plane at rest: (u, v) on y = Y1. A drawer sliding out from under the pointer cannot change it.
  const O = P(0, Y1, 0), pu = P(1, Y1, 0), pv = P(0, Y1, 1);
  const au = [pu[0] - O[0], pu[1] - O[1]], av = [pv[0] - O[0], pv[1] - O[1]], det = au[0] * av[1] - au[1] * av[0];
  function hit([sx, sy]) {
    const qx = sx - O[0], qy = sy - O[1];
    const u = (qx * av[1] - qy * av[0]) / det, v = (au[0] * qy - au[1] * qx) / det;
    if (u < M - 1.5 || u > X1 - M + 1.5 || v < ZB - 1.5 || v > ZB + 2 * DH + GZ + 1.5) return -1;
    const c = clamp(Math.floor((u - M + GX / 2) / (DW + GX)), 0, COLS - 1);
    return v > ZB + DH + GZ / 2 ? c : COLS + c;
  }

  let act = -2;
  /** Pulls drawer a (-1 puts the chest back at rest). The stagger spreads out from the drawer pulled, or the one let go. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = drawers[a >= 0 ? a : act];
    act = a;
    for (const dr of drawers) {
      const delay = from ? Math.hypot(dr.c - from.c, dr.r - from.r) * stag : 0;
      tset(dr.tw, a < 0 ? REST[dr.i] : dr.i === a ? OUT : 0, now, delay);
      dr.el.face.classList.toggle("hi", dr.i === a);
      dr.el.pull.classList.toggle("hi", a < 0 ? dr.i === 1 : dr.i === a);
      dr.el.dots[dr.i].classList.toggle("m", dr.i !== a);
    }
    read.textContent = a < 0 ? "rest" : NAMES[a];
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
  name: "cabinet",
  means: "Eight drawers, one per Commission system: the one under the pointer slides out, and the rest ease shut in turn.",
  rules: [1, 2, 8, 10],
  range: [0, 45, 90],
  mount,
});
