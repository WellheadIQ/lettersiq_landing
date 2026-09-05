let locks = 0;
let previousOverflow = "";

/** Nestable, idempotent scroll locks for the menu and sample dialog. */
export function lockPageScroll() {
  if (typeof document === "undefined") return () => {};
  const root = document.documentElement;
  if (locks === 0) {
    previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
  }
  locks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) root.style.overflow = previousOverflow;
  };
}
