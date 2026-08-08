/**
 * JS mirror of the transitions.dev motion-token scale.
 *
 * `src/styles/transitions.css` is the source of truth; anime.js and Framer
 * Motion take numbers rather than `var(--…)`, so the scale is restated here.
 * Keep the two in sync — if a token moves in the stylesheet, move it here too.
 */

export const duration = {
  stagger: 40, // per-item stagger offset
  micro: 80, // intent delay, large-item stagger
  quick: 150, // close, text swap
  fast: 250, // open, slide, tabs
  medium: 350, // panel close
  slow: 400, // panel open
  verySlow: 500, // emphasis moments, text reveal
};

export const distance = {
  micro: 4,
  small: 6,
  base: 8,
  medium: 12, // text reveal
  large: 30,
};

export const blur = {
  small: 2,
  medium: 3,
  large: 8,
};

/** cubic-bezier(0.22, 1, 0.36, 1) — open/close, slide, resize, position change. */
export const SMOOTH_OUT = [0.22, 1, 0.36, 1];

/** Framer Motion takes the control points directly. */
export const easeSmoothOut = SMOOTH_OUT;

/** anime.js needs the curve built from its own factory. */
export const animeSmoothOut = (anime) => anime.cubicBezier(...SMOOTH_OUT);

/**
 * Ceiling for a whole staggered sequence. Past roughly this point the last item
 * reads as late rather than as part of the group, so long lists cap the number
 * of staggered steps instead of stretching the offset across every item.
 */
export const STAGGER_CAP = 280;

/**
 * Per-item delay that holds the offset on-token while keeping the total under
 * STAGGER_CAP: items beyond the cap all land on the final beat.
 */
export const cappedStagger = (offset) => {
  const lastStep = Math.floor(STAGGER_CAP / offset);
  return (_el, index) => Math.min(index, lastStep) * offset;
};
