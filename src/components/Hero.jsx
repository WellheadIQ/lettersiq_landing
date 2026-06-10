import { motion } from "framer-motion";
import dashboard from "../assets/images/dashboard.jpg";
import React from "react";

const monitored = [
  "DELINQUENT H-10",
  "WELL SEVERANCE",
  "FEE DUES",
  "STATEWIDE RULE 14",
  "P-4 FILINGS",
  "SEAL ORDERS",
];

const stats = [
  { label: "DELIVERY", value: "7AM", unit: "CST" },
  { label: "COVERAGE", value: "TEXAS", unit: "RRC" },
  { label: "MONITORING", value: "24/7", unit: "AUTO" },
  { label: "PRICE", value: "$4", unit: "/LEASE" },
];

export const Hero = () => {
  const scrollToContactUs = () => {
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="w-full flex flex-col relative overflow-hidden" id="home">
      {/* ---------- Dark stage ---------- */}
      <div className="relative w-full bg-ink pt-[68px] md:pt-20">
        {/* Ambient ember glow */}
        <div
          className="pointer-events-none absolute -top-40 right-0 w-[42rem] h-[42rem] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(224,86,14,0.35), transparent 60%)" }}
        />
        {/* Fine grid on the dark stage */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(120% 90% at 70% 0%, #000 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(120% 90% at 70% 0%, #000 30%, transparent 100%)",
          }}
        />

        <div className="section-shell relative pt-12 pb-16 md:pt-16 md:pb-24">
          {/* Status row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between gap-4 mb-10 md:mb-14 font-mono text-[11px] tracking-[0.16em]"
          >
            <div className="flex items-center gap-2 text-emberBright">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emberBright opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emberBright" />
              </span>
              SYSTEM&nbsp;ACTIVE
            </div>
            <div className="hidden sm:flex items-center gap-6 text-white/35">
              <span>SYS_ID: LIQ-2024</span>
              <span>REGION: TX</span>
              <span className="hidden md:inline">V 2.0</span>
            </div>
          </motion.div>

          {/* Headline */}
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-display-lg font-bold text-white"
            >
              Never miss a
              <br />
              severance letter{" "}
              <span className="relative inline-block text-ember">
                again.
                <motion.span
                  className="absolute left-0 -bottom-1 h-[3px] w-full bg-ember origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-7 max-w-2xl text-white/60 text-base md:text-lg leading-relaxed"
            >
              RRC violations delivered to your inbox every morning. Stay ahead of
              compliance issues and avoid costly severance actions from the Texas
              Railroad Commission.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-9 flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4"
            >
              <button onClick={scrollToContactUs} className="btn-ember">
                Get Started
                <span aria-hidden>→</span>
              </button>
              <a href="#features" className="btn-ghost-dark">
                See How It Works
              </a>
            </motion.div>
          </div>
        </div>

        {/* Monitored marquee strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative border-t border-white/10 py-4 overflow-hidden"
        >
          <div className="flex w-max animate-marquee gap-10 font-mono text-[11px] tracking-[0.18em] text-white/35">
            {[...monitored, ...monitored, ...monitored].map((m, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap">
                <span className="text-ember/70">›</span> {m}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---------- Light stage: dashboard ---------- */}
      <div className="w-full bg-paper py-16 md:py-24">
        <div className="section-shell">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Caption */}
            <div className="flex items-center gap-3 mb-5 font-mono text-[11px] tracking-[0.16em] text-labFgMuted">
              <span className="text-labFg font-semibold">FIG.01</span>
              <span className="w-10 h-px bg-labBorderStrong" />
              <span>DASHBOARD INTERFACE</span>
              <span className="ml-auto hidden sm:inline">REAL-TIME</span>
            </div>

            {/* Framed dashboard */}
            <div className="relative">
              <span className="bracket -top-2 -left-2 border-l-2 border-t-2 border-labFg" />
              <span className="bracket -top-2 -right-2 border-r-2 border-t-2 border-labFg" />
              <span className="bracket -bottom-2 -left-2 border-l-2 border-b-2 border-labFg" />
              <span className="bracket -bottom-2 -right-2 border-r-2 border-b-2 border-labFg" />

              <div className="relative border border-labBorderStrong bg-white p-2 md:p-3 shadow-panelLg overflow-hidden">
                {/* Scanning sweep */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
                  <div className="absolute top-0 bottom-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-ember/10 to-transparent" />
                </div>
                <img src={dashboard} alt="LettersIQ monitoring dashboard" className="w-full h-auto block" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-10 md:mt-14 bg-labBorder border border-labBorder">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-paper px-5 py-6">
                  <div className="font-mono text-[11px] tracking-[0.16em] text-labFgMuted mb-2">
                    {stat.label}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-2xl md:text-3xl text-labFg tracking-tight">
                      {stat.value}
                    </span>
                    <span className="font-mono text-xs text-ember">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
