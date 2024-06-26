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

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full h-20 flex flex-col justify-center items-center fixed bg-customDarkBg1 lg:bg-customDarkBgTransparent z-40 lg:backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a className="navbar-link" href="#home" aria-label="Home">
            <div className="flex items-center">
              {/* Increase the h-8 class to h-12 or more based on your preference */}
              <img src={LettersIQLogo} alt="LettersIQ" className="h-48" />
            </div>
          </a>

        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden lg:flex justify-center flex-grow"
        >
          <div className="flex gap-6">
            {navbarLinks.map(({ href, label, ariaLabel }) => (
              <motion.a
                key={label}
                className="navbar-link"
                href={href}
                aria-label={ariaLabel}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.a>
            ))}
          </div>
        </motion.div>
        <div className="lg:hidden cursor-pointer" onClick={toggleMenu}>
          {/* Menu icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="lg:hidden absolute top-20 left-0 right-0 bg-customDarkBg1 z-50 border-y border-solid border-customDarkBg3 py-6"
          >
            {navbarLinks.map(({ label, href, ariaLabel }) => (
              <motion.a
                key={href}
                className="navbar-link block text-center py-4"
                href={href}
                onClick={toggleMenu}
                aria-label={ariaLabel}
                variants={menuItemVariants}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};