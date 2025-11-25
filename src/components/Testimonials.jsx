import { motion } from "framer-motion";
import React from 'react';

const testimonialsData = [
  {
    customerName: "John Smith",
    customerTitle: "Founder of Barnett Exploration",
    content: "LettersIQ has been a game-changer for our compliance management. The real-time notifications and comprehensive monitoring have helped us stay ahead of potential issues and avoid costly severance actions. The report is very easy to parse through and see what's relevant, and the peace of mind it provides is invaluable.",
    code: "RPT_001"
  },
  {
    customerName: "Michael Thompson",
    customerTitle: "Head of Regulatory",
    content: "Since implementing LettersIQ, we've streamlined our compliance processes and significantly reduced the risk of violations. The detailed reports and customizable alerts keep us informed and in control. It's a must-have tool for any operator looking to maintain compliance and protect their operations.",
    code: "RPT_002"
  },
  {
    customerName: "John Chen",
    customerTitle: "Lease Operator",
    content: "LettersIQ has revolutionized the way we approach compliance. The proactive severance prevention features have saved us time, money, and headaches. The platform's ease of use and exceptional customer support have made it an essential part of our daily operations. We couldn't be happier with the results.",
    code: "RPT_003"
  },
];

export const Testimonials = () => (
  <section className="w-full bg-labBg py-16 md:py-24 relative">
    <div className="absolute -top-16" id="feedback" />
    
    {/* Top border */}
    <div className="absolute top-0 left-0 right-0 h-px bg-labBorder" />
    
    <div className="max-w-7xl mx-auto px-6 md:px-8">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-6"
      >
        <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">04</span>
        <span className="w-12 h-px bg-labBorder" />
        <span className="font-mono text-xs text-labFgMuted uppercase tracking-widest">FIELD REPORTS</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-labFg mb-4">
          What Our Customers Say
        </h2>
        <p className="text-labFgMuted max-w-2xl">
          Trusted by operators across Texas for compliance monitoring and severance prevention.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {testimonialsData.map((testimonial, index) => (
          <motion.div
            key={`${testimonial.customerName}-${index}`}
            className="border border-labBorder bg-labBg hover:border-labFg transition-colors duration-300 relative group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {/* Card header */}
            <div className="p-4 border-b border-labBorder flex items-center justify-between">
              <span className="font-mono text-xs text-labFgMuted">{testimonial.code}</span>
              <span className="font-mono text-xs text-labFgMuted">VERIFIED</span>
            </div>
            
            {/* Card content */}
            <div className="p-6">
              {/* Quote mark */}
              <div className="font-mono text-4xl text-labBorder mb-4 leading-none">"</div>
              
              <p className="text-labFg text-sm leading-relaxed mb-6">
                {testimonial.content}
              </p>
              
              {/* Author info */}
              <div className="flex items-center gap-4 pt-4 border-t border-labBorder">
                <div className="w-10 h-10 border border-labBorder flex items-center justify-center font-mono text-sm text-labFg bg-labBgAlt">
                  {testimonial.customerName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-labFg text-sm">
                    {testimonial.customerName}
                  </div>
                  <div className="font-mono text-xs text-labFgMuted">
                    {testimonial.customerTitle}
                  </div>
                </div>
              </div>
            </div>

            {/* Hover corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-transparent group-hover:border-labFg transition-colors" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-transparent group-hover:border-labFg transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Bottom technical bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 pt-6 border-t border-labBorder flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-labFgMuted"
      >
        <span>/// CUSTOMER TESTIMONIALS</span>
        <span>TOTAL REPORTS: {testimonialsData.length}</span>
        <span>STATUS: VERIFIED</span>
      </motion.div>
    </div>
  </section>
);
