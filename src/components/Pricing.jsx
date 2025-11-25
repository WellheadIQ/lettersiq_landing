import React from 'react';
import { motion } from "framer-motion";

const pricingFeatures = [
  { text: "Daily report delivered to your inbox", code: "DLY" },
  { text: "Remarks and contents of every violation", code: "VIO" },
  { text: "No more waiting on the mailman", code: "INS" }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="w-full bg-labBgAlt py-16 md:py-24 relative">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-labBorder" />
      
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">05</span>
          <span className="w-12 h-px bg-labBorder" />
          <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">PLAN CONFIGURATION</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-labFg mb-4">
            Simple Pricing
          </h2>
          <p className="text-labFgMuted">
            Transparent, straightforward pricing with no hidden fees.
          </p>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-2 border-labFg bg-labBg relative"
        >
          {/* Corner accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-labFg" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-labFg" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-labFg" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-labFg" />

          {/* Card header */}
          <div className="p-4 border-b border-labBorder flex items-center justify-between bg-labBgAlt">
            <span className="font-mono text-xs text-labFgMuted">PLAN: STANDARD</span>
            <span className="font-mono text-xs text-labAccent">ACTIVE</span>
          </div>

          {/* Price display */}
          <div className="p-8 md:p-12 text-center border-b border-labBorder">
            <div className="font-mono text-xs text-labFgMuted mb-2">MONTHLY RATE</div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl md:text-7xl font-bold text-labFg">$4</span>
              <span className="text-labFgMuted">/</span>
              <span className="text-labFgMuted">lease</span>
              <span className="text-labFgMuted">/</span>
              <span className="text-labFgMuted">month</span>
            </div>
            <div className="mt-4 inline-block px-4 py-2 bg-labAlert/10 border border-labAlert text-labAlert font-mono text-sm">
              NO HIDDEN FEES • NO ANNUAL COMMITMENT
            </div>
          </div>

          {/* Features list */}
          <div className="divide-y divide-labBorder">
            {pricingFeatures.map((feature, index) => (
              <motion.div
                key={feature.code}
                className="flex items-center gap-4 p-4 hover:bg-labBgAlt transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <span className="w-8 h-8 border border-labAccent flex items-center justify-center">
                  <svg className="w-4 h-4 text-labAccent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-labFg flex-1">{feature.text}</span>
                <span className="font-mono text-xs text-labFgMuted">{feature.code}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="p-6 bg-labBgAlt">
            <motion.a
              href="#contact-us"
              className="block w-full py-4 bg-labFg text-labBg font-mono text-sm uppercase tracking-wider text-center hover:bg-labAccent transition-colors duration-300"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Get Started
            </motion.a>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center font-mono text-xs text-labFgMuted"
        >
          /// 30-DAY MONEY-BACK GUARANTEE • CANCEL ANYTIME
        </motion.div>
      </div>
    </section>
  );
};
