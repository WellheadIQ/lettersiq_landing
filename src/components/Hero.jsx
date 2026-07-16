import React from "react";
import dashboard from "../assets/images/liq-dashboard-interface.png";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { StarMark } from "./Primitives.jsx";
import { Button } from "./ui/button.jsx";

// Expanded scrolling ticker — one authored copy, tripled for a seamless loop.
const ticker = [
  "WELL SEVERANCE",
  "CERTIFIED LETTERS",
  "P-5 RENEWAL EXPIRY",
  "RULE 15 / W-3X BLOCKERS",
  "PRORATION ALLOWABLES",
  "DELINQUENT H-10",
  "COMMINGLE BLAST RADIUS",
  "DRILLING PERMIT EXPIRY",
  "INACTIVE WELL AGING",
  "P-4 FILINGS",
  "OPERATOR-OF-RECORD",
  "SEAL ORDERS",
  "STATEWIDE RULE 14",
];

const chips = [
  { label: "SYSTEM", value: "ACTIVE", live: true },
  { label: "DATASETS", value: "8" },
  { label: "ALERT TYPES", value: "25+" },
  { label: "VERSION", value: "2.0" },
];

// Approximate Lone Star State silhouette (decorative, low-opacity).
const TEXAS_PATH =
  "M40,34 L96,34 L96,26 L132,26 L134,58 L162,64 L182,92 L176,104 L188,120 L182,150 L150,150 L146,150 L138,176 L120,150 L96,150 L96,120 L58,120 L58,78 L40,78 Z";

