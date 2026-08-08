/**
 * Single source of truth for the FAQ.
 * Rendered as visible <dl> copy by FAQ.jsx and as FAQPage JSON-LD by Seo.astro —
 * Google penalises schema whose answers don't match the on-page text, so both
 * must read from here.
 */
export const faq = [
  {
    question: "What is LettersIQ?",
    answer:
      "LettersIQ is a regulatory operations intelligence service for Texas oil and gas operators. It monitors public Texas Railroad Commission records, connects related filings across systems, and delivers a prioritized morning briefing showing what changed, what it affects, why it matters, and what needs attention.",
  },
  {
    question: "What does LettersIQ monitor?",
    answer:
      "Eight public RRC systems: severance and seal orders, certified pre-severance letters, P-5 organization status, Rule 15 inactive wells, proration schedules and allowables, surface commingling permits (P-17), drilling permits (W-1), and gatherer or purchaser filings (P-4).",
  },
  {
    question: "What appears in the morning briefing?",
    answer:
      "The briefing contains new regulatory activity since the previous scan, the leases and records connected to each issue, the likely operational impact, and the filing, deadline, or underlying problem your team should investigate. It is delivered around 7:00 AM CT.",
  },
  {
    question: "How is this different from checking an operator number?",
    answer:
      "An operator-number search only returns records filed against that operator. LettersIQ also maps relationships across datasets, so it can surface risks created by another operator, a shared P-17 commingle, or a filing dependency that lives in a different RRC system.",
  },
  {
    question: "What is commingle blast radius?",
    answer:
      "If several leases share one surface commingling permit (P-17), a severance on one co-member can stop production across the commingle. The triggering record may sit under another operator. LettersIQ maps the P-17 relationship and watches every connected lease so that hidden exposure reaches your briefing.",
  },
  {
    question: "Can LettersIQ help explain why a well has no allowable?",
    answer:
      "LettersIQ can work backwards through the relevant filing dependencies and identify what appears to be missing, such as a W-2 or G-1 completion report, W-12 directional survey, L-1 electric log, or W-15 cementing report. The result is a named checklist for your team to investigate, not another database to search.",
  },
  {
    question: "How does early-warning monitoring prevent production interruptions?",
    answer:
      "Many production problems have public signals before the final consequence: a certified letter, an approaching P-5 expiration, a delinquent proration code, a Rule 15 milestone, or an expiring permit. LettersIQ surfaces those upstream changes while there may still be time to investigate and act.",
  },
  {
    question: "How do I request an operator review?",
    answer:
      "Use the operator review form on this page and send your operator name and contact details. We will follow up to understand your portfolio and discuss the appropriate LettersIQ monitoring setup. No credit card is required to request the review.",
  },
];
