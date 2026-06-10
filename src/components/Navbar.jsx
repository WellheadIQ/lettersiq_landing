import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import LettersIQLogo from "/lettersiqlogo.png";

const navbarLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reports", href: "#feedback" },
  { label: "FAQ", href: "#FAQ" },
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
      <motion.div
        className={`w-full transition-colors duration-300 ${
          scrolled ? "bg-ink/95 backdrop-blur-md border-b border-white/10" : "bg-ink border-b border-transparent"
        }`}
      >
        <div className="section-shell h-[68px] md:h-20 flex justify-between items-center">
          {/* Brand */}
          <motion.a
            href="#home"
            aria-label="LettersIQ home"
            className="flex items-center gap-3 shrink-0"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={LettersIQLogo} alt="LettersIQ" className="h-9 md:h-11 w-auto" />
            <span className="hidden lg:inline-block mono-label text-white/45">
              /// RRC&nbsp;MONITORING
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
                className="font-mono text-[13px] text-white/70 hover:text-white px-4 py-2 transition-colors duration-200 link-underline"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact-us"
              className="ml-4 inline-flex items-center gap-2 bg-ember text-white font-mono text-[13px] uppercase tracking-[0.12em] px-5 py-2.5 transition-all duration-300 hover:bg-emberBright"
            >
              Get Started
              <span aria-hidden>→</span>
            </a>
          </motion.div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="lg:hidden cursor-pointer p-2.5 border border-white/20 hover:border-white/50 transition-colors text-white"
            onClick={toggleMenu}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
          className="h-px origin-left bg-gradient-to-r from-ember via-emberBright to-ember"
        />
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 top-[68px] bg-black/40 backdrop-blur-sm z-40"
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
              className="lg:hidden fixed top-[68px] left-0 right-0 bg-ink border-b border-white/10 z-50 overflow-hidden"
            >
              <div className="section-shell py-4">
                {[...navbarLinks, { label: "Contact Us", href: "#contact-us" }].map(
                  ({ label, href }, index) => (
                    <motion.a
                      key={href}
                      href={href}
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-1 py-3.5 font-mono text-base text-white/80 hover:text-white transition-colors border-l-2 border-transparent hover:border-ember hover:pl-3"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className="text-ember/70 text-xs">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {label}
                    </motion.a>
                  )
                )}
                <a
                  href="#contact-us"
                  onClick={toggleMenu}
                  className="btn-ember w-full mt-4"
                >
                  Get Started →
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
