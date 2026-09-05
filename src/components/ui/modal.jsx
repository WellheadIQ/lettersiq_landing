import React, { useEffect, useId, useRef } from "react";
import { lockPageScroll } from "../../lib/scrollLock.js";

const WIDTHS = { default: "max-w-3xl", wide: "max-w-6xl" };

// The native top layer contains focus, makes the page inert, and escapes every
// transformed or clipped ancestor without a second focus-trap implementation.
export const Modal = ({ open, onClose, title, caption, width = "default", children }) => {
  const dialogRef = useRef(null);
  const titleId = useId();
  const captionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return undefined;
    const trigger = document.activeElement;
    dialog.showModal();
    const release = lockPageScroll();
    return () => {
      dialog.close();
      release();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={caption ? captionId : undefined}
      className={`sample-dialog w-[calc(100%-2rem)] ${WIDTHS[width] || WIDTHS.default} overflow-hidden rounded-sm border border-lineStrong bg-oxford p-0 text-white`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
          <div className="min-w-0 py-1">
            <h2 id={titleId} className="font-display text-base font-bold">{title}</h2>
            {caption && <p id={captionId} className="mt-1 font-mono text-xs text-white/65">{caption}</p>}
          </div>
          <button type="button" autoFocus onClick={onClose} aria-label="Close sample briefing" className="flex h-11 w-11 shrink-0 items-center justify-center border border-lineControl text-white/80 transition-colors hover:border-white hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div tabIndex={0} role="region" aria-label="Sample briefing" className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-midnight p-3 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cobaltText">
          {open ? children : null}
        </div>
      </div>
    </dialog>
  );
};
