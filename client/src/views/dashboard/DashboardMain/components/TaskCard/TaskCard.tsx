import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo } from "react";
import {
  FiClock,
  FiEdit2,
  FiMenu,
  FiMoreVertical,
  FiTrash2,
} from "react-icons/fi";
import { RiDraggable } from "react-icons/ri";

import { Button, DropdownMenu } from "@/components";
import { DATE_FORMAT, TaskStatus } from "@/constants";

dayjs.extend(relativeTime);

interface Props {
  id: string;

  title: string;
  description: string;
  status: TaskStatus;
  dueAt?: string;

  onClick: (id: string) => void | Promise<void>;
  onModify: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

export const TaskCard = ({
  id,
  title,
  description,
  dueAt,

  onClick,
  onModify,
  onDelete,
}: Props): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { id },
    });

  const isAlreadyDue = useMemo(() => {
    return dayjs(dueAt).diff() < 0;
  }, [dueAt]);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={clsx(
        isDragging && "!bg-white border !border-gray-200",
        "group hover:bg-slate-50",
        "px-4 md:!border md:rounded-xl rounded-none",
        "flex items-center justify-between gap-4"
      )}
    >
      <div className="-ml-2 -mr-2 flex h-full">
        <button
          {...listeners}
          {...attributes}
          role="button"
          className={clsx("cursor-grab p-2", isDragging && "cursor-grabbing")}
        >
          <RiDraggable className="text-gray-500" />
        </button>
      </div>

      <button className="text-left flex-1 py-3" onClick={() => onClick(id)}>
        <p className="text-sm">{title}</p>
        <p className="text-xs text-gray-600 line-clamp-1">{description}</p>

        {dueAt && (
          <time
            title={dayjs(dueAt).format(DATE_FORMAT.DEFAULT)}
            dateTime={dayjs(dueAt).toString()}
            className="hover:!cursor-default text-[0.65rem] text-gray-600 inline-flex items-center gap-1.5 mt-2 border border-gray-300 px-1.5 py-0.5 rounded-xl"
          >
            <FiClock />
            <span className=" mt-[0.05rem]">
              {isAlreadyDue ? "Expired" : "Due in"}{" "}
              {dayjs().from(dayjs(dueAt), true)} {isAlreadyDue && "ago"}
            </span>
          </time>
        )}
      </button>
      <div className="flex gap-1">
        <DropdownMenu.root>
          <DropdownMenu.trigger asChild>
            <Button variant="ghost" size="iconSmall">
              <FiMoreVertical />
            </Button>
          </DropdownMenu.trigger>
          <DropdownMenu.content className="w-40">
            <DropdownMenu.label>Actions</DropdownMenu.label>
            <DropdownMenu.separator />
            <DropdownMenu.group>
              <DropdownMenu.item
                className="text-brand-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onModify(id);
                }}
              >
                <FiEdit2 className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenu.item>
              <DropdownMenu.item
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenu.item>
            </DropdownMenu.group>
          </DropdownMenu.content>
        </DropdownMenu.root>
      </div>
    </div>
  );
};
