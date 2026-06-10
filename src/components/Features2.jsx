import { motion } from "framer-motion";
import React from "react";

const features = [
  { text: "Multi-lease management", code: "MLM_001", icon: "◆" },
  { text: "No more waiting at the post office", code: "NPO_002", icon: "◇" },
  { text: "Go on vacation without a worry", code: "VAC_003", icon: "○" },
];

const MonitoringGraphic = () => (
  <div className="relative w-full h-full min-h-[340px] sm:min-h-[400px] border border-labBorder bg-paper overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(12,13,15,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(12,13,15,0.04) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />

    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-60 h-60">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute border border-labBorder rounded-full"
            style={{
              width: `${i * 33}%`,
              height: `${i * 33}%`,
              top: `${(100 - i * 33) / 2}%`,
              left: `${(100 - i * 33) / 2}%`,
            }}
            animate={{ opacity: [0.3, 0.65, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-ember rounded-full ring-4 ring-ember/15" />

        <motion.div
          className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-ember to-transparent origin-left"
          animate={{ rotate: 360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        />

        {[
          { x: 30, y: 22 },
          { x: 70, y: 35 },
          { x: 25, y: 65 },
          { x: 78, y: 70 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-labFg rounded-full"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>
    </div>

    <div className="absolute top-4 left-4 font-mono text-[10px] tracking-wider text-labFgMuted">
      <div>SCAN_MODE</div>
      <div className="text-ember">ACTIVE</div>
    </div>
    <div className="absolute top-4 right-4 font-mono text-[10px] tracking-wider text-labFgMuted text-right">
      <div>LEASES: ALL</div>
      <div>VIOLATIONS: 0</div>
    </div>
    <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-wider text-labFgMuted">
      COVERAGE: TX
    </div>
    <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-wider text-ember/70">
      {">>>>>"}
    </div>
  </div>
);

export const Features2 = () => (
  <section className="w-full bg-paperAlt py-16 md:py-24 relative">
    <div className="absolute top-0 left-0 right-0 h-px bg-labBorder" />

    <div className="section-shell">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mono-label text-labFgMuted mb-12"
      >
        <span className="text-ember">02</span>
        <span className="w-8 h-px bg-labBorderStrong" />
        <span>Monitoring</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-last lg:order-first relative"
        >
          <span className="bracket -top-2 -left-2 border-l-2 border-t-2 border-labFg" />
          <span className="bracket -top-2 -right-2 border-r-2 border-t-2 border-labFg" />
          <span className="bracket -bottom-2 -left-2 border-l-2 border-b-2 border-labFg" />
          <span className="bracket -bottom-2 -right-2 border-r-2 border-b-2 border-labFg" />

          <MonitoringGraphic />

          <div className="font-mono text-[11px] tracking-wider text-labFgMuted mt-4 flex justify-between">
            <span>FIG.03 — MONITORING RADAR</span>
            <span className="text-ember">/// REAL-TIME</span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mono-label text-ember mb-4">STAY INFORMED & COMPLIANT</div>
          <h2 className="text-display-sm font-bold text-labFg leading-[1.05]">
            Operator-centric
            <br />
            updates
          </h2>
          <p className="mt-5 text-labFgMuted text-base md:text-lg leading-relaxed max-w-lg">
            Comprehensive monitoring for every lease you operate — consolidated in
            one clear daily briefing.
          </p>

          <div className="mt-8 border border-labBorder bg-paper divide-y divide-labBorder">
            {features.map((feature, index) => (
              <motion.div
                key={feature.code}
                className="flex items-center gap-4 p-4 hover:bg-paperAlt transition-colors group"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.08 }}
              >
                <span className="w-9 h-9 border border-labBorder flex items-center justify-center font-mono text-sm text-labFgMuted group-hover:border-ember group-hover:text-ember transition-colors shrink-0">
                  {feature.icon}
                </span>
                <span className="text-labFg flex-1">{feature.text}</span>
                <span className="font-mono text-[11px] text-labFgMuted">{feature.code}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 font-mono text-[11px] tracking-wider text-labFgMuted">
            <span className="text-ember">{">>>>>"}</span>
            <span>COMPREHENSIVE MONITORING SYSTEM</span>
          </div>
        </motion.div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-px bg-labBorder" />
  </section>
);
