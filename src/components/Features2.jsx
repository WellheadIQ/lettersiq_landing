import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { SectionLabel } from "./Primitives.jsx";

const features = [
  { text: "Multi-lease management", code: "MLM_001", icon: "◆" },
  { text: "One briefing for every operator you run", code: "OPS_002", icon: "◇" },
  { text: "Only what changed since yesterday", code: "DIF_003", icon: "○" },
];

const TEXAS_RADAR =
  "M52,44 L112,44 L112,36 L150,36 L152,74 L182,80 L204,112 L196,126 L210,148 L202,180 L168,180 L162,180 L154,208 L134,180 L112,180 L112,146 L70,146 L70,98 L52,98 Z";

// Plotted lease points; a few flagged as violations (red).
const points = [
  { x: 96, y: 70, hot: true },
  { x: 120, y: 62 },
  { x: 84, y: 104, hot: false },
  { x: 150, y: 96, hot: true },
  { x: 110, y: 120 },
  { x: 138, y: 150, hot: true },
  { x: 130, y: 96 },
  { x: 100, y: 150 },
];

const MonitoringRadar = () => (
  <div className="relative w-full aspect-square max-w-[440px] mx-auto border border-lineDarkStrong bg-midnight overflow-hidden">
    <div
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          "linear-gradient(rgba(250,251,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(250,251,255,0.05) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
    <svg viewBox="0 0 256 256" className="absolute inset-0 w-full h-full" aria-hidden="true">
      {/* Range rings */}
      {[40, 78, 116].map((r) => (
        <circle key={r} cx="128" cy="128" r={r} fill="none" stroke="rgba(200,16,46,0.18)" strokeWidth="0.6" />
      ))}
      <line x1="128" y1="12" x2="128" y2="244" stroke="rgba(250,251,255,0.08)" strokeWidth="0.6" />
      <line x1="12" y1="128" x2="244" y2="128" stroke="rgba(250,251,255,0.08)" strokeWidth="0.6" />

      {/* Texas outline */}
      <path d={TEXAS_RADAR} fill="rgba(200,16,46,0.05)" stroke="rgba(200,16,46,0.55)" strokeWidth="1" />

      {/* Rotating sweep wedge */}
      <g className="radar-sweep" style={{ transformOrigin: "128px 128px" }}>
        <defs>
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(200,16,46,0)" />
            <stop offset="100%" stopColor="rgba(200,16,46,0.35)" />
          </linearGradient>
        </defs>
        <path d="M128,128 L128,20 A108,108 0 0,1 210,74 Z" fill="url(#sweepGrad)" />
        <line x1="128" y1="128" x2="128" y2="20" stroke="#E8354F" strokeWidth="1" />
      </g>

      {/* Plotted points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            className="radar-dot"
            cx={p.x + 24}
            cy={p.y + 12}
            r={p.hot ? 3.4 : 2}
            fill={p.hot ? "#E8354F" : "#F0B429"}
          />
          {p.hot && (
            <circle
              className="radar-ping"
              cx={p.x + 24}
              cy={p.y + 12}
              r="3.4"
              fill="none"
              stroke="#E8354F"
              strokeWidth="1"
            />
          )}
        </g>
      ))}
      <circle cx="128" cy="128" r="3" fill="#E8354F" />
    </svg>

    <div className="absolute top-3 left-3 font-mono text-[10px] tracking-wider text-white/45 leading-relaxed">
      <div>SCAN_MODE: <span className="text-signalBright">ACTIVE</span></div>
      <div>LEASES: ALL</div>
      <div>COVERAGE: TX</div>
    </div>
    <div className="absolute top-3 right-3 font-mono text-[10px] tracking-wider text-white/45 text-right">
      VIOLATIONS: <span className="text-signalBright">3</span>
    </div>
    <div className="absolute bottom-3 right-3 font-mono text-[10px] tracking-wider text-signalBright/80 text-right">
      FIG.04 — MONITORING RADAR
    </div>
  </div>
);

export const Features2 = () => {
  const root = useAnimeScope(({ self, reduceMotion, anime }) => {
    const { utils, animate } = anime;

    if (reduceMotion) {
      utils.set(".radar-sweep", { rotate: 45 });
      return;
    }

    animate(".radar-sweep", {
      rotate: [0, 360],
      duration: 5200,
      loop: true,
      ease: "linear",
    });

    animate(".radar-ping", {
      opacity: [0.9, 0],
      scale: [1, 3],
      duration: 2200,
      loop: true,
      ease: "out(2)",
      delay: anime.stagger(500),
    });
  }, []);

  return (
    <section ref={root} className="w-full bg-parchmentAlt py-16 md:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-line" />

      <div className="section-shell">
        <SectionLabel number="03" label="Monitoring" className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Radar */}
          <div className="order-last lg:order-first relative">
            <MonitoringRadar />
            <div className="font-mono text-[11px] tracking-wider text-labFgMuted mt-4 flex justify-between max-w-[440px] mx-auto">
              <span>STATEWIDE COVERAGE</span>
              <span className="text-signalRed">/// REAL-TIME</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="mono-label text-signalRed mb-4">STAY INFORMED & COMPLIANT</div>
            <h2 className="font-display font-extrabold text-labFg text-display-sm leading-[1.0]">
              Operator-centric updates
            </h2>
            <p className="mt-5 text-labFgMuted text-base md:text-lg leading-relaxed max-w-lg">
              Comprehensive monitoring for every lease you operate across Texas —
              consolidated into one clear daily briefing that surfaces only what
              changed.
            </p>

            <div className="mt-8 border border-line bg-card divide-y divide-line">
              {features.map((feature) => (
                <div
                  key={feature.code}
                  className="flex items-center gap-4 p-4 hover:bg-parchmentAlt transition-colors group"
                >
                  <span className="w-9 h-9 border border-line flex items-center justify-center font-mono text-sm text-labFgMuted group-hover:border-signalRed group-hover:text-signalRed transition-colors shrink-0">
                    {feature.icon}
                  </span>
                  <span className="text-labFg flex-1">{feature.text}</span>
                  <span className="font-mono text-[11px] text-labFgMuted">{feature.code}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 font-mono text-[11px] tracking-wider text-labFgMuted">
              <span className="text-signalRed">{">>>>>"}</span>
              <span>COMPREHENSIVE MONITORING SYSTEM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-line" />
    </section>
  );
};
