import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const TOKEN_COOKIE = "rentnest_token";
export const ROLE_COOKIE = "rentnest_role";

export class ApiError extends Error {
  status: number;
  errorDetails: unknown;

  constructor(status: number, message: string, errorDetails: unknown = null) {
    super(message);
    this.status = status;
    this.errorDetails = errorDetails;
    this.name = "ApiError";
  }

  /** Flattens Zod-style field errors (from the backend's 400 responses)
   *  into a map React Hook Form can use with setError. */
  fieldErrors(): Record<string, string> {
    if (!Array.isArray(this.errorDetails)) return {};
    const map: Record<string, string> = {};
    for (const issue of this.errorDetails as { path?: string; message?: string }[]) {
      if (issue?.path && issue?.message) {
        const key = issue.path.replace(/^body\./, "");
        map[key] = issue.message;
      }
    }
    return map;
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = auth ? Cookies.get(TOKEN_COOKIE) : undefined;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  let json: { success: boolean; message: string; data?: T; errorDetails?: unknown; meta?: unknown } | null =
    null;
  try {
    json = await res.json();
  } catch {
    // no body
  }

  if (!res.ok || !json?.success) {
    throw new ApiError(
      res.status,
      json?.message || "Something went wrong. Please try again.",
      json?.errorDetails ?? null
    );
  }

  return json.data as T;
}

/** Same as apiRequest but also returns the `meta` block (used for pagination). */
export async function apiRequestWithMeta<T>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: T; meta: Record<string, unknown> | null }> {
  const { auth = true, headers, ...rest } = options;
  const token = auth ? Cookies.get(TOKEN_COOKIE) : undefined;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  let json: {
    success: boolean;
    message: string;
    data?: T;
    errorDetails?: unknown;
    meta?: Record<string, unknown>;
  } | null = null;
  try {
    json = await res.json();
  } catch {
    // no body
  }

  if (!res.ok || !json?.success) {
    throw new ApiError(
      res.status,
      json?.message || "Something went wrong. Please try again.",
      json?.errorDetails ?? null
    );
  }

  return { data: json.data as T, meta: json.meta ?? null };
}

export { API_URL };
