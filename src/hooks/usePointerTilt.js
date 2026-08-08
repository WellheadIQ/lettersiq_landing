import { useEffect, useRef } from "react";

/**
 * Damped pointer tilt for a 3D-transformed surface.
 *
 * Returns a ref for the element that should rotate. Children can be pushed onto
 * their own depth planes with `translateZ` because the element is set to
 * `preserve-3d`. Also publishes `--px` / `--py` (0-1 pointer position) so a
 * sheen or shadow can track the same input.
 *
 * Opt-out on coarse pointers and reduced motion: the element simply stays flat.
 */
export function usePointerTilt({ max = 5, lift = 10, ease = 0.12 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const current = { rx: 0, ry: 0, z: 0 };
    const target = { rx: 0, ry: 0, z: 0 };
    let raf = 0;

    const tick = () => {
      let moving = false;
      for (const key of ["rx", "ry", "z"]) {
        const delta = target[key] - current[key];
        if (Math.abs(delta) > 0.002) moving = true;
        current[key] += delta * ease;
      }

      el.style.transform = `perspective(1400px) rotateX(${current.rx.toFixed(3)}deg) rotateY(${current.ry.toFixed(3)}deg) translateZ(${current.z.toFixed(2)}px)`;

      raf = moving ? requestAnimationFrame(tick) : 0;
    };

    const run = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      target.rx = -(py * 2 - 1) * max;
      target.ry = (px * 2 - 1) * max;
      target.z = lift;

      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
      run();
    };

    const onLeave = () => {
      target.rx = 0;
      target.ry = 0;
      target.z = 0;
      el.style.setProperty("--px", "0.5");
      el.style.setProperty("--py", "0.5");
      run();
    };

    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform";
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
      el.style.willChange = "";
    };
  }, [max, lift, ease]);

  return ref;
}
