import dayjs from "dayjs";

import { TaskStatus } from "@/constants";

export enum SortCriteria {
  DUE_AT = "dueAt",
  NAME = "title",
  CREATED_AT = "createdAt",
}

export const SortNameMap: Record<SortCriteria, string> = {
  [SortCriteria.CREATED_AT]: "Created On",
  [SortCriteria.DUE_AT]: "Due On",
  [SortCriteria.NAME]: "Name",
};

const SAMPLE_TASK = {
  id: "",
  title: "Hello World",
  description:
    "Hello World Hello World Hello World Hello World Hello World Hello World Hello World",
  status: TaskStatus.TODO,

  dueAt: dayjs("10-12-2025").toISOString(),

  createdAt: dayjs("2023-10-31T03:00:00").toISOString(),
  updatedAt: dayjs("2024-04-21T12:00:00").toISOString(),
};

export type Task = typeof SAMPLE_TASK;

export type TaskStatusKey = keyof typeof TaskStatus;

// Function to filter tasks by search term
export const filterBySearchTerm = (
  tasks: Task[],
  searchTerm: string | undefined
): Task[] => {
  if (!searchTerm) return tasks;
  const lowerSearchTerm = searchTerm.toLowerCase();
  return tasks.filter(
    ({ title, description }) =>
      title.toLowerCase().includes(lowerSearchTerm) ||
      description.toLowerCase().includes(lowerSearchTerm)
  );
};

// Function to sort tasks by a given criterion
export const sortTasks = (tasks: Task[], sortBy: SortCriteria): Task[] => {
  return [...tasks].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (valueA === undefined || valueA === null) return 1;
    if (valueB === undefined || valueB === null) return -1;

    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  });
};
