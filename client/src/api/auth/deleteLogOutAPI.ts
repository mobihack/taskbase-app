import { request } from "@/lib/axios-request.util";

export const deleteLogOutAPI = async (): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "DELETE",
    url: `/auth/logout`,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
