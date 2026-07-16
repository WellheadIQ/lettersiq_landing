import React from "react";

/** Five-point Lone Star glyph used as the brand punctuation mark. */
export const StarMark = ({ className = "", size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
  >
    <path
      fill="currentColor"
      d="M12 2l2.6 6.9L22 9.3l-5.6 4.6L18.4 22 12 17.7 5.6 22l2-8.1L2 9.3l7.4-.4z"
    />
  </svg>
);

/**
 * Numbered section marker: NN — star — label.
 * `tone="dark"` styles it for navy surfaces.
 */
export const SectionLabel = ({ number, label, tone = "light", className = "" }) => {
  const dark = tone === "dark";
  return (
    <div
      className={`flex items-center gap-3 mono-label ${
        dark ? "text-white/55" : "text-labFgMuted"
      } ${className}`}
    >
      <span className={dark ? "text-signalBright" : "text-signalRed"}>{number}</span>
      <StarMark size={11} className={dark ? "text-signalBright" : "text-signalRed"} />
      <span className={`w-8 h-px ${dark ? "bg-white/25" : "bg-lineStrong"}`} />
      <span>{label}</span>
    </div>
  );
};
