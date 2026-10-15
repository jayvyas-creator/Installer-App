import type { ServerEnv } from "./env.js";

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

interface TokenResponse {
  access_token: string;
  expires_in?: number;
}

const REFRESH_SKEW_MS = 5 * 60_000;
const DEFAULT_TTL_SECONDS = 60 * 60;

// Fetches and caches the bearer token from endpoint 1 (CLAUDE.md §6). This
// is the only place TOKEN_API_KEY/TOKEN_API_SECRET are used — the browser
// never sees them, and never reaches this endpoint directly (proxy.ts blocks
// /api/auth/* from the client side).
export class TokenService {
  private cached: CachedToken | null = null;
  private inFlight: Promise<string> | null = null;

  constructor(private readonly env: ServerEnv) {}

  async getToken(): Promise<string> {
    if (this.cached && this.cached.expiresAt - REFRESH_SKEW_MS > Date.now()) {
      return this.cached.accessToken;
    }
    if (!this.inFlight) {
      this.inFlight = this.fetchToken().finally(() => {
        this.inFlight = null;
      });
    }
    return this.inFlight;
  }

  async refresh(): Promise<string> {
    this.cached = null;
    return this.getToken();
  }

  private async fetchToken(): Promise<string> {
    const response = await fetch(`${this.env.baseUrlApi}/api/auth/1.0.0/token`, {
      method: "POST",
      headers: {
        appname: "RegisterCharger",
        appkey: this.env.tokenApiKey,
        appsecret: this.env.tokenApiSecret,
      },
    });

    if (!response.ok) {
      throw new Error(`Token request failed with status ${response.status}`);
    }

    const body = (await response.json()) as TokenResponse;
    const ttlMs = (body.expires_in ?? DEFAULT_TTL_SECONDS) * 1000;
    this.cached = { accessToken: body.access_token, expiresAt: Date.now() + ttlMs };
    return this.cached.accessToken;
  }
}
