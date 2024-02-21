import type { NitroFetchOptions } from "nitropack";
import { useRequestHeaders } from "#app";

export const useApi = <T = unknown>(
  url: string,
  opts?: NitroFetchOptions<any>,
) => {
  let headers = {};
  if (process.client) {
    headers = useRequestHeaders(["cookie"]) as HeadersInit;
  }

  return $fetch<T>(url, {
    ...opts,
    headers: {
      ...opts?.headers,
      ...headers,
    },
  });
};
