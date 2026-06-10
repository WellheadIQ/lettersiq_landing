import React from "react";
import { motion } from "framer-motion";

const pricingFeatures = [
  { text: "Daily report delivered to your inbox", code: "DLY" },
  { text: "Remarks and contents of every violation", code: "VIO" },
  { text: "No more waiting on the mailman", code: "INS" },
  { text: "Multi-lease management included", code: "MLM" },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="w-full bg-paperAlt py-16 md:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-labBorder" />

      <div className="section-shell max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mono-label text-labFgMuted mb-5"
        >
          <span className="text-ember">05</span>
          <span className="w-8 h-px bg-labBorderStrong" />
          <span>Plan Configuration</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-center mb-12"
        >
          <h2 className="text-display-sm font-bold text-labFg">Simple pricing</h2>
          <p className="mt-4 text-labFgMuted text-base md:text-lg">
            Transparent, straightforward pricing with no hidden fees.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative border-2 border-labFg bg-paperPanel shadow-panelLg"
        >
          <span className="bracket -top-2 -left-2 border-l-2 border-t-2 border-labFg" />
          <span className="bracket -top-2 -right-2 border-r-2 border-t-2 border-labFg" />
          <span className="bracket -bottom-2 -left-2 border-l-2 border-b-2 border-labFg" />
          <span className="bracket -bottom-2 -right-2 border-r-2 border-b-2 border-labFg" />

          <div className="px-5 py-4 border-b border-labBorder flex items-center justify-between bg-paperAlt font-mono text-[11px] tracking-wider">
            <span className="text-labFgMuted">PLAN: STANDARD</span>
            <span className="flex items-center gap-1.5 text-ember">
              <span className="w-1.5 h-1.5 rounded-full bg-ember" /> ACTIVE
            </span>
          </div>

          <div className="px-6 py-10 md:py-12 text-center border-b border-labBorder">
            <div className="font-mono text-[11px] tracking-wider text-labFgMuted mb-3">MONTHLY RATE</div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl md:text-7xl font-bold text-labFg tracking-tight">$4</span>
              <span className="font-mono text-labFgMuted text-sm">/ lease / month</span>
            </div>
            <div className="mt-5 inline-block px-4 py-2 bg-emberSoft border border-ember/40 text-ember font-mono text-xs tracking-wider">
              NO HIDDEN FEES • NO ANNUAL COMMITMENT
            </div>
          </div>

          <div className="divide-y divide-labBorder">
            {pricingFeatures.map((feature, index) => (
              <motion.div
                key={feature.code}
                className="flex items-center gap-4 px-6 py-4 hover:bg-paperAlt transition-colors"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
              >
                <span className="w-7 h-7 bg-ember flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-labFg flex-1">{feature.text}</span>
                <span className="font-mono text-[11px] text-labFgMuted hidden sm:inline">{feature.code}</span>
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-paperAlt">
            <a href="#contact-us" className="btn-ember w-full">
              Get Started
              <span aria-hidden>→</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center font-mono text-[11px] tracking-wider text-labFgMuted"
        >
          /// 30-DAY MONEY-BACK GUARANTEE • CANCEL ANYTIME
        </motion.div>
      </div>
    </section>
  );
};
