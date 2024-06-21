export type ApiResponse<T> = {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: T;
};
