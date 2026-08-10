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

/** Devices that would stutter, or visitors who have asked for less, get the still. */
function canRenderScene() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return false;

  const connection = navigator.connection;
  if (connection?.saveData === true) return false;
  if (/^(slow-)?2g$/.test(connection?.effectiveType ?? "")) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;

  const probe = document.createElement("canvas");
  return !!(probe.getContext("webgl2") || probe.getContext("webgl"));
}

export const Story3D = () => {
  const trackRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [mode, setMode] = useState("static");
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

  useEffect(() => {
    if (!canRenderScene()) return undefined;
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
        scene.setProgress(readProgress());
        setReady(true);
        cleanup = () => {
          scene.dispose();
          sceneRef.current = null;
        };
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
  }, [readProgress]);

  useEffect(() => {
    if (mode !== "scene") return undefined;

    const onScroll = () => {
      const progress = readProgress();
      sceneRef.current?.setProgress(progress);

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
  }, [mode, readProgress]);

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
        <ScrollStage
          trackRef={trackRef}
          canvasRef={canvasRef}
          ready={ready}
          active={active}
        />
      ) : (
        <StaticStory />
      )}
    </section>
  );
};

const ScrollStage = ({ trackRef, canvasRef, ready, active }) => (
  <div
    ref={trackRef}
    className="relative mt-10 md:mt-14"
    style={{ height: `${(storyChapters.length + 1) * 100}vh` }}
  >
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full transition-opacity duration-700 ease-out-strong"
        style={{ opacity: ready ? 1 : 0 }}
      />

      {/* Legibility scrim — local to the reading column, not a blanket. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight via-midnight/45 to-transparent lg:bg-gradient-to-r lg:from-midnight lg:via-midnight/55 lg:to-transparent"
      />

      {/* The copy only moves beside the stage once there is room for both;
          below that it sits under it and the world composes centred. */}
      <div className="section-shell relative flex h-full flex-col justify-end pb-14 lg:justify-center lg:pb-0">
        <div className="relative max-w-lg">
          {storyChapters.map((chapter, i) => (
            <article
              key={chapter.id}
              // Beats are stacked in one slot: the first holds the height, the
              // rest are absolutely placed over it. All stay in the accessible
              // reading order.
              className={`${i === 0 ? "relative" : "absolute inset-x-0 top-0"} transition-[opacity,transform,filter] duration-500 ease-out-strong`}
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
              <h3 className="mt-4 text-balance font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
                {chapter.title}
              </h3>
              <p className="mt-4 text-pretty text-base leading-relaxed text-white/70">
                {chapter.body}
              </p>
              {i === storyChapters.length - 1 && (
                <Button asChild className="mt-7">
                  <a href="#contact-us">
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
    className="pointer-events-none absolute inset-x-0 bottom-10 hidden lg:block"
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
        src="/film/lettersiq-film-poster.jpg"
        alt="Eight Texas Railroad Commission dataset planes suspended over a map of Texas, with one overnight record joined down to the leases it affects."
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
