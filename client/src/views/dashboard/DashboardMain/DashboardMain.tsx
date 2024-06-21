"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiLogOut, FiPlus } from "react-icons/fi";

import { deleteTaskAPI } from "@/api/task/deleteTaskAPI";
import { getTasksAPI } from "@/api/task/getTasksAPI";
import { patchTaskAPI } from "@/api/task/patchTaskAPI";
import { Button, Chip, Input, LoadingIndicator } from "@/components";
import { TaskStatus } from "@/constants";
import { ConfirmDialog } from "@/containers";
import { useAuth } from "@/context/useAuth";
import { useFetch } from "@/hooks";

import {
  DashboardHeader,
  TaskCard,
  TaskEmpty,
  TaskFormDialog,
  TaskList,
  TaskViewerDialog,
} from "./components";
import { Task } from "./DashboardMain.utils";

type TaskStatusKey = keyof typeof TaskStatus;

export const DashboardMain = (): JSX.Element => {
  const auth = useAuth();
  const router = useRouter();
  const {
    data: tasks,
    mutate,
    isLoading: isTaskLoading,
    isError,
  } = useFetch("/task", getTasksAPI);

  const [isLoading, setIsLoading] = useState(false);
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
          else return filters.includes(TaskStatus[key as TaskStatusKey]);
        })
        .reduce((accumulator: Partial<Record<TaskStatusKey, Task[]>>, key) => {
          accumulator[key as TaskStatusKey] = (tasks || []).filter((item) => {
            const hasSearchTerm = searchTerm
              ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              : true;
            return (
              hasSearchTerm && item.status === TaskStatus[key as TaskStatusKey]
            );
          });
          return accumulator;
        }, {}),
    [tasks, filters, searchTerm]
  );

  const selectedTask = useMemo(() => {
    return (tasks || []).find((item) => item.id === selectedId);
  }, [tasks, selectedId]);

  const onMoveTaskStatus = async (e: DragEndEvent) => {
    // id of dragged item
    const newItem = e.active.data.current?.id;

    // id of dropped TaskStatus section
    const dropContainerId =
      e.collisions && e.collisions.length > 0 && e.collisions[0].id;

    const temp = [...(tasks || [])];

    var index = temp.findIndex((x) => x.id == newItem);

    if (
      !newItem ||
      !dropContainerId ||
      index === -1 ||
      !Object.values(TaskStatus).includes(dropContainerId as TaskStatus)
    ) {
      return;
    }

    if (temp[index].status === (dropContainerId as TaskStatus)) {
      // no change in status
      return;
    }

    temp[index] = {
      ...temp[index],
      status: dropContainerId as TaskStatus,
    };

    toast.promise(
      patchTaskAPI(temp[index].id, { status: dropContainerId as TaskStatus }),
      {
        loading: "Updating Task",
        success: () => {
          setIsLoading(false);
          onCloseDialog();
          mutate(temp);
          return "Task updated successfully";
        },
        error: (err) => {
          setIsLoading(false);
          return err?.response?.data?.message || "Error during updation";
        },
      }
    );
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
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const onDeleteTaskConfirmed = () => {
    if (!selectedId) return;

    toast.promise(deleteTaskAPI(selectedId), {
      loading: "Deleting Task",
      success: () => {
        setIsLoading(false);
        onCloseDialog();
        mutate();
        return "Task deleted successfully";
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "Error during deletion";
      },
    });
    onCloseDialog();
  };

  const onLogOut = () => {
    toast.promise(auth.logOut(), {
      loading: "Signing Out",
      success: () => {
        router.push("/auth/login");
        return "Signed Out";
      },
      error: (err) => {
        return err?.response?.data?.message || "Error during logout";
      },
    });
  };

  if (!auth.currentUser) {
    router.push("/auth/login");
  }

  return (
    <>
      <div className="w-full py-16">
        <DashboardHeader
          onCreateClicked={() => setDialogMode("create")}
          onLogOutClicked={onLogOut}
        />

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

        {isTaskLoading ? (
          <div className="flex justify-center">
            <LoadingIndicator />
          </div>
        ) : (
          <>
            {tasks?.length === 0 ? (
              <TaskEmpty />
            ) : (
              <DndContext onDragEnd={onMoveTaskStatus}>
                <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
                  {Object.keys(statusFilteredTasks).map((key) => (
                    <TaskList
                      key={key}
                      status={key as TaskStatusKey}
                      title={TaskStatus[key as TaskStatusKey]}
                      count={
                        statusFilteredTasks[key as TaskStatusKey]?.length || 0
                      }
                    >
                      {statusFilteredTasks[key as TaskStatusKey]?.map(
                        (item, i) => (
                          <TaskCard
                            key={item.id}
                            {...item}
                            status={TaskStatus[key as TaskStatusKey]}
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
            )}
          </>
        )}
      </div>

      <TaskFormDialog
        open={dialogMode}
        onClose={onCloseDialog}
        onSubmit={async () => {}}
        initialValue={selectedTask}
        onUpdate={() => mutate()}
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
        onClose={onCloseDialog}
        title="Delete Task"
        description="Confirm deletion of task permanently"
      />
    </>
  );
};
