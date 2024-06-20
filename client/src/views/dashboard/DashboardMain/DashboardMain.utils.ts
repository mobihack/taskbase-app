import { TaskStatus } from "@/constants";
import dayjs from "dayjs";

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
