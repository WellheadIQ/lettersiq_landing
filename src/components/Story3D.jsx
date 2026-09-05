import React, { useCallback, useEffect, useRef, useState } from "react";
import { SectionLabel } from "./Primitives.jsx";
import { Button } from "./ui/button.jsx";
import { storyChapters } from "../lib/storyChapters.js";

/**
 * The morning loop as a scroll-conducted world rather than a video.
 *
 * A tall track owns the scroll distance; its sticky child owns the screen. The
 * exact scroll fraction picks the DOM beat and is handed to the WebGL scene,
 * which damps it for camera travel only — so the same scroll position always
 * composes the same chapter, forwards, backwards, or after a reload at depth.
 *
 * Every chapter's copy is real markup in reading order, so the story survives
 * with no canvas at all.
 */

/**
 * The floor below which no arrangement of the stage leaves a band the briefing
 * can be read in.
 *
 * This has to be measured against what a browser actually reports, not against
 * a device's spec sheet: a phone whose screen is 844pt tall reports about 664
 * with the URL and tab bars showing, and then grows as they collapse. Gating
 * above that band means the same phone gets the flat story or the world
 * depending on how far the visitor happened to have scrolled, which reads as
 * random. Short portrait viewports get compacted copy instead (see Theme.css),
 * and the briefing drops rows until the ones it keeps are legible.
 */
let webGLSupported;

function stageHasRoom() {
  const { innerWidth: w, innerHeight: h } = window;
  if (w >= 1024) return h >= 560;
  // Laid flat, the copy takes a side column, so what's scarce is width: a
  // 640-wide phone leaves under 200px for the document, which is worse than
  // not drawing it. Orientation has to be read from both axes — a small phone
  // in portrait can be shorter than a big one in landscape.
  if (w > h) return w >= 640 && h >= 360;
  return h >= 520;
}

/** Devices that would stutter, or visitors who have asked for less, get the still. */
function canRenderScene() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return false;
  if (!stageHasRoom()) return false;

  const connection = navigator.connection;
  if (connection?.saveData === true) return false;
  if (/^(slow-)?2g$/.test(connection?.effectiveType ?? "")) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;

  if (webGLSupported === undefined) {
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      webGLSupported = !!context;
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { webGLSupported = false; }
  }
  return webGLSupported;
}

