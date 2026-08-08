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

const CommingleGraph = () => (
  <div className="relative mx-auto w-full max-w-[440px]">
    <svg
      viewBox="0 0 360 320"
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
          r="36"
          fill="#0A1428"
          stroke="rgba(250,251,255,0.45)"
          strokeWidth="1.25"
        />
        <text
          x={CENTER.x}
          y={CENTER.y - 2}
          textAnchor="middle"
          className="font-mono"
          fontSize="12"
          fill="#FAFBFF"
        >
          {CENTER.label}
        </text>
        <text
          x={CENTER.x}
          y={CENTER.y + 13}
          textAnchor="middle"
          className="font-mono"
          fontSize="10"
          fill="rgba(250,251,255,0.55)"
        >
          {CENTER.sub}
        </text>
      </g>

      {nodes.map((n) => (
        <g key={n.id} className={`graph-node graph-node-${n.tone}`}>
          <circle
            cx={n.x}
            cy={n.y}
            r="30"
            fill="#060D1B"
            stroke={toneStroke[n.tone]}
            strokeWidth={n.tone === "hot" ? "1.75" : "1.1"}
          />
          <text
            x={n.x}
            y={n.sub ? n.y - 4 : n.y + 4}
            textAnchor="middle"
            className="font-mono"
            fontSize="11"
            fill={toneFill[n.tone]}
          >
            {n.label}
          </text>
          {n.sub ? (
            <text
              x={n.x}
              y={n.y + 10}
              textAnchor="middle"
              fontSize="10"
              fill={
                n.tone === "hot" ? toneFill.hot : "rgba(250,251,255,0.55)"
              }
            >
              {n.sub}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
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

    const nodesEls = utils.$(".graph-node");
    if (nodesEls.length && !reduceMotion) {
      utils.set(nodesEls, { translateY: distance.medium });
      animate(nodesEls, {
        translateY: [distance.medium, 0],
        duration: duration.verySlow,
        delay: stagger(duration.stagger),
        ease: animeSmoothOut(anime),
        autoplay: onScroll({ target: ".blast-graph", enter: "82% top" }),
      });
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
        <SectionLabel label="Blast radius" className="mb-5" />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <h2 className="max-w-xl text-balance font-display text-display-sm font-extrabold tracking-[-0.02em] text-white">
              You can be shut in by someone else's violation.
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/65 md:text-lg">
              When any lease on a shared surface commingle (Form P-17) is severed,
              every lease on that permit stops producing — including yours. The
              severance is filed against the other operator, so it never appears
              in your own records.
            </p>
            <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-white/65 md:text-lg">
              LettersIQ builds the commingle graph from imaged P-17 filings, then
              watches your neighbors the same way it watches you.
            </p>

            <ul className="blast-beats mt-9 space-y-0 border-t border-white/10">
              <li className="blast-beat border-b border-white/10 py-4">
                <div className="text-sm font-semibold text-white">Hidden upstream</div>
                <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-white/60">
                  You find out when your purchaser rejects the load — unless someone
                  is watching the co-member leases.
                </p>
              </li>
              <li className="blast-beat border-b border-white/10 py-4">
                <div className="text-sm font-semibold text-white">One graph, every morning</div>
                <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-white/60">
                  By hand this means cross-referencing two disconnected RRC systems
                  every day. We do that before 7:00 AM CT.
                </p>
              </li>
            </ul>
          </div>

          <figure className="blast-graph w-full lg:pt-2">
            <div
              ref={graphPanel}
              className="tilt-surface overflow-hidden rounded-[3px] border border-white/15 bg-white/[0.03] shadow-float"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="h-2 w-2 bg-signalRed" aria-hidden="true" />
                  Commingle graph
                </div>
                <span className="font-mono text-xs font-semibold text-signalRed">
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
                <p className="mt-2 text-sm font-semibold text-signalRed">
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
