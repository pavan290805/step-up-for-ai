export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });

  let payload: Partial<ApiEnvelope<T>> & { error?: { message?: string } };
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(`The server returned an unreadable response (${response.status}).`, response.status);
  }

  if (!response.ok || payload.success === false) {
    throw new ApiError(
      payload.message || payload.error?.message || `Request failed (${response.status}).`,
      response.status,
    );
  }

  if (!("data" in payload)) {
    throw new ApiError("The server response was missing its data payload.", response.status);
  }

  return payload.data as T;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export interface PageResult<T> {
  items: T[];
  nextCursor?: string | null;
}

export function getPageItems<T>(value: PageResult<T> | T[]): T[] {
  return Array.isArray(value) ? value : value.items;
}
