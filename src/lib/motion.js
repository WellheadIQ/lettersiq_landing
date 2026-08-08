import {
  animeSmoothOut,
  cappedStagger,
  distance,
  duration,
} from "./motionTokens.js";

/**
 * Shared scroll-reveal for the page.
 *
 * Elements arrive tipped back in depth and settle flat, so every section reads
 * in the same space as the hero's 3D stage instead of sliding on a flat plane.
 * Opacity is deliberately untouched: if an observer never fires, content is
 * still painted — just fractionally offset.
 *
 * Perspective is applied per element rather than on a shared ancestor. A single
 * container perspective puts the vanishing point at the container's centre,
 * which shears anything sitting off to one side into a trapezoid.
 *
 * Depth values have no counterpart in the motion-token scale, which covers flat
 * translation only; duration, distance, easing and stagger all read from it.
 */
const PERSPECTIVE = 1200;
const FROM = { translateY: distance.medium, rotateX: 6, translateZ: -55 };

// Anime parses `enter` as "<container position> <target position>", so the
// viewport fraction comes first: the reveal fires when the target's top edge
// reaches 86% down the viewport.
export function settle(anime, targets, { trigger, stagger = 0, enter = "86% top" }) {
  const { utils, animate, onScroll } = anime;
  if (!targets || !targets.length) return null;

  utils.set(targets, { perspective: PERSPECTIVE, ...FROM });

  return animate(targets, {
    perspective: PERSPECTIVE,
    translateY: [FROM.translateY, 0],
    rotateX: [FROM.rotateX, 0],
    translateZ: [FROM.translateZ, 0],
    duration: duration.verySlow,
    ease: animeSmoothOut(anime),
    delay: stagger ? cappedStagger(stagger) : 0,
    autoplay: onScroll({ target: trigger, enter }),
  });
}
