import type { NitroFetchRequest } from "nitropack";

export const useApi = <
  T = unknown,
  R extends NitroFetchRequest = NitroFetchRequest,
>(
  url: Parameters<typeof $fetch<T, R>>[0],
  opts: Parameters<typeof $fetch<T, R>>[1],
) => {
  const headers = useRequestHeaders(["cookie"]) as HeadersInit;

  return $fetch<T, R>(url, {
    ...opts,
    headers: {
      ...headers,
      ...opts?.headers,
    },
  });
};
