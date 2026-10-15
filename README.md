# DynaChrg Installer (web)

This is the web version of the DynaChrg charger installer flow. An installer uses it to:

1. identify a charger (scan its QR code or type its ID),
2. register with the installer token,
3. confirm the charger and site details,
4. enter the electrical and connector configuration,
5. run the commissioning checks until the charger is ready to be commissioned.

- The React Native app `eves-charger-installerapp` (a separate repo) is the reference for endpoints, payloads, dropdown values, validation and routing. That repo is **reference only** — this repo never edits it.
- Where the web app deliberately behaves differently, the difference is recorded in [docs/Parity.md](docs/Parity.md).

## Architecture

```
Browser (React SPA)  ──/api/*──▶  Node/Express proxy (server/)  ──▶  EVES API (BASE_URL_API)
   installerToken,                  adds Authorization: Bearer <token>
   charger ID, bodies               caches the token, blocks /api/auth/*
```

The browser never talks to the EVES API directly. It calls `/api/*` on this repo's own Node server (`server/`), which:

- **keeps the credentials on the server.** `TOKEN_API_KEY` and `TOKEN_API_SECRET` exist only in the server's environment. The server fetches a bearer token from `POST /api/auth/1.0.0/token`, caches it until 5 minutes before it expires, refreshes it once on an upstream 401, and adds `Authorization: Bearer …` to every proxied request (`server/src/tokenService.ts`).
- **blocks the token endpoint.** Every request under `/api/auth/*` gets a `403`. The path is normalised first (decoded, `.`/`..` segments collapsed, lower-cased), so encodings such as `/api/x/../AUTH` or `/api%2Fauth` can't get around the block (`server/src/proxy.ts`).
- **forwards only known headers:** `installerToken`, `chargerID`, `appname` and `content-type`. Cookies and any `Authorization` header sent by the browser are dropped.
- **serves the built SPA** from `dist/` when `NODE_ENV=production`. This is separate from `APP_ENV`, which only names the environment (`server/src/index.ts`).
- **exposes `GET /healthz`**, returning `{ "ok": true, "env": "<APP_ENV>" }`.

The five backend endpoints, the status→screen routing, and the full integration rules are in [CLAUDE.md](CLAUDE.md), section 6.

## Prerequisites

- **Node.js 20.19+ or 22.13+** (Node 24 also works) and npm.
  - The repo does not pin a version yet: there is no `engines` field and no `.nvmrc`.

## Local setup

1. **Install the dependencies:**

   ```
   npm install
   ```

2. **Configure the front end.** Copy `.env.local.example` to `.env.local`:

   ```
   VITE_USE_MOCKS=true      # true = offline mock data, no backend needed (see Mock mode below)
   VITE_API_BASE_URL=/api   # path the front end calls; the dev server and the production server
                             # both proxy/serve this from the same origin, so the default is fine
   ```

3. **Configure the server** (needed even in mock mode, so `npm run dev` can start it — see Mock mode below). Copy `server/.env.example` to `server/.env.dev` (or `server/.env.staging`) and fill in the values from the team's secret store:

   ```
   APP_ENV=dev
   BASE_URL_API=<EVES API base URL for that environment>
   TOKEN_API_KEY=<from the secret store>
   TOKEN_API_SECRET=<from the secret store>
   PORT=8080
   ```

   - `APP_ENV` (`dev`, `staging` or `production`; default `dev`) chooses which `server/.env.<APP_ENV>` file is loaded.
   - A variable already set in the shell overrides the same variable in the file.
   - In mock mode, any placeholder values are fine — the browser never calls the proxy, but the server still needs to start cleanly.

