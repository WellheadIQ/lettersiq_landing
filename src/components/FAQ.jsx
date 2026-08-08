import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { settle } from "../lib/motion.js";
import { duration } from "../lib/motionTokens.js";
import { SectionLabel } from "./Primitives.jsx";
import { faq } from "../data/faq.js";

export const FAQ = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    if (reduceMotion) return;
    settle(anime, anime.utils.$(".faq-item"), {
      trigger: ".faq-list",
      stagger: duration.stagger,
      enter: "88% top",
    });
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-parchment py-16 md:py-24"
    >
      <div className="absolute -top-10" id="FAQ" />
      <div className="absolute left-0 right-0 top-0 h-px bg-line" />

      <div className="section-shell">
        <SectionLabel label="FAQ" className="mb-5" />

        <div className="mb-12 max-w-3xl">
          <h2 className="text-balance font-display text-display-sm font-extrabold tracking-[-0.02em] text-labFg">
            Built for operators, not data analysts.
          </h2>
          <p className="mt-4 text-pretty text-base text-labFgMuted md:text-lg">
            LettersIQ is not another database your team has to learn. Here is how
            the monitoring, connected-record analysis, and operator review work.
          </p>
        </div>

        {/* Open Q&A — every answer visible. No accordion, no “view more.” */}
        <dl className="faq-list grid grid-cols-1 gap-x-16 border-t border-line md:grid-cols-2">
          {faq.map((item) => (
            <div
              key={item.question}
              className="faq-item border-b border-line py-7"
            >
              <dt className="text-balance font-display text-base font-bold tracking-[-0.01em] text-labFg md:text-lg">
                {item.question}
              </dt>
              <dd className="mt-3 max-w-prose text-pretty text-[15px] leading-relaxed text-labFgMuted">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-labFgMuted">
          <span>Still have a question?</span>
          <a
            href="#contact-us"
            className="link-underline inline-flex min-h-11 items-center text-labFg"
          >
            Request an operator review &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
