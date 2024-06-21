import { request } from "@/lib/axios-request.util";

interface Body {
  title: string;
  description: string;
  dueAt?: string;
}
export const postTaskAPI = async (body: Body): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "POST",
    url: `/task`,
    data: body,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
