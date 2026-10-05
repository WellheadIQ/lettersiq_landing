/**
 * Mailbox: three rural mailboxes on one plank at a lease road, every flag
 * down and nothing inside. The box under the pointer drops its door open on
 * the lift curve, and the others crack theirs, staggered outwards from it, so
 * each shows its bare floor. At rest the big box stands ajar and the near
 * box's flag, down, is the bright mark. The read-out counts what the box
 * holds: none. The slider is how far a door drops, in degrees.
 *
 * The pattern: an empty state. The object is whole and composed; what is
 * missing is what it would hold. Tweens, a stagger by distance, and a hit
 * test on the rest centres of a single row.
 */
const {
  Cam, clamp, fillet, fit, hull, open, poly, proj, rad, rings, rrect,
  tdone, tset, tval, tween, disposer, mk, place, pointer, prism, put, register, solid, facing,
} = HL;

// x0, width, wall height, length; the fronts line up at YF on the plank
const BOX = [[0, 15, 9, 36], [21, 19, 12, 44], [46, 15, 9, 36]];
const YF = 24, Z0 = 30, TK = 1.2, REST = [0, 18, 4], SHARE = 0.22;
const FACE_TURN = 50.8; // past this a dropped door shows its inner face to the camera

/** The box's cross-section in (x, z): a flat floor with rounded corners, straight walls, a round top. */
function profile(x0, w, hw, inset) {
  const r = 1.6 - inset * 0.5, a = x0 + inset, b = x0 + w - inset, z = Z0 + inset, R = w / 2 - inset, cx = x0 + w / 2, zc = Z0 + hw;
  const pts = [[a, zc]];
  for (let k = 0; k <= 3; k++) { const t = rad(180 + k * 30); pts.push([a + r + r * Math.cos(t), z + r + r * Math.sin(t)]); }
  for (let k = 0; k <= 3; k++) { const t = rad(270 + k * 30); pts.push([b - r + r * Math.cos(t), z + r + r * Math.sin(t)]); }
  pts.push([b, zc]);
  for (let k = 1; k < 16; k++) { const t = rad((k * 180) / 16); pts.push([cx + R * Math.cos(t), zc + R * Math.sin(t)]); }
  return pts;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let OPEN = value;

  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-14, -30, -3], [76, -30, -3], [-14, 44, -3], [76, 44, -3], [21, -20, Z0 + 22], [61, -12, Z0 + 17], [0, YF + 18, Z0], [46, YF + 18, Z0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // ground, two posts, the plank: back to front
  for (const [x0, y0, x1, y1, r, b, z0, z1] of [
    [-14, -30, 76, 40, 7, 2.2, -3, 0], [2, 4, 6, 8, 1.2, 0.5, 0, 27], [55, 4, 59, 8, 1.2, 0.5, 0, 27], [-3, 0, 64, 12, 1.5, 0.8, 27, Z0],
  ]) {
    const [ring, inner] = rings(x0, y0, x1, y1, r, b);
    put(solid(g), prism(P, front, ring, inner, z0, z1));
  }

  const boxes = BOX.map(([x0, w, hw, L], i) => {
    const prof = profile(x0, w, hw, 0), rim = profile(x0, w, hw, 0.8), yb = YF - L, xf = x0 + w;
    const grp = mk("g", {}, g);
    mk("path", { d: poly(hull(prof.map(([x, z]) => P(x, YF, z)).concat(prof.map(([x, z]) => P(x, yb, z))))), class: "sil" }, grp);
    // reflectors on the near side number the box
    for (let k = 0; k <= i; k++) place(mk("circle", { r: 0.9, class: "dot off" }, grp), P(xf, YF - 4 - k * 2.6, Z0 + 3));
    // the flag, down: an arm along the side with its blade at the front end, pinned at the pivot
    const yp = YF - L * 0.6, zp = Z0 + hw * 0.55;
    const blade = fillet([[yp - 1.6, zp - 1], [yp + 14, zp - 1], [yp + 14, zp + 6], [yp + 7, zp + 6], [yp + 7, zp + 1], [yp - 1.6, zp + 1]], [1, 1, 1.4, 1.4, 0.6, 1]);
    mk("path", { d: poly(blade.map(([y, z]) => P(xf + 0.5, y, z))), class: "lo" }, grp);
    const flag = mk("path", { d: poly(blade.map(([y, z]) => P(xf + 1.4, y, z))), class: "sil" }, grp);
    place(mk("circle", { r: 0.8, class: "dot m" }, grp), P(xf + 1.5, yp, zp));
    const el = {
      rim: mk("path", { class: "nf" }, grp), inner: mk("path", { class: "nf lo" }, grp), seam: mk("path", { class: "nf lo" }, grp),
      back: mk("path", {}, grp), face: mk("path", {}, grp), handle: mk("path", { class: "nf" }, grp),
    };
    return { i, x0, w, hw, L, prof, rim, flag, el, tw: tween(REST[i]), drawn: NaN, f: P(x0 + w / 2, YF, Z0 + hw / 2), b: P(x0 + w / 2, YF - L, Z0 + hw / 2) };
  });

  /** The floor seam inside the near-left wall, seen through the opening: it runs back until the rim hides it. */
  function seamLength(bx) {
    const u0 = bx.x0 + 0.8, v0 = Z0 + 0.8, R = bx.w / 2 - 0.8, cx = bx.x0 + bx.w / 2, zc = Z0 + bx.hw;
    let d = bx.x0 + bx.w - 0.8 - u0;
    if (v0 + 0.817 * d > zc) {
      const ox = u0 - cx, oz = v0 - zc, A = 1 + 0.817 ** 2, Bq = 2 * (ox + 0.817 * oz), Cq = ox * ox + oz * oz - R * R;
      d = (-Bq + Math.sqrt(Bq * Bq - 4 * A * Cq)) / (2 * A);
    }
    return Math.min(d, bx.L - 1);
  }

  function draw(bx, deg) {
    const th = rad(deg), s = Math.sin(th), c = Math.cos(th), { el } = bx;
    const door = (t) => bx.prof.map(([u, v]) => P(u, YF + t * c + (v - Z0) * s, Z0 - t * s + (v - Z0) * c));
    const ajar = deg > 1.5;
    el.rim.setAttribute("d", ajar ? poly(bx.prof.map(([x, z]) => P(x, YF, z))) : "");
    el.inner.setAttribute("d", ajar ? poly(bx.rim.map(([x, z]) => P(x, YF, z))) : "");
    el.seam.setAttribute("d", ajar ? open([P(bx.x0 + 0.8, YF, Z0 + 0.8), P(bx.x0 + 0.8, YF - seamLength(bx), Z0 + 0.8)]) : "");
    const outerShows = deg < FACE_TURN;
    el.back.setAttribute("d", poly(door(outerShows ? 0 : TK)));
    el.face.setAttribute("d", poly(door(outerShows ? TK : 0)));
    const hx = bx.x0 + bx.w / 2, hv = bx.hw + bx.w / 2 - 2.6, t = TK + 0.6;
    el.handle.setAttribute("d", outerShows ? poly(rrect(hx - 2.2, hv - 1, hx + 2.2, hv + 1, 0.9, 3).map((q) => P(q.u, YF + t * c + q.v * s, Z0 - t * s + q.v * c))) : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const bx of boxes) {
      const d = tval(bx.tw, now);
      if (d !== bx.drawn) { bx.drawn = d; draw(bx, d); }
      if (!tdone(bx.tw, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  const top = P(21, -20, Z0 + 22)[1] - 6, bottom = P(21, YF + 20, Z0)[1] + 10;
  /** A single row: the box whose rest axis, door to back, passes nearest the pointer, while the pointer is over the row. */
  function hit([sx, sy]) {
    if (sy < top || sy > bottom) return -1;
    let best = -1, bd = 40;
    for (const { i, f, b } of boxes) {
      const dx = b[0] - f[0], dy = b[1] - f[1], t = clamp(((sx - f[0]) * dx + (sy - f[1]) * dy) / (dx * dx + dy * dy), 0, 1);
      const d = Math.hypot(sx - f[0] - t * dx, sy - f[1] - t * dy);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const bx of boxes) {
      const delay = from >= 0 ? Math.abs(bx.i - from) * 60 : 0;
      tset(bx.tw, a < 0 ? REST[bx.i] : bx.i === a ? OPEN : OPEN * SHARE, now, delay);
      const lit = bx.i === a;
      bx.el.face.setAttribute("class", lit ? "sil hi" : "sil");
      bx.el.back.setAttribute("class", "lo");
      bx.flag.classList.toggle("hi", a < 0 && bx.i === 2);
    }
    read.textContent = a < 0 ? "rest" : `box ${a + 1} · 0`;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { OPEN = clamp(v, 0, 110); if (act >= 0) { const a = act; act = -2; setActive(a); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "mailbox",
  means: "Three mailboxes on a lease road, every flag down: the box under the pointer drops its door, and there is nothing inside.",
  rules: [2, 5, 6, 10],
  range: [55, 85, 105],
  mount,
});
