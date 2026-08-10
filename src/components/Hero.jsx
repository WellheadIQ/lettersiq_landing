import React, { useState } from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { usePointerTilt } from "../hooks/usePointerTilt.js";
import { Button } from "./ui/button.jsx";
import { Modal } from "./ui/modal.jsx";
import { HeroScene } from "./HeroScene.jsx";
import { animeSmoothOut, distance, duration } from "../lib/motionTokens.js";
import briefingEmail from "../assets/images/liq-daily-briefing-email.jpg";

// The 7:00 AM briefing — real product artifact, authored as semantic markup.
const briefingStats = [
  { label: "Datasets", value: "8" },
  { label: "Changes", value: "5" },
  { label: "Critical", value: "1", alert: true },
];

// Consequence first, then the record, then what it touches — the same three
// pieces every LettersIQ finding is written in.
const briefingRows = [
  {
    sev: "critical",
    consequence: "Production stopped",
    title: "Commingle severance — Clam Lake",
    meta: "2 leases exposed",
  },
  {
    sev: "high",
    consequence: "Production at risk",
    title: "P-5 renewal — Brazos Bend Operating",
    meta: "14 days",
  },
  {
    sev: "med",
    consequence: "Severance risk",
    title: "Rule 15 inactive — Well 08-11234",
    meta: "W-3X due",
  },
  {
    sev: "med",
    consequence: "Allowable blocked",
    title: "Proration delinquent — DLQ W-10",
    meta: "3 wells",
  },
  {
    sev: "low",
    consequence: "Permit lapses",
    title: "Drilling permit expiry — W-1",
    meta: "22 days",
  },
];

const severity = {
  critical: { label: "Critical", className: "text-signalInk" },
  high: { label: "High", className: "text-cobaltInk" },
  med: { label: "Medium", className: "text-panelInkMuted" },
  low: { label: "Low", className: "text-panelInkMuted" },
};

