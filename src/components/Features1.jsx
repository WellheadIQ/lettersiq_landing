import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { SectionLabel } from "./Primitives.jsx";

const features = [
  {
    text: "One ranked briefing",
    desc: "Daily at 7:00 AM CT, with lease, violation, remarks, and a weekly activity summary.",
  },
  {
    text: "Early warning",
    desc: "Certified letters, P-5 countdowns, and delinquent proration codes surface problems weeks before a severance order.",
  },
  {
    text: "Root cause to next action",
    desc: "Every alert explains why a lease was hit, who to call, and which filing stands between the well and first revenue.",
  },
];

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
      <div className="mb-1 font-mono text-xs text-labFgMuted">Lease</div>
      <div className="font-mono text-sm text-labFg mb-3">03-00701 MCFADDIN STATE — Well 14D</div>
      <span className="inline-block border border-signalRed/50 bg-signalSoft px-3 py-1.5 font-mono text-xs text-signalRed">
        NO ALLOWABLE (DLQ W-10)
      </span>
    </div>
    <div className="px-5 py-3">
      <div className="mb-2 font-mono text-xs text-labFgMuted">Filing dependencies</div>
      <div className="divide-y divide-line">
        {checklist.map((row) => (
          <div key={row.label} className="flex items-center gap-3 py-3">
            <StatusIcon tone={row.tone} />
            <div className="min-w-0">
              <div className="text-labFg text-sm">{row.label}</div>
              <div
                className={`font-mono text-xs ${
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
    <div className="flex items-center gap-2 border-t border-line px-5 py-4 text-sm text-signalRed">
      <span>(!)</span>
      <span>1 filing blocking first revenue.</span>
    </div>
  </div>
);

export const Features1 = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    const { utils, animate, stagger, onScroll } = anime;

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

  }, []);

  return (
    <section ref={root} className="w-full bg-parchment py-16 md:py-24 relative" id="features">
      <div className="absolute top-0 left-0 right-0 h-px bg-line" />

      <div className="section-shell">
        <SectionLabel label="What you get" className="mb-5" />

        <div className="max-w-3xl mb-12">
          <h2 className="font-display font-extrabold text-labFg text-display-sm tracking-[-0.02em]">
            More than a mailbox.
          </h2>
          <p className="mt-5 text-labFgMuted text-base md:text-lg leading-relaxed">
            We watch the Commission so you don't have to — then explain every alert,
            trace its root cause, and hand you the exact filings that stand between a
            well and first revenue.
          </p>
        </div>

        {/* Outcome-led feature list */}
        <div className="features-grid grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.text}
              className="feature-card border-t border-line py-6"
            >
              <h3 className="font-semibold text-labFg">{f.text}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-labFgMuted">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* One concrete product artifact; the preceding primer already explains the pipeline. */}
        <div className="mt-14 max-w-3xl">
          <div className="relative">
            <AllowableChecklist />
            <div className="mt-4 text-sm text-labFgMuted">
              Why a producing well earns nothing
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
