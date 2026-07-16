import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { SectionLabel } from "./Primitives.jsx";

const features = [
  { code: "RPT_001", text: "Daily email report", desc: "Delivered at 7:00 AM CST" },
  { code: "DTL_002", text: "All the necessary details", desc: "Lease, violation & remarks" },
  { code: "SUM_003", text: "Weekly summaries", desc: "A digest of all activity" },
  {
    code: "PRE_004",
    text: "Early warning",
    desc: "Certified letters, P-5 countdowns, and delinquent proration codes surface problems weeks before a severance order.",
  },
  {
    code: "RCA_005",
    text: "Root-cause analysis",
    desc: "Every alert explains why a lease was hit — P-5 lapse vs. delinquent W-10 vs. Rule 15 — and lists the purchasers and gatherers connected to it, so you know exactly who to call.",
  },
  {
    code: "REV_006",
    text: "Revenue-blocker checklist",
    desc: "Well producing but earning no allowable? We hand you the exact list of missing filings (W-2/G-1, directional survey, L-1, W-15) standing between you and first revenue.",
  },
];

const pipelineSources = [
  "SEVERANCE",
  "CERTIFIED",
  "P-5 RENEWAL",
  "RULE 15 / IWAR",
  "PRORATION",
  "COMMINGLE P-17",
  "DRILLING W-1",
  "GATHERER P-4",
];

const DataPipeline = () => (
  <div className="relative w-full h-full min-h-[420px] border border-lineStrong bg-card overflow-hidden p-5">
    <div
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10,20,40,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,20,40,0.05) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
    <div className="relative flex items-stretch gap-3 h-full min-h-[380px]">
      {/* Sources */}
      <div className="flex flex-col justify-between gap-2 w-[42%] z-10">
        {pipelineSources.map((s, i) => (
          <div
            key={s}
            className="pipe-src flex items-center gap-2 border border-lineStrong bg-parchment px-2.5 py-2"
          >
            <span className="font-mono text-[10px] text-signalRed w-4 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] text-labFg truncate">{s}</span>
          </div>
        ))}
      </div>

      {/* Connectors + engine + inbox */}
      <div className="relative flex-1">
        <svg
          viewBox="0 0 200 200"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          {[8, 26, 44, 62, 80, 98, 116, 134].map((y, i) => (
            <path
              key={i}
              className="pipe-line"
              d={`M0,${y + 4} C40,${y + 4} 60,100 96,100`}
              stroke="rgba(200,16,46,0.55)"
              strokeWidth="1"
              fill="none"
            />
          ))}
          <path
            className="pipe-out"
            d="M112,100 L168,100"
            stroke="#1F4FFF"
            strokeWidth="1.4"
            fill="none"
          />
        </svg>

        {/* Engine hexagon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-labFg" aria-hidden="true">
              <path
                d="M50 4 L90 27 L90 73 L50 96 L10 73 L10 27 Z"
                fill="#FFFFFF"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <div className="relative text-center px-2">
              <div className="font-mono text-[9px] leading-tight font-bold text-labFg">
                SCAN + DIFF
              </div>
              <div className="font-mono text-[9px] leading-tight font-bold text-labFg">ENGINE</div>
            </div>
          </div>
        </div>

        {/* Inbox */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <div className="w-14 h-12 border-2 border-cobalt flex items-center justify-center">
            <svg width="22" height="18" viewBox="0 0 24 20" fill="none" className="text-cobalt" aria-hidden="true">
              <rect x="2" y="2" width="20" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 3l10 8 10-8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="font-mono text-[9px] text-cobalt text-center mt-1">INBOX</div>
        </div>
      </div>
    </div>

    <div className="absolute top-4 right-4 font-mono text-[10px] tracking-wider text-labFgMuted text-right">
      <div>FREQ: DAILY</div>
      <div className="text-signalRed">07:00 CST</div>
    </div>
  </div>
);

const checklist = [
  { label: "W-2/G-1 completion report", status: "ACCEPTED", tone: "ok" },
  { label: "W-12 directional survey", status: "MISSING (required for horizontal wellbore)", tone: "bad" },
  { label: "L-1 electric log", status: "ON FILE", tone: "ok" },
  { label: "W-15 cementing report", status: "PENDING", tone: "warn" },
  { label: "P-15 / plat", status: "ON FILE", tone: "ok" },
];

