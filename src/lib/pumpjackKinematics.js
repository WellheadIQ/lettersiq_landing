/**
 * Conventional beam-pump linkage. Given the crank angle, find the walking-beam
 * angle that keeps the pitman arm at its fixed length. The horsehead is an arc
 * centred on the pivot, so the carrier bar rises by exactly R · φ.
 *
 * Angles are SVG-positive (clockwise). A positive φ lifts the horsehead.
 */
export function solvePumpjack(theta, g) {
  const K = [g.C[0] + g.r * Math.cos(theta), g.C[1] + g.r * Math.sin(theta)];
  const rear = (phi) => {
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    return [g.P[0] + g.b * c - g.eOff * s, g.P[1] + g.b * s + g.eOff * c];
  };
  let lo = -0.7;
  let hi = 0.7;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    const E = rear(mid);
    const gap = Math.hypot(E[0] - K[0], E[1] - K[1]) - g.L;
    if (gap > 0) lo = mid;
    else hi = mid;
  }
  const phi = (lo + hi) / 2;
  return { phi, K, E: rear(phi), carrierY: g.restY - g.R * phi };
}
