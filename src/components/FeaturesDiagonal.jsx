import React from "react";
import briefingEmail from "../assets/images/liq-daily-briefing-email.png";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { SectionLabel } from "./Primitives.jsx";

const timeline = [
  { time: "07:00", event: "RRC MULTI-DATASET SCAN", status: "ok" },
  { time: "07:03", event: "PRORATION + SEVERANCE DIFF", status: "ok" },
  { time: "07:05", event: "CHANGES DETECTED", status: "alert" },
  { time: "07:10", event: "ROOT-CAUSE + BRIEFING BUILT", status: "ok" },
  { time: "07:15", event: "EMAIL DELIVERED", status: "ok" },
];

const stats = [
  { label: "DELIVERY", value: "7AM", unit: "CST" },
  { label: "UPTIME", value: "99.9%", unit: "" },
  { label: "DATASETS", value: "8", unit: "" },
  { label: "COVERAGE", value: "TX", unit: "RRC" },
];

// P-5 renewal countdown milestone track.
const milestones = [
  { day: "60", state: "passed" },
  { day: "30", state: "passed" },
  { day: "14", state: "current" },
  { day: "7", state: "upcoming" },
];

const P5Countdown = () => (
  <div className="relative w-full border border-lineDarkStrong bg-midnight overflow-hidden p-6">
    <div className="font-mono text-[10px] tracking-wider text-white/45 mb-6">
      FIG.05 — RENEWAL COUNTDOWN /// AUTOMATED
    </div>

    {/* Milestone track */}
    <div className="relative flex items-center justify-between mb-8 px-2">
      <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-cobalt via-[#F0B429] to-signalRed" />
      {milestones.map((m) => {
        const color =
          m.state === "passed"
            ? "text-cobalt border-cobalt"
            : m.state === "current"
            ? "text-[#F0B429] border-[#F0B429]"
            : "text-signalRed border-signalRed";
        return (
          <div key={m.day} className="relative flex flex-col items-center gap-2 z-10">
            <span className={`font-mono text-lg font-bold ${color.split(" ")[0]}`}>{m.day}</span>
            <span className="font-mono text-[9px] text-white/45">DAYS</span>
            <span
              className={`w-6 h-6 rounded-full bg-midnight border-2 flex items-center justify-center ${color} ${
                m.state === "current" ? "p5-current" : ""
              }`}
            >
              {m.state === "passed" ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              )}
            </span>
            <span className="font-mono text-[8px] uppercase text-white/35">
              {m.state === "current" ? "current" : m.state}
            </span>
          </div>
        );
      })}
    </div>

    {/* Readout */}
    <div className="border border-dashed border-white/20 py-5 text-center mb-5">
      <div className="font-mono text-2xl md:text-3xl font-bold text-white tracking-wide">
        P-5 EXPIRES IN <span className="text-[#F0B429]">14</span> DAYS
      </div>
      <div className="font-mono text-[11px] text-white/45 mt-2">
        02/01/2027 — MCFADDIN OPERATING LLC
      </div>
    </div>

    <div className="flex items-center gap-2 font-mono text-[11px] text-[#F0B429] mb-4">
      <span>(!)</span>
      <span>An unrenewed P-5 severs every lease you operate.</span>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2 border border-cobalt/40 bg-cobaltSoft px-3 py-2 font-mono text-[11px] text-cobalt">
        <span className="w-1.5 h-1.5 rounded-full bg-cobalt" /> STATUS: ACTIVE
      </div>
      <div className="flex items-center gap-2 border border-signalRed/40 bg-signalSoft px-3 py-2 font-mono text-[11px] text-signalRed">
        (!) 9 WELLS STILL LACK W-3X
      </div>
    </div>
  </div>
);

