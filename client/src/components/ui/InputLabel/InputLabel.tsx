import { forwardRef,LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface InputLabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {}

const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn(
          "flex w-full px-3 py-2 text-xs font-medium text-gray-800",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
InputLabel.displayName = "Input";

export { InputLabel };
