import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { createPumpjacks } from "./pumpjacks.js";
import { initStory } from "./story.js";
import { initNav } from "./nav.js";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);

const html = document.documentElement;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const INK = ".ink-l, .ink-t, .ink-h, .ink-r";
const nav = document.querySelector("[data-nav]");

const show = (el) => {
  el.style.visibility = "visible";
};

/** Draw a set of strokes the way a pen would: in order, each at its own pace. */
function drawPaths(paths, { delay = 0, spread = 0.9, each = 0.018, order = "dom" } = {}) {
  if (!paths.length) return gsap.timeline();
  let list = paths;
  if (order === "x") {
    const xs = new Map(paths.map((p) => [p, p.getBoundingClientRect().left]));
    list = [...paths].sort((a, b) => xs.get(a) - xs.get(b));
  }
  gsap.set(list, { drawSVG: "0%" });
  const tl = gsap.timeline({ delay });
  const n = list.length;
  list.forEach((p, i) => {
    const hatch = p.classList.contains("ink-h");
    const at = (order === "x" ? (i / n) * spread : i * each) + (hatch ? 0.35 : 0);
    tl.to(
      p,
      {
        drawSVG: "100%",
        duration: hatch ? 0.5 : 0.7 + Math.random() * 0.5,
        ease: "power2.inOut",
        onStart: () => show(p),
      },
      at
    );
  });
  return tl;
}

function sweep(paths, { trigger, start = "top 80%", spread = 2 }) {
  gsap.set(paths, { visibility: "hidden" });
  ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: () => drawPaths(paths, { order: "x", spread }),
  });
}

function hero() {
  const title = document.querySelector("[data-hero-title]");
  const ring = document.querySelector("[data-draw-now] path");
  const rise = gsap.utils.toArray(".hero-rise");
  const world = document.querySelector("[data-draw-sweep]");
  if (!title) return;

  gsap.set(ring, { visibility: "hidden" });
  const split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "hero-line" });
  gsap.set(title, { visibility: "visible" });

  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.09 }, 0.1)
    .from(rise, { y: 18, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.5)
    .add(() => split.revert(), 1.55)
    .add(() => {
      const freshRing = document.querySelector("[data-draw-now] path");
      drawPaths([freshRing], { each: 0 });
    }, 1.6);

  if (world) {
    const paths = [...world.querySelectorAll(INK)];
    gsap.set(paths, { visibility: "hidden" });
    drawPaths(paths, { order: "x", spread: 2.2, delay: 0.5 });
  }
}

function reveals() {
  const items = gsap.utils.toArray("[data-reveal]");
  gsap.set(items, { autoAlpha: 0, y: 26 });
  ScrollTrigger.batch(items, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.07, overwrite: true }),
  });

  gsap.utils.toArray("[data-draw-on-view]").forEach((svg) => {
    const paths = [...svg.querySelectorAll(INK)];
    gsap.set(paths, { visibility: "hidden" });
    ScrollTrigger.create({
      trigger: svg,
      start: "top 85%",
      once: true,
      onEnter: () => drawPaths(paths, { delay: 0.25, each: 0.08 }),
    });
  });

  gsap.utils.toArray("[data-draw-scrub]").forEach((svg) => {
    const paths = [...svg.querySelectorAll(INK)];
    gsap.set(paths, { drawSVG: "0%" });
    gsap.to(paths, {
      drawSVG: "100%",
      ease: "none",
      stagger: 0.15,
      scrollTrigger: { trigger: svg.closest("[data-timeline]") || svg, start: "top 80%", end: "bottom 60%", scrub: 0.6 },
    });
  });

  // Coverage glyphs draw in with their row and redraw on hover.
  gsap.utils.toArray(".index-row").forEach((row) => {
    const paths = [...row.querySelectorAll("[data-glyph] path")];
    gsap.set(paths, { visibility: "hidden" });
    ScrollTrigger.create({
      trigger: row,
      start: "top 90%",
      once: true,
      onEnter: () => drawPaths(paths, { delay: 0.2 }),
    });
    row.addEventListener("pointerenter", () => {
      gsap.fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, ease: "power2.inOut", overwrite: true });
    });
  });

  // Briefing rows settle one after another, like lines being typed.
  const rows = gsap.utils.toArray("[data-sheet-item]");
  if (!rows.length) return;
  gsap.set(rows, { autoAlpha: 0, x: -10 });
  ScrollTrigger.create({
    trigger: "[data-sheet]",
    start: "top 70%",
    once: true,
    onEnter: () => gsap.to(rows, { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out", stagger: 0.12 }),
  });
}

function faqMarks() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const v = item.querySelector(".faq-mark-v");
    item.addEventListener("toggle", () => {
      gsap.to(v, { drawSVG: item.open ? "50% 50%" : "0% 100%", duration: 0.4, ease: "power2.inOut" });
    });
  });
}

if (reduce) {
  initNav();
  html.classList.add("motion-ready", "reduced");
} else {
  const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  initNav({
    onNavigate: (target) => lenis.scrollTo(target, { offset: -72, duration: 1.6 }),
  });

  const jacks = createPumpjacks(gsap);
  hero();
  initStory({ gsap, jacks, nav, sweep });
  reveals();
  faqMarks();
  html.classList.add("motion-ready");

  // Webfonts change line heights; re-measure pinned sections once they land.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
