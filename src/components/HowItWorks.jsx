import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { SectionLabel } from "./Primitives.jsx";

const steps = [
  {
    n: "01",
    title: "We scan",
    body: "Every dawn we pull eight public Texas Railroad Commission datasets — severance orders, certified letters, P-5 operator renewals, proration schedules and more.",
  },
  {
    n: "02",
    title: "We connect",
    body: "We diff each one against yesterday and cross-reference systems that don't talk to each other — so a risk hiding across two separate filings surfaces as a single signal.",
  },
  {
    n: "03",
    title: "You get one briefing",
    body: "By 7:00 AM you get one ranked email: what changed, why it matters for your leases, and how many days you have left to cure it.",
  },
];

/** Instrument diagram: Scan → Connect → Brief. Paths are drawn once on enter. */
const SignalLoopDiagram = () => (
  <div className="how-diagram relative mx-auto w-full max-w-[440px]">
    <svg
      viewBox="0 0 420 300"
      className="h-auto w-full"
      role="img"
      aria-labelledby="how-diagram-title how-diagram-desc"
    >
      <title id="how-diagram-title">How LettersIQ turns RRC filings into a briefing</title>
      <desc id="how-diagram-desc">
        Eight data sources are scanned, connected into one signal, and delivered
        as a 7 AM briefing.
      </desc>

      {/* Flow paths — drawn by Anime.js createDrawable */}
      <path
        className="how-draw how-draw-a"
        d="M118,150 C168,150 178,150 210,150"
        fill="none"
        stroke="rgba(122,160,255,0.55)"
        strokeWidth="1.5"
      />
      <path
        className="how-draw how-draw-b"
        d="M246,150 C278,150 292,150 318,150"
        fill="none"
        stroke="rgba(200,16,46,0.65)"
        strokeWidth="1.75"
      />

      {/* Scan: stacked dataset rails */}
      <g className="how-scan">
        <rect
          x="28"
          y="78"
          width="90"
          height="144"
          rx="2"
          fill="#0A1428"
          stroke="rgba(250,251,255,0.2)"
          strokeWidth="1"
        />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line
            key={i}
            className="how-rail"
            x1="42"
            y1={98 + i * 14}
            x2="104"
            y2={98 + i * 14}
            stroke={i < 3 ? "#E8354F" : "rgba(122,160,255,0.55)"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        <text
          x="73"
          y="246"
          textAnchor="middle"
          className="font-mono"
          fontSize="11"
          fill="rgba(250,251,255,0.55)"
        >
          Scan
        </text>
      </g>

      {/* Connect hub */}
      <g className="how-hub">
        <circle
          cx="228"
          cy="150"
          r="22"
          fill="#060D1B"
          stroke="rgba(250,251,255,0.4)"
          strokeWidth="1.25"
        />
        <path
          className="how-draw how-draw-hub"
          d="M218,150 H238 M228,140 V160"
          fill="none"
          stroke="#7AA0FF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <text
          x="228"
          y="246"
          textAnchor="middle"
          className="font-mono"
          fontSize="11"
          fill="rgba(250,251,255,0.55)"
        >
          Connect
        </text>
      </g>

      {/* Brief: miniature briefing panel */}
      <g className="how-brief">
        <rect
          x="318"
          y="88"
          width="78"
          height="124"
          rx="2"
          fill="#F4F6FB"
          stroke="rgba(250,251,255,0.25)"
          strokeWidth="1"
        />
        <rect x="318" y="88" width="78" height="18" fill="#C8102E" />
        <text
          x="357"
          y="100"
          textAnchor="middle"
          className="font-mono"
          fontSize="8"
          fill="#FAFBFF"
        >
          7:00 AM
        </text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} className="how-brief-row">
            <rect
              x="328"
              y={118 + i * 20}
              width="6"
              height="6"
              fill={i === 0 ? "#C8102E" : "#3D6BFF"}
            />
            <line
              x1="340"
              y1={121 + i * 20}
              x2="384"
              y2={121 + i * 20}
              stroke="#0A1428"
              strokeOpacity={i === 0 ? "0.85" : "0.35"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        ))}
        <text
          x="357"
          y="246"
          textAnchor="middle"
          className="font-mono"
          fontSize="11"
          fill="rgba(250,251,255,0.55)"
        >
          Brief
        </text>
      </g>
    </svg>
  </div>
);

