import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from 'react';

const FAQData = [
  {
    question: "What is well severance, and why should I be concerned about it?",
    answer:
      "Well severance occurs when The Texas Railroad Commission shuts in or seals a well due to violations of statutes, rules, permits, or orders. This action can halt production and lead to significant financial losses, making it crucial for operators to stay compliant and avoid severance actions.",
    code: "FAQ_001"
  },
  {
    question: "How do I sign up?",
    answer:
      "Click on the 'Get Started' button on the top of this page and we'll reach out right away.",
    code: "FAQ_002"
  },
  {
    question: "What time does the report get delivered to me?",
    answer:
      "We deliver the report around 7.00am CST every day right to your inbox.",
    code: "FAQ_003"
  },
  {
    question: "How does receiving immediate notifications benefit our compliance efforts?",
    answer:
      "Receiving immediate notifications through our service, as opposed to waiting for traditional certified mail, significantly enhances your ability to respond swiftly and effectively to potential compliance issues. No more running the query manually, worrying about the mail on vacation, or waiting at the post office. Simply subscribe and check your email and you're good to go.",
    code: "FAQ_004"
  },
  {
    question: "What's your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee . If you're not satisfied with our service, simply contact our support team within 30 days of purchase for a full refund.",
    code: "FAQ_005"
  },
  {
    question: "What kind of alerts and updates does your service provide?",
    answer:
      "We deliver notifications regarding any operation actions that may violate statutes, rules, or commission orders. This includes, but is not limited to, Delinquent H-10 filings, fee dues, and any operational activities that need immediate attention to prevent severance. Right now, we only work on delivering you Texas Railroad Commission notifications.",
    code: "FAQ_006"
  },
];

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 md:py-24 bg-labBg overflow-hidden">
      <div className="absolute -top-10" id="FAQ" />
      
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-labBorder" />

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">06</span>
          <span className="w-12 h-px bg-labBorder" />
          <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">DOCUMENTATION</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-labFg mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-labFgMuted">
            Common inquiries about our compliance monitoring service.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="border border-labBorder divide-y divide-labBorder">
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

        {/* Bottom technical bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-labFgMuted"
        >
          <span>/// DOCUMENTATION v2.0</span>
          <span>TOTAL ENTRIES: {FAQData.length}</span>
          <span>LAST UPDATED: 2024</span>
        </motion.div>
      </div>
    </section>
  );
};

const FAQBox = ({ index, title, content, code, isOpen, onToggle }) => (
  <motion.div
    className="cursor-pointer group"
    onClick={onToggle}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <div className={`px-6 py-5 flex items-start gap-4 transition-colors ${isOpen ? 'bg-labBgAlt' : 'hover:bg-labBgAlt'}`}>
      {/* Index number */}
      <span className="font-mono text-xs text-labFgMuted pt-1">
        {String(index + 1).padStart(2, '0')}
      </span>
      
      {/* Question */}
      <div className="flex-1">
        <h3 className="text-base md:text-lg text-labFg font-medium pr-8">
          {title}
        </h3>
      </div>
      
      {/* Code and toggle */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-labFgMuted hidden md:block">{code}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 border border-labBorder flex items-center justify-center group-hover:border-labFg transition-colors"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-labFgMuted group-hover:text-labFg transition-colors"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </div>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="px-6 py-5 pl-16 bg-labBgAlt border-t border-labBorder">
            <p className="text-labFgMuted leading-relaxed">{content}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);
