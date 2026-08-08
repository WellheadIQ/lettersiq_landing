import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { settle } from "../lib/motion.js";
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

export const Pricing = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    if (reduceMotion) return;
    settle(anime, anime.utils.$(".pricing-card"), {
      trigger: ".pricing-card",
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
              Regulatory intelligence for every lease you operate.
            </h2>
          </div>
          <p className="md:col-span-5 text-labFgMuted text-base md:text-lg leading-relaxed md:pb-1">
            Every monitored dataset, connected-record alert, and morning briefing
            is included at one per-lease price.
          </p>
        </div>

        <div className="pricing-card relative border-2 border-oxford bg-card shadow-float">
          <div className="h-1.5 bg-signalRed" />
          <div className="flex items-center justify-between border-b border-line bg-parchmentAlt px-5 py-3.5 font-mono text-xs sm:px-6">
            <span className="text-labFg">Complete coverage</span>
            <span className="flex items-center gap-2 text-cobaltText">
              <span className="h-2 w-2 rounded-full bg-cobalt" aria-hidden="true" />
              One complete plan
            </span>
          </div>

          <div className="grid min-w-0 lg:grid-cols-[0.82fr_1.35fr]">
            <div className="flex min-w-0 flex-col bg-oxford p-7 text-white sm:p-9 lg:p-10">
              <div className="inline-flex self-start items-center gap-2 border border-white/20 px-3 py-2 font-mono text-xs text-white/70">
                <StarMark size={10} className="text-signalBright" />
                EVERYTHING INCLUDED
              </div>

              <div className="mt-10">
                <div className="font-mono text-xs text-white/70">
                  PER LEASE / MONTH
                </div>
                <div className="mt-2 flex items-start">
                  <span className="font-display text-3xl sm:text-4xl font-bold text-signalBright mt-2">$</span>
                  <span className="font-display text-[6.5rem] sm:text-[8rem] leading-[0.82] font-extrabold tracking-[-0.04em]">
                    4
                  </span>
                </div>
              </div>

              <p className="mt-7 text-white/60 leading-relaxed max-w-sm">
                Start with one lease or protect the full operating portfolio.
                Billing scales with you.
              </p>

              <Button asChild className="w-full mt-9 shadow-none">
                <a href="#contact-us">
                  Request an Operator Review
                  <span aria-hidden>&rarr;</span>
                </a>
              </Button>

              <div className="mt-4 text-sm text-white/65">
                No credit card required
              </div>
            </div>

            <div className="min-w-0 p-6 sm:p-8 lg:p-10">
              <div className="pb-6 border-b border-line">
                <h3 className="font-display text-2xl font-bold text-labFg">
                  No feature gates.
                </h3>
                <p className="mt-1.5 text-sm text-labFgMuted">
                  Every dataset and alert type, on every lease you operate.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8">
                {pricingFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex gap-3 py-4 border-b border-line"
                  >
                    <span className="mt-0.5 w-5 h-5 bg-signalRed text-white flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div className="text-labFg text-sm leading-snug pt-0.5">{feature}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 mt-7 border border-line divide-x divide-line">
                {[
                  ["8", "DATASETS"],
                  ["1", "CONNECTED VIEW"],
                  ["7 AM", "BRIEFING"],
                ].map(([value, label]) => (
                  <div key={label} className="px-3 py-4 text-center">
                    <div className="font-display text-xl sm:text-2xl font-bold text-labFg">{value}</div>
                    <div className="mt-1 break-words text-xs text-labFgMuted">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm text-labFgMuted">
          <span>Start with one lease or review the full portfolio</span>
          <span className="text-labFg">Monitoring begins after operator setup</span>
        </div>
      </div>
    </section>
  );
};
