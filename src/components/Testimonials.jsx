import { motion } from "framer-motion";
import React from "react";
import { SectionLabel } from "./Primitives.jsx";

const testimonialsData = [
  {
    customerName: "John Smith",
    customerTitle: "Founder, Barnett Exploration",
    content:
      "LettersIQ has been a game-changer for our compliance management. The real-time notifications and comprehensive monitoring help us stay ahead of potential issues and avoid costly severance actions. The report is easy to parse, and the peace of mind it provides is invaluable.",
    code: "RPT_001",
  },
  {
    customerName: "Michael Thompson",
    customerTitle: "Head of Regulatory",
    content:
      "Since implementing LettersIQ, we've streamlined our compliance processes and significantly reduced the risk of violations. The detailed reports and customizable alerts keep us informed and in control. A must-have for any operator looking to protect their operations.",
    code: "RPT_002",
  },
  {
    customerName: "John Chen",
    customerTitle: "Lease Operator",
    content:
      "LettersIQ revolutionized the way we approach compliance. The proactive severance prevention has saved us time, money, and headaches. The platform's ease of use and exceptional support made it an essential part of our daily operations.",
    code: "RPT_003",
  },
];

export const Testimonials = () => (
  <section className="w-full bg-parchment py-16 md:py-24 relative">
    <div className="absolute -top-16" id="feedback" />
    <div className="absolute top-0 left-0 right-0 h-px bg-line" />

    <div className="section-shell">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-5"
      >
        <SectionLabel number="04" label="Field Reports" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mb-12 max-w-2xl"
      >
        <h2 className="font-display font-extrabold text-labFg text-display-sm">What our customers say</h2>
        <p className="mt-4 text-labFgMuted text-base md:text-lg">
          Trusted by operators across Texas for compliance monitoring and severance
          prevention.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonialsData.map((t, index) => (
          <motion.figure
            key={`${t.customerName}-${index}`}
            className="flex flex-col border border-labBorder bg-paperPanel hover:border-labFg hover:shadow-panel transition-[border-color,box-shadow] duration-200 ease-out-strong relative group"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="p-4 border-b border-labBorder flex items-center justify-between font-mono text-[11px] text-labFgMuted">
              <span>{t.code}</span>
              <span className="flex items-center gap-1.5 text-ember">
                <span className="w-1.5 h-1.5 rounded-full bg-ember" /> VERIFIED
              </span>
            </div>

            <blockquote className="p-6 flex-1 flex flex-col">
              <span aria-hidden className="font-mono text-5xl text-labBorderStrong leading-none mb-3">
                &ldquo;
              </span>
              <p className="text-labFg text-[15px] leading-relaxed flex-1">{t.content}</p>

              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-labBorder">
                <div className="w-10 h-10 border border-labBorder flex items-center justify-center font-mono text-sm font-semibold text-labFg bg-paperAlt shrink-0">
                  {t.customerName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-labFg text-sm truncate">{t.customerName}</div>
                  <div className="font-mono text-[11px] text-labFgMuted truncate">{t.customerTitle}</div>
                </div>
              </figcaption>
            </blockquote>

            <span className="bracket top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-transparent group-hover:border-ember transition-colors" />
            <span className="bracket bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-transparent group-hover:border-ember transition-colors" />
          </motion.figure>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 pt-6 border-t border-labBorder flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-wider text-labFgMuted"
      >
        <span className="text-ember">/// CUSTOMER TESTIMONIALS</span>
        <span>TOTAL REPORTS: {testimonialsData.length}</span>
        <span>STATUS: VERIFIED</span>
      </motion.div>
    </div>
  </section>
);
