import React from "react";
import { SectionLabel, StarMark } from "./Primitives.jsx";
import { Button } from "./ui/button.jsx";

const pricingFeatures = [
  { code: "DLY", text: "Daily briefing delivered 7:00 AM CST" },
  { code: "SEV", text: "Severance, seal & certified-letter alerts" },
  { code: "P5", text: "P-5 renewal countdown & Rule 15 blockers" },
  { code: "PRO", text: "Proration delinquent-code & allowable diffs" },
  { code: "CMG", text: "Commingle blast-radius monitoring" },
  { code: "PMT", text: "Drilling-permit expiry & P-4 change alerts" },
  { code: "RCA", text: "Root-cause analysis on every alert" },
  { code: "MLM", text: "Multi-lease management included" },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="w-full bg-parchmentAlt py-16 md:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-line" />

      <div className="section-shell">
        <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-12">
          <div className="md:col-span-7">
            <SectionLabel number="07" label="Pricing" className="mb-5" />
            <h2 className="font-display font-extrabold text-labFg text-display-sm">
              One price. The whole signal.
            </h2>
          </div>
          <p className="md:col-span-5 text-labFgMuted text-base md:text-lg leading-relaxed md:pb-1">
            Every monitored dataset, every root-cause alert, and every lease you
            operate—without add-ons or annual lock-in.
          </p>
        </div>

        <div className="relative border-2 border-oxford bg-card shadow-panelLg">
          <span className="bracket -top-2 -left-2 border-l-2 border-t-2 border-labFg" />
          <span className="bracket -top-2 -right-2 border-r-2 border-t-2 border-labFg" />
          <span className="bracket -bottom-2 -left-2 border-l-2 border-b-2 border-labFg" />
          <span className="bracket -bottom-2 -right-2 border-r-2 border-b-2 border-labFg" />

          <div className="h-1.5 bg-gradient-to-r from-signalRed via-signalRed to-cobalt" />
          <div className="px-5 sm:px-6 py-3.5 border-b border-line flex items-center justify-between bg-parchment font-mono text-[10px] sm:text-[11px] tracking-[0.14em]">
            <span className="text-labFg">PLAN_001 / COMPLETE COVERAGE</span>
            <span className="flex items-center gap-2 text-cobalt">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-40 animate-ping motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cobalt" />
              </span>
              AVAILABLE
            </span>
          </div>

          <div className="grid lg:grid-cols-[0.82fr_1.35fr]">
            <div className="bg-oxford text-white p-7 sm:p-9 lg:p-10 flex flex-col">
              <div className="inline-flex self-start items-center gap-2 border border-white/20 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-white/65">
                <StarMark size={10} className="text-signalBright" />
                EVERYTHING INCLUDED
              </div>

              <div className="mt-10">
                <div className="font-mono text-[10px] tracking-[0.18em] text-white/45">
                  PER LEASE / MONTH
                </div>
                <div className="mt-2 flex items-start">
                  <span className="font-display text-3xl sm:text-4xl font-bold text-signalBright mt-2">$</span>
                  <span className="font-display text-[6.5rem] sm:text-[8rem] leading-[0.82] font-extrabold tracking-[-0.07em]">
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
                  Protect My Leases
                  <span aria-hidden>&rarr;</span>
                </a>
              </Button>

              <div className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-wider text-white/45">
                <span className="text-signalBright">///</span>
                30-DAY GUARANTEE · CANCEL ANYTIME
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-line">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.16em] text-signalRed">
                    COVERAGE MANIFEST
                  </div>
                  <h3 className="font-display text-2xl font-bold text-labFg mt-2">
                    No feature gates.
                  </h3>
                </div>
                <span className="hidden sm:block font-display text-5xl font-extrabold text-parchmentAlt">
                  08
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8">
                {pricingFeatures.map((feature) => (
                  <div
                    key={feature.code}
                    className="flex gap-3 py-4 border-b border-line"
                  >
                    <span className="mt-0.5 w-5 h-5 bg-signalRed text-white flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-mono text-[9px] tracking-[0.14em] text-cobalt mb-1">
                        {feature.code}
                      </div>
                      <div className="text-labFg text-sm leading-snug">{feature.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 mt-7 border border-line divide-x divide-line">
                {[
                  ["8", "DATASETS"],
                  ["25+", "ALERT TYPES"],
                  ["7 AM", "DELIVERY"],
                ].map(([value, label]) => (
                  <div key={label} className="px-3 py-4 text-center">
                    <div className="font-display text-xl sm:text-2xl font-bold text-labFg">{value}</div>
                    <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.13em] text-labFgMuted mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.14em] text-labFgMuted">
          <span>NO SETUP FEE / NO ANNUAL CONTRACT</span>
          <span className="text-signalRed">&gt;&gt;&gt;&gt;&gt; MONITORING STARTS NEXT CYCLE</span>
        </div>
      </div>
    </section>
  );
};
