import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { SectionLabel } from "./Primitives.jsx";

const CENTER = { x: 168, y: 176, label: "CLAM LAKE", sub: "(18458001)" };
const nodes = [
  { id: "third", x: 96, y: 78, label: "08-12345", sub: "MCFADDIN TRUST", tag: "THIRD-PARTY", tone: "hot" },
  { id: "y1", x: 268, y: 84, label: "08-08559", sub: "", tag: "YOUR LEASE", tone: "you" },
  { id: "y2", x: 292, y: 190, label: "08-09012", sub: "", tag: "YOUR LEASE", tone: "you" },
  { id: "o1", x: 78, y: 258, label: "08-11234", sub: "", tag: "OTHER LEASE", tone: "muted" },
  { id: "o2", x: 214, y: 268, label: "08-07777", sub: "", tag: "OTHER LEASE", tone: "muted" },
];

const CommingleGraph = () => (
  <div className="relative w-full aspect-square max-w-[460px] mx-auto">
    <svg viewBox="0 0 360 340" className="w-full h-full" aria-hidden="true">
      {/* Edges */}
      {nodes.map((n) => (
        <path
          key={`edge-${n.id}`}
          className={n.tone === "hot" ? "graph-edge graph-edge-hot" : "graph-edge"}
          d={`M${CENTER.x},${CENTER.y} L${n.x},${n.y}`}
          stroke={n.tone === "hot" ? "#E8354F" : "rgba(250,251,255,0.28)"}
          strokeWidth={n.tone === "hot" ? "2" : "1"}
          fill="none"
        />
      ))}

      {/* Center node */}
      <g>
        <circle cx={CENTER.x} cy={CENTER.y} r="30" fill="#0A1428" stroke="rgba(250,251,255,0.5)" strokeWidth="1.2" />
        <text x={CENTER.x} y={CENTER.y - 2} textAnchor="middle" className="font-mono" fontSize="9" fill="#FAFBFF">
          {CENTER.label}
        </text>
        <text x={CENTER.x} y={CENTER.y + 9} textAnchor="middle" className="font-mono" fontSize="7" fill="rgba(250,251,255,0.55)">
          {CENTER.sub}
        </text>
      </g>

      {/* Outer nodes */}
      {nodes.map((n) => {
        const stroke =
          n.tone === "hot" ? "#E8354F" : n.tone === "you" ? "#F0B429" : "rgba(250,251,255,0.4)";
        const labelColor =
          n.tone === "hot" ? "#E8354F" : n.tone === "you" ? "#F0B429" : "rgba(250,251,255,0.65)";
        return (
          <g key={n.id} className={n.tone === "hot" ? "graph-node-hot" : ""}>
            <circle cx={n.x} cy={n.y} r="26" fill="#060D1B" stroke={stroke} strokeWidth={n.tone === "hot" ? "1.8" : "1"} />
            <text x={n.x} y={n.y - 2} textAnchor="middle" className="font-mono" fontSize="8.5" fill={labelColor}>
              {n.label}
            </text>
            {n.sub && (
              <text x={n.x} y={n.y + 7} textAnchor="middle" className="font-mono" fontSize="5.5" fill="rgba(250,251,255,0.5)">
                {n.sub}
              </text>
            )}
            <text x={n.x} y={n.y + (n.sub ? 15 : 8)} textAnchor="middle" className="font-mono" fontSize="5" fill={labelColor}>
              ({n.tag})
            </text>
          </g>
        );
      })}
    </svg>
  </div>
);

export const BlastRadius = () => {
  const root = useAnimeScope(({ self, reduceMotion, anime }) => {
    const { utils, animate, stagger, onScroll, svg } = anime;

    if (svg && svg.createDrawable) {
      const edges = svg.createDrawable(".graph-edge");
      if (reduceMotion) {
        utils.set(edges, { draw: "0 1" });
      } else {
        utils.set(edges, { draw: "0 0" });
        animate(edges, {
          draw: ["0 0", "0 1"],
          duration: 900,
          delay: stagger(120),
          ease: "inOut(2)",
          autoplay: onScroll({ target: ".blast-graph", enter: "top 80%" }),
        });
      }
    }

    if (!reduceMotion) {
      animate(".graph-node-hot circle", {
        opacity: [1, 0.55, 1],
        duration: 1600,
        loop: true,
        ease: "inOutSine",
      });
    }
  }, []);

  return (
    <section
      ref={root}
      id="blast-radius"
      className="w-full bg-midnight py-16 md:py-28 relative overflow-hidden"
    >
      <div className="section-shell relative z-10">
        <SectionLabel label="Blast Radius" className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div>
            <h2 className="font-display font-extrabold text-white text-display-sm leading-[1.0] tracking-[-0.02em]">
              You can be shut in by someone else's violation.
            </h2>
            <p className="mt-6 text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
              When any lease on a shared surface commingle (Form P-17) is severed,
              every lease on that permit stops producing — including yours. That
              severance is filed against the other operator, so it never appears in
              your own records. You find out when your purchaser rejects the load.
            </p>
            <p className="mt-4 text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
              LettersIQ builds the commingle graph from the RRC's imaged P-17 filings,
              then watches your neighbors' leases the same way it watches yours.
            </p>

            {/* Example alert — faithful product copy without decorative terminal syntax */}
            <div className="mt-8 border border-signalRed/45 bg-signalSoft">
              <div className="flex items-center justify-between border-b border-signalRed/25 px-5 py-3">
                <span className="text-sm font-semibold text-white">Example alert</span>
                <span className="font-mono text-xs font-semibold text-signalBright">
                  Critical
                </span>
              </div>
              <div className="space-y-3 px-5 py-4 text-sm leading-relaxed">
                <p className="text-white/80">
                  Third-party lease 08-12345 MCFADDIN TRUST (operator: SOMEONE ELSE LLC)
                  on your shared surface commingle CLAM LAKE (18458001) is under an
                  outstanding severance.
                </p>
                <p className="font-semibold text-signalBright">
                  Commingled leases cannot produce or move stock until it clears.
                </p>
                <p className="text-white/80">
                  <span className="font-semibold text-[#F0B429]">Your affected leases:</span>{" "}
                  08-08559, 08-09012
                </p>
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className="blast-graph relative">
            <div className="border border-white/15 bg-white/[0.02] p-4">
              <CommingleGraph />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-white/65">
              <span>Commingle graph</span>
              <span className="text-white/70">Source: RRC Form P-17</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/65">
          By hand, this means cross-referencing two disconnected RRC systems — every day.
        </div>
      </div>
    </section>
  );
};
