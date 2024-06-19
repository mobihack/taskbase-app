import { cn } from "@/lib/utils";
import { LabelHTMLAttributes, forwardRef } from "react";

export interface InputLabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {}

const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn("flex w-full px-3 py-2 text-xs font-medium", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
InputLabel.displayName = "Input";

export { InputLabel };
