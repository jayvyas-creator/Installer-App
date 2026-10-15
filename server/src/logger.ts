import type { NextFunction, Request, Response } from "express";

// One line per request: method, path, status, duration. req.path never
// includes the query string, which can carry installer tokens.
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${durationMs}ms`);
  });
  next();
}
