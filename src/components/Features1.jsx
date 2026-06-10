import { motion } from "framer-motion";
import React from "react";

const features = [
  { text: "Daily email report", code: "RPT_001", desc: "Delivered at 7:00 AM CST" },
  { text: "All the necessary details", code: "DTL_002", desc: "Lease, violation & remarks" },
  { text: "Weekly summaries", code: "SUM_003", desc: "A digest of all activity" },
];

const DataFlowGraphic = () => (
  <div className="relative w-full h-full min-h-[340px] sm:min-h-[400px] border border-labBorder bg-paperAlt overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(12,13,15,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(12,13,15,0.04) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />

    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[200px] h-[200px]">
        {/* connection lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.line
              key={i}
              x1="100"
              y1="100"
              x2={100 + Math.cos((angle * Math.PI) / 180) * 82}
              y2={100 + Math.sin((angle * Math.PI) / 180) * 82}
              stroke="rgba(12,13,15,0.12)"
              strokeWidth="1"
              strokeDasharray="3 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.08 }}
            />
          ))}
        </svg>

        {/* central hub */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-labFg rounded-full flex flex-col items-center justify-center bg-paper"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <span className="font-mono text-[10px] text-labFgMuted">SOURCE</span>
          <span className="font-mono text-sm font-bold text-labFg">RRC</span>
        </motion.div>

        {/* orbiting dots */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-ember rounded-full"
            style={{ marginLeft: -5, marginTop: -5 }}
            animate={{
              x: [0, Math.cos((i * Math.PI) / 2) * 82, 0],
              y: [0, Math.sin((i * Math.PI) / 2) * 82, 0],
              opacity: [0.25, 1, 0.25],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>
    </div>

    {/* corner labels */}
    <div className="absolute top-4 left-4 font-mono text-[10px] tracking-wider text-labFgMuted">
      <div>DATA_FLOW</div>
      <div className="text-ember">ACTIVE</div>
    </div>
    <div className="absolute top-4 right-4 font-mono text-[10px] tracking-wider text-labFgMuted text-right">
      <div>FREQ: DAILY</div>
      <div>07:00 CST</div>
    </div>
    <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-wider text-labFgMuted">
      INBOUND → INBOX
    </div>
    <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-wider text-ember/70">
      {">>>>>"}
    </div>
  </div>
);

export const Features1 = () => {
  return (
    <section className="w-full bg-paper py-16 md:py-24 relative" id="features">
      <div className="absolute top-0 left-0 right-0 h-px bg-labBorder" />

      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mono-label text-labFgMuted mb-12"
        >
          <span className="text-ember">01</span>
          <span className="w-8 h-px bg-labBorderStrong" />
          <span>Features</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mono-label text-ember mb-4">EMBRACE CONVENIENCE</div>
            <h2 className="text-display-sm font-bold text-labFg leading-[1.05]">
              Real-time
              <br />
              notifications
            </h2>
            <p className="mt-5 text-labFgMuted text-base md:text-lg leading-relaxed max-w-lg">
              No more waiting in line at the post office or worrying about checking
              your mail while you're on vacation. We watch the Commission so you
              don't have to.
            </p>

            <div className="mt-8 space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.code}
                  className="flex items-center gap-4 p-4 border border-labBorder bg-paper hover:border-labFg hover:shadow-panel transition-all duration-300 group"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
                >
                  <span className="font-mono text-[11px] text-labFgMuted group-hover:text-ember transition-colors w-14 shrink-0">
                    {feature.code}
                  </span>
                  <span className="w-px h-9 bg-labBorder" />
                  <div className="flex-1 min-w-0">
                    <span className="text-labFg font-medium block">{feature.text}</span>
                    <span className="text-labFgMuted text-sm">{feature.desc}</span>
                  </div>
                  <span className="font-mono text-labFgMuted group-hover:text-ember group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right graphic */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <span className="bracket -top-2 -left-2 border-l-2 border-t-2 border-labFg" />
            <span className="bracket -top-2 -right-2 border-r-2 border-t-2 border-labFg" />
            <span className="bracket -bottom-2 -left-2 border-l-2 border-b-2 border-labFg" />
            <span className="bracket -bottom-2 -right-2 border-r-2 border-b-2 border-labFg" />

            <DataFlowGraphic />

            <div className="font-mono text-[11px] tracking-wider text-labFgMuted mt-4 flex justify-between">
              <span>FIG.02 — DATA PIPELINE</span>
              <span className="text-ember">/// AUTOMATED</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