export const Hero = () => {
  const panel = usePointerTilt({ max: 4.5, lift: 12 });
  const [briefingOpen, setBriefingOpen] = useState(false);

  const root = useAnimeScope(({ reduceMotion, anime }) => {
    const { utils, createTimeline } = anime;

    const bootTargets = utils.$(".boot-in");

    // Content stays painted — motion enhances, never gates visibility.
    if (reduceMotion) {
      utils.set(bootTargets, { translateY: 0 });
      utils.set(".boot-underline", { scaleX: 1 });
      return;
    }

    // One reveal duration for the whole entrance; the rhythm comes from the
    // overlaps, not from six slightly different durations.
    const rise = distance.medium;
    createTimeline({
      defaults: { ease: animeSmoothOut(anime), duration: duration.verySlow },
    })
      .add(".boot-eyebrow", { translateY: [rise, 0] })
      .add(".boot-headline", { translateY: [rise, 0] }, "-=200")
      .add(".boot-underline", { scaleX: [0, 1] }, "-=320")
      .add(".boot-sub", { translateY: [rise, 0] }, "-=340")
      .add(".boot-cta", { translateY: [rise, 0] }, "-=280")
      .add(".boot-panel", { translateY: [rise, 0] }, "-=420")
      .add(
        ".boot-row",
        {
          translateX: [distance.base, 0],
          duration: duration.fast,
          delay: anime.stagger(duration.stagger),
        },
        "-=360"
      );
  }, []);

  const scrollToContactUs = () => {
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={root}
      className="relative w-full overflow-hidden bg-midnight pt-[100px]"
      id="home"
    >
      {/* Eight dataset planes over the Texas base plate — real geometry, real depth */}
      <HeroScene />

      <div className="section-shell relative pb-16 pt-10 md:pb-32 md:pt-16 lg:pb-40">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* ---------- Left: message ---------- */}
          <div>
            <div className="boot-in boot-eyebrow flex items-center gap-2.5 text-sm font-semibold text-white/65">
              <span className="h-px w-6 shrink-0 bg-signalRed" aria-hidden="true" />
              <span>Texas RRC intelligence · 8 connected systems</span>
            </div>

            <h1 className="boot-in boot-headline mt-6 font-display text-[clamp(2.75rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.02em] text-white">
              Know what can stop production{" "}
              <span className="relative inline-block text-signalRed">
                before it does.
                <span className="boot-underline absolute -bottom-1 left-0 h-[5px] w-full origin-left scale-x-0 bg-signalRed" />
              </span>
            </h1>

            <p className="boot-in boot-sub mt-7 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              LettersIQ connects eight Texas RRC systems to catch regulatory issues
              that can shut in wells, delay first sales, or interrupt revenue. Every
              morning, your team gets one prioritized briefing: what changed, what it
              affects, and what needs attention.
            </p>

            <div className="boot-in boot-cta mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:gap-4">
              <Button onClick={scrollToContactUs}>
                Check My Operator
                <span aria-hidden>&rarr;</span>
              </Button>
              <Button variant="ghostDark" onClick={() => setBriefingOpen(true)}>
                See a Sample Briefing <span aria-hidden>&rsaquo;</span>
              </Button>
            </div>

            <p className="boot-in boot-cta mt-8 max-w-xl text-sm text-white/60">
              No spreadsheets · no eight-system morning check · only new exceptions
            </p>
          </div>

          {/* ---------- Right: 7 AM briefing panel (light instrument inset) ---------- */}
          <figure className="boot-in boot-panel relative">
            <figcaption className="sr-only">Example LettersIQ 7:00 AM briefing</figcaption>

            <div ref={panel} className="tilt-surface relative">
              {/* Back plate — the sheet under today's briefing */}
              <span
                className="pointer-events-none absolute -inset-x-3 -inset-y-3 rounded-[4px] border border-white/[0.07] [transform:translateZ(-30px)]"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-[3px] border border-white/20 bg-panelLight text-panelInk shadow-float">
                {/* Panel header */}
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                  <div className="flex items-center gap-2 font-mono text-[12px] font-semibold tracking-tight text-panelInk">
                    <span className="h-2 w-2 bg-signalRed" aria-hidden="true" />
                    7:00 AM Briefing
                  </div>
                  <span className="font-mono text-xs text-panelInkMuted">
                    07:00 CT
                  </span>
                </div>

                {/* Stat strip */}
                <div className="grid grid-cols-3 divide-x divide-black/10 border-b border-black/10">
                  {briefingStats.map((s) => (
                    <div key={s.label} className="px-4 py-3.5">
                      <div className="font-mono text-xs text-panelInkMuted">
                        {s.label}
                      </div>
                      <div
                        className={`mt-1 font-display text-2xl font-extrabold tabular-nums tracking-tight ${
                          s.alert ? "text-signalInk" : "text-panelInk"
                        }`}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Alert rows */}
                <ul className="divide-y divide-black/[0.07]">
                  {briefingRows.map((r) => (
                    <li
                      key={r.title}
                      className={`boot-row px-5 py-3 ${
                        r.sev === "critical" ? "bg-signalSoft" : ""
                      }`}
                    >
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`min-w-0 flex-1 truncate font-mono text-[11px] font-semibold uppercase tracking-[0.07em] ${severity[r.sev].className}`}
                        >
                          <span className="sr-only">
                            {severity[r.sev].label} —{" "}
                          </span>
                          {r.consequence}
                        </span>
                        <span
                          className={`shrink-0 font-mono text-xs tabular-nums ${
                            r.sev === "critical"
                              ? "font-semibold text-signalInk"
                              : "text-panelInkMuted"
                          }`}
                        >
                          {r.meta}
                        </span>
                      </div>
                      <div className="mt-1 text-[13px] font-medium text-panelInk">
                        {r.title}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Panel footer */}
                <div className="flex items-center justify-between border-t border-black/10 px-5 py-3.5">
                  <span className="font-mono text-xs text-panelInkMuted">
                    8 datasets · diffed daily
                  </span>
                  <span className="font-mono text-xs text-panelInkMuted">
                    Illustrative portfolio
                  </span>
                </div>

                {/* Glancing light that tracks the pointer across the surface */}
                <span className="tilt-sheen" aria-hidden="true" />
              </div>
            </div>
          </figure>
        </div>
      </div>

      <Modal
        open={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        title="A sample 7:00 AM briefing"
        caption="Example portfolio · delivered daily at 07:00 CT"
      >
        <img
          src={briefingEmail}
          alt="A LettersIQ daily briefing email listing four RRC alerts for McFaddin Operating: a critical certified pre-severance letter, a P-5 expiring in 14 days, a proration status change, and a resolved severance."
          width="1100"
          height="1650"
          decoding="async"
          className="mx-auto h-auto w-full max-w-[640px] rounded-[2px] border border-white/10"
        />
      </Modal>
    </section>
  );
};
