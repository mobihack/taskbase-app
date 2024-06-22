import dayjs from "dayjs";
import { ReactNode } from "react";

import { Button, Dialog } from "@/components";
import { DATE_FORMAT } from "@/constants";
import { Task } from "@/types/task.type";

interface Props {
  open: boolean;
  onClose: () => void;
  onModify: (id: string) => void | Promise<void>;

  task: Task | undefined;
}

const Item = ({ name, value }: Record<string, ReactNode>) => (
  <div>
    <p className="text-sm text-gray-600">{name}</p>
    <p className="text-sm">{value}</p>
  </div>
);

export const TaskViewerDialog = ({
  open,
  onClose,
  onModify,
  task,
}: Props): JSX.Element | null => {
  const onCloseDialog = () => {
    onClose();
  };

  const onModifyClicked = () => {
    onModify("");
    onCloseDialog();
  };

  if (!task) return null;

  const isAlreadyDue = dayjs(task.dueAt).diff() < 0;

  return (
    <Dialog.root open={Boolean(open)} onOpenChange={() => onCloseDialog()}>
      <Dialog.content className="max-w-md">
        <Dialog.header>
          <Dialog.title>View Task</Dialog.title>
        </Dialog.header>

        <div className="flex flex-col gap-3">
          <Item name="Title" value={task.title} />
          <Item name="Description" value={task.description} />
          <Item
            name="Due On"
            value={
              task.dueAt
                ? `${dayjs(task.dueAt).format(DATE_FORMAT.DEFAULT)} (${
                    isAlreadyDue ? "Expired" : "Due in"
                  } 
            ${dayjs().from(dayjs(task.dueAt), true)}${
                    isAlreadyDue ? " ago" : ""
                  })`
                : "-"
            }
          />

          <div className="grid grid-cols-2 mt-4">
            <Item
              name="Created On"
              value={`${dayjs(task.createdAt).format(DATE_FORMAT.DEFAULT)}`}
            />
            <Item
              name="Updated On"
              value={`${dayjs(task.updatedAt).format(DATE_FORMAT.DEFAULT)}`}
            />
          </div>

          <div className="flex flex-col items-center gap-4 mt-6">
            <Button variant="outline" width="full" onClick={onCloseDialog}>
              Close
            </Button>
          </div>
        </div>
      </Dialog.content>
    </Dialog.root>
  );
};
