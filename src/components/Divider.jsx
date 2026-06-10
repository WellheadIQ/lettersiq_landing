import React from "react";

export const Divider = () => (
  <div className="w-full py-6 bg-paper">
    <div className="section-shell">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-labBorder" />
        <span className="font-mono text-[11px] tracking-[0.2em] text-ember/70">///</span>
        <div className="flex-1 h-px bg-labBorder" />
      </div>
    </div>
  </div>
);
