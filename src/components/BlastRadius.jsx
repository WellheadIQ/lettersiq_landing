import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { usePointerTilt } from "../hooks/usePointerTilt.js";
import { settle } from "../lib/motion.js";
import { animeSmoothOut, distance, duration } from "../lib/motionTokens.js";
import { SectionLabel } from "./Primitives.jsx";

const CENTER = { x: 180, y: 168, label: "Clam Lake", sub: "18458001" };

const nodes = [
  {
    id: "third",
    x: 86,
    y: 74,
    label: "08-12345",
    sub: "McFaddin",
    tone: "hot",
  },
  {
    id: "y1",
    x: 276,
    y: 80,
    label: "08-08559",
    sub: "Yours",
    tone: "you",
  },
  {
    id: "y2",
    x: 292,
    y: 190,
    label: "08-09012",
    sub: "Yours",
    tone: "you",
  },
  {
    id: "o1",
    x: 74,
    y: 248,
    label: "08-11234",
    sub: "",
    tone: "muted",
  },
  {
    id: "o2",
    x: 218,
    y: 266,
    label: "08-07777",
    sub: "",
    tone: "muted",
  },
];

const toneStroke = {
  hot: "#E8354F",
  you: "#7AA0FF", // cobaltText — readable on midnight
  muted: "rgba(250,251,255,0.35)",
};

const toneFill = {
  hot: "#E8354F",
  you: "#7AA0FF",
  muted: "rgba(250,251,255,0.55)",
};

const legend = [
  { tone: "hot", label: "Severed third-party" },
  { tone: "you", label: "Your lease" },
  { tone: "muted", label: "Other lease on permit" },
];

/** Draw order: severed edge first, then the rest — telegraphs the blast path. */
const edgeOrder = ["third", "y1", "y2", "o1", "o2"];

/* Cropped to the drawing's real bounds — the old 0 0 360 320 box carried ~30
   units of dead margin on every side, and on a 320px phone that margin was
   costing the whole diagram 18% of its scale. */
const VIEW = { x: 30, y: 30, w: 306, h: 280 };

/** Node centre as a percentage of the rendered SVG box, for the DOM label layer. */
const anchor = (n) => ({
  left: `${((n.x - VIEW.x) / VIEW.w) * 100}%`,
  top: `${((n.y - VIEW.y) / VIEW.h) * 100}%`,
});

