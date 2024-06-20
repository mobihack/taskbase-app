import clsx from "clsx";

interface Props {
  className?: string;
  error: boolean;
  helperText: string;
}

export const HelperText = ({
  error,
  helperText,
  className,
}: Props): JSX.Element => {
  return (
    <p
      className={clsx(
        "px-3 text-gray-500 text-xs",
        error && "text-red-500",
        className
      )}
    >
      {helperText}
    </p>
  );
};
