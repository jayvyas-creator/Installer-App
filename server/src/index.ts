import path from "node:path";
import express, { type ErrorRequestHandler } from "express";
import { loadServerEnv } from "./env.js";
import { requestLogger } from "./logger.js";
import { createApiProxy } from "./proxy.js";
import { TokenService } from "./tokenService.js";

const env = loadServerEnv();
const tokenService = new TokenService(env);
const app = express();

app.disable("x-powered-by");
app.use(requestLogger);
app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, env: env.appEnv });
});

app.use("/api", createApiProxy(env, tokenService));

// NODE_ENV=production is the only thing that makes the server serve the
// built SPA — APP_ENV only names the environment (dev/staging/production)
// and never changes what's served.
if (env.nodeEnv === "production") {
  const distDir = path.resolve(import.meta.dirname, "../../dist");
  app.use(express.static(distDir));
  app.get("/*splat", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  res.status(502).json({ message: "Upstream request failed" });
};
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[server] listening on :${env.port} (${env.appEnv})`);
});
