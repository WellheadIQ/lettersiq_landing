import React from 'react';

export const Divider = () => (
  <div className="w-full py-8">
    <div className="max-w-7xl mx-auto px-6 md:px-8">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-labBorder" />
        <span className="font-mono text-xs text-labFgMuted">///</span>
        <div className="flex-1 h-px bg-labBorder" />
      </div>
    </div>
  </div>
);
