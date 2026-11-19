import { ApiError } from "@/lib/api/errors";

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch ${path}`, response.status);
  }

  const json = (await response.json()) as T;
  return json;
}
