import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { usePointerTilt } from "../hooks/usePointerTilt.js";
import { settle } from "../lib/motion.js";
import { duration } from "../lib/motionTokens.js";
import { SectionLabel } from "./Primitives.jsx";

const outcomes = [
  {
    title: "Prevent production interruptions",
    body: "Catch certified letters, P-5 deadlines, delinquent proration codes, and Rule 15 issues while there is still time to act.",
  },
  {
    title: "Get wells to first sales faster",
    body: "Trace a missing allowable back through its filing dependencies so your team knows what to chase instead of where to search.",
  },
  {
    title: "Reduce manual monitoring",
    body: "Replace spreadsheets and operator-by-operator searches with one ranked list of the changes that require attention.",
  },
  {
    title: "De-risk asset acquisitions",
    body: "Run acquired Texas properties through LettersIQ before or immediately after closing to surface inherited regulatory obligations and connected exposure.",
  },
];

const checklist = [
  {
    label: "W-2/G-1 completion report",
    status: "Accepted",
    tone: "ok",
  },
  {
    label: "W-12 directional survey",
    status: "Missing — required for horizontal wellbore",
    tone: "bad",
  },
  {
    label: "L-1 electric log",
    status: "On file",
    tone: "ok",
  },
  {
    label: "W-15 cementing report",
    status: "Pending",
    tone: "warn",
  },
  {
    label: "P-15 / plat",
    status: "On file",
    tone: "ok",
  },
];

const statusStyle = {
  ok: "text-cobaltInk",
  bad: "text-signalInk",
  warn: "text-panelInkMuted",
};

const StatusMark = ({ tone }) => {
  if (tone === "ok") {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center border border-cobaltInk text-cobaltInk"
        aria-hidden="true"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (tone === "bad") {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center border border-signalInk text-signalInk"
        aria-hidden="true"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center border border-panelInkMuted text-panelInkMuted"
      aria-hidden="true"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M6 12h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
};

/** Product artifact: the revenue-blocker checklist from a real briefing. */
const AllowableChecklist = () => {
  const panel = usePointerTilt({ max: 3.5, lift: 10 });

  return (
  <figure className="blocker-figure w-full">
    <div
      ref={panel}
      className="tilt-surface relative overflow-hidden rounded-[3px] border border-white/20 bg-panelLight text-panelInk shadow-float"
    >
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="h-2 w-2 bg-signalRed" aria-hidden="true" />
          Allowable blocker
        </div>
        <span className="font-mono text-xs font-semibold text-signalInk">Blocking</span>
      </div>

      <div className="border-b border-black/10 px-5 py-4">
        <div className="text-xs text-panelInkMuted">Lease</div>
        <div className="mt-1 font-mono text-sm font-medium tabular-nums">
          03-00701 MCFADDIN STATE — Well 14D
        </div>
        <p className="mt-3 inline-block border border-signalRed/40 bg-signalSoft px-3 py-1.5 text-xs font-semibold text-signalInk">
          No allowable (DLQ W-10)
        </p>
      </div>

      <div className="px-5 py-2">
        <div className="pt-2 text-xs text-panelInkMuted">Filing dependencies</div>
        <ul className="divide-y divide-black/[0.07]">
          {checklist.map((row) => (
            <li key={row.label} className="flex items-start gap-3 py-3.5">
              <StatusMark tone={row.tone} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-panelInk">{row.label}</div>
                <div className={`mt-0.5 font-mono text-xs ${statusStyle[row.tone]}`}>
                  {row.status}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Consequence, then the record, then the move — the same three lines the
          product uses everywhere a finding is shown. */}
      <div className="border-t border-black/10 px-5 py-4">
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-signalInk">
          First sales blocked
        </div>
        <div className="mt-1.5 text-sm font-semibold text-panelInk">
          W-12 missing
        </div>
        <div className="mt-1 text-sm text-panelInkMuted">
          Next action: chase the directional survey
        </div>
      </div>

      <span className="tilt-sheen" aria-hidden="true" />
    </div>
    <figcaption className="mt-4 text-sm text-labFgMuted">
      Example from a producing well with no allowable
    </figcaption>
  </figure>
  );
};

export const Features1 = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    if (reduceMotion) return;
    settle(anime, anime.utils.$(".outcome-beat"), {
      trigger: ".outcomes-list",
      stagger: duration.micro,
    });
    settle(anime, anime.utils.$(".blocker-figure"), {
      trigger: ".blocker-figure",
      enter: "90% top",
    });
  }, []);

  return (
    <section
      ref={root}
      id="features"
      className="relative w-full bg-parchment py-16 md:py-24"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-line" />

      <div className="section-shell">
        <SectionLabel label="Operational outcomes" className="mb-5" />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Narrative — one job: explain why this is more than mail */}
          <div>
            <h2 className="max-w-xl font-display text-display-sm font-extrabold tracking-[-0.02em] text-labFg">
              From regulatory issue to economic impact.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-labFgMuted md:text-lg">
              Not every compliance issue matters equally. LettersIQ prioritizes
              the changes that can interfere with production, first sales, and
              upcoming operating deadlines.
            </p>

            <ul className="outcomes-list mt-10 space-y-0 border-t border-line">
              {outcomes.map((item) => (
                <li
                  key={item.title}
                  className="outcome-beat border-b border-line py-5"
                >
                  <h3 className="font-display text-lg font-bold tracking-[-0.01em] text-labFg">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-labFgMuted">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Artifact — the proof */}
          <div className="lg:pt-2">
            <AllowableChecklist />
          </div>
        </div>
      </div>
    </section>
  );
};