export const Story3D = () => {
  const trackRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  const sceneRef = useRef(null);
  const [mode, setMode] = useState("static");
  // Bumped when a viewport that was too small becomes big enough, to re-run the
  // capability check rather than latching the first answer.
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);

  // Progress is read on scroll and written straight to the scene; only the
  // chapter index crosses into React state, so scrolling never re-renders.
  const activeRef = useRef(0);

  const readProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    if (travel <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / travel));
  }, []);

  /**
   * The reading column moves between the side and the bottom of the stage
   * depending on the viewport, so the scene is told where the empty space
   * actually is rather than re-deriving the breakpoints in a second place.
   */
  const publishSafeArea = useCallback(() => {
    const canvas = canvasRef.current;
    const copy = copyRef.current;
    const scene = sceneRef.current;
    if (!canvas || !copy || !scene) return;

    const stage = canvas.getBoundingClientRect();
    const taken = copy.getBoundingClientRect();
    if (!stage.width || !stage.height) return;

    // The header is fixed over the pinned stage, so the top of the canvas is
    // not actually free. Without this the world composes behind the nav.
    const header = document.querySelector("nav.fixed")?.getBoundingClientRect();
    const masked = Math.max(0, Math.min(stage.height * 0.3, (header?.bottom ?? 0) - stage.top));

    const left = taken.left - stage.left;
    const right = taken.right - stage.left;
    const top = taken.top - stage.top;
    const bottom = taken.bottom - stage.top;
    const gutter = 24;
    const floor = stage.height - masked;

    // The back-to-top control floats over the same corner the world uses, so a
    // band that runs under it gets cut back on whichever axis costs less.
    const badge = document
      .querySelector("[data-scroll-top]")
      ?.getBoundingClientRect();
    const clearBadge = (band) => {
      if (!badge) return band;
      const bx = badge.left - stage.left - 12;
      const by = badge.top - stage.top - 12;
      const overlaps =
        bx < band.x + band.width &&
        badge.right - stage.left > band.x &&
        by < band.y + band.height &&
        badge.bottom - stage.top > band.y;
      if (!overlaps) return band;
      const trimRight = { ...band, width: Math.max(0, bx - band.x) };
      const trimBottom = { ...band, height: Math.max(0, by - band.y) };
      return trimRight.width * band.height >= band.width * trimBottom.height
        ? trimRight
        : trimBottom;
    };

    // The four bands the copy leaves behind. Taking the biggest one is what
    // makes this work at sizes nobody authored a breakpoint for: it lands on
    // the side column when the copy is beside the world and on the open band
    // when the copy is under it, without either case being named here.
    const area = [
      { x: right + gutter, y: masked, width: stage.width - right - gutter, height: floor },
      { x: 0, y: masked, width: left - gutter, height: floor },
      { x: 0, y: masked, width: stage.width, height: top - gutter - masked },
      { x: 0, y: bottom + gutter, width: stage.width, height: stage.height - bottom - gutter },
    ]
      .map(clearBadge)
      .filter((band) => band.width >= 150 && band.height >= 150)
      .sort((a, b) => b.width * b.height - a.width * a.height)[0];

    scene.setSafeArea(area ?? { x: 0, y: masked, width: stage.width, height: floor });
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const recheck = () => setAllowed(canRenderScene());
    recheck();
    window.addEventListener("resize", recheck);
    preference.addEventListener("change", recheck);
    return () => {
      window.removeEventListener("resize", recheck);
      preference.removeEventListener("change", recheck);
    };
  }, []);

  useEffect(() => {
    if (!allowed) {
      setMode("static");
      setReady(false);
      return undefined;
    }

    setMode("scene");

    let cancelled = false;
    let cleanup;
    const lowPower = window.matchMedia("(max-width: 767px)").matches;

    const load = () => {
      import("../lib/storyScene.js").then(({ initStoryScene }) => {
        if (cancelled || !canvasRef.current) return;
        const scene = initStoryScene(canvasRef.current, { lowPower });
        if (!scene) {
          setMode("static");
          return;
        }
        sceneRef.current = scene;
        publishSafeArea();
        scene.setProgress(readProgress());
        setReady(true);
        cleanup = () => {
          scene.dispose();
          sceneRef.current = null;
        };
      }).catch(() => {
        if (!cancelled) { setReady(false); setMode("static"); }
      });
    };

    // Yield to first paint; the section sits below the fold either way.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1500 })
      : window.setTimeout(load, 300);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup?.();
    };
  }, [readProgress, publishSafeArea, allowed]);

  // The copy column is what defines the free space, so watch the box itself
  // rather than the viewport: font loading and wrapping move it too.
  useEffect(() => {
    if (mode !== "scene" || !copyRef.current) return undefined;
    const observer = new ResizeObserver(publishSafeArea);
    observer.observe(copyRef.current);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [mode, publishSafeArea]);

  useEffect(() => {
    if (mode !== "scene") return undefined;

    const onScroll = () => {
      const progress = readProgress();
      sceneRef.current?.setProgress(progress);
      // The header only overlaps the stage while the section is pinned, and it
      // mounts after this island does, so the mask is re-measured here rather
      // than once at startup. Unchanged areas are dropped by the scene.
      publishSafeArea();

      // Beats change on thresholds rather than continuously, so the reading
      // block stays put while the camera makes its largest moves.
      const index = Math.min(
        storyChapters.length - 1,
        Math.floor(progress * storyChapters.length)
      );
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mode, readProgress, publishSafeArea]);

  return (
    <section
      id="story"
      className="relative w-full bg-midnight"
      aria-label="How the morning briefing is built"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-white/10" />

      <div className="section-shell relative z-10 pt-16 md:pt-24">
        <SectionLabel label="The morning loop" className="mb-5" />
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
          <h2 className="max-w-2xl text-balance font-display text-display-sm font-extrabold tracking-[-0.02em] text-white">
            Stop checking the RRC. Start managing the exceptions.
          </h2>
          <p className="max-w-md text-pretty text-base leading-relaxed text-white/65">
            LettersIQ continuously turns public regulatory records into a ranked
            list of the handful of things your team actually needs to look at.
          </p>
        </div>
      </div>

      {mode === "scene" ? (
        <>
        <div className="section-shell mt-5">
          <a href="#blast-radius" className="inline-flex min-h-11 items-center text-sm text-white/70 underline underline-offset-4 hover:text-white">Skip the walkthrough →</a>
        </div>
        <ScrollStage
          trackRef={trackRef}
          canvasRef={canvasRef}
          copyRef={copyRef}
          ready={ready}
          active={active}
        />
        </>
      ) : (
        <StaticStory />
      )}
    </section>
  );
};

const ScrollStage = ({ trackRef, canvasRef, copyRef, ready, active }) => (
  <div
    ref={trackRef}
    className="story-track relative mt-10 md:mt-14"
    style={{ "--story-beats": storyChapters.length + 1 }}
  >
    <div className="story-frame sticky top-0 w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full transition-opacity duration-700 ease-out-strong"
        style={{ opacity: ready ? 1 : 0 }}
      />

      {/* Legibility scrim — local to the reading column, not a blanket. */}
      <div aria-hidden="true" className="story-scrim pointer-events-none absolute inset-0" />

      {/* Which edge the copy takes is a CSS decision; the scene measures the
          result rather than repeating the breakpoints. */}
      <div className="section-shell story-stage relative">
        <div ref={copyRef} className="story-copy">
          {storyChapters.map((chapter, i) => (
            <article
              key={chapter.id}
              className="story-beat transition-[opacity,transform,filter] duration-500 ease-out-strong"
              style={{
                opacity: i === active ? 1 : 0,
                transform: `translateY(${i === active ? 0 : 14}px)`,
                filter: i === active ? "none" : "blur(4px)",
                pointerEvents: i === active ? "auto" : "none",
              }}
            >
              <p className="font-mono text-xs tracking-[0.14em] text-signalBright">
                {chapter.eyebrow.toUpperCase()}
              </p>
              <h3 className="story-beat-title text-balance font-display font-extrabold text-white">
                {chapter.title}
              </h3>
              <p className="story-beat-body text-pretty text-base leading-relaxed text-white/70">
                {chapter.body}
              </p>
              {i === storyChapters.length - 1 && (
                <Button asChild className="story-beat-cta">
                  {/* Off-beat CTAs stay in the reading order but out of the
                      tab order, so nothing focusable hides behind opacity 0. */}
                  <a href="#contact-us" tabIndex={i === active ? undefined : -1}>
                    Check My Operator
                    <span aria-hidden>&rarr;</span>
                  </a>
                </Button>
              )}
            </article>
          ))}
        </div>
      </div>

      <ChapterRail active={active} />
    </div>
  </div>
);

/** Bottom-left so it never competes with the world for the right of the frame. */
const ChapterRail = ({ active }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 bottom-10 hidden lg:block [@media(max-height:560px)]:lg:hidden"
  >
    <div className="section-shell">
      <ol className="flex items-center gap-2">
        {storyChapters.map((chapter, i) => (
          <li key={chapter.id} className="flex items-center gap-2">
            <span
              className={`font-mono text-[11px] tabular-nums transition-colors duration-300 ${
                i === active ? "text-white" : "text-white/30"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`h-px transition-all duration-300 ease-out-strong ${
                i === active ? "w-10 bg-signalRed" : "w-5 bg-white/20"
              }`}
            />
          </li>
        ))}
      </ol>
    </div>
  </div>
);

/** No WebGL, reduced motion, or a metered connection: the same story, flat. */
const StaticStory = () => (
  <div className="section-shell pb-16 pt-10 md:pb-24 md:pt-12">
    <figure className="overflow-hidden rounded-[3px] border border-white/15 bg-midnight shadow-float">
      <img
        src="/film/story-briefing.jpg"
        alt="A 7:00 AM briefing listing five findings in order of consequence: production stopped by a commingle severance at Clam Lake, a P-5 renewal due in fourteen days, a missing W-12 blocking first sales, a proration delinquency, and a drilling permit expiring in twenty-two days — drawn from 1,204 records reviewed overnight."
        width="1920"
        height="1080"
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </figure>

    <ol className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 border-t border-white/10 pt-8 md:grid-cols-2">
      {storyChapters.map((chapter) => (
        <li key={chapter.id}>
          <p className="font-mono text-xs tracking-[0.14em] text-signalBright">
            {chapter.eyebrow.toUpperCase()}
          </p>
          <h3 className="mt-3 font-display text-xl font-bold tracking-[-0.01em] text-white">
            {chapter.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-white/65">
            {chapter.body}
          </p>
        </li>
      ))}
    </ol>

    <Button asChild className="mt-10">
      <a href="#contact-us">
        Check My Operator
        <span aria-hidden>&rarr;</span>
      </a>
    </Button>
  </div>
);
