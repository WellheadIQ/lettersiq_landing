import React from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { SectionLabel } from "./Primitives.jsx";

const FAQData = [
  {
    question: "What is well severance, and why should I be concerned about it?",
    answer:
      "Well severance occurs when the Texas Railroad Commission shuts in or seals a well due to violations of statutes, rules, permits, or orders. This action can halt production and lead to significant financial losses, making it crucial for operators to stay compliant and avoid severance actions.",
  },
  {
    question: "How do I sign up?",
    answer:
      "Click the 'Get Started' button at the top of this page and we'll reach out right away.",
  },
  {
    question: "What time does the report get delivered to me?",
    answer: "We deliver the report around 7:00 AM CT every day, right to your inbox.",
  },
  {
    question: "How do early notifications benefit our compliance efforts?",
    answer:
      "Receiving early notifications, instead of waiting for traditional certified mail, gives you more time to respond to potential compliance issues. No more running the query manually, worrying about the mail on vacation, or waiting at the post office. Check the daily briefing and act on what changed.",
  },
  {
    question: "What's your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied with our service, simply contact our support team within 30 days of purchase for a full refund.",
  },
  {
    question: "What kind of alerts and updates does your service provide?",
    answer:
      "We deliver notifications regarding any operational actions that may violate statutes, rules, or commission orders. This includes, but is not limited to, delinquent H-10 filings, fee dues, and any operational activities that need immediate attention to prevent severance. Right now, we focus on delivering Texas Railroad Commission notifications.",
  },
  {
    question: "What does LettersIQ monitor besides severance letters?",
    answer:
      "Eight public RRC datasets: severance and seal orders, certified (pre-severance) letters, P-5 organization renewal status, the Rule 15 inactive-well aging report, monthly proration schedules, surface commingling permits (P-17), drilling permits (W-1), and gatherer/purchaser filings (P-4). We diff each one and email only what changed.",
  },
  {
    question: "How can you warn me before a severance happens?",
    answer:
      "Most severances are preceded by public signals: a certified letter, a P-5 expiring, a delinquent W-10 on the proration schedule, or an unresolved Rule 15 well. We watch those upstream signals and give you a countdown, so you can cure the issue before the severance order is ever issued.",
  },
  {
    question: "What is commingle blast radius?",
    answer:
      "If several leases share one surface commingling permit (P-17), a severance on any of them stops production on all of them — even leases you don't operate. Because the severance is filed against the other operator, it never appears in your own records. LettersIQ maps your commingles and watches every co-member lease, so you're alerted the moment a neighbor's problem becomes yours.",
  },
  {
    question: "My well is producing but has no allowable — can you tell me why?",
    answer:
      "Yes. When a well shows no allowable on the proration schedule, we cross-reference its drilling permit and completion dependencies and give you a named checklist of what's missing — W-2/G-1 completion report, directional survey (W-12) for horizontal wells, L-1 electric log, W-15 cementing — so you can chase the exact filing instead of guessing.",
  },
  {
    question: "How does P-5 renewal monitoring work?",
    answer:
      "We track your organization report's expiration date and count down at 60, 30, 14, and 7 days, plus an immediate alert if your status flips to Delinquent. An unrenewed P-5 severs every lease your organization holds, so this is the single highest-leverage date we watch.",
  },
  {
    question: "Do I get the new alerts automatically?",
    answer:
      "Expanded alert types are included at no extra cost and enabled per organization, with zero change to the severance notifications you already rely on. Tell us to enable them and the new datasets start appearing in your next briefing.",
  },
];

export const FAQ = () => {
  const root = useAnimeScope(({ reduceMotion, anime }) => {
    const { utils, animate, stagger, onScroll } = anime;
    const items = utils.$(".faq-item");
    if (!items.length || reduceMotion) return;

    utils.set(items, { translateY: 12 });
    animate(items, {
      translateY: [12, 0],
      duration: 400,
      ease: "out(3)",
      delay: stagger(45),
      autoplay: onScroll({ target: ".faq-list", enter: "top 88%" }),
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
            Questions, answered.
          </h2>
          <p className="mt-4 text-pretty text-base text-labFgMuted md:text-lg">
            How the monitoring works, what's covered, and how billing scales —
            all of it, no digging.
          </p>
        </div>

        {/* Open Q&A — every answer visible. No accordion, no “view more.” */}
        <dl className="faq-list grid grid-cols-1 gap-x-16 border-t border-line md:grid-cols-2">
          {FAQData.map((item) => (
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
            Talk to us &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
