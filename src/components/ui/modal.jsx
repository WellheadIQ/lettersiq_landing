import React, { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useSurfaceTransition } from "../../hooks/useSurfaceTransition.js";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Centred dialog on the transitions.dev modal recipe (06-modal.md): scales up
 * from `--modal-scale` on open, dips back on close. The surface is unmounted
 * only after the close transition has finished.
 */
const WIDTHS = { default: "max-w-3xl", wide: "max-w-6xl" };

export const Modal = ({
  open,
  onClose,
  title,
  caption,
  width = "default",
  children,
}) => {
  const { ref, mounted, stateClass } = useSurfaceTransition(open, {
    closeVar: "--modal-close-dur",
  });
  const panelRef = useRef(null);
  const restoreFocusTo = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreFocusTo.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open || !mounted) return undefined;
    panelRef.current?.querySelector("[data-modal-close]")?.focus();
  }, [open, mounted]);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onKeyDown={onKeyDown}
    >
      <div
        className={`t-scrim absolute inset-0 bg-midnight/90 backdrop-blur-[3px] ${stateClass}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={(node) => {
          ref.current = node;
          panelRef.current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`t-modal relative flex max-h-full w-full ${WIDTHS[width]} flex-col overflow-hidden rounded-[3px] border border-white/15 bg-oxford shadow-float ${stateClass}`}
      >
        <div className="flex items-start justify-between gap-6 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-display text-base font-bold tracking-[-0.01em] text-white"
            >
              {title}
            </h2>
            {caption && (
              <p className="mt-1 font-mono text-xs text-white/55">{caption}</p>
            )}
          </div>
          <button
            type="button"
            data-modal-close
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-midnight p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
