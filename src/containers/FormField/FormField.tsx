import { Input, InputLabel, InputProps } from "@/components";

interface Props extends InputProps {
  label: string;
  name: string;
  inputClassName?: string;
  labelClassName?: string;
}

export const FormField = ({
  label,
  name,
  className,
  inputClassName,
  labelClassName,
  ...props
}: Props): JSX.Element => {
  return (
    <div className={className}>
      <InputLabel htmlFor={name} className={labelClassName}>
        {label}
      </InputLabel>
      <Input id={name} name={name} className={inputClassName} {...props} />
    </div>
  );
};
