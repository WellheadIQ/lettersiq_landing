import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { settle } from "../lib/motion.js";
import { duration } from "../lib/motionTokens.js";
import { SectionLabel } from "./Primitives.jsx";

const daily = [
  {
    title: "Severance & seal orders",
    body: "The original signal — plus an all-clear the day a lease is back in business.",
  },
  {
    title: "Certified letters",
    body: "The last warning the Commission sends before a severance order. Catch it while there's still time to cure.",
  },
  {
    title: "Proration schedules",
    body: "Delinquent codes (DLQ W-10, DLQ FORM, H-15 VIOL) and allowable changes, diffed off the schedule every day.",
  },
];

const weekly = [
  {
    title: "P-5 renewal",
    body: "A 60 / 30 / 14 / 7-day countdown to your organization report expiry. An unrenewed P-5 severs every lease you have.",
  },
  {
    title: "Rule 15 / inactive wells",
    body: "5- and 10-year inactivity milestones, W-3X extension status, and wells that newly hit the inactive aging report.",
  },
  {
    title: "Surface commingling (P-17)",
    body: "Blast-radius monitoring — a severance on any lease sharing your commingle stops your production too.",
  },
  {
    title: "Drilling permits (W-1)",
    body: "A countdown to the 2-year no-spud expiry, verified against the wellbore record so you're only warned on undrilled permits.",
  },
  {
    title: "Gatherer / purchaser (P-4)",
    body: "Lost market outlets and operator-of-record transfers the day the Commission processes them.",
  },
];

const CoverageColumn = ({ cadence, items, accent }) => (
  <div className="coverage-col min-w-0">
    <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <h3 className="font-display text-lg font-bold tracking-[-0.01em] text-labFg">
        {cadence}
      </h3>
      <span className={`font-mono text-xs tabular-nums ${accent}`}>
        {items.length} datasets
      </span>
    </div>
    <ul className="space-y-0">
      {items.map((item) => (
        <li
          key={item.title}
          className="coverage-row border-b border-line py-5 last:border-b-0"
        >
          <div className="text-sm font-semibold text-labFg">{item.title}</div>
          <p className="mt-1.5 max-w-md text-pretty text-[15px] leading-relaxed text-labFgMuted">
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

export const Coverage = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    if (reduceMotion) return;
    settle(anime, anime.utils.$(".coverage-row"), {
      trigger: ".coverage-board",
      stagger: duration.stagger,
    });
  }, []);

  return (
    <section
      ref={root}
      id="coverage"
      className="relative w-full bg-parchment py-16 md:py-24"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-line" />

      <div className="section-shell">
        <SectionLabel label="Eight connected RRC systems" className="mb-5" />

        <div className="mb-12 max-w-3xl">
          <h2 className="text-balance font-display text-display-sm font-extrabold tracking-[-0.02em] text-labFg">
            Stop checking the RRC. Start managing the exceptions.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-labFgMuted md:text-lg">
            We monitor regulatory activity across your operating portfolio,
            connect records that live in separate systems, and surface only what
            changed. Your team handles the handful of issues that need attention.
          </p>
        </div>

        {/* Full inventory, grouped by scan cadence — nothing tucked behind a click */}
        <div className="coverage-board grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <CoverageColumn
            cadence="Daily"
            items={daily}
            accent="text-signalRed"
          />
          <CoverageColumn
            cadence="Weekly"
            items={weekly}
            accent="text-cobaltText"
          />
        </div>
      </div>
    </section>
  );
};
