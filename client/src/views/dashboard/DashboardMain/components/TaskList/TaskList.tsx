import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { ReactNode } from "react";

import { TaskStatus } from "@/constants";

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
  const { setNodeRef, isOver, active } = useDroppable({
    id: TaskStatus[status],
  });

  return (
    <div ref={setNodeRef}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg text-gray-800">{title}</h2>
        <span className="text-xs text-gray-400">{count}</span>
      </div>
      {count === 0 && !active && (
        <div className="text-center font-medium p-8 text-xs text-gray-400">
          No Items
        </div>
      )}
      <div
        className={clsx(
          "flex flex-col md:gap-4 divide-y md:border-0 border rounded-xl",
          isOver && " ring-2 ring-brand-400",
          active && "!border-2 !border-dashed",
          count === 0 && !active && "hidden"
        )}
      >
        {count === 0 && active && (
          <div className="text-center font-medium p-8 text-xs text-gray-400">
            Drop Here to change status
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
