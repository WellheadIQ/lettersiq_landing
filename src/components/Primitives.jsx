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

/** Quiet section marker. Sentence case avoids repetitive terminal-style eyebrows. */
export const SectionLabel = ({ label, className = "" }) => (
  <p
    className={`flex items-center gap-3 text-sm font-semibold text-inkMuted ${className}`}
  >
    <span className="h-px w-6 bg-signalRed shrink-0" aria-hidden="true" />
    <span>{label}</span>
  </p>
);