export const Hero = () => {
  const root = useAnimeScope(({ self, reduceMotion, anime }) => {
    const { utils, createTimeline, stagger, svg } = anime;

    const bootTargets = utils.$(".boot-in");

    if (reduceMotion) {
      utils.set(bootTargets, { opacity: 1, translateY: 0 });
      utils.set(".hero-line", { strokeDashoffset: 0, opacity: 0.55 });
      utils.set(".hero-node", { opacity: 1, scale: 1 });
      return;
    }

    // Boot sequence: announcement/chips -> headline -> sub -> CTAs -> chips row.
    createTimeline({ defaults: { ease: "out(3)" } })
      .add(".boot-eyebrow", { opacity: [0, 1], translateY: [12, 0], duration: 500 })
      .add(".boot-headline", { opacity: [0, 1], translateY: [24, 0], duration: 700 }, "-=250")
      .add(".boot-underline", { scaleX: [0, 1], duration: 600 }, "-=350")
      .add(".boot-sub", { opacity: [0, 1], translateY: [16, 0], duration: 500 }, "-=350")
      .add(".boot-cta", { opacity: [0, 1], translateY: [16, 0], duration: 450 }, "-=300")
      .add(
        ".boot-chip",
        { opacity: [0, 1], translateY: [10, 0], duration: 400, delay: stagger(70) },
        "-=250"
      );

    // Draw the decorative Texas outline + data lines.
    if (svg && svg.createDrawable) {
      const drawables = svg.createDrawable(".hero-draw");
      utils.set(drawables, { opacity: 0.5 });
      anime.animate(drawables, {
        draw: ["0 0", "0 1"],
        duration: 2600,
        delay: stagger(120),
        ease: "inOut(2)",
      });
    }

    // Ambient node pulse loop.
    anime.animate(".hero-node", {
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.5, 1],
      duration: 2600,
      delay: stagger(320),
      loop: true,
      ease: "inOutSine",
    });
  }, []);

  const scrollToContactUs = () => {
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={root}
      className="w-full flex flex-col relative overflow-hidden"
      id="home"
    >
      {/* ---------- Dark instrument stage ---------- */}
      <div className="relative w-full bg-midnight pt-[100px]">
        {/* Ambient red signal glow */}
        <div
          className="pointer-events-none absolute -top-40 right-0 w-[42rem] h-[42rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(200,16,46,0.35), transparent 60%)" }}
        />
        {/* Blueprint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(250,251,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(250,251,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(120% 90% at 70% 0%, #000 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(120% 90% at 70% 0%, #000 30%, transparent 100%)",
          }}
        />

        {/* Decorative Texas / data-line motif */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[46rem] max-w-[70%] opacity-70 hidden sm:block">
          <svg viewBox="0 0 220 200" className="w-full h-full" fill="none" aria-hidden="true">
            <path
              className="hero-draw hero-line"
              d={TEXAS_PATH}
              stroke="rgba(250,251,255,0.28)"
              strokeWidth="0.8"
            />
            {[70, 96, 122, 148].map((y, i) => (
              <path
                key={i}
                className="hero-draw hero-line"
                d={`M0,${y} C60,${y - 18} 120,${y + 16} 220,${y - 10}`}
                stroke="rgba(200,16,46,0.5)"
                strokeWidth="0.7"
              />
            ))}
            {[
              [150, 70],
              [172, 96],
              [120, 90],
              [140, 130],
              [96, 150],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                className="hero-node"
                cx={cx}
                cy={cy}
                r="2.4"
                fill={i % 2 === 0 ? "#E8354F" : "#1F4FFF"}
              />
            ))}
          </svg>
        </div>

        <div className="section-shell relative pt-12 pb-16 md:pt-16 md:pb-24">
          {/* Eyebrow */}
          <div className="boot-in boot-eyebrow opacity-0 flex items-center gap-3 mb-8 md:mb-10 font-mono text-[11px] tracking-[0.18em] text-signalBright">
            <StarMark size={12} className="text-signalBright" />
            <span>/// RRC MONITORING — NOW WITH PREDICTIVE ALERTS</span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl">
            <h1 className="boot-in boot-headline opacity-0 font-display font-extrabold text-white text-display-lg">
              Stop severances{" "}
              <span className="relative inline-block text-signalRed">
                before the letter.
                <span className="boot-underline absolute left-0 -bottom-1 h-[4px] w-full bg-signalRed origin-left scale-x-0" />
              </span>
            </h1>

            <p className="boot-in boot-sub opacity-0 mt-7 max-w-2xl text-white/60 text-base md:text-lg leading-relaxed">
              LettersIQ now watches 8 Texas RRC datasets — not just severance
              letters — and connects them so a problem visible only across two
              systems lands as one line in your 7 AM email. Predict, prevent, and
              prove compliance before it costs you a shut-in.
            </p>

            <div className="boot-in boot-cta opacity-0 mt-9 flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4">
              <Button onClick={scrollToContactUs}>
                Get Started
                <span aria-hidden>&rarr;</span>
              </Button>
              <Button asChild variant="ghostDark">
                <a href="#coverage">
                  See What We Monitor <span aria-hidden>&rsaquo;</span>
                </a>
              </Button>
            </div>

            {/* Status chips */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 max-w-2xl">
              {chips.map((chip) => (
                <div
                  key={chip.label}
                  className="boot-in boot-chip opacity-0 bg-midnight px-4 py-4"
                >
                  <div className="font-mono text-[10px] tracking-[0.16em] text-white/40 mb-1.5">
                    {chip.label}
                  </div>
                  <div className="flex items-center gap-2">
                    {chip.live && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-signalBright opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-signalBright" />
                      </span>
                    )}
                    <span className="font-mono text-sm font-bold text-white tracking-tight">
                      {chip.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded monitored ticker */}
        <div className="relative border-t border-white/10 py-4 overflow-hidden">
          <div
            className="flex w-max animate-marquee gap-10 font-mono text-[11px] tracking-[0.18em] text-white/40"
            aria-hidden="true"
          >
            {[...ticker, ...ticker, ...ticker].map((m, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap">
                <span className="text-signalRed/70">&rsaquo;</span> {m}
              </span>
            ))}
          </div>
          <span className="sr-only">
            Monitored alert types: {ticker.join(", ")}
          </span>
        </div>
      </div>

      {/* ---------- Light stage: product proof ---------- */}
      <div className="w-full bg-parchment py-16 md:py-24">
        <div className="section-shell">
          <div className="relative">
            {/* Caption */}
            <div className="flex items-center gap-3 mb-5 font-mono text-[11px] tracking-[0.16em] text-labFgMuted">
              <span className="text-labFg font-semibold">FIG.01</span>
              <span className="w-10 h-px bg-lineStrong" />
              <span>DASHBOARD INTERFACE</span>
              <span className="ml-auto hidden sm:inline text-signalRed">REAL-TIME</span>
            </div>

            {/* Framed dashboard screenshot */}
            <div className="relative">
              <span className="bracket -top-2 -left-2 border-l-2 border-t-2 border-labFg" />
              <span className="bracket -top-2 -right-2 border-r-2 border-t-2 border-labFg" />
              <span className="bracket -bottom-2 -left-2 border-l-2 border-b-2 border-labFg" />
              <span className="bracket -bottom-2 -right-2 border-r-2 border-b-2 border-labFg" />

              <div className="relative border border-lineStrong bg-midnight shadow-panelLg overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 h-9 border-b border-white/10 bg-white/[0.03]">
                  <span className="w-2.5 h-2.5 rounded-full bg-signalRed/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cobalt/70" />
                  <span className="ml-3 font-mono text-[10px] tracking-wider text-white/35">
                    app.lettersiq.com
                  </span>
                </div>
                {/* Scanning sweep */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
                  <div className="absolute top-9 bottom-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-cobalt/10 to-transparent" />
                </div>
                <img
                  src={dashboard}
                  alt="LettersIQ monitoring dashboard showing 8 datasets, 25+ alert types, and lease-level severity"
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
