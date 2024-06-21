import clsx from "clsx";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const LoadingIndicator = ({
  className,
  ...props
}: Props): JSX.Element => {
  return (
    <div
      role="status"
      className={clsx(
        "animate-spin inline-block size-16 border-8 border-current border-t-transparent text-brand-600 rounded-full dark:text-brand-500",
        className
      )}
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
