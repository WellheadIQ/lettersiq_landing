import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { SectionLabel, StarMark } from "./Primitives.jsx";

const Icon = ({ children }) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const sources = [
  {
    code: "SRC_001",
    title: "SEVERANCE & SEAL ORDERS",
    body: "The original signal — plus an all-clear the day a lease is back in business.",
    tone: "red",
    icon: (
      <Icon>
        <path d="M9 4h9l5 5v19H9z" />
        <path d="M18 4v5h5" />
        <circle cx="15" cy="19" r="3" />
        <path d="M15 22v4" />
      </Icon>
    ),
  },
  {
    code: "SRC_002",
    title: "CERTIFIED LETTERS",
    body: "The last warning the Commission sends before a severance order. Catch it while there's still time to cure.",
    tone: "red",
    icon: (
      <Icon>
        <rect x="6" y="8" width="20" height="16" rx="1" />
        <path d="M6 9l10 8 10-8" />
      </Icon>
    ),
  },
  {
    code: "SRC_003",
    title: "P-5 RENEWAL",
    body: "A 60 / 30 / 14 / 7-day countdown to your organization report expiry. An unrenewed P-5 severs every lease you have.",
    tone: "cobalt",
    icon: (
      <Icon>
        <path d="M25 9a10 10 0 10.5 8" />
        <path d="M25 4v5h-5" />
        <path d="M16 11v5l3 2" />
      </Icon>
    ),
  },
  {
    code: "SRC_004",
    title: "RULE 15 / INACTIVE WELLS",
    body: "5- and 10-year inactivity milestones, W-3X extension status, and wells that newly hit the inactive aging report.",
    tone: "cobalt",
    icon: (
      <Icon>
        <circle cx="13" cy="11" r="4" />
        <path d="M6 26c0-4 3-7 7-7s7 3 7 7" />
        <path d="M22 10l5 5M27 10l-5 5" />
      </Icon>
    ),
  },
  {
    code: "SRC_005",
    title: "PRORATION SCHEDULES",
    body: "Delinquent codes (DLQ W-10, DLQ FORM, H-15 VIOL) and allowable changes, diffed off the schedule every day.",
    tone: "red",
    icon: (
      <Icon>
        <circle cx="16" cy="16" r="10" />
        <path d="M16 16V6a10 10 0 019 6z" />
        <path d="M16 16l7 5" />
      </Icon>
    ),
  },
  {
    code: "SRC_006",
    title: "SURFACE COMMINGLING (P-17)",
    body: "Blast-radius monitoring — a severance on any lease sharing your commingle stops your production too.",
    tone: "red",
    icon: (
      <Icon>
        <circle cx="10" cy="12" r="3" />
        <circle cx="22" cy="12" r="3" />
        <circle cx="16" cy="22" r="3" />
        <path d="M12 14l3 6M20 14l-3 6M13 12h6" />
      </Icon>
    ),
  },
  {
    code: "SRC_007",
    title: "DRILLING PERMITS (W-1)",
    body: "A countdown to the 2-year no-spud expiry, verified against the wellbore record so you're only warned on undrilled permits.",
    tone: "cobalt",
    icon: (
      <Icon>
        <path d="M12 4l8 8M16 8v18M10 26h12" />
        <path d="M13 12l-3 8M19 12l3 8" />
      </Icon>
    ),
  },
  {
    code: "SRC_008",
    title: "GATHERER / PURCHASER (P-4)",
    body: "Lost market outlets and operator-of-record transfers the day the Commission processes them.",
    tone: "cobalt",
    icon: (
      <Icon>
        <path d="M4 18h6l2-3 3 6 2-3h5" />
        <circle cx="24" cy="18" r="3" />
        <path d="M6 12h8M6 24h10" />
      </Icon>
    ),
  },
];

export const Coverage = () => {
  const root = useAnimeScope(({ self, reduceMotion, anime }) => {
    const { utils, animate, stagger, onScroll } = anime;
    const cards = utils.$(".coverage-card");
    if (!cards.length) return;

    if (reduceMotion) return;

    // Content stays visible if JS or the scroll observer fails. Motion is an
    // enhancement only: cards rise into place without using opacity as a gate.
    utils.set(cards, { translateY: 16 });
    animate(cards, {
      translateY: [16, 0],
      duration: 520,
      ease: "out(3)",
      delay: stagger(55),
      autoplay: onScroll({ target: ".coverage-grid", enter: "top 85%" }),
    });
  }, []);

  return (
    <section
      ref={root}
      id="coverage"
      className="w-full bg-parchment py-16 md:py-24 relative"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-line" />

      <div className="section-shell">
        <SectionLabel number="01" label="Coverage" className="mb-5" />

        <div className="max-w-3xl mb-12">
          <div className="mono-label text-signalRed mb-4">/// EIGHT DATA SOURCES, ONE BRIEFING</div>
          <h2 className="font-display font-extrabold text-labFg text-display-sm">
            What we monitor
          </h2>
          <p className="mt-5 text-labFgMuted text-base md:text-lg leading-relaxed">
            Every morning we scan the public RRC record across eight datasets and
            diff them against yesterday. You only hear from us when something
            changes — never the same standing issue twice.
          </p>
        </div>

        <div className="coverage-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
          {sources.map((s) => (
            <article
              key={s.code}
              className="coverage-card group relative bg-card p-6 flex flex-col min-h-[220px] hover:bg-parchmentAlt transition-colors"
            >
              <span
                className={`bracket -top-px -right-px w-3 h-3 border-r-2 border-t-2 ${
                  s.tone === "red" ? "border-signalRed" : "border-cobalt"
                } opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div
                className={`mb-5 ${s.tone === "red" ? "text-signalRed" : "text-cobalt"}`}
              >
                {s.icon}
              </div>
              <h3 className="font-mono text-[13px] tracking-wide text-labFg font-semibold mb-2">
                {s.title}
              </h3>
              <p className="text-labFgMuted text-sm leading-relaxed flex-1">{s.body}</p>
              <div className="mt-5 flex items-center justify-between">
                <span
                  className={`font-mono text-[11px] ${
                    s.tone === "red" ? "text-signalRed" : "text-cobalt"
                  }`}
                >
                  {s.code}
                </span>
                <span className="font-mono text-labFgMuted group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Footer flourish */}
        <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-wider text-labFgMuted">
          <StarMark size={11} className="text-signalRed" />
          <span className="text-signalRed">{">>>>>"}</span>
          <span>DAILY: SEVERANCE &middot; CERTIFIED &middot; PRORATION</span>
          <span className="text-lineStrong">//</span>
          <span>WEEKLY: P-5 &middot; RULE 15 &middot; W-1 &middot; P-17 &middot; P-4</span>
        </div>
      </div>
    </section>
  );
};