export const HowItWorks = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    const { utils, animate, stagger, onScroll, svg, createTimeline } = anime;

    const stepsEls = utils.$(".how-step");
    if (stepsEls.length && !reduceMotion) {
      utils.set(stepsEls, { translateY: 12 });
      animate(stepsEls, {
        translateY: [12, 0],
        duration: 420,
        delay: stagger(100),
        ease: "out(3)",
        autoplay: onScroll({ target: ".how-steps", enter: "top 85%" }),
      });
    }

    // Explanatory one-shot diagram — rare marketing beat, not a daily UI loop.
    // See anime.js createDrawable: https://animejs.com/documentation/
    if (reduceMotion || !svg?.createDrawable) return;

    const diagram = utils.$(".how-diagram")[0];
    if (!diagram || typeof IntersectionObserver === "undefined") return;

    const paths = svg.createDrawable(".how-draw");
    const rails = utils.$(".how-rail");
    const briefRows = utils.$(".how-brief-row");
    let played = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        observer.disconnect();

        // Blank drawable strokes only at play time so the diagram never ships empty.
        utils.set(paths, { draw: "0 0" });
        if (rails.length) utils.set(rails, { opacity: 0.2 });
        if (briefRows.length) utils.set(briefRows, { translateX: 6, opacity: 0.25 });

        const tl = createTimeline({ defaults: { ease: "out(3)" } });
        tl.add(paths, {
          draw: "0 1",
          duration: 700,
          delay: stagger(120),
        });
        if (rails.length) {
          tl.add(
            rails,
            {
              opacity: [0.2, 1],
              duration: 320,
              delay: stagger(35),
            },
            "-=500"
          );
        }
        if (briefRows.length) {
          tl.add(
            briefRows,
            {
              translateX: [6, 0],
              opacity: [0.25, 1],
              duration: 360,
              delay: stagger(55),
            },
            "-=200"
          );
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(diagram);
  }, []);

  return (
    <section
      ref={root}
      id="how-it-works"
      className="relative w-full bg-parchmentAlt py-16 md:py-24"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-line" />

      <div className="section-shell">
        <SectionLabel label="How it works" className="mb-5" />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <h2 className="max-w-xl text-balance font-display text-display-sm font-extrabold tracking-[-0.02em] text-labFg">
              New to the filings? Here's the whole loop.
            </h2>

            <ol className="how-steps mt-10 space-y-0 border-t border-line">
              {steps.map((step) => (
                <li
                  key={step.n}
                  className="how-step border-b border-line py-6"
                >
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="font-mono text-sm tabular-nums text-signalBright">
                      {step.n}
                    </span>
                    <h3 className="font-display text-xl font-bold tracking-[-0.01em] text-labFg">
                      {step.title}
                    </h3>
                  </div>
                  <p className="max-w-md text-pretty text-[15px] leading-relaxed text-labFgMuted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <figure className="w-full lg:pt-2">
            <div className="overflow-hidden rounded-[3px] border border-white/15 bg-white/[0.03] px-4 py-6 sm:px-6">
              <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="h-2 w-2 bg-signalRed" aria-hidden="true" />
                  Signal loop
                </div>
                <span className="font-mono text-xs text-white/55">Once daily</span>
              </div>
              <SignalLoopDiagram />
            </div>
            <figcaption className="mt-4 text-sm text-labFgMuted">
              Public filings in → one ranked briefing out
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
