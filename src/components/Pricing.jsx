import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { settle } from "../lib/motion.js";
import { duration } from "../lib/motionTokens.js";
import { SectionLabel, StarMark } from "./Primitives.jsx";
import { Button } from "./ui/button.jsx";

const pricingFeatures = [
  "Daily briefing delivered 7:00 AM CT",
  "Severance, seal & certified-letter alerts",
  "P-5 renewal countdown & Rule 15 blockers",
  "Proration delinquent-code & allowable diffs",
  "Commingle blast-radius monitoring",
  "Drilling-permit expiry & P-4 change alerts",
  "Connected context and next-step guidance",
  "Multi-lease management included",
];

// Priced on the operating portfolio being protected, not on record count —
// the value is the production that keeps running, not the rows we read.
const tiers = [
  {
    name: "Essential",
    scope: "Up to 100 leases",
    price: "$399",
    cadence: "/ month",
    body: "For single-basin operators who need the whole RRC picture without a compliance team.",
  },
  {
    name: "Operator",
    scope: "Up to 500 leases",
    price: "$999",
    cadence: "/ month",
    body: "For multi-field operators where one severance can interrupt revenue across several counties.",
    featured: true,
  },
  {
    name: "Enterprise",
    scope: "500+ leases",
    price: "Custom",
    body: "For large portfolios, acquisition diligence, and teams that need LettersIQ alongside their own systems.",
  },
];

export const Pricing = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    if (reduceMotion) return;
    settle(anime, anime.utils.$(".pricing-card"), {
      trigger: ".pricing-tiers",
      enter: "92% top",
      stagger: duration.micro,
    });
    settle(anime, anime.utils.$(".pricing-included"), {
      trigger: ".pricing-included",
      enter: "92% top",
    });
  }, []);

  return (
    <section
      ref={root}
      id="pricing"
      className="w-full bg-parchmentAlt py-16 md:py-24 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-line" />

      <div className="section-shell">
        <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-12">
          <div className="md:col-span-7">
            <SectionLabel label="Pricing" className="mb-5" />
            <h2 className="font-display font-extrabold text-labFg text-display-sm">
              Priced on the portfolio you operate.
            </h2>
          </div>
          <p className="md:col-span-5 text-labFgMuted text-base md:text-lg leading-relaxed md:pb-1">
            Every monitored dataset, connected-record alert, and morning briefing
            is included in every plan. You choose the size of the portfolio it
            protects.
          </p>
        </div>

        <div className="pricing-tiers grid gap-5 lg:grid-cols-3 lg:gap-6">
          {tiers.map((tier) => (
            <TierCard key={tier.name} {...tier} />
          ))}
        </div>

        <div className="pricing-included mt-6 border-2 border-oxford bg-card shadow-float">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line bg-parchmentAlt px-5 py-3.5 font-mono text-xs sm:px-6">
            <span className="text-labFg">Included in every plan</span>
            <span className="flex items-center gap-2 text-cobaltText">
              <span className="h-2 w-2 rounded-full bg-cobalt" aria-hidden="true" />
              No feature gates
            </span>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
              {pricingFeatures.map((feature) => (
                <div key={feature} className="flex gap-3 border-b border-line py-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-signalRed text-white">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div className="pt-0.5 text-sm leading-snug text-labFg">{feature}</div>
                </div>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-3 divide-x divide-line border border-line">
              {[
                ["8", "DATASETS"],
                ["1", "CONNECTED VIEW"],
                ["7 AM", "BRIEFING"],
              ].map(([value, label]) => (
                <div key={label} className="px-3 py-4 text-center">
                  <div className="font-display text-xl font-bold text-labFg sm:text-2xl">
                    {value}
                  </div>
                  <div className="mt-1 break-words text-xs text-labFgMuted">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm text-labFgMuted">
          <span>Annual billing available on every plan</span>
          <span className="text-labFg">Monitoring begins after operator setup</span>
        </div>
      </div>
    </section>
  );
};

const TierCard = ({ name, scope, price, cadence, body, featured }) => (
  <div
    className={`pricing-card relative flex flex-col border-2 border-oxford shadow-float ${
      featured ? "bg-oxford text-white" : "bg-card"
    }`}
  >
    <div className={`h-1.5 ${featured ? "bg-signalRed" : "bg-transparent"}`} />

    <div className="flex flex-1 flex-col p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h3
          className={`font-display text-xl font-bold ${
            featured ? "text-white" : "text-labFg"
          }`}
        >
          {name}
        </h3>
        {featured && (
          <span className="inline-flex items-center gap-1.5 border border-white/20 px-2.5 py-1 font-mono text-[11px] text-white/70">
            <StarMark size={9} className="text-signalBright" />
            MOST OPERATORS
          </span>
        )}
      </div>

      <div
        className={`mt-1 font-mono text-xs ${
          featured ? "text-white/70" : "text-labFgMuted"
        }`}
      >
        {scope.toUpperCase()}
      </div>

      <div className="mt-7 flex items-baseline gap-1.5">
        <span
          className={`font-display text-[3.25rem] font-extrabold leading-none tracking-[-0.03em] ${
            featured ? "text-white" : "text-labFg"
          }`}
        >
          {price}
        </span>
        {cadence && (
          <span
            className={`font-mono text-sm ${
              featured ? "text-white/60" : "text-labFgMuted"
            }`}
          >
            {cadence}
          </span>
        )}
      </div>

      <p
        className={`mt-5 flex-1 text-[15px] leading-relaxed ${
          featured ? "text-white/65" : "text-labFgMuted"
        }`}
      >
        {body}
      </p>

      <Button
        asChild
        variant={featured ? "default" : "outline"}
        className="mt-7 w-full shadow-none"
      >
        <a href="#contact-us">
          Check My Operator
          <span aria-hidden>&rarr;</span>
        </a>
      </Button>
    </div>
  </div>
);
