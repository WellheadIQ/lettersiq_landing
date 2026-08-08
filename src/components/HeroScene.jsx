import React, { useEffect, useRef, useState } from "react";

/** Cheap capability probe — avoids shipping the scene to devices that will stutter. */
function shouldRender() {
  if (typeof window === "undefined") return false;
  if (window.innerWidth < 768) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;

  const canvas = document.createElement("canvas");
  return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

/**
 * Lazy WebGL layer behind the hero. Three.js is code-split and only fetched
 * once the canvas mounts on a capable viewport, so it never blocks first paint.
 */
export const HeroScene = () => {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!shouldRender()) return undefined;

    let cleanup;
    let cancelled = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const load = () => {
      import("../lib/heroScene.js").then(({ initHeroScene }) => {
        if (cancelled || !canvasRef.current) return;
        cleanup = initHeroScene(canvasRef.current, { reduceMotion });
        setReady(true);
      });
    };

    // Yield to first paint before pulling the renderer down.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1200 })
      : window.setTimeout(load, 200);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup?.();
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 hidden md:block"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full transition-opacity ease-out-strong"
        style={{
          opacity: ready ? 1 : 0,
          transitionDuration: "1200ms",
          maskImage:
            "linear-gradient(to right, transparent 14%, black 44%), linear-gradient(to bottom, transparent, black 12%, black 82%, transparent)",
          maskComposite: "intersect",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 14%, black 44%), linear-gradient(to bottom, transparent, black 12%, black 82%, transparent)",
          WebkitMaskComposite: "source-in",
        }}
      />
    </div>
  );
};
