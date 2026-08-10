import * as THREE from "three";

/**
 * The Lone Star silhouette, authored in the same 220x200 space as the flat SVG
 * motif so every rendering of Texas on the page traces one outline.
 */
export const TEXAS_POINTS = [
  [40, 34], [96, 34], [96, 26], [132, 26], [134, 58], [162, 64], [182, 92],
  [176, 104], [188, 120], [182, 150], [150, 150], [138, 176], [120, 150],
  [96, 150], [96, 120], [58, 120], [58, 78], [40, 78],
];

const CENTER_X = 114;
const CENTER_Y = 101;

export function buildTexasShape(scale = 0.019) {
  const shape = new THREE.Shape();

  TEXAS_POINTS.forEach(([x, y], i) => {
    const px = (x - CENTER_X) * scale;
    // SVG y grows downward; the extruded shape is laid flat and flipped on X.
    const py = -(y - CENTER_Y) * scale;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  });

  shape.closePath();
  return shape;
}

/**
 * True when a point in the shape's own coordinate space falls inside the
 * outline — used to scatter lease markers on land instead of in a bounding box.
 */
export function isInsideTexas(x, y, scale = 0.019) {
  const px = x / scale + CENTER_X;
  const py = -y / scale + CENTER_Y;

  let inside = false;
  for (let i = 0, j = TEXAS_POINTS.length - 1; i < TEXAS_POINTS.length; j = i, i += 1) {
    const [xi, yi] = TEXAS_POINTS[i];
    const [xj, yj] = TEXAS_POINTS[j];
    const crosses = yi > py !== yj > py;
    if (crosses && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
