import { TaskStatus } from "@/constants";

const SAMPLE_TASK = {
  id: "",
  title: "Hello World",
  description:
    "Hello World Hello World Hello World Hello World Hello World Hello World Hello World",
  status: TaskStatus.TODO,

  dueAt: new Date("10/12/2025").toISOString(),

  createdAt: new Date("10/12/2023 06:00pm").toISOString(),
  updatedAt: new Date("10/12/2023 12:00pm").toISOString(),
};

export type Task = typeof SAMPLE_TASK;

export const INITIAL_STATE = [
  ...[1, 2, 3].map((i) => ({
    ...SAMPLE_TASK,
    id: `${TaskStatus.TODO}-${i}`,
    status: TaskStatus.TODO,
  })),
  ...[1, 2, 3].map((i) => ({
    ...SAMPLE_TASK,
    id: `${TaskStatus.PROGRESS}-${i}`,
    status: TaskStatus.PROGRESS,
  })),
  ...[1, 2, 3].map((i) => ({
    ...SAMPLE_TASK,
    id: `${TaskStatus.DONE}-${i}`,
    status: TaskStatus.DONE,
  })),
];
