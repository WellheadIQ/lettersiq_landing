import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React from "react";
import { distance, duration, easeSmoothOut } from "../lib/motionTokens.js";

/**
 * Regions the button steps aside for: the contact form, whose fields it would
 * sit on top of, and the pinned story stage, which owns the whole screen while
 * it plays and carries its own navigation.
 */
const YIELD_TO = ["contact-us", "story"];

export const ScrollUpButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [yielding, setYielding] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const toggleVisible = () => {
      setIsScrolled(document.documentElement.scrollTop > 300);
    };
    toggleVisible();
    window.addEventListener("scroll", toggleVisible, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const targets = YIELD_TO.map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return undefined;

    const showing = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) showing.add(entry.target);
          else showing.delete(entry.target);
        });
        setYielding(showing.size > 0);
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const isVisible = isScrolled && !yielding;
  const offset = reduceMotion ? 0 : distance.medium;

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          data-scroll-top
          className="w-12 h-12 fixed bottom-6 right-6 border border-lineStrong bg-card hover:bg-oxford hover:border-oxford cursor-pointer flex justify-center items-center z-50 group transition-colors duration-150 ease-out-strong"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: offset }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: duration.fast / 1000, ease: easeSmoothOut },
          }}
          exit={{
            opacity: 0,
            y: offset,
            transition: { duration: duration.quick / 1000, ease: easeSmoothOut },
          }}
          whileTap={{ scale: 0.96 }}
        >
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="text-labFg group-hover:text-white transition-colors duration-150 ease-out-strong"
          >
            <path
              d="M18 15L12 9L6 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
