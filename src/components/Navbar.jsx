import React from 'react';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LettersIQLogo from "/lettersiqlogo.png";

const navbarLinks = [
  { label: "Home", href: "#home", ariaLabel: "Home" },
  { label: "Features", href: "#features", ariaLabel: "Features" },
  { label: "Pricing", href: "#pricing", ariaLabel: "Pricing" },
  { label: "Feedback", href: "#feedback", ariaLabel: "Feedback" },
  { label: "FAQ", href: "#FAQ", ariaLabel: "FAQ" },
  { label: "Contact Us", href: "#contact-us", ariaLabel: "Contact Us" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full h-20 flex flex-col justify-center items-center fixed bg-labFg/95 backdrop-blur-md z-40 border-b border-white/10">
      {/* Top technical bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <a className="flex items-center gap-3" href="#home" aria-label="Home">
            <img src={LettersIQLogo} alt="LettersIQ" className="h-12 md:h-16" />
          </a>
          <span className="hidden md:block font-mono text-xs text-white/50 tracking-wider uppercase">
            /// RRC MONITORING
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden lg:flex items-center gap-1"
        >
          {navbarLinks.map(({ href, label, ariaLabel }, index) => (
            <motion.a
              key={label}
              className="font-mono text-sm text-white/80 hover:text-white px-4 py-2 transition-colors duration-200 relative group"
              href={href}
              aria-label={ariaLabel}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="relative z-10">{label}</span>
              <span className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              {index < navbarLinks.length - 1 && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20">/</span>
              )}
            </motion.a>
          ))}
        </motion.div>
        
        {/* Mobile menu button */}
        <div className="lg:hidden cursor-pointer p-2 border border-white/20 hover:border-white/50 transition-colors" onClick={toggleMenu}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile navbar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-20 left-0 right-0 bg-labFg border-b border-white/10 overflow-hidden"
          >
            <div className="py-4">
              {navbarLinks.map(({ label, href, ariaLabel }, index) => (
                <motion.a
                  key={href}
                  className="block px-6 py-3 font-mono text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors border-l-2 border-transparent hover:border-white"
                  href={href}
                  onClick={toggleMenu}
                  aria-label={ariaLabel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="text-white/40 mr-2">{String(index + 1).padStart(2, '0')}.</span>
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