const AlertTimelineGraphic = () => (
  <div className="relative w-full border border-white/15 bg-white/[0.03] overflow-hidden">
    <div
      className="absolute inset-0 opacity-70"
      style={{
        backgroundImage:
          "linear-gradient(rgba(250,251,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(250,251,255,0.04) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
    <div className="relative p-6 pt-12">
      <div className="absolute top-4 left-4 font-mono text-[10px] tracking-wider text-white/40">TIMELINE</div>
      <div className="absolute top-4 right-4 font-mono text-[10px] tracking-wider text-white/40">CST</div>
      <div className="absolute left-[4.25rem] top-14 bottom-24 w-px bg-white/15" />

      {timeline.map((item, index) => {
        const isAlert = item.status === "alert";
        return (
          <div key={index} className="tl-row opacity-0 flex items-center gap-4 mb-6 relative">
            <div className="w-10 font-mono text-[11px] text-white/40">{item.time}</div>
            <div
              className={`w-3 h-3 rounded-full shrink-0 ${
                isAlert ? "bg-signalRed ring-4 ring-signalRed/20" : "bg-white/60"
              }`}
            />
            <div
              className={`flex-1 font-mono text-[11px] sm:text-xs ${
                isAlert ? "text-signalBright" : "text-white/80"
              }`}
            >
              {item.event}
            </div>
            <div
              className={`font-mono text-[11px] whitespace-nowrap ${
                isAlert ? "text-signalBright tl-alert" : "text-white/40"
              }`}
            >
              {isAlert ? "● ALERT" : "✓ OK"}
            </div>
          </div>
        );
      })}

      <div className="tl-next mt-2 border border-signalRed/30 bg-signalRed/[0.08] p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-signalBright">NEXT SCAN: 23:45:00</span>
          <span className="font-mono text-[11px] text-white/40">AUTO</span>
        </div>
      </div>
    </div>
  </div>
);

export const FeaturesDiagonal = () => {
  const root = useAnimeScope(({ self, reduceMotion, anime }) => {
    const { utils, animate, stagger, onScroll } = anime;

    const rows = utils.$(".tl-row");
    if (rows.length) {
      if (reduceMotion) {
        utils.set(rows, { opacity: 1, translateX: 0 });
      } else {
        utils.set(rows, { opacity: 0, translateX: -16 });
        animate(rows, {
          opacity: [0, 1],
          translateX: [-16, 0],
          duration: 480,
          ease: "out(3)",
          delay: stagger(120),
          autoplay: onScroll({ target: ".timeline-figure", enter: "top 82%" }),
        });
      }
    }

    if (!reduceMotion) {
      animate(".tl-alert", {
        opacity: [0.4, 1, 0.4],
        duration: 1500,
        loop: true,
        ease: "inOutSine",
      });
      animate(".p5-current", {
        boxShadow: [
          "0 0 0 0 rgba(240,180,41,0.4)",
          "0 0 0 8px rgba(240,180,41,0)",
        ],
        duration: 1800,
        loop: true,
        ease: "out(2)",
      });
    }
  }, []);

  const scrollToContactUs = () => {
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={root} className="w-full bg-oxford py-16 md:py-24 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -bottom-40 -left-20 w-[36rem] h-[36rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(31,79,255,0.4), transparent 60%)" }}
      />
      <div className="absolute inset-0 opacity-[0.4]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(250,251,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(250,251,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="section-shell relative z-10">
        <SectionLabel number="05" label="Compliance" tone="dark" className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Content */}
          <div>
            <div className="mono-label text-signalBright mb-4">PROACTIVE COMPLIANCE</div>
            <h2 className="font-display font-extrabold text-white text-display-sm leading-[1.0]">
              Stay ahead of every regulatory challenge — not just the mailbox.
            </h2>
            <p className="mt-5 text-white/60 text-base md:text-lg leading-relaxed max-w-lg">
              Real-time alerts across severance, P-5, Rule 15, proration, commingling,
              permits, and purchaser filings let you resolve issues before they
              interrupt production. One briefing. Every operator you run. Every morning.
            </p>

            <button onClick={scrollToContactUs} className="btn-ember mt-8">
              Get Started
              <span aria-hidden>&rarr;</span>
            </button>

            {/* Stat tiles */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10">
              {stats.map((stat, i) => (
                <div key={stat.label} className="bg-oxford px-4 py-5">
                  <div className="font-mono text-[10px] tracking-wider text-white/45 mb-1.5">
                    {stat.label}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    {stat.unit && (
                      <span className="font-mono text-[11px] text-signalBright">{stat.unit}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="timeline-figure relative mt-10">
              <span className="bracket -top-2 -left-2 border-l-2 border-t-2 border-white/30" />
              <span className="bracket -top-2 -right-2 border-r-2 border-t-2 border-white/30" />
              <span className="bracket -bottom-2 -left-2 border-l-2 border-b-2 border-white/30" />
              <span className="bracket -bottom-2 -right-2 border-r-2 border-b-2 border-white/30" />
              <AlertTimelineGraphic />
              <div className="mt-4 flex items-center justify-between font-mono text-[11px] tracking-wider text-white/45">
                <span>FIG.06 — DAILY PROCESS</span>
                <span className="text-signalBright">/// AUTOMATED</span>
              </div>
            </div>
          </div>

          {/* Right column: P-5 countdown + briefing email proof */}
          <div className="space-y-10">
            <P5Countdown />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-wider text-white/45">
                <span className="text-white font-semibold">FIG.07</span>
                <span className="w-10 h-px bg-white/25" />
                <span>THE 7 AM BRIEFING</span>
              </div>
              <div className="relative border border-white/15 bg-midnight shadow-panelLg overflow-hidden">
                <div className="flex items-center gap-2 px-4 h-8 border-b border-white/10 bg-white/[0.03]">
                  <span className="w-2 h-2 rounded-full bg-signalRed/80" />
                  <span className="w-2 h-2 rounded-full bg-white/25" />
                  <span className="w-2 h-2 rounded-full bg-cobalt/70" />
                  <span className="ml-3 font-mono text-[10px] tracking-wider text-white/35">
                    inbox — 07:00 CST
                  </span>
                </div>
                <img
                  src={briefingEmail}
                  alt="LettersIQ daily RRC compliance briefing email listing severity-ranked alerts for an operator"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
