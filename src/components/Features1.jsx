import { motion } from "framer-motion";
import React from 'react';

const features = [
  { text: "Daily email report", code: "RPT_001", desc: "Delivered at 7AM CST" },
  { text: "All the necessary details", code: "DTL_002", desc: "Lease, violation, remarks" },
  { text: "Weekly Summaries", code: "SUM_003", desc: "Digest of all activity" },
];

// CSS-based technical graphic component
const DataFlowGraphic = () => (
  <div className="relative w-full h-full min-h-[400px] border border-labBorder bg-labBgAlt overflow-hidden">
    {/* Grid background */}
    <div className="absolute inset-0" style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }} />
    
    {/* Animated data points */}
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Central hub */}
      <div className="relative">
        <motion.div 
          className="w-24 h-24 border-2 border-labFg rounded-full flex items-center justify-center bg-labBg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-mono text-xs text-labFg">RRC</span>
        </motion.div>
        
        {/* Orbiting dots */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-labAlert rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * Math.PI / 2) * 80, 0],
              y: [0, Math.sin(i * Math.PI / 2) * 80, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ transform: 'translate(-50%, -50%)', width: '200px', height: '200px', left: '50%', top: '50%' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.line
              key={i}
              x1="100"
              y1="100"
              x2={100 + Math.cos(angle * Math.PI / 180) * 80}
              y2={100 + Math.sin(angle * Math.PI / 180) * 80}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          ))}
        </svg>
      </div>
    </div>
    
    {/* Corner labels */}
    <div className="absolute top-4 left-4 font-mono text-xs text-labFgMuted">
      <div>DATA_FLOW</div>
      <div className="text-labAlert">ACTIVE</div>
    </div>
    <div className="absolute top-4 right-4 font-mono text-xs text-labFgMuted text-right">
      <div>FREQ: DAILY</div>
      <div>07:00 CST</div>
    </div>
    <div className="absolute bottom-4 left-4 font-mono text-xs text-labFgMuted">
      <div>SOURCE: TRC</div>
    </div>
    <div className="absolute bottom-4 right-4 font-mono text-xs text-labFgMuted text-right">
      <div>{">>>>>>>>>"}</div>
    </div>
  </div>
);

export const Features1 = () => {
  return (
    <section
      className="w-full bg-labBg py-16 md:py-24 relative"
      id="features"
    >
      {/* Section header bar */}
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
          <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">01</span>
          <span className="w-12 h-px bg-labBorder" />
          <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">FEATURES</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="font-mono text-xs text-labAlert uppercase tracking-widest mb-4">
              EMBRACE CONVENIENCE
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-labFg mb-6 leading-tight">
              Real-Time<br />Notifications
            </h2>
            <p className="text-labFgMuted text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              No more waiting in line at the post office or worrying about checking your mail while you're on vacation.
            </p>
            
            {/* Feature list */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.code}
                  className="flex items-center gap-4 p-4 border border-labBorder hover:border-labFg transition-colors group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  <span className="font-mono text-xs text-labFgMuted group-hover:text-labAlert transition-colors">
                    {feature.code}
                  </span>
                  <span className="w-px h-8 bg-labBorder" />
                  <div className="flex-1">
                    <span className="text-labFg font-medium block">{feature.text}</span>
                    <span className="text-labFgMuted text-sm">{feature.desc}</span>
                  </div>
                  <span className="font-mono text-labFgMuted group-hover:text-labFg transition-colors">
                    →
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - CSS graphic instead of images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            {/* Technical frame corners */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-labFg z-10" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-labFg z-10" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-labFg z-10" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-labFg z-10" />
            
            <DataFlowGraphic />
            
            <div className="font-mono text-xs text-labFgMuted mt-4 flex justify-between">
              <span>FIG. 02 — DATA PIPELINE</span>
              <span>/// AUTOMATED</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
