import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import LettersIQLogo from "/lettersiqlogo.png";
import { Button } from "./ui/button.jsx";

const navbarLinks = [
  { label: "Blast Radius", href: "#blast-radius" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Coverage", href: "#coverage" },
  { label: "Pricing", href: "#pricing" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((v) => !v);

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50">
      {/* Announcement bar — rationed red */}
      <div className="w-full bg-signalRed text-white">
        <div className="section-shell flex h-9 items-center justify-center gap-2.5 font-mono text-xs">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden="true" />
          <span className="truncate">Daily scans across 8 RRC datasets — latest 07:00 CT</span>
        </div>
      </div>

      <motion.div
        className={`w-full transition-colors duration-200 ease-out ${
          scrolled
            ? "bg-midnight/95 backdrop-blur-md border-b border-white/10"
            : "bg-midnight border-b border-transparent"
        }`}
      >
        <div className="section-shell h-[64px] md:h-[72px] flex justify-between items-center">
          {/* Brand */}
          <motion.a
            href="#home"
            aria-label="LettersIQ home"
            className="flex items-center gap-3 shrink-0"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={LettersIQLogo} alt="LettersIQ" className="h-9 md:h-10 w-auto" />
            <span className="hidden border-l border-white/15 pl-3 font-mono text-xs text-white/65 lg:inline-block">
              RRC&nbsp;Monitoring
            </span>
          </motion.a>

          {/* Desktop links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden lg:flex items-center gap-1"
          >
            {navbarLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="link-underline flex min-h-11 items-center px-4 font-mono text-[13px] text-white/70 transition-colors duration-200 hover:text-white"
              >
                {label}
              </a>
            ))}
            <Button asChild size="sm" className="ml-4 text-[13px]">
              <a href="#contact-us">
                Get Started
                <span aria-hidden>&rarr;</span>
              </a>
            </Button>
          </motion.div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors hover:border-white/50 lg:hidden"
            onClick={toggleMenu}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"}
              />
            </svg>
          </button>
        </div>

        {/* Scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-signalRed"
        />
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 top-[100px] bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed top-[100px] left-0 right-0 bg-midnight border-b border-white/10 z-50 overflow-hidden"
            >
              <div className="section-shell py-4">
                {navbarLinks.map(
                  ({ label, href }, index) => (
                    <motion.a
                      key={href}
                      href={href}
                      onClick={toggleMenu}
                      className="flex items-center justify-between px-1 py-3.5 font-mono text-base text-white/80 hover:text-white transition-colors border-b border-white/5"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {label}
                      <span aria-hidden className="text-white/25">&rarr;</span>
                    </motion.a>
                  )
                )}
                <a href="#contact-us" onClick={toggleMenu} className="btn-ember w-full mt-4">
                  Get Started &rarr;
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
