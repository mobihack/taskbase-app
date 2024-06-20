import { TaskStatus } from "@/constants";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: string;
  count: number;
  status: keyof typeof TaskStatus;
}

export const TaskList = ({
  children,
  title,
  count,
  status,
}: Props): JSX.Element | null => {
  const { setNodeRef, isOver } = useDroppable({
    id: TaskStatus[status],
  });

  if (count === 0) return null;

  return (
    <div ref={setNodeRef}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg text-gray-800">{title}</h2>
        <span className="text-md text-gray-500">{count} items</span>
      </div>
      <div
        className={clsx(
          "flex flex-col divide-y border rounded-xl",
          isOver && " ring-2 ring-brand-400"
        )}
      >
        {children}
      </div>
    </div>
  );
};
