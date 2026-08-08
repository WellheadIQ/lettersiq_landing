import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React from "react";
import { distance, duration, easeSmoothOut } from "../lib/motionTokens.js";

export const ScrollUpButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const toggleVisible = () => {
      setIsScrolled(document.documentElement.scrollTop > 300);
    };
    toggleVisible();
    window.addEventListener("scroll", toggleVisible, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  // Hide the button once the contact/footer region is on screen so it never
  // collides with the form's fields or submit button on mobile.
  useEffect(() => {
    const target = document.getElementById("contact-us");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactInView(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const isVisible = isScrolled && !contactInView;
  const offset = reduceMotion ? 0 : distance.medium;

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
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