const StatusIcon = ({ tone }) => {
  if (tone === "ok")
    return (
      <span className="w-7 h-7 rounded-full border-2 border-cobalt text-cobalt flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    );
  if (tone === "bad")
    return (
      <span className="w-7 h-7 rounded-full border-2 border-signalRed text-signalRed flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
      </span>
    );
  return (
    <span className="w-7 h-7 rounded-full border-2 border-labFgMuted text-labFgMuted flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 12h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
    </span>
  );
};

const AllowableChecklist = () => (
  <div className="w-full border border-lineStrong bg-card">
    <div className="px-5 py-4 border-b border-line">
      <div className="font-mono text-[13px] font-semibold text-signalRed tracking-wide">
        ALLOWABLE BLOCKER — WHY NO ALLOWABLE?
      </div>
    </div>
    <div className="px-5 py-4 border-b border-line">
      <div className="font-mono text-[10px] tracking-wider text-labFgMuted mb-1">LEASE</div>
      <div className="font-mono text-sm text-labFg mb-3">03-00701 MCFADDIN STATE — Well 14D</div>
      <span className="inline-block px-3 py-1.5 border border-signalRed/50 bg-signalSoft text-signalRed font-mono text-[11px] tracking-wide">
        NO ALLOWABLE (DLQ W-10)
      </span>
    </div>
    <div className="px-5 py-3">
      <div className="font-mono text-[10px] tracking-wider text-labFgMuted mb-2">FILING DEPENDENCIES</div>
      <div className="divide-y divide-line">
        {checklist.map((row) => (
          <div key={row.label} className="flex items-center gap-3 py-3">
            <StatusIcon tone={row.tone} />
            <div className="min-w-0">
              <div className="text-labFg text-sm">{row.label}</div>
              <div
                className={`font-mono text-[11px] ${
                  row.tone === "ok"
                    ? "text-cobalt"
                    : row.tone === "bad"
                    ? "text-signalRed"
                    : "text-labFgMuted"
                }`}
              >
                {row.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="px-5 py-4 border-t border-line flex items-center gap-2 font-mono text-[11px] text-signalRed">
      <span>(!)</span>
      <span>1 filing blocking first revenue.</span>
    </div>
  </div>
);

export const Features1 = () => {
  const root = useAnimeScope(({ self, reduceMotion, anime }) => {
    const { utils, animate, stagger, onScroll, svg } = anime;

    const cards = utils.$(".feature-card");
    if (cards.length) {
      if (!reduceMotion) {
        // Never hide product copy behind JavaScript. The scroll animation adds
        // spatial polish, while the visible default remains resilient.
        utils.set(cards, { translateY: 14 });
        animate(cards, {
          translateY: [14, 0],
          duration: 500,
          ease: "out(3)",
          delay: stagger(50),
          autoplay: onScroll({ target: ".features-grid", enter: "top 85%" }),
        });
      }
    }

    // Draw the pipeline connectors on scroll.
    if (svg && svg.createDrawable && !reduceMotion) {
      const lines = svg.createDrawable(".pipe-line, .pipe-out");
      utils.set(lines, { opacity: 0.7 });
      animate(lines, {
        draw: ["0 0", "0 1"],
        duration: 1400,
        delay: stagger(60),
        ease: "inOut(2)",
        autoplay: onScroll({ target: ".pipeline-figure", enter: "top 80%" }),
      });
    }
  }, []);

  return (
    <section ref={root} className="w-full bg-parchment py-16 md:py-24 relative" id="features">
      <div className="absolute top-0 left-0 right-0 h-px bg-line" />

      <div className="section-shell">
        <SectionLabel number="02" label="Features" className="mb-5" />

        <div className="max-w-3xl mb-12">
          <div className="mono-label text-signalRed mb-4">EMBRACE CONVENIENCE</div>
          <h2 className="font-display font-extrabold text-labFg text-display-sm">
            More than a mailbox
          </h2>
          <p className="mt-5 text-labFgMuted text-base md:text-lg leading-relaxed">
            We watch the Commission so you don't have to — then explain every alert,
            trace its root cause, and hand you the exact filings that stand between a
            well and first revenue.
          </p>
        </div>

        {/* Six feature cards */}
        <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
          {features.map((f) => (
            <div
              key={f.code}
              className="feature-card group bg-card p-6 flex flex-col hover:bg-parchmentAlt transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] text-signalRed">{f.code}</span>
                <span className="font-mono text-labFgMuted group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
              <h3 className="text-labFg font-semibold mb-2">{f.text}</h3>
              <p className="text-labFgMuted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Supporting visuals: pipeline + allowable checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-16 items-start">
          <div className="pipeline-figure relative">
            <span className="bracket -top-2 -left-2 border-l-2 border-t-2 border-labFg" />
            <span className="bracket -top-2 -right-2 border-r-2 border-t-2 border-labFg" />
            <span className="bracket -bottom-2 -left-2 border-l-2 border-b-2 border-labFg" />
            <span className="bracket -bottom-2 -right-2 border-r-2 border-b-2 border-labFg" />
            <DataPipeline />
            <div className="font-mono text-[11px] tracking-wider text-labFgMuted mt-4 flex justify-between">
              <span>FIG.02 — DATA PIPELINE</span>
              <span className="text-signalRed">/// AUTOMATED</span>
            </div>
          </div>

          <div className="relative">
            <AllowableChecklist />
            <div className="font-mono text-[11px] tracking-wider text-labFgMuted mt-4 flex justify-between">
              <span>FIG.03 — REVENUE BLOCKER</span>
              <span className="text-cobalt">/// RCA_005 &middot; REV_006</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
