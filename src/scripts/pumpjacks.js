import { solvePumpjack } from "../lib/pumpjackKinematics.js";

// About eleven strokes a minute: slow enough to read as machinery, not a toy.
const OMEGA = (2 * Math.PI * 11) / 60;
const DEG = 180 / Math.PI;

function pose(j) {
  const { g } = j;
  const { phi, K, E, carrierY } = solvePumpjack(j.theta, g);
  j.crank.setAttribute("transform", `translate(${g.C[0]} ${g.C[1]}) rotate(${(j.theta * DEG).toFixed(2)})`);
  j.beam.setAttribute("transform", `translate(${g.P[0]} ${g.P[1]}) rotate(${(phi * DEG).toFixed(2)})`);
  j.pitman.setAttribute("x1", K[0].toFixed(1));
  j.pitman.setAttribute("y1", K[1].toFixed(1));
  j.pitman.setAttribute("x2", E[0].toFixed(1));
  j.pitman.setAttribute("y2", E[1].toFixed(1));
  const cy = carrierY.toFixed(1);
  j.carrier.setAttribute("transform", `translate(0 ${cy})`);
  j.rod.setAttribute("y1", cy);
  const top = (carrierY - 8).toFixed(1);
  j.bridle.setAttribute("d", `M-1.6 ${g.P[1]}V${top}M1.6 ${g.P[1]}V${top}`);
}

/**
 * Every pumpjack on the page runs on one ticker and only while its drawing is
 * on screen. `mult` is the throttle the story uses to stop and restart them.
 */
export function createPumpjacks(gsap) {
  const jacks = new Map();
  const bySvg = new Map();

  document.querySelectorAll("[data-pumpjack]").forEach((el) => {
    const j = {
      el,
      g: JSON.parse(el.dataset.geom),
      theta: parseFloat(el.dataset.theta),
      speed: parseFloat(el.dataset.speed) || 1,
      mult: 1,
      visible: false,
      crank: el.querySelector(".pj-crank"),
      beam: el.querySelector(".pj-beam"),
      pitman: el.querySelector(".pj-pitman"),
      carrier: el.querySelector(".pj-carrier"),
      bridle: el.querySelector(".pj-bridle"),
      rod: el.querySelector(".pj-rod"),
    };
    jacks.set(el.dataset.pumpjack, j);
    const svg = el.ownerSVGElement;
    if (!bySvg.has(svg)) bySvg.set(svg, []);
    bySvg.get(svg).push(j);
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const j of bySvg.get(entry.target) || []) j.visible = entry.isIntersecting;
      }
    },
    { rootMargin: "120px 0px" }
  );
  bySvg.forEach((_, svg) => io.observe(svg));

  gsap.ticker.add((_time, deltaTime) => {
    const dt = Math.min(deltaTime, 64) / 1000;
    for (const j of jacks.values()) {
      if (!j.visible || j.mult < 0.002) continue;
      j.theta += OMEGA * j.speed * j.mult * dt;
      pose(j);
    }
  });

  return jacks;
}
