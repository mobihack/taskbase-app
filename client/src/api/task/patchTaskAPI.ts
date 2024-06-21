import { request } from "@/lib/axios-request.util";

interface Body {
  title: string;
  description: string;
  dueAt: string;
  status: string;
}
export const patchTaskAPI = async (
  id: string,
  body: Partial<Body>
): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "PATCH",
    url: `/task/${id}`,
    data: body,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
