import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import LettersIQLogo from "/lettersiqlogo.png";
import { Button } from "./ui/button.jsx";
import { IconSwap } from "./ui/icon-swap.jsx";
import { useSurfaceTransition } from "../hooks/useSurfaceTransition.js";
import { duration } from "../lib/motionTokens.js";

const MenuIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M4 7h16M4 12h16M4 17h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const navbarLinks = [
  { label: "Briefing", href: "#how-it-works" },
  { label: "Blast Radius", href: "#blast-radius" },
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

  // Escape closes the menu wherever focus currently sits.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // The menu stays mounted so the close transition can play out; `inert` keeps
  // its links out of the tab order while it is hidden.
  const menu = useSurfaceTransition(isOpen, {
    closeVar: "--dropdown-close-dur",
    keepMounted: true,
  });

  const toggleMenu = () => setIsOpen((v) => !v);

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50">
      {/* Announcement bar — rationed red */}
      <div className="w-full bg-signalRed text-white">
        <div className="section-shell flex h-9 items-center justify-center gap-2.5 font-mono text-xs">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden="true" />
          {/* The full sentence clips mid-word under ~640px, so the narrow
              viewport gets a shorter line rather than a truncated one. */}
          <span className="truncate sm:hidden">
            Regulatory intelligence · 8 RRC systems
          </span>
          <span className="hidden truncate sm:inline">
            Regulatory intelligence across 8 connected RRC systems
          </span>
        </div>
      </div>

      <motion.div
        className={`w-full transition-colors duration-150 ease-out-strong ${
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
            className="flex min-h-11 items-center gap-3 shrink-0"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.verySlow / 1000 }}
          >
            <img
              src={LettersIQLogo}
              alt="LettersIQ"
              width="2000"
              height="1500"
              className="h-9 md:h-10 w-auto"
            />
            <span className="hidden border-l border-white/15 pl-3 font-mono text-xs text-white/65 lg:inline-block">
              RRC&nbsp;Operations&nbsp;Intelligence
            </span>
          </motion.a>

          {/* Desktop links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: duration.micro / 1000,
              duration: duration.verySlow / 1000,
            }}
            className="hidden lg:flex items-center gap-1"
          >
            {navbarLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="link-underline flex min-h-11 items-center px-4 font-mono text-[13px] text-white/70 transition-colors duration-150 ease-out-strong hover:text-white"
              >
                {label}
              </a>
            ))}
            <Button asChild size="sm" className="ml-4 text-[13px]">
              <a href="#contact-us">
                Request Review
                <span aria-hidden>&rarr;</span>
              </a>
            </Button>
          </motion.div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors hover:border-white/50 lg:hidden"
            onClick={toggleMenu}
          >
            <IconSwap
              state={isOpen ? "b" : "a"}
              a={<MenuIcon />}
              b={<CloseIcon />}
            />
          </button>
        </div>

        {/* Scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-signalRed"
        />
      </motion.div>

      {/* Mobile menu — anchored dropdown, grows from the toggle in the top right */}
      <div
        className={`t-scrim lg:hidden fixed inset-0 top-[100px] bg-black/50 backdrop-blur-sm z-40 ${menu.stateClass}`}
        onClick={toggleMenu}
        aria-hidden="true"
      />
      <div
        ref={menu.ref}
        id="mobile-menu"
        data-origin="top-right"
        inert={isOpen ? undefined : ""}
        className={`t-dropdown lg:hidden fixed top-[100px] left-0 right-0 bg-midnight border-b border-white/10 z-50 overflow-hidden ${menu.stateClass}`}
      >
        <div className="section-shell py-4">
          {navbarLinks.map(({ label, href }, index) => (
            <div key={href} className="t-dropdown-item" style={{ "--index": index }}>
              <a
                href={href}
                onClick={toggleMenu}
                className="flex items-center justify-between px-1 py-3.5 font-mono text-base text-white/80 hover:text-white transition-colors border-b border-white/5"
              >
                {label}
                <span aria-hidden className="text-white/25">&rarr;</span>
              </a>
            </div>
          ))}
          <div
            className="t-dropdown-item mt-4"
            style={{ "--index": navbarLinks.length }}
          >
            <a href="#contact-us" onClick={toggleMenu} className="btn-ember w-full">
              Request an Operator Review &rarr;
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
