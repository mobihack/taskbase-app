"use client";

import { Button, Input, Chip } from "@/components";
import { TaskStatus } from "@/constants";
import { ConfirmDialog, TaskCard, TaskList } from "@/containers";
import { FiLogOut, FiPlus } from "react-icons/fi";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { TaskFormDialog, TaskViewerDialog } from "./components";
import { INITIAL_STATE, Task } from "./DashboardMain.utils";

export const DashboardMain = (): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_STATE);
  const [dialogMode, setDialogMode] = useState<"create" | "modify" | false>(
    false
  );
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<TaskStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const statusFilteredTasks = useMemo(
    () =>
      Object.keys(TaskStatus)
        .filter((key) => {
          if (filters.length === 0) return true;
          else
            return filters.includes(TaskStatus[key as keyof typeof TaskStatus]);
        })
        .reduce(
          (
            accumulator: Partial<Record<keyof typeof TaskStatus, Task[]>>,
            key
          ) => (
            (accumulator[key as keyof typeof TaskStatus] = tasks.filter(
              (item) =>
                item.status === TaskStatus[key as keyof typeof TaskStatus]
            )),
            accumulator
          ),
          {}
        ),
    [tasks, filters]
  );

  const selectedTask = useMemo(() => {
    return tasks.find((item) => item.id === selectedId);
  }, [tasks, selectedId]);

  const onMoveTaskStatus = (e: DragEndEvent) => {
    // id of dragged item
    const newItem = e.active.data.current?.id;

    // id of dropped TaskStatus section
    const dropContainerId =
      e.collisions && e.collisions.length > 0 && e.collisions[0].id;

    const temp = [...tasks];

    var index = temp.findIndex((x) => x.id == newItem);

    if (
      !newItem ||
      !dropContainerId ||
      index === -1 ||
      !Object.values(TaskStatus).includes(dropContainerId as TaskStatus)
    ) {
      return;
    }

    temp[index] = {
      ...temp[index],
      status: dropContainerId as TaskStatus,
    };

    setTasks(temp);
  };

  const onCloseDialog = () => {
    setIsDeleteModalOpen(false);
    setIsViewerModalOpen(false);
    setDialogMode(false);
    setSelectedId(undefined);
  };

  const onToggleFilter = (type: TaskStatus | "All") => {
    // clear if all
    if (type === "All") {
      setFilters([]);
      return;
    }

    // toggle TaskStatus
    const temp = new Set(filters);
    if (temp.has(type)) {
      temp.delete(type);
    } else {
      temp.add(type);
    }

    // reset to 'All' if all items are selected
    if (temp.size === Object.keys(TaskStatus).length) {
      temp.clear();
    }

    setFilters(Array.from(temp));
  };

  const onViewTask = (id: string) => {
    setSelectedId(id);
    setIsViewerModalOpen(true);
  };

  const onEditTask = (id: string) => {
    setSelectedId(id);
    setDialogMode("modify");
  };

  const onDeleteTask = (id: string) => {
    // asdasd
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const onDeleteTaskConfirmed = () => {
    // asdasd
    // selectedId
    onCloseDeleteConfirmation();
  };

  const onCloseDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
    setSelectedId(undefined);
  };

  return (
    <>
      <div className="max-w-lg mx-auto w-full py-16">
        <div className="flex items-center justify-between gap-2 rounded-xl mb-12">
          <h1 className="text-2xl sm:text-3xl">{"TaskBase™"}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogMode("create")}
            >
              <FiPlus className="mr-2" />
              Add Task
            </Button>
            <Button variant="outline" size="sm">
              <FiLogOut className="mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="my-12">
          <Input
            className="h-12"
            placeholder="Search Tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <p className="text-xs mt-1 px-3 text-gray-600">
            Search through name and description.
          </p>

          <div className="flex gap-2 pl-3 mt-3">
            <Chip
              variant={filters.length === 0 ? "filled" : "outlined"}
              size="small"
              onClick={() => onToggleFilter("All")}
            >
              All
            </Chip>
            <Chip
              variant={
                filters.includes(TaskStatus.TODO) ? "filled" : "outlined"
              }
              onClick={() => onToggleFilter(TaskStatus.TODO)}
              size="small"
            >
              Todo
            </Chip>
            <Chip
              variant={
                filters.includes(TaskStatus.PROGRESS) ? "filled" : "outlined"
              }
              onClick={() => onToggleFilter(TaskStatus.PROGRESS)}
              size="small"
            >
              In Progress
            </Chip>
            <Chip
              variant={
                filters.includes(TaskStatus.DONE) ? "filled" : "outlined"
              }
              onClick={() => onToggleFilter(TaskStatus.DONE)}
              size="small"
            >
              Completed
            </Chip>
          </div>
        </div>

        <DndContext onDragEnd={onMoveTaskStatus}>
          <div className="flex flex-col gap-8">
            {Object.keys(statusFilteredTasks).map((key) => (
              <TaskList
                key={key}
                status={key as keyof typeof TaskStatus}
                title={TaskStatus[key as keyof typeof TaskStatus]}
                count={
                  statusFilteredTasks[key as keyof typeof TaskStatus]?.length ||
                  0
                }
              >
                {statusFilteredTasks[key as keyof typeof TaskStatus]?.map(
                  (item, i) => (
                    <TaskCard
                      key={i} // TODO: change to unique id from db
                      {...item}
                      status={TaskStatus[key as keyof typeof TaskStatus]}
                      onClick={onViewTask}
                      onModify={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  )
                )}
              </TaskList>
            ))}
          </div>
        </DndContext>
      </div>

      <TaskFormDialog
        open={dialogMode}
        onClose={onCloseDialog}
        onSubmit={async () => {}}
        initialValue={selectedTask}
      />

      <TaskViewerDialog
        open={isViewerModalOpen}
        onClose={onCloseDialog}
        onModify={onEditTask}
        task={selectedTask}
      />

      <ConfirmDialog
        open={isDeleteModalOpen}
        onConfirm={onDeleteTaskConfirmed}
        onClose={onCloseDeleteConfirmation}
        title="Delete Task"
        description="Confirm deletion of task permanently"
      />
    </>
  );
};