const CommingleGraph = () => (
  <div className="relative mx-auto w-full max-w-[440px]">
    <svg
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      className="h-auto w-full"
      role="img"
      aria-labelledby="commingle-graph-title commingle-graph-desc"
    >
      <title id="commingle-graph-title">Surface commingle graph for Clam Lake</title>
      <desc id="commingle-graph-desc">
        A third-party lease on the Clam Lake surface commingle is severed. Two of
        your leases share that permit and are exposed.
      </desc>

      {edgeOrder.map((id) => {
        const n = nodes.find((node) => node.id === id);
        return (
          <path
            key={`edge-${n.id}`}
            className={
              n.tone === "hot" ? "graph-edge graph-edge-hot" : "graph-edge"
            }
            data-edge={n.id}
            d={`M${CENTER.x},${CENTER.y} L${n.x},${n.y}`}
            stroke={n.tone === "hot" ? toneStroke.hot : "rgba(250,251,255,0.22)"}
            strokeWidth={n.tone === "hot" ? "1.75" : "1"}
            fill="none"
          />
        );
      })}

      <g className="graph-center">
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r="44"
          fill="#0A1428"
          stroke="rgba(250,251,255,0.45)"
          strokeWidth="1.25"
        />
      </g>

      {nodes.map((n) => (
        <g key={n.id} className={`graph-node graph-node-${n.tone}`}>
          <circle
            cx={n.x}
            cy={n.y}
            r="38"
            fill="#060D1B"
            stroke={toneStroke[n.tone]}
            strokeWidth={n.tone === "hot" ? "1.75" : "1.1"}
          />
        </g>
      ))}
    </svg>

    {/* Labels live in the DOM, not in the SVG: baked <text> scaled with the
        viewBox and bottomed out at 7.8px on a 320px phone. The SVG keeps
        role="img" with its title and desc, so this layer is decoration to a
        screen reader and the relationship is still described once. */}
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* w-max: an absolutely positioned box is otherwise capped by the space
          left of the container edge, which wrapped the right-hand IDs mid-token. */}
      <div
        className="absolute w-max -translate-x-1/2 -translate-y-1/2 text-center font-mono text-[12px] leading-[1.25] tracking-tight"
        style={anchor(CENTER)}
      >
        <div className="text-starWhite">{CENTER.label}</div>
        <div className="text-white/55">{CENTER.sub}</div>
      </div>

      {/* Two elements per label: the outer one owns the centring transform, the
          inner one is what the entrance animates — sharing an element would let
          anime's translateY overwrite the -50% centring. */}
      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute w-max -translate-x-1/2 -translate-y-1/2"
          style={anchor(n)}
        >
          <div className="graph-node-label text-center font-mono text-[12px] leading-[1.25] tracking-tight">
            <div style={{ color: toneFill[n.tone] }}>{n.label}</div>
            {n.sub ? (
              <div
                style={{
                  color:
                    n.tone === "hot" ? toneFill.hot : "rgba(250,251,255,0.55)",
                }}
              >
                {n.sub}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const BlastRadius = () => {
  const graphPanel = usePointerTilt({ max: 3.5, lift: 8 });

  const root = useAnimeScope(({ reduceMotion, anime }) => {
    const { utils, animate, stagger, onScroll, svg } = anime;

    if (!reduceMotion) {
      settle(anime, utils.$(".blast-beat"), {
        trigger: ".blast-beats",
        stagger: duration.micro,
      });
      settle(anime, utils.$(".blast-graph"), { trigger: ".blast-graph", enter: "90% top" });
    }

    // Circles and their DOM labels are two sets in the same order, animated as a
    // pair so each node and its name arrive together.
    const nodeLayers = [utils.$(".graph-node"), utils.$(".graph-node-label")];
    if (!reduceMotion) {
      for (const els of nodeLayers) {
        if (!els.length) continue;
        utils.set(els, { translateY: distance.medium });
        animate(els, {
          translateY: [distance.medium, 0],
          duration: duration.verySlow,
          delay: stagger(duration.stagger),
          ease: animeSmoothOut(anime),
          autoplay: onScroll({ target: ".blast-graph", enter: "82% top" }),
        });
      }
    }

    // One-shot line drawing. Edges stay fully painted until the graph enters
    // view, then we blank and draw once — never a looping pulse.
    if (reduceMotion || !svg?.createDrawable) return;

    const graphEl = utils.$(".blast-graph")[0];
    if (!graphEl || typeof IntersectionObserver === "undefined") return;

    const edges = svg.createDrawable(".graph-edge");
    let drawn = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || drawn) return;
        drawn = true;
        observer.disconnect();
        utils.set(edges, { draw: "0 0" });
        // 700ms stroke draw is a one-shot explanatory beat with no counterpart
        // on the motion-token scale; only the stagger is tokenised.
        animate(edges, {
          draw: "0 1",
          duration: 700,
          delay: stagger(duration.stagger),
          ease: animeSmoothOut(anime),
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(graphEl);
  }, []);

  return (
    <section
      ref={root}
      id="blast-radius"
      className="relative w-full overflow-hidden bg-midnight py-16 md:py-24"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-white/10" />

      <div className="section-shell relative z-10">
        <SectionLabel label="The P-17 blast radius" className="mb-5" />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <h2 className="max-w-xl text-balance font-display text-display-sm font-extrabold tracking-[-0.02em] text-white">
              The RRC doesn't have to name you for it to become your problem.
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/65 md:text-lg">
              A third-party operator sharing your surface commingle can create
              exposure for your leases. If one co-member is severed, every lease
              on that Form P-17 can stop producing — including yours.
            </p>
            <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-white/65 md:text-lg">
              A normal operator-number search misses that relationship. LettersIQ
              connects the P-17 records to severance data and monitors the entire
              commingle, not just your own filings.
            </p>

            <ul className="blast-beats mt-9 space-y-0 border-t border-white/10">
              <li className="blast-beat border-b border-white/10 py-4">
                <div className="text-sm font-semibold text-white">Hidden upstream</div>
                <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-white/60">
                  The trigger sits in another operator's record. The impact lands
                  on your production.
                </p>
              </li>
              <li className="blast-beat border-b border-white/10 py-4">
                <div className="text-sm font-semibold text-white">One graph, every morning</div>
                <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-white/60">
                  We rebuild the relationship from imaged P-17 filings and check
                  every connected lease before your day begins.
                </p>
              </li>
            </ul>
          </div>

          <figure className="blast-graph w-full lg:pt-2">
            <p className="mb-4 text-pretty font-display text-lg font-bold tracking-[-0.01em] text-white">
              This is what &ldquo;connected regulatory intelligence&rdquo; means.
            </p>
            <div
              ref={graphPanel}
              className="tilt-surface overflow-hidden rounded-[3px] border border-white/15 bg-white/[0.03] shadow-float"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="h-2 w-2 bg-signalRed" aria-hidden="true" />
                  Commingle graph
                </div>
                <span className="font-mono text-xs font-semibold text-signalText">
                  Critical
                </span>
              </div>

              <div className="px-3 py-5 sm:px-5">
                <CommingleGraph />
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 px-5 py-3.5">
                {legend.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-xs text-white/65"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: toneStroke[item.tone] }}
                      aria-hidden="true"
                    />
                    {item.label}
                  </li>
                ))}
              </ul>

              <div className="border-t border-signalRed/30 bg-signalSoft px-5 py-4">
                <p className="text-sm leading-relaxed text-white/85">
                  Third-party lease{" "}
                  <span className="font-mono tabular-nums text-white">08-12345</span>{" "}
                  (McFaddin Trust) on Clam Lake is under an outstanding severance.
                </p>
                <p className="mt-2 text-sm font-semibold text-signalText">
                  Your leases{" "}
                  <span className="font-mono tabular-nums">08-08559</span> and{" "}
                  <span className="font-mono tabular-nums">08-09012</span> cannot
                  produce until it clears.
                </p>
              </div>
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-white/60">
              <span>Example surface commingle</span>
              <span>Source: RRC Form P-17</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
