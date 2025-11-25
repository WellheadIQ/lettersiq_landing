import { motion } from "framer-motion";
import React from 'react';

const features = [
  { text: "Multi-lease management", code: "MLM_001", icon: "◆" },
  { text: "No more waiting at the post office", code: "NPO_002", icon: "◇" },
  { text: "Go on vacation without a worry", code: "VAC_003", icon: "○" },
];

// CSS-based monitoring radar graphic
const MonitoringGraphic = () => (
  <div className="relative w-full h-full min-h-[350px] border border-labBorder bg-labBg overflow-hidden">
    {/* Grid background */}
    <div className="absolute inset-0" style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }} />
    
    {/* Radar circles */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-64 h-64">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-labBorder rounded-full"
            style={{ 
              width: `${i * 33}%`, 
              height: `${i * 33}%`,
              top: `${(100 - i * 33) / 2}%`,
              left: `${(100 - i * 33) / 2}%`,
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-labAlert rounded-full" />
        
        {/* Scanning line */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-labAlert to-transparent origin-left"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Data points */}
        {[
          { x: 30, y: 20 },
          { x: 70, y: 35 },
          { x: 25, y: 65 },
          { x: 80, y: 70 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-labFg rounded-full"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>
    </div>
    
    {/* Corner labels */}
    <div className="absolute top-4 left-4 font-mono text-xs text-labFgMuted">
      <div>SCAN_MODE</div>
      <div className="text-labAlert">ACTIVE</div>
    </div>
    <div className="absolute top-4 right-4 font-mono text-xs text-labFgMuted text-right">
      <div>LEASES: ALL</div>
      <div>VIOLATIONS: 0</div>
    </div>
    <div className="absolute bottom-4 left-4 font-mono text-xs text-labFgMuted">
      <div>COVERAGE: TX</div>
    </div>
    <div className="absolute bottom-4 right-4 font-mono text-xs text-labFgMuted text-right">
      <div>{">>>>>>>>>"}</div>
    </div>
  </div>
);

export const Features2 = () => (
  <section className="w-full bg-labBgAlt py-16 md:py-24 relative">
    {/* Top border */}
    <div className="absolute top-0 left-0 right-0 h-px bg-labBorder" />
    
    <div className="max-w-7xl mx-auto px-6 md:px-8">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-12"
      >
        <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">02</span>
        <span className="w-12 h-px bg-labBorder" />
        <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">MONITORING</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left - CSS graphic instead of images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-last lg:order-first relative"
        >
          {/* Technical frame corners */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-labFg z-10" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-labFg z-10" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-labFg z-10" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-labFg z-10" />
          
          <MonitoringGraphic />
          
          <div className="font-mono text-xs text-labFgMuted mt-4 flex justify-between">
            <span>FIG. 03 — MONITORING RADAR</span>
            <span>/// REAL-TIME</span>
          </div>
        </motion.div>

        {/* Right content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="font-mono text-xs text-labAlert uppercase tracking-widest mb-4">
            STAY INFORMED AND COMPLIANT
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-labFg mb-6 leading-tight">
            Operator-Centric<br />Updates
          </h2>
          <p className="text-labFgMuted text-base md:text-lg leading-relaxed mb-8">
            Comprehensive monitoring for all your leases in one place.
          </p>
          
          {/* Feature list with technical styling */}
          <div className="border border-labBorder divide-y divide-labBorder">
            {features.map((feature, index) => (
              <motion.div
                key={feature.code}
                className="flex items-center gap-4 p-4 hover:bg-labBg transition-colors group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <span className="w-8 h-8 border border-labBorder flex items-center justify-center font-mono text-sm text-labFgMuted group-hover:border-labAlert group-hover:text-labAlert transition-colors">
                  {feature.icon}
                </span>
                <span className="text-labFg flex-1">{feature.text}</span>
                <span className="font-mono text-xs text-labFgMuted">
                  {feature.code}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Technical footer */}
          <div className="mt-6 flex items-center gap-4 font-mono text-xs text-labFgMuted">
            <span>{">>>>>>>>>"}</span>
            <span>COMPREHENSIVE MONITORING SYSTEM</span>
          </div>
        </motion.div>
      </div>
    </div>
    
    {/* Bottom border */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-labBorder" />
  </section>
);
