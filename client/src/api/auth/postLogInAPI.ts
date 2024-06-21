import { request } from "@/lib/axios-request.util";

interface Props {
  email: string;
  password: string;
}
export const postLogInAPI = async (body: Props): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "POST",
    url: `/auth/login`,
    data: body,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
