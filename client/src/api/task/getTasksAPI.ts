import { request } from "@/lib/axios-request.util";
import { ApiResponse } from "@/types/api-response";
import { Task } from "@/types/task.type";

export const getTasksAPI = async (url: string): Promise<Task[]> => {
  const { data, error } = await request<ApiResponse<{ tasks: Task[] }>>({
    method: "GET",
    url,
  });

  if (error && !data) {
    console.log(error);

    throw error;
  }

  return data?.data.tasks || [];
};
