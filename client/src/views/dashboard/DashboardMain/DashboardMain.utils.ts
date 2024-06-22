import dayjs from "dayjs";

import { Task } from "@/types/task.type";

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
