import { motion } from "framer-motion";
import React from "react";

const timeline = [
  { time: "07:00", event: "RRC DATA SCAN", status: "complete" },
  { time: "07:05", event: "VIOLATIONS DETECTED", status: "alert" },
  { time: "07:10", event: "REPORT GENERATED", status: "complete" },
  { time: "07:15", event: "EMAIL DELIVERED", status: "complete" },
];

const AlertTimelineGraphic = () => (
  <div className="relative w-full h-full min-h-[380px] border border-white/15 bg-white/[0.03] overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />

    <div className="relative p-6 pt-14">
      <div className="absolute left-[4.25rem] top-16 bottom-24 w-px bg-white/15" />

      {timeline.map((item, index) => {
        const isAlert = item.status === "alert";
        return (
          <motion.div
            key={index}
            className="flex items-center gap-4 mb-7 relative"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="w-10 font-mono text-[11px] text-white/40">{item.time}</div>
            <div
              className={`w-3 h-3 rounded-full shrink-0 ${
                isAlert ? "bg-ember ring-4 ring-ember/20" : "bg-white/60"
              }`}
            />
            <div
              className={`flex-1 font-mono text-xs sm:text-sm ${
                isAlert ? "text-emberBright" : "text-white/80"
              }`}
            >
              {item.event}
            </div>
            <motion.div
              className="font-mono text-[11px] text-white/40 whitespace-nowrap"
              animate={isAlert ? { opacity: [0.4, 1, 0.4] } : {}}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              {isAlert ? "● ALERT" : "✓ OK"}
            </motion.div>
          </motion.div>
        );
      })}

      <motion.div
        className="mt-2 border border-ember/30 bg-ember/[0.08] p-4"
        animate={{ borderColor: ["rgba(224,86,14,0.3)", "rgba(224,86,14,0.6)", "rgba(224,86,14,0.3)"] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-emberBright">NEXT SCAN: 23:45:00</span>
          <span className="font-mono text-[11px] text-white/40">AUTO</span>
        </div>
      </motion.div>
    </div>

    <div className="absolute top-4 left-4 font-mono text-[10px] tracking-wider text-white/40">
      TIMELINE
    </div>
    <div className="absolute top-4 right-4 font-mono text-[10px] tracking-wider text-white/40">
      CST
    </div>
  </div>
);

export const FeaturesDiagonal = () => {
  const scrollToContactUs = () => {
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="w-full bg-ink py-16 md:py-24 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -bottom-40 -left-20 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(224,86,14,0.4), transparent 60%)" }}
      />
      <div className="absolute inset-0 opacity-[0.4]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="section-shell relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mono-label text-white/55 mb-12"
        >
          <span className="text-emberBright">03</span>
          <span className="w-8 h-px bg-white/25" />
          <span>Compliance</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mono-label text-emberBright mb-4">PROACTIVE COMPLIANCE</div>
            <h2 className="text-display-sm font-bold text-white leading-[1.05]">
              Stay ahead of
              <br />
              regulatory
              <br />
              challenges
            </h2>
            <p className="mt-5 text-white/60 text-base md:text-lg leading-relaxed max-w-lg">
              Real-time alerts on potential compliance issues let you address and
              resolve them promptly. Avoid well severance and keep operations running
              without interruption.
            </p>

            <button onClick={scrollToContactUs} className="btn-ember mt-8">
              Get Started Now
              <span aria-hidden>→</span>
            </button>

            <div className="mt-12 grid grid-cols-2 gap-6 max-w-md">
              <div className="border-l-2 border-ember pl-4">
                <div className="font-mono text-[11px] tracking-wider text-white/45 mb-1">DELIVERY</div>
                <div className="text-3xl font-bold text-white">7AM</div>
              </div>
              <div className="border-l-2 border-white/20 pl-4">
                <div className="font-mono text-[11px] tracking-wider text-white/45 mb-1">UPTIME</div>
                <div className="text-3xl font-bold text-white">99.9%</div>
              </div>
            </div>
          </motion.div>

          {/* Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <span className="bracket -top-2 -left-2 border-l-2 border-t-2 border-white/30" />
            <span className="bracket -top-2 -right-2 border-r-2 border-t-2 border-white/30" />
            <span className="bracket -bottom-2 -left-2 border-l-2 border-b-2 border-white/30" />
            <span className="bracket -bottom-2 -right-2 border-r-2 border-b-2 border-white/30" />

            <AlertTimelineGraphic />

            <div className="mt-4 flex items-center justify-between font-mono text-[11px] tracking-wider text-white/45">
              <span>FIG.04 — DAILY PROCESS</span>
              <span className="text-emberBright">/// AUTOMATED</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
