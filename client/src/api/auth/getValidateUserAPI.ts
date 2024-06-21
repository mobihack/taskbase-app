import { request } from "@/lib/axios-request.util";
import { ApiResponse } from "@/types/api-response";

interface Body {
  user: {
    email: string;
    id: string;
  };
}
export const getValidateUserAPI = async (): Promise<Body["user"] | null> => {
  const { data, error } = await request<ApiResponse<Body>>({
    method: "GET",
    url: `/auth/me`,
  });

  if (error && !data) {
    throw error;
  }

  return data?.data.user || null;
};
