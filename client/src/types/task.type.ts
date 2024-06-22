import { TaskStatus } from "@/constants";

export type Task = {
  id: string;

  title: string;
  description: string;
  status: TaskStatus;
  dueAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type TaskStatusKey = keyof typeof TaskStatus;
