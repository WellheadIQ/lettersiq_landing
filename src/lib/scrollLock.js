/**
 * Freezes page scroll behind an overlay and returns the release function.
 *
 * The lock has to land on <html>: Layout.astro puts `overflow-x: hidden` there,
 * which makes <html> the scrolling element, so the usual `body.style.overflow`
 * lock is inert on this page and the page scrolls behind open overlays.
 *
 * @returns {() => void} release
 */
export function lockPageScroll() {
  if (typeof document === "undefined") return () => {};

  const root = document.documentElement;
  const previous = root.style.overflow;
  root.style.overflow = "hidden";

  return () => {
    root.style.overflow = previous;
  };
}
