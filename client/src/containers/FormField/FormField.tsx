import {
  HelperText,
  Input,
  InputLabel,
  InputProps,
  Textarea,
  TextareaProps,
} from "@/components";
import clsx from "clsx";

type ComponentProps = TextareaProps & InputProps;

interface Props extends ComponentProps {
  label: string;
  name: string;
  inputClassName?: string;
  labelClassName?: string;
  component?: "input" | "textarea";

  helperText?: string;
  error?: boolean;
}

export const FormField = ({
  label,
  name,
  className,
  component = "input",
  inputClassName,
  labelClassName,
  helperText,
  error = false,
  ...props
}: Props): JSX.Element => {
  const Component = component === "input" ? Input : Textarea;

  return (
    <div className={className}>
      <InputLabel htmlFor={name} className={labelClassName}>
        {label}
      </InputLabel>
      <Component
        error={error}
        id={name}
        name={name}
        className={inputClassName}
        {...props}
      />
      {helperText && (
        <HelperText error={error} helperText={helperText} className="mt-1" />
      )}
    </div>
  );
};
