import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

// shadcn/ui Button, adapted to the LettersIQ Lone Star palette + Emil press feel.
// Emil: buttons must feel responsive (scale on :active), animate transform/opacity
// only, custom ease-out curve, sub-200ms feedback.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono uppercase tracking-[0.12em] font-medium select-none transition-[transform,background-color,color,border-color] duration-150 ease-out-strong will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobaltText focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-signalRed text-white hover:bg-signalRedHover",
        outline:
          "border border-lineControl bg-transparent text-labFg hover:border-labFg hover:bg-parchmentAlt",
        ghost: "bg-transparent text-labFg hover:bg-parchmentAlt",
        ghostDark: "bg-transparent text-white/80 hover:text-white hover:bg-white/10",
        secondary: "bg-oxford text-white hover:bg-slateNavy",
      },
      size: {
        default: "px-7 py-4 text-sm",
        // Compact only in width — every size still clears the 44px target floor.
        sm: "min-h-11 px-4 py-2.5 text-xs",
        lg: "px-9 py-5 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        style={{ borderRadius: 2, ...style }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
