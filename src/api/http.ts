import type { Result } from "@/types/api";

// In dev this is proxied to the server/ Express app by Vite; in production
// the built SPA and the proxy are served from the same origin, so a relative
// base works in both cases without an env var.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  installerToken?: string;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function describeHttpError(status: number, json: unknown): string {
  const record = json && typeof json === "object" ? (json as Record<string, unknown>) : null;
  const message =
    (typeof record?.message === "string" && record.message) ||
    (typeof record?.description === "string" && record.description) ||
    undefined;
  if (message) return message;
  if (status >= 500) return "The server had a problem. Please try again.";
  if (status === 404) return "Not found.";
  if (status >= 400) return "The request was rejected.";
  return `Request failed (${status}).`;
}

// Fetch wrapper every src/api/*.ts endpoint function goes through. Never
// throws — callers get a Result and branch on `.ok`, so a page can render
// loading/error/success without a try/catch at the call site.
export async function request<T>(path: string, options: RequestOptions = {}): Promise<Result<T>> {
  const { method = "GET", query, body, installerToken } = options;
  try {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (installerToken) headers.installerToken = installerToken;

    const response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const json: unknown = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return { ok: false, error: describeHttpError(response.status, json) };
    }
    return { ok: true, data: json as T };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network request failed.",
    };
  }
}
