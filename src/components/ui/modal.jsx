import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDialKit } from "dialkit";
import { createPortal } from "react-dom";
import { lockPageScroll } from "../../lib/scrollLock.js";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const WIDTHS = { default: "max-w-3xl", wide: "max-w-6xl" };

const modalDialConfig = {
  entranceSpring: { type: "spring", visualDuration: 0.45, bounce: 0.18 },
  overlayOpacity: [0.9, 0, 1, 0.01],
  contentBorderRadius: [3, 0, 40, 1],
  replay: { type: "action", label: "Replay entrance" },
};

export const Modal = ({
  open,
  onClose,
  title,
  caption,
  width = "default",
  children,
}) => {
  const [replayKey, setReplayKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const modal = useDialKit("Modal", modalDialConfig, {
    id: "lettersiq-modal",
    onAction: (path) => {
      if (path === "replay" && open) setReplayKey((key) => key + 1);
    },
  });
  const panelRef = useRef(null);
  const restoreFocusTo = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreFocusTo.current = document.activeElement;
    const release = lockPageScroll();
    return () => {
      release();
      restoreFocusTo.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector("[data-modal-close]")?.focus();
  }, [open, replayKey]);

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

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onKeyDown={onKeyDown}
        >
          <motion.div
            className="absolute inset-0 bg-midnight backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: modal.overlayOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key={replayKey}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={reduceMotion ? { duration: 0 } : modal.entranceSpring}
            style={{ borderRadius: modal.contentBorderRadius }}
            className={`relative flex max-h-full w-full ${WIDTHS[width]} flex-col overflow-hidden border border-white/15 bg-oxford shadow-float`}
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
                className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center border border-lineControl text-white/70 transition-colors hover:border-white/50 hover:text-white"
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

            {/* tabIndex makes the scroll container focusable, which is the only way
                arrow keys can scroll it — a keyboard reader otherwise cannot reach
                content that sits below the fold of a long dialog. */}
            <div
              tabIndex={0}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-midnight p-4 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cobaltText"
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
