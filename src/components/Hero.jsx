import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { Button } from "./ui/button.jsx";

// Approximate Lone Star State silhouette (decorative, low-opacity motif).
const TEXAS_PATH =
  "M40,34 L96,34 L96,26 L132,26 L134,58 L162,64 L182,92 L176,104 L188,120 L182,150 L150,150 L146,150 L138,176 L120,150 L96,150 L96,120 L58,120 L58,78 L40,78 Z";

// The 7:00 AM briefing — real product artifact, authored as semantic markup.
const briefingStats = [
  { label: "Monitored", value: "12,842" },
  { label: "Overnight", value: "+37" },
  { label: "Critical", value: "1", alert: true },
];

const briefingRows = [
  {
    sev: "critical",
    title: "Commingle severance — Clam Lake",
    meta: "2 leases exposed",
  },
  {
    sev: "high",
    title: "P-5 renewal — Pioneer Natural Res.",
    meta: "14 days",
  },
  {
    sev: "med",
    title: "Rule 15 inactive — Well 08-11234",
    meta: "W-3X due",
  },
  {
    sev: "med",
    title: "Proration delinquent — DLQ W-10",
    meta: "3 wells",
  },
  {
    sev: "low",
    title: "Drilling permit expiry — W-1",
    meta: "22 days",
  },
];

const severity = {
  critical: { label: "Critical", className: "text-signalRed" },
  high: { label: "High", className: "text-cobalt" },
  med: { label: "Medium", className: "text-panelInkMuted" },
  low: { label: "Low", className: "text-panelInkMuted" },
};

export const Hero = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    const { utils, createTimeline, svg } = anime;

    const bootTargets = utils.$(".boot-in");

    // Content stays painted — motion enhances, never gates visibility.
    if (reduceMotion) {
      utils.set(bootTargets, { translateY: 0 });
      utils.set(".boot-underline", { scaleX: 1 });
      utils.set(".hero-draw", { opacity: 0.5 });
      return;
    }

    createTimeline({ defaults: { ease: "out(3)" } })
      .add(".boot-eyebrow", { translateY: [12, 0], duration: 450 })
      .add(".boot-headline", { translateY: [18, 0], duration: 560 }, "-=200")
      .add(".boot-underline", { scaleX: [0, 1], duration: 560 }, "-=320")
      .add(".boot-sub", { translateY: [12, 0], duration: 420 }, "-=340")
      .add(".boot-cta", { translateY: [10, 0], duration: 400 }, "-=280")
      .add(".boot-panel", { translateY: [16, 0], duration: 560 }, "-=420")
      .add(
        ".boot-row",
        { translateX: [8, 0], duration: 320, delay: anime.stagger(55) },
        "-=360"
      );

    if (svg && svg.createDrawable) {
      const drawables = svg.createDrawable(".hero-draw");
      utils.set(drawables, { opacity: 0.42 });
      anime.animate(drawables, {
        draw: ["0 0", "0 1"],
        duration: 2400,
        delay: anime.stagger(120),
        ease: "inOut(2)",
      });
    }
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
      {/* Decorative Texas outline motif */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[46rem] max-w-[70%] opacity-60 hidden md:block">
        <svg viewBox="0 0 220 200" className="w-full h-full" fill="none" aria-hidden="true">
          <path
            className="hero-draw"
            d={TEXAS_PATH}
            stroke="rgba(122,160,255,0.30)"
            strokeWidth="0.8"
          />
          {[70, 100, 130].map((y, i) => (
            <path
              key={i}
              className="hero-draw"
              d={`M0,${y} C60,${y - 16} 120,${y + 14} 220,${y - 8}`}
              stroke="rgba(200,16,46,0.35)"
              strokeWidth="0.6"
            />
          ))}
        </svg>
      </div>

      <div className="section-shell relative pb-16 pt-10 md:pb-24 md:pt-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* ---------- Left: message ---------- */}
          <div>
            <div className="boot-in boot-eyebrow flex items-center gap-2.5 text-sm font-semibold text-white/65">
              <span className="h-px w-6 shrink-0 bg-signalRed" aria-hidden="true" />
              <span>Texas RRC compliance monitoring</span>
            </div>

            <h1 className="boot-in boot-headline mt-6 font-display text-[clamp(2.75rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.02em] text-white">
              Stop severances{" "}
              <span className="relative inline-block text-signalRed">
                before the letter.
                <span className="boot-underline absolute -bottom-1 left-0 h-[5px] w-full origin-left scale-x-0 bg-signalRed" />
              </span>
            </h1>

            <p className="boot-in boot-sub mt-7 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              We watch eight Texas Railroad Commission datasets and connect them, so a
              risk visible only across two systems lands as one line in your 7:00 AM
              briefing — with time left to cure it.
            </p>

            <div className="boot-in boot-cta mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:gap-4">
              <Button onClick={scrollToContactUs}>
                Get Started
                <span aria-hidden>&rarr;</span>
              </Button>
              <Button asChild variant="ghostDark">
                <a href="#coverage">
                  See what we monitor <span aria-hidden>&rsaquo;</span>
                </a>
              </Button>
            </div>

            <div className="boot-in boot-cta mt-8 flex items-center gap-3 text-sm text-white/60">
              <span className="h-2 w-2 shrink-0 bg-cobalt" aria-hidden="true" />
              Last scan 07:00 CT · next briefing tomorrow morning
            </div>
          </div>

          {/* ---------- Right: 7 AM briefing panel (light instrument inset) ---------- */}
          <figure
            className="boot-in boot-panel relative"
          >
            <figcaption className="sr-only">Example LettersIQ 7:00 AM briefing</figcaption>
            <div className="overflow-hidden rounded-[3px] border border-white/20 bg-panelLight text-panelInk">
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
                        s.alert ? "text-signalRed" : "text-panelInk"
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
                    className={`boot-row flex items-center gap-3 px-5 py-3.5 ${
                      r.sev === "critical" ? "bg-signalSoft" : ""
                    }`}
                  >
                    <span
                      className={`w-[4.5rem] shrink-0 font-mono text-xs font-semibold ${severity[r.sev].className}`}
                    >
                      {severity[r.sev].label}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-panelInk">
                        {r.title}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 font-mono text-xs tabular-nums ${
                        r.sev === "critical" ? "font-semibold text-signalRed" : "text-panelInkMuted"
                      }`}
                    >
                      {r.meta}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Panel footer */}
              <div className="flex items-center justify-between border-t border-black/10 px-5 py-3.5">
                <span className="font-mono text-xs text-panelInkMuted">
                  8 datasets · diffed daily
                </span>
                <span className="font-mono text-xs text-panelInkMuted">
                  Example portfolio
                </span>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
};
