import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "./Primitives.jsx";

const steps = [
  {
    n: "01",
    title: "We scan",
    body: "Every dawn we pull eight public Texas Railroad Commission datasets — severance orders, certified letters, P-5 operator renewals, proration schedules and more.",
  },
  {
    n: "02",
    title: "We connect",
    body: "We diff each one against yesterday and cross-reference systems that don't talk to each other — so a risk hiding across two separate filings surfaces as a single signal.",
  },
  {
    n: "03",
    title: "You get one briefing",
    body: "By 7:00 AM you get one ranked email: what changed, why it matters for your leases, and how many days you have left to cure it.",
  },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="w-full bg-parchmentAlt py-16 md:py-24 relative">
    <div className="absolute top-0 left-0 right-0 h-px bg-line" />

    <div className="section-shell">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-5"
      >
        <SectionLabel label="How it works" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mb-12 max-w-2xl font-display font-extrabold text-labFg text-display-sm tracking-[-0.02em]"
      >
        New to the filings? Here's the whole loop.
      </motion.h2>

      <ol className="grid grid-cols-1 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.li
            key={step.n}
            className="relative border-t border-line pt-6 md:pr-8 md:[&:not(:first-child)]:pl-8 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-line md:[&:not(:first-child)]:border-t-0 md:pt-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-mono text-sm tabular-nums text-signalBright">{step.n}</span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
            <h3 className="font-display text-xl font-bold text-labFg tracking-[-0.01em]">
              {step.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-labFgMuted">{step.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);
