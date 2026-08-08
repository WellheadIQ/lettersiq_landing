import { useEffect, useRef, useState } from "react";

/**
 * Drives the transitions.dev open / close lifecycle for `.t-dropdown` and
 * `.t-modal`: `.is-open` while shown, then `.is-closing` for exactly one close
 * duration before the surface resets to its pre-open rest state. Without that
 * cleanup the next open would start from the closing scale instead of the
 * resting one.
 *
 * The close duration is read from the CSS custom property rather than
 * duplicated here, so retuning `transitions.css` retunes the JS too.
 */

const readMs = (name, fallback) => {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return /ms$/.test(raw) ? value : value * 1000;
};

export function useSurfaceTransition(
  open,
  { closeVar = "--modal-close-dur", closeFallback = 150, keepMounted = false } = {}
) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(keepMounted || open);
  const [state, setState] = useState(open ? "open" : "closed");

  // Mount first and let the pre-open rest state paint, then add `.is-open` on
  // the next frame so the enter transition has somewhere to start from.
  useEffect(() => {
    if (!open) return undefined;
    setMounted(true);
    const raf = requestAnimationFrame(() => {
      if (ref.current) void ref.current.offsetWidth;
      setState("open");
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (open) return undefined;
    setState((prev) => (prev === "closed" ? "closed" : "closing"));
    const timer = setTimeout(() => {
      setState("closed");
      if (!keepMounted) setMounted(false);
    }, readMs(closeVar, closeFallback));
    return () => clearTimeout(timer);
  }, [open, closeVar, closeFallback, keepMounted]);

  return {
    ref,
    mounted,
    state,
    stateClass:
      state === "open" ? "is-open" : state === "closing" ? "is-closing" : "",
  };
}
