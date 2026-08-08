import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { settle } from "../lib/motion.js";
import { duration } from "../lib/motionTokens.js";
import { SectionLabel } from "./Primitives.jsx";

const testimonialsData = [
  {
    customerName: "John Smith",
    customerTitle: "Founder, Barnett Exploration",
    content:
      "LettersIQ has been a game-changer for our compliance management. The real-time notifications and comprehensive monitoring help us stay ahead of potential issues and avoid costly severance actions. The report is easy to parse, and the peace of mind it provides is invaluable.",
  },
  {
    customerName: "Michael Thompson",
    customerTitle: "Head of Regulatory",
    content:
      "Since implementing LettersIQ, we've streamlined our compliance processes and significantly reduced the risk of violations. The detailed reports and customizable alerts keep us informed and in control. A must-have for any operator looking to protect their operations.",
  },
  {
    customerName: "John Chen",
    customerTitle: "Lease Operator",
    content:
      "LettersIQ revolutionized the way we approach compliance. The proactive severance prevention has saved us time, money, and headaches. The platform's ease of use and exceptional support made it an essential part of our daily operations.",
  },
];

export const Testimonials = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    if (reduceMotion) return;
    settle(anime, anime.utils.$(".quote-card"), {
      trigger: ".quote-grid",
      stagger: duration.micro,
    });
  }, []);

  return (
    <section ref={root} className="w-full bg-parchment py-16 md:py-24 relative">
      <div className="absolute -top-16" id="feedback" />
      <div className="absolute top-0 left-0 right-0 h-px bg-line" />

      <div className="section-shell">
        <div className="mb-5">
          <SectionLabel label="From the field" />
        </div>

        <h2 className="mb-12 max-w-2xl text-balance font-display font-extrabold text-labFg text-display-sm tracking-[-0.02em]">
          Operators who stopped guessing.
        </h2>

        {/* Borderless, hairline-divided quotes — deliberately not a bordered card grid */}
        <div className="quote-grid grid grid-cols-1 gap-px bg-line border-y border-line md:grid-cols-3">
          {testimonialsData.map((t, index) => (
            <figure
              key={`${t.customerName}-${index}`}
              className="quote-card flex flex-col bg-parchment px-6 py-8 md:px-8"
            >
              <span aria-hidden className="mb-5 block h-1 w-8 bg-signalRed" />
              <blockquote className="flex-1 text-pretty text-[15px] leading-relaxed text-labFg">
                {t.content}
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <div className="text-sm font-semibold text-labFg">{t.customerName}</div>
                <div className="mt-1 text-sm text-labFgMuted">
                  {t.customerTitle}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
