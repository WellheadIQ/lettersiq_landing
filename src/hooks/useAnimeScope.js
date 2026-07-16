import { useEffect, useRef } from "react";

/**
 * useAnimeScope — React-safe Anime.js integration for Astro islands.
 *
 * Creates an Anime.js scope bound to a ref'd root element, runs the provided
 * setup callback inside it, and reverts everything on unmount so no timelines,
 * loops, or scroll observers leak across hydration boundaries.
 *
 * The setup callback receives the Anime.js scope self plus a `reduceMotion`
 * boolean (from the scope media query) so callers can render final state
 * immediately instead of animating when the user prefers reduced motion.
 *
 * @param {(ctx: { self: any, reduceMotion: boolean, anime: any }) => void} setup
 * @param {any[]} deps
 * @returns {import('react').RefObject<HTMLElement>} root ref to spread onto the container
 */
export function useAnimeScope(setup, deps = []) {
  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    if (!root.current) return undefined;
    let cancelled = false;

    import("animejs").then((anime) => {
      if (cancelled || !root.current) return;
      const { createScope } = anime;
      scope.current = createScope({
        root,
        mediaQueries: { reduceMotion: "(prefers-reduced-motion: reduce)" },
      }).add((self) => {
        const reduceMotion = !!self.matches.reduceMotion;
        setup({ self, reduceMotion, anime });
      });
    });

    return () => {
      cancelled = true;
      if (scope.current) {
        scope.current.revert();
        scope.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return root;
}

/** Synchronous check usable outside a scope (e.g. gating Framer variants). */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
