import type { NextFunction, Request, Response } from "express";
import type { ServerEnv } from "./env.js";
import type { TokenService } from "./tokenService.js";

// Everything else — cookies, any browser-sent Authorization header — is
// dropped; only these survive the proxy.
const FORWARDED_REQUEST_HEADERS = ["installertoken", "chargerid", "appname", "content-type"];

// Decodes, then re-collapses "." / ".." segments AFTER decoding, so an
// encoded traversal (/api/x/..%2fAUTH, /api%2fauth) can't slip past a check
// that only looked at the raw, still-encoded path.
function normalizeApiPath(originalUrl: string): string | null {
  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(originalUrl, "http://internal").pathname);
  } catch {
    return null;
  }

  const segments: string[] = [];
  for (const part of pathname.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") segments.pop();
    else segments.push(part);
  }
  return `/${segments.join("/")}`.toLowerCase();
}

function isBlockedAuthPath(normalizedPath: string): boolean {
  return normalizedPath === "/api/auth" || normalizedPath.startsWith("/api/auth/");
}

export function createApiProxy(env: ServerEnv, tokenService: TokenService) {
  return async function apiProxy(req: Request, res: Response, next: NextFunction): Promise<void> {
    const normalizedPath = normalizeApiPath(req.originalUrl);

    // Fail closed: an unparsable path is treated the same as a blocked one.
    if (normalizedPath === null || isBlockedAuthPath(normalizedPath)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const upstreamPath = req.originalUrl.replace(/^\/api/, "");
    const upstreamUrl = new URL(upstreamPath, env.baseUrlApi);

    const headers = new Headers();
    for (const name of FORWARDED_REQUEST_HEADERS) {
      const value = req.headers[name];
      if (typeof value === "string") headers.set(name, value);
    }

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const body = hasBody ? JSON.stringify(req.body ?? {}) : undefined;

    try {
      const accessToken = await tokenService.getToken();
      headers.set("Authorization", `Bearer ${accessToken}`);

      let upstreamResponse = await fetch(upstreamUrl, { method: req.method, headers, body });

      if (upstreamResponse.status === 401) {
        const refreshedToken = await tokenService.refresh();
        headers.set("Authorization", `Bearer ${refreshedToken}`);
        upstreamResponse = await fetch(upstreamUrl, { method: req.method, headers, body });
      }

      const responseText = await upstreamResponse.text();
      res.status(upstreamResponse.status);
      const contentType = upstreamResponse.headers.get("content-type");
      if (contentType) res.setHeader("content-type", contentType);
      res.send(responseText);
    } catch (error) {
      next(error);
    }
  };
}
