import { motion } from "framer-motion";
import dashboard from "../assets/images/dashboard.jpg";
import React from 'react';

export const Hero = () => {
  const scrollToContactUs = () => {
    const contactUsSection = document.getElementById("contact-us");
    if (contactUsSection) {
      contactUsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="w-full flex flex-col justify-start items-center relative overflow-hidden"
      id="home"
    >
      {/* Dark header section */}
      <div className="w-full bg-labFg pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-8">
          {/* Technical decorative elements */}
          <div className="flex justify-between items-start mb-8">
            <div className="font-mono text-xs text-white/40">
              <div className="flex flex-col gap-1">
                <span>SYS_ID: LIQ-2024</span>
                <span>STATUS: ACTIVE</span>
                <span className="text-labAlert">{">>>>>>>>>"}</span>
              </div>
            </div>
            <div className="font-mono text-xs text-white/40 text-right hidden md:block">
              <div className="flex flex-col gap-1">
                <span>REGION: TEXAS</span>
                <span>MODE: MONITORING</span>
                <span>V 2.0</span>
              </div>
            </div>
          </div>

          {/* Main headline - specific to LettersIQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              <span className="block">Never miss a</span>
              <span className="block">severance letter</span>
              <span className="block text-white/50">again.</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 max-w-2xl"
          >
            <p className="text-white/60 text-base md:text-lg leading-relaxed">
              RRC violations delivered to your inbox daily. Stay ahead of compliance issues and avoid costly severance actions from the Texas Railroad Commission.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              onClick={scrollToContactUs}
              className="px-8 py-4 bg-labAlert text-labFg font-mono text-sm uppercase tracking-wider hover:bg-white transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
            <motion.a
              href="#features"
              className="px-8 py-4 bg-transparent text-white font-mono text-sm uppercase tracking-wider border border-white/30 hover:border-white transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Light section with dashboard */}
      <div className="w-full bg-labBg py-16 md:py-24">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-8">
          {/* Dashboard image with technical frame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            {/* Technical frame corners */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-labFg" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-labFg" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-labFg" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-labFg" />
            
            {/* Image label */}
            <div className="absolute -top-8 left-0 font-mono text-xs text-labFgMuted flex items-center gap-4">
              <span>FIG. 01</span>
              <span className="w-16 h-px bg-labBorder" />
              <span>DASHBOARD INTERFACE</span>
            </div>
            
            {/* Main image */}
            <div className="border border-labBorder bg-white p-2 md:p-4">
              <img
                src={dashboard}
                alt="LettersIQ Dashboard"
                className="w-full h-auto"
              />
            </div>
            
            {/* Bottom technical info */}
            <div className="flex justify-between items-center mt-4 font-mono text-xs text-labFgMuted">
              <span>REAL-TIME MONITORING</span>
              <span>/// LETTERSIQ PLATFORM</span>
              <span>24/7 ALERTS</span>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 md:mt-16 pt-8 border-t border-labBorder"
          >
            {[
              { label: "DELIVERY", value: "7AM CST" },
              { label: "COVERAGE", value: "TEXAS" },
              { label: "MONITORING", value: "24/7" },
              { label: "STATUS", value: "ACTIVE" },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="font-mono text-xs text-labFgMuted mb-1">{stat.label}</div>
                <div className="font-bold text-2xl md:text-3xl text-labFg">{stat.value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
