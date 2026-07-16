import React from "react";

export const Divider = () => (
  <div className="w-full py-6 bg-parchment">
    <div className="section-shell">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-line" />
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="text-signalRed shrink-0"
        >
          <path
            fill="currentColor"
            d="M12 2l2.6 6.9L22 9.3l-5.6 4.6L18.4 22 12 17.7 5.6 22l2-8.1L2 9.3l7.4-.4z"
          />
        </svg>
        <div className="flex-1 h-px bg-line" />
      </div>
    </div>
  </div>
);
