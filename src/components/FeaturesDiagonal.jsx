import { motion } from "framer-motion";
import React from 'react';

// CSS-based alert timeline graphic
const AlertTimelineGraphic = () => (
  <div className="relative w-full h-full min-h-[400px] border border-white/20 bg-white/5 overflow-hidden">
    {/* Grid background */}
    <div className="absolute inset-0" style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }} />
    
    {/* Timeline visualization */}
    <div className="absolute inset-0 p-6">
      {/* Timeline line */}
      <div className="absolute left-12 top-16 bottom-16 w-px bg-white/20" />
      
      {/* Timeline events */}
      {[
        { time: "07:00", event: "RRC DATA SCAN", status: "complete" },
        { time: "07:05", event: "VIOLATIONS DETECTED", status: "alert" },
        { time: "07:10", event: "REPORT GENERATED", status: "complete" },
        { time: "07:15", event: "EMAIL DELIVERED", status: "complete" },
      ].map((item, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="w-8 font-mono text-xs text-white/40">{item.time}</div>
          <div className={`w-3 h-3 rounded-full ${item.status === 'alert' ? 'bg-labAlert' : 'bg-white/60'}`} />
          <div className="flex-1">
            <div className={`font-mono text-sm ${item.status === 'alert' ? 'text-labAlert' : 'text-white/80'}`}>
              {item.event}
            </div>
          </div>
          <motion.div
            className="font-mono text-xs text-white/40"
            animate={item.status === 'alert' ? { opacity: [0.4, 1, 0.4] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {item.status === 'alert' ? '● ALERT' : '✓ OK'}
          </motion.div>
        </motion.div>
      ))}
      
      {/* Animated pulse for current action */}
      <motion.div
        className="absolute bottom-8 left-8 right-8 border border-labAlert/30 bg-labAlert/10 p-4"
        animate={{ borderColor: ['rgba(75,156,211,0.3)', 'rgba(75,156,211,0.6)', 'rgba(75,156,211,0.3)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-labAlert">NEXT SCAN IN: 23:45:00</span>
          <span className="font-mono text-xs text-white/40">AUTO</span>
        </div>
      </motion.div>
    </div>
    
    {/* Corner labels */}
    <div className="absolute top-4 left-4 font-mono text-xs text-white/40">
      <div>TIMELINE</div>
    </div>
    <div className="absolute top-4 right-4 font-mono text-xs text-white/40 text-right">
      <div>CST</div>
    </div>
  </div>
);

export const FeaturesDiagonal = () => {
  const scrollToContactUs = () => {
    const contactUsSection = document.getElementById("contact-us");
    if (contactUsSection) {
      contactUsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-labFg py-16 md:py-24 relative overflow-hidden">
      {/* Technical grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-8 left-8 font-mono text-xs text-labBg/40 hidden lg:block">
        <div className="flex flex-col gap-1">
          <span>SECTION: 03</span>
          <span>TYPE: CTA</span>
          <span className="text-labAlert">{">>>>>>>>>"}</span>
        </div>
      </div>
      
      <div className="absolute top-8 right-8 font-mono text-xs text-labBg/40 text-right hidden lg:block">
        <div className="flex flex-col gap-1">
          <span>PRIORITY: HIGH</span>
          <span>ACTION: REQUIRED</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="font-mono text-xs text-labBg/60 uppercase tracking-widest">03</span>
          <span className="w-12 h-px bg-labBg/20" />
          <span className="font-mono text-xs text-labBg/60 uppercase tracking-widest">COMPLIANCE</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="font-mono text-xs text-labAlert uppercase tracking-widest mb-4">
              PROACTIVE COMPLIANCE MANAGEMENT
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-labBg mb-6 leading-tight">
              Stay Ahead of<br />Regulatory<br />Challenges
            </h2>
            <p className="text-labBg/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Our service empowers you with real-time alerts on potential compliance issues, ensuring you can address and resolve them promptly. Avoid well severance and maintain uninterrupted operations with our notification system.
            </p>
            
            <motion.button
              onClick={scrollToContactUs}
              className="px-8 py-4 bg-labAlert text-white font-mono text-sm uppercase tracking-wider hover:bg-white hover:text-labFg transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Now
            </motion.button>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="border-l-2 border-labBg/20 pl-4">
                <div className="font-mono text-xs text-labBg/50 mb-1">DELIVERY</div>
                <div className="text-3xl font-bold text-labBg">7AM</div>
              </div>
              <div className="border-l-2 border-labBg/20 pl-4">
                <div className="font-mono text-xs text-labBg/50 mb-1">UPTIME</div>
                <div className="text-3xl font-bold text-labBg">99.9%</div>
              </div>
            </div>
          </motion.div>

          {/* Right - CSS graphic instead of image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Technical frame */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-labBg/30 z-10" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-labBg/30 z-10" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-labBg/30 z-10" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-labBg/30 z-10" />
            
            <AlertTimelineGraphic />
            
            {/* Image label */}
            <div className="mt-4 flex items-center justify-between font-mono text-xs text-labBg/50">
              <span>FIG. 04 — DAILY PROCESS</span>
              <span>/// AUTOMATED</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
