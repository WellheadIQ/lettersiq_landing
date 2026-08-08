import React from "react";
import { cn } from "../../lib/utils.js";

/**
 * Two icons stacked in one grid cell, cross-fading with blur and scale.
 * transitions.dev — 09-icon-swap.md. Pure CSS; this only sets `data-state`.
 *
 * Both icons stay in the DOM, so the swap is decorative: give the control
 * itself the accessible name.
 */
export const IconSwap = ({ state, a, b, className }) => (
  <span
    className={cn("t-icon-swap", className)}
    data-state={state}
    aria-hidden="true"
  >
    <span className="t-icon" data-icon="a">
      {a}
    </span>
    <span className="t-icon" data-icon="b">
      {b}
    </span>
  </span>
);
