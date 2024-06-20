import { Button, Dialog } from "@/components";
import { FiArrowRight } from "react-icons/fi";
import { Task } from "../../DashboardMain.utils";
import { ReactNode } from "react";
import dayjs from "dayjs";

const INITIAL_VALUE = {
  title: "",
  description: "",
  dueAt: "",
};

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
            value={`${dayjs(task.dueAt).format("MMM MM, YYYY")} (${
              isAlreadyDue ? "Expired" : "Due in"
            } 
            ${dayjs().from(dayjs(task.dueAt), true)}${
              isAlreadyDue ? " ago" : ""
            })`}
          />

          <div className="grid grid-cols-2 mt-4">
            <Item
              name="Created On"
              value={`${dayjs(task.createdAt).format("MMM MM, YYYY")}`}
            />
            <Item
              name="Updated On"
              value={`${dayjs(task.updatedAt).format("MMM MM, YYYY")}`}
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
