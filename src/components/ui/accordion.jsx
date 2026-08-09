import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "../../lib/utils.js";

// shadcn/ui Accordion (Radix) — gives us correct keyboard a11y and interruptible,
// GPU-friendly height animation via CSS. Styled to the LettersIQ terminal look.
const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b border-line last:border-b-0", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-start gap-4 px-5 sm:px-6 py-5 text-left transition-colors duration-150 ease-out-strong",
        "hover:bg-parchmentAlt data-[state=open]:bg-parchmentAlt",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cobaltText",
        className
      )}
      {...props}
    >
      <span className="flex-1 text-base md:text-lg text-labFg font-medium pr-2">{children}</span>
      <div className="flex items-center shrink-0">
        <span className="w-7 h-7 border border-line flex items-center justify-center transition-colors duration-150 ease-out-strong group-hover:border-labFg group-data-[state=open]:border-labFg">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="text-labFgMuted transition-transform duration-[250ms] ease-out-strong group-hover:text-labFg group-data-[state=open]:rotate-180"
          >
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none"
    {...props}
  >
    <div className={cn("px-5 sm:px-6 py-5 sm:pl-[3.75rem] bg-parchmentAlt border-t border-line", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
