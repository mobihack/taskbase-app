import { request } from "@/lib/axios-request.util";

export const deleteTaskAPI = async (id: string): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "DELETE",
    url: `/task/${id}`,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