4. **Run the app:**

   ```
   npm run dev
   ```

   This starts Vite (the web app, http://localhost:5173) and the proxy (http://localhost:8080) together via `concurrently`. Vite forwards `/api` to the proxy (see `vite.config.ts`).
   - To run against staging instead, use `APP_ENV=staging npm run dev`.
   - To run each half on its own: `npm run dev:web` (Vite only) or `npm run dev:server` (proxy only, via `tsx watch`).

> **Never commit env files.** `.env*`, `.env.local` and `server/.env.*` are gitignored. Only `server/.env.example` and `.env.local.example` are tracked, and they must only ever hold placeholders.

## Mock mode

Mock mode lets you click through the whole flow with no backend and no credentials. With `VITE_USE_MOCKS=true`, every function in `src/api/endpoints.ts` returns local mock data (`src/api/mocks/realEndpoints.ts`) after a short delay instead of calling `/api`.

- **To turn it on or off:** change `VITE_USE_MOCKS` in `.env.local`, then **restart Vite**. The value is read when Vite starts or builds, not while it is running.
- **Status:** in mock mode the charger status is always *Registered* with no step, so every charger starts at Validate Charger Details. Resume routing can only be tested against a real backend.
- **Token:** any token is accepted.
- **Server:** the browser never calls the proxy in mock mode, but `npm run dev` still starts it. Give `server/.env.dev` placeholder values so it starts cleanly.
- **Special charger IDs:** put one of these keywords anywhere in the charger ID to choose a behaviour. Case doesn't matter, so `test-noarea-1` works. Values are keyed by the normalized (uppercased) charger ID, so the mock state for a given ID stays consistent across lookups/status checks/installs within one browser session.

| Charger ID contains | Effect |
|---|---|
| `NOTFOUND` | The charger lookup fails outright, as if the charger doesn't exist. |
| `NOAREA` | The site has **no site areas**, so Site Information opens the *Create Site Area* form. |
| `ONEAREA` | The site has **one** site area, shown read-only. |
| *(anything else)* | The site has **three** site areas to choose from in a dropdown. |
| `STEPFAIL` | **Every** installation-step update fails. Validate Charger Confirm fails first. |
| `INSTALLFAIL` | The install submit on Connector Information fails. |
| `COMMFAIL` | The communication check fails, so the *No Heartbeat Received!* panel shows. |
| `HWFAIL` | The hardware check that runs when Automated OCPP Testing opens fails (error + Retry). |
| `OCPPFAIL` | The final OCPP check fails, so the *OCPP Testing Failed* panel shows. |
| `ACTIVE` | The charger starts in *Active* status, routing straight to Ready to Charge. |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts Vite and the proxy together with auto-reload (`concurrently`). |
| `npm run dev:web` | Starts only the Vite dev server. |
| `npm run dev:server` | Starts only the proxy, via `tsx watch`. |
| `npm run build` | Type-checks the app (`tsc -b`), builds the SPA into `dist/`, and compiles the server into `server/dist/`. |
| `npm start` | Runs the compiled server (`node server/dist/index.js`). Needs `npm run build` first. |
| `npm test` | Runs the Vitest suite once (`vitest run`). |
| `npm run lint` | Runs `oxlint`. |
| `npm run preview` | Serves the built SPA with Vite. There is no `/api` proxy, so this is only for checking the static build. |
| `npm run typecheck` | Type-checks the app (`tsc --noEmit -p tsconfig.app.json`). If you run it by hand, always pass `-p tsconfig.app.json`: a bare `npx tsc --noEmit` checks nothing, because the root `tsconfig.json` only lists project references. |
| `npm run typecheck:server` | Type-checks the server only (`tsc --noEmit -p server/tsconfig.json`). |

## Deploy notes (for DevOps)

Packaging and deployment are owned by DevOps. The app only needs Node:

```
npm ci
npm run build      # with VITE_USE_MOCKS unset or false
npm start          # with NODE_ENV=production and APP_ENV=<dev|staging|production>
```

Two variables control the deployment, and they do different jobs:

- **`NODE_ENV=production`** makes the server serve the built SPA from `dist/` (and puts Express in production mode). Set it in **every** deployed environment, including dev, but **only for `npm start`** (see below).
- **`APP_ENV`** names the environment (`dev`, `staging` or `production`). It picks which `server/.env.<APP_ENV>` file to load if one exists, and it is reported by `/healthz`. It does not change what the server serves.

**Don't set `NODE_ENV=production` for the install and build steps.** If it is set when `npm ci` runs, npm skips `devDependencies`, so Vite and TypeScript aren't installed and `npm run build` fails. Set it only on the run step (`npm start`), or, if it has to be set for the whole pipeline, install with `npm ci --include=dev`.

The server doesn't need an env file. If `server/.env.<APP_ENV>` is missing it logs a warning and reads the process environment, and a variable set by the pipeline always overrides the same variable in a file. So the pipeline can inject everything directly.

**Example: deploying the dev environment** (against the dev EVES API, serving the built app):

```
NODE_ENV=production
APP_ENV=dev
BASE_URL_API=<dev EVES API base URL>
TOKEN_API_KEY=<dev key, from the secret store>
TOKEN_API_SECRET=<dev secret, from the secret store>
PORT=8080            # optional
```

`GET /healthz` should then return `{ "ok": true, "env": "dev" }`, and `GET /` should return the app. For staging or production, change `APP_ENV` and the three EVES values.

### Environment variables

| Name | Where | Required | Description |
|---|---|---|---|
| `VITE_USE_MOCKS` | front end, build time | build time | `true`/`false`. Compiled into the bundle, so changing it later at runtime has no effect. Must be unset or `false` for a deployed build. |
| `VITE_API_BASE_URL` | front end, build time | no (default `/api`) | Base path the front end calls for backend requests. The dev server and the production server both serve/proxy this from the same origin, so the default works in both. |
| `NODE_ENV` | server | yes, when deployed | Must be `production` when deployed. Only then does the server serve the built SPA from `dist/`. Set it for `npm start` only, not for `npm ci` / `npm run build` (or install with `npm ci --include=dev`). Leave it unset locally, where Vite serves the app. |
| `APP_ENV` | server | no (default `dev`) | `dev`, `staging` or `production`. Names the environment: picks the optional `server/.env.<APP_ENV>` file and is reported by `/healthz`. It doesn't choose the EVES API; `BASE_URL_API` does. |
| `BASE_URL_API` | server | yes | Base URL of the EVES API for the target environment. |
| `TOKEN_API_KEY` | server | yes | App key for the EVES token endpoint. **Secret.** |
| `TOKEN_API_SECRET` | server | yes | App secret for the EVES token endpoint. **Secret.** |
| `PORT` | server | no (default `8080`) | Port the server listens on. |

- **Health check:** `GET /healthz` returns `{ "ok": true, "env": "<APP_ENV>" }`.
- **HTTPS only.** Serve the app only over HTTPS. Installer tokens travel in request headers, and browsers block the camera (QR scanning) on plain-HTTP pages.
- **Secrets.** Inject them from the secret store at runtime. Never bake them into the image or commit them. Without a `server/.env.<APP_ENV>` file, the server logs a warning and uses the process environment — the expected setup in a container.
- **Missing variables.** The server refuses to start if a required variable (`BASE_URL_API`, `TOKEN_API_KEY`, `TOKEN_API_SECRET`) is missing. The error names the missing variable, never its value.
- **Sessions reset on some deploys.** An installer's progress is saved in the browser's `sessionStorage` under a versioned key (`dynachrg.installSession.v6`). If a release changes that key's version, any installation in progress is reset (see [docs/KNOWN-LIMITATIONS.md](docs/KNOWN-LIMITATIONS.md)).

## Project structure

```
src/
  components/
    atoms/        smallest pieces — Button, Checkbox, Heading, IconButton, Input, ProgressRing,
                   PulsingBadge, Select, StatusPill, SuccessCheck, Tooltip, Wordmark
                   (Input/Select are fused "field" atoms: label + control + helper + error in one
                   component — see CLAUDE.md §1 for why this differs from a stricter atom/molecule split)
    molecules/     small combinations of atoms — ChecklistItem, CollapsiblePanel, ErrorBanner,
                   OutcomePanel, PhoneNumberField, ReadOnlyField, ResumeInstallBanner,
                   SelectField (generic, type-safe wrapper over the Select atom), Stepper
    organisms/     page sections — AppShell (header, offline banner, toaster chrome)
    templates/     page layout skeleton — AppLayout (wraps AppShell)
    ErrorBoundary.tsx, PageTransition.tsx   app-level utilities, not tiered
  pages/          one folder-less file per routed screen; wires organisms to session state and flows
    shared/        CSS modules shared across a few page files (form.module.css, siteCard.module.css)
  api/            typed endpoint functions returning Result<T>
    http.ts          fetch wrapper + error handling
    normalize.ts     reconciles the backend's two response envelope shapes
    mappers.ts       session state -> API request payloads
    endpoints.ts     the 5 real EVES endpoint functions (mock-backed until VITE_USE_MOCKS=false)
    mocks/           offline stand-ins used when VITE_USE_MOCKS is not explicitly "false"
  flows/          multi-call sequences — enterTokenFlow, commissioningFlow, installFlow
  state/          InstallFlowContext.tsx — sessionStorage-backed install session + its React provider
  navigation/     resolveRoute.ts (status -> screen routing) and useHistorySync.ts (browser history sync)
  hooks/          useQrScanner.ts and useCommissioningCheck.ts
  constants/      electrical.ts (voltage/phase/connector option tables), helpContent.ts, mockData.ts
  types/          api.ts (backend wire shapes) and index.ts (domain types + Draft/Data form types)
  styles/         tokens.css (design tokens), global.css, outcome.module.css
server/
  src/            Express app (index.ts), /api proxy (proxy.ts), token caching (tokenService.ts),
                  env loading (env.ts), request logging (logger.ts)
  .env.example    template for server/.env.<APP_ENV> (placeholders only)
docs/             Parity.md, KNOWN-LIMITATIONS.md, OPS-TEST-GUIDE.md
```

The conventions for this code (atomic design, design tokens, TypeScript patterns, backend integration rules) are in [CLAUDE.md](CLAUDE.md), including two places where the actual implementation deliberately deviates from how those conventions were originally specified — flagged there, not hidden.

## Documentation

- [CLAUDE.md](CLAUDE.md): project conventions and the backend integration rules (including the two deliberate deviations from the original spec — design tokens and the Input/Select atom tier).
- [docs/Parity.md](docs/Parity.md): deliberate differences from the mobile app, and the open backend questions.
- [docs/KNOWN-LIMITATIONS.md](docs/KNOWN-LIMITATIONS.md): open questions, placeholders and work not done in EVES-5453.
- [docs/OPS-TEST-GUIDE.md](docs/OPS-TEST-GUIDE.md): step-by-step test guide for the operations team.
