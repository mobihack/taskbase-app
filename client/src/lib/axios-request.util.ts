import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { CONFIG } from "@/config";

interface RequestReturn<T> {
  data: T | null;
  error: AxiosError | null;
}

const instance = axios.create();

const defaultOptions = {
  withCredentials: true,
  baseURL: CONFIG.apiUrl,
};

/**
 * A request wrapper for axios
 * @param options - all configuration for axios instance, methods, params
 * @param type - content type header
 * @returns {Promise<object>}: {data:<result | undefined>, error:<error | undefined>}
 */
export const request = async <T>(
  options: AxiosRequestConfig,
  headers = { "Content-Type": `application/json` }
): Promise<RequestReturn<T>> => {
  const axiosOptions = { ...defaultOptions, ...options };
  axiosOptions.headers = { ...headers, ...options.headers };
  try {
    const { data } = await instance(axiosOptions);

    return { error: null, data };
  } catch (error) {
    return { error: error as AxiosError, data: null };
  }
};
