import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import clsx from "clsx";

const chipVariants = cva(
  clsx(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg",
    "text-base",
    "ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-brand-950 dark:focus-visible:ring-brand-300"
  ),
  {
    variants: {
      variant: {
        filled:
          "font-medium bg-brand-500 text-brand-50 hover:bg-brand-900/90 dark:bg-brand-50 dark:text-brand-900 dark:hover:bg-brand-50/90",
        outlined:
          "border border-brand-200 bg-white hover:bg-brand-100 hover:text-brand-900 dark:border-brand-800 dark:bg-brand-950 dark:hover:bg-brand-800 dark:hover:text-brand-50",
      },
      size: {
        default: "px-3 py-1.5 text-sm",
        small: "px-2 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {}

const Chip = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(chipVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Chip.displayName = "Button";

export { Chip };
