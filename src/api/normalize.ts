import type { Result } from "@/types/api";

// The real backend answers with one of two envelope shapes depending on
// endpoint (CLAUDE.md "Backend integration" section). Every endpoint
// function in src/api/endpoints.ts runs its raw JSON through one of these
// two normalizers instead of assuming a shape.

interface EnvelopeA<T> {
  returnCode: number;
  isError: boolean;
  message: string | null;
  data: T;
}

interface EnvelopeB<T> {
  status: string;
  result: T;
  errorCode: string | null;
  description: string | null;
  token: string | null;
}

function isEnvelopeA(json: unknown): json is EnvelopeA<unknown> {
  return !!json && typeof json === "object" && "returnCode" in json && "isError" in json;
}

function isEnvelopeB(json: unknown): json is EnvelopeB<unknown> {
  return !!json && typeof json === "object" && "status" in json && "result" in json;
}

// For POST/PUT endpoints whose only interesting outcome is success/failure
// (step advance, install submit) — there's no payload to unwrap.
export function expectSuccess(json: unknown): Result<void> {
  if (isEnvelopeA(json)) {
    if (json.returnCode === 200 && !json.isError) return { ok: true, data: undefined };
    return { ok: false, error: json.message ?? "Request failed." };
  }
  if (isEnvelopeB(json)) {
    if (json.status === "Success") return { ok: true, data: undefined };
    return { ok: false, error: json.description ?? "Request failed." };
  }
  return { ok: false, error: "Unrecognized response shape." };
}

// For GET/PUT endpoints that return a payload worth reading (charger lookup,
// status, token registration result). EnvelopeA's `data` is documented as
// arriving as a JSON string on the step POST in dev, so it's parsed if needed.
export function unwrapData<T>(json: unknown): Result<T> {
  if (isEnvelopeA(json)) {
    if (json.returnCode === 200 && !json.isError) {
      const data = typeof json.data === "string" ? (JSON.parse(json.data) as T) : (json.data as T);
      return { ok: true, data };
    }
    return { ok: false, error: json.message ?? "Request failed." };
  }
  if (isEnvelopeB(json)) {
    if (json.status === "Success") return { ok: true, data: json.result as T };
    return { ok: false, error: json.description ?? "Request failed." };
  }
  return { ok: false, error: "Unrecognized response shape." };
}
