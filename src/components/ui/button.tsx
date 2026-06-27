import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold cursor-pointer",
    "rounded-xl transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-[0.97]",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — deep navy with lift on hover
        default:
          "bg-primary text-primary-foreground shadow-sm " +
          "hover:bg-primary/90 hover:shadow-md hover:-translate-y-px",

        // Gold CTA — warm gold, most prominent action
        gold:
          "bg-gold text-white shadow-sm " +
          "hover:bg-[#a07020] hover:shadow-[0_6px_20px_oklch(0.72_0.13_75/0.35)] hover:-translate-y-px",

        // Destructive — red for dangerous actions
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm " +
          "hover:bg-destructive/90 hover:shadow-md hover:-translate-y-px",

        // Outline — bordered, transparent fill
        outline:
          "border-2 border-input bg-background text-foreground " +
          "hover:border-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-px",

        // Outline gold — bordered gold variant for secondary CTAs
        "outline-gold":
          "border-2 border-gold text-gold bg-transparent " +
          "hover:bg-gold hover:text-white hover:-translate-y-px",

        // Secondary — subtle filled
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm " +
          "hover:bg-secondary/70 hover:-translate-y-px",

        // Ghost — no background until hover
        ghost:
          "text-foreground " +
          "hover:bg-accent hover:text-accent-foreground",

        // Link — text-only with underline
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs:      "h-7 rounded-lg px-3 text-xs gap-1.5",
        sm:      "h-9 rounded-lg px-4 text-sm",
        default: "h-11 px-6 py-2.5 text-sm",
        lg:      "h-12 rounded-xl px-8 text-base",
        xl:      "h-14 rounded-xl px-10 text-base tracking-wide",
        icon:    "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
