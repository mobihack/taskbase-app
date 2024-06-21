import useSWR from "swr";
import { Fetcher, Key } from "swr";

export interface UseFetchReturn<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: null | string;
  mutate: (data?: any, shouldRevalidate?: boolean | undefined) => Promise<any>;
}

export const useFetch = <T,>(
  url: Key,
  fetcher: Fetcher<T>,
  config = {}
): UseFetchReturn<T> => {
  const { data, error, mutate } = useSWR<T>(url, fetcher, config);
  return {
    data,
    isLoading: !error && data === undefined,
    mutate,
    isError: error,
  };
};
