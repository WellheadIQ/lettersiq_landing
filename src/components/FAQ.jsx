import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const FAQData = [
  {
    question: "What is well severance, and why should I be concerned about it?",
    answer:
      "Well severance occurs when the Texas Railroad Commission shuts in or seals a well due to violations of statutes, rules, permits, or orders. This action can halt production and lead to significant financial losses, making it crucial for operators to stay compliant and avoid severance actions.",
    code: "FAQ_001",
  },
  {
    question: "How do I sign up?",
    answer:
      "Click the 'Get Started' button at the top of this page and we'll reach out right away.",
    code: "FAQ_002",
  },
  {
    question: "What time does the report get delivered to me?",
    answer: "We deliver the report around 7:00 AM CST every day, right to your inbox.",
    code: "FAQ_003",
  },
  {
    question: "How do immediate notifications benefit our compliance efforts?",
    answer:
      "Receiving immediate notifications, as opposed to waiting for traditional certified mail, significantly enhances your ability to respond swiftly to potential compliance issues. No more running the query manually, worrying about the mail on vacation, or waiting at the post office. Simply subscribe, check your email, and you're good to go.",
    code: "FAQ_004",
  },
  {
    question: "What's your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied with our service, simply contact our support team within 30 days of purchase for a full refund.",
    code: "FAQ_005",
  },
  {
    question: "What kind of alerts and updates does your service provide?",
    answer:
      "We deliver notifications regarding any operational actions that may violate statutes, rules, or commission orders. This includes, but is not limited to, delinquent H-10 filings, fee dues, and any operational activities that need immediate attention to prevent severance. Right now, we focus on delivering Texas Railroad Commission notifications.",
    code: "FAQ_006",
  },
];

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFAQ = (index) => setActiveIndex(activeIndex === index ? null : index);

  return (
    <section className="relative py-16 md:py-24 bg-paper overflow-hidden">
      <div className="absolute -top-10" id="FAQ" />
      <div className="absolute top-0 left-0 right-0 h-px bg-labBorder" />

      <div className="section-shell max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mono-label text-labFgMuted mb-5"
        >
          <span className="text-ember">06</span>
          <span className="w-8 h-px bg-labBorderStrong" />
          <span>Documentation</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mb-10"
        >
          <h2 className="text-display-sm font-bold text-labFg">Frequently asked questions</h2>
          <p className="mt-4 text-labFgMuted text-base md:text-lg">
            Common inquiries about our compliance monitoring service.
          </p>
        </motion.div>

        <div className="border border-labBorder bg-paperPanel divide-y divide-labBorder">
          {FAQData.map((item, index) => (
            <FAQBox
              key={index}
              index={index}
              title={item.question}
              content={item.answer}
              code={item.code}
              isOpen={activeIndex === index}
              onToggle={() => toggleFAQ(index)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-wider text-labFgMuted"
        >
          <span className="text-ember">/// DOCUMENTATION v2.0</span>
          <span>TOTAL ENTRIES: {FAQData.length}</span>
          <span>UPDATED: 2024</span>
        </motion.div>
      </div>
    </section>
  );
};

const FAQBox = ({ index, title, content, code, isOpen, onToggle }) => (
  <div>
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={`w-full text-left cursor-pointer group px-5 sm:px-6 py-5 flex items-start gap-4 transition-colors ${
        isOpen ? "bg-paperAlt" : "hover:bg-paperAlt"
      }`}
    >
      <span className="font-mono text-[11px] text-ember pt-1 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="flex-1 text-base md:text-lg text-labFg font-medium pr-2">{title}</h3>

      <div className="flex items-center gap-4 shrink-0">
        <span className="font-mono text-[11px] text-labFgMuted hidden md:block">{code}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-7 h-7 border border-labBorder flex items-center justify-center group-hover:border-labFg transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-labFgMuted group-hover:text-labFg transition-colors">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="px-5 sm:px-6 py-5 sm:pl-[3.75rem] bg-paperAlt border-t border-labBorder">
            <p className="text-labFgMuted leading-relaxed">{content}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
