import path from "node:path";

export interface ServerEnv {
  appEnv: string;
  nodeEnv: string | undefined;
  baseUrlApi: string;
  tokenApiKey: string;
  tokenApiSecret: string;
  port: number;
}

const REQUIRED_VARS = ["BASE_URL_API", "TOKEN_API_KEY", "TOKEN_API_SECRET"] as const;

// server/.env.<APP_ENV> is optional (a container injects real env vars
// directly); a variable already set in the shell/pipeline always wins over
// the file, per README's deploy notes.
function loadEnvFile(appEnv: string): void {
  const envPath = path.resolve(import.meta.dirname, "..", `.env.${appEnv}`);
  try {
    process.loadEnvFile(envPath);
  } catch {
    console.warn(`[env] no ${envPath} found, reading from the process environment only`);
  }
}

export function loadServerEnv(): ServerEnv {
  const appEnv = process.env.APP_ENV ?? "dev";
  loadEnvFile(appEnv);

  for (const name of REQUIRED_VARS) {
    if (!process.env[name]) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  }

  return {
    appEnv,
    nodeEnv: process.env.NODE_ENV,
    baseUrlApi: process.env.BASE_URL_API!,
    tokenApiKey: process.env.TOKEN_API_KEY!,
    tokenApiSecret: process.env.TOKEN_API_SECRET!,
    port: Number(process.env.PORT ?? 8080),
  };
}
