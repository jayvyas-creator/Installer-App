# CLAUDE.md — DynaChrg Installer (web)

This file governs all work in this repository. Follow it for every prompt, not just the one that introduced it.

It is adapted from the authoritative `CLAUDE.md` the app was rebuilt against (see
`/Users/jayvyas/Downloads/DynaChrg Installer Web Documentations/CLAUDE.md` at the time of this
restructure). Two sections below — design tokens and the Input/Select atom tier — describe a
**deliberate, documented deviation** from that source's literal instructions. They are called out
explicitly, not silently applied.

## 1. Project structure — atomic design

Components live under `src/components/`, organized by complexity tier. Full-screen views live under `src/pages/`.

```
src/
  components/
    atoms/        # smallest pieces: Button, Checkbox, Heading, IconButton, Input, ProgressRing,
                   # PulsingBadge, Select, StatusPill, SuccessCheck, Tooltip, Wordmark
    molecules/     # small combinations of atoms: ChecklistItem, CollapsiblePanel, ErrorBanner,
                   # OutcomePanel, PhoneNumberField, ReadOnlyField, ResumeInstallBanner,
                   # SelectField, Stepper
    organisms/     # larger sections: AppShell (header/offline banner/toaster chrome)
    templates/     # full-page layout skeleton: AppLayout (currently a thin pass-through to AppShell)
    ErrorBoundary.tsx, PageTransition.tsx  # app-level utilities, not tiered — see note below
  pages/           # routed screens composed from organisms/templates
```

Placement rules:

- **Atoms** — a single input, button, label, icon, badge, spinner. Must not import or compose any other custom component. Only host elements + design tokens.
- **Molecules** — a small, focused combination of atoms. May compose atoms only, not other molecules (with the one exception below).
- **Organisms** — a larger, meaningful section built from molecules and/or atoms (e.g. `AppShell`, the page header/offline-banner/toaster chrome). May compose molecules, atoms, and other organisms.
- **Templates** — full-screen layout skeletons composed from organisms, arranging them into a page shape without wiring real data.
- **Pages** — the routed screens. Compose a template (or organisms directly for simple screens) and wire up real data/state from `InstallFlowContext`.

When adding a component, first decide its tier by asking "what is the most complex thing this composes?" — an atom composes nothing, a molecule composes only atoms, an organism composes molecules/atoms/organisms, a template/page composes organisms.

`ErrorBoundary` and `PageTransition` sit directly under `src/components/`, outside the atomic tiers. They are app-shell-level concerns (render-error recovery, route transition animation) wired once in `src/App.tsx`, not reusable UI pieces a page composes — tiering them as atoms/molecules/organisms wouldn't describe what they do.

### Known deviation: Input/Select are fused "field" atoms, not strict atom-only primitives

The authoritative source doc describes a stricter split: bare atom primitives (`Input`, `Select`) plus separate molecule wrappers (`TextField`, `SelectField`) that add the label/helper/error chrome. **That split was not built.** What actually exists:

- `src/components/atoms/Input.tsx` and `src/components/atoms/Select.tsx` are **fused** components: each already combines label + control + helper text + error message in one atom-tier component (closer to what the doc calls a molecule-tier `TextField`/`SelectField`). They are still the right thing to reach for everywhere a labeled field is needed — there is no separate "bare" `<input>`/`<select>` atom underneath them to use instead.
- `src/components/molecules/SelectField.tsx` was still added, but as a **thin, generic, type-safe wrapper around the `Select` atom** (`SelectField<T extends string>`), not as a from-scratch label/control/error composition. It exists purely so call sites get a union-typed `value`/`onValueChange` instead of plumbing `ChangeEvent<HTMLSelectElement>` and string casts through every page.

Treat this as the real tier boundary in this codebase: reach for `Input`/`Select` directly for untyped or string-valued fields, and `SelectField<T>` when the option values are a specific string union. Don't assume a lower-level, unlabeled atom exists underneath them — it doesn't, and decomposing `Input`/`Select` further is a larger, deliberate refactor, not something to redo incidentally while wiring up a page.

### Parametric atoms — size/variant as props, not separate components

When an atom has multiple visual sizes or styles, model that as props on the one component (e.g. `size: 'sm' | 'md' | 'lg'`, `variant: 'primary' | 'secondary'`), not as separate components (`ButtonSmall`, `PrimaryButton`) or hardcoded styles duplicated per call site. Give each prop a default that reproduces the component's current look, so every existing call site keeps rendering identically without changes.

```tsx
interface ButtonProps extends NativeButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      {...rest}
    />
  )
}
```

In the CSS module, keep truly shared rules (layout, border-radius, transitions, disabled state) on the base class, and put only the values that actually change per size/variant into their own classes — still built from design tokens, never literals. This is the `Button` atom's established pattern; apply it to any other atom that grows size or style variations instead of forking new components.

## 2. Styling — design tokens

No hardcoded hex values, font strings, or magic transition durations inside component files. All visual constants are design tokens, defined once in `src/styles/tokens.css` and referenced everywhere else.

### Known deviation: the rich token scale was kept, not collapsed

The authoritative source doc's token section prescribes a flatter scale (`--color-primary`, `--color-success`, `--color-disabled`, a small proposed type/spacing scale, etc.) as something to establish from scratch. **That collapse was deliberately not done.** `src/styles/tokens.css` as it actually exists today is a much richer, already-reviewed system:

- **Confirmed brand** — `--color-brand-orange-{50,100,500,600,700,800}`, `--color-success-{50,100,600,700}`, `--color-cta-{500,600,700}`, `--color-disabled-overlay`, the `--font-family-base` / `--font-family-heading` pairing, `--duration-standard-max` (1000ms). These are fixed brand values, verified against the PayG Installer App source directly — do not alter them without explicit instruction.
- **Proposed, OKLCH-based scale** — a full `--color-neutral-{0..900}` ramp in OKLCH (hue 235, cool slate), plus semantic error/warning/info ramps, surfaces, text, borders, a type scale (`--font-size-display` … `--font-size-micro` with matching line-heights/weights), a 4px spacing scale, radius, elevation (`--shadow-*`), and motion durations/easings. This is real, already-conducted design review work, not a placeholder — it is used throughout every atom/molecule/organism CSS module.
- **Doc-compatibility aliases** — a block at the end of `:root` (`/* Doc-compatibility aliases */`) adds the flatter, doc-familiar names (`--color-primary`, `--color-success`, `--color-disabled`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-surface`, `--color-background`, `--shadow-surface`, `--size-touch-target`, `--focus-ring-width`, `--focus-ring-offset`, `--transition-standard`) as thin aliases **pointing at** the real tokens above (e.g. `--color-primary: var(--color-brand-orange-500);`). They exist so a developer who read the source doc first can grep for the name they expect and land on the right real value — they are not a second, competing token system.

**Why:** the OKLCH scale reflects real prior design review and is already load-bearing in every component's CSS today. Renaming it to match the doc's flatter proposal would have silently changed pixel-level values (contrast ratios, spacing, shadows) across the entire app for no functional gain. If you need a new visual constant, add it to the real scale (matching its existing tier/naming convention) and, if it corresponds to a name the source doc uses, add a matching alias — don't reintroduce a parallel flat scale.

Any component needing a color, font size, weight, line-height, spacing value, or transition duration must reference one of these tokens (either the real name or its alias) — never a literal value.

## 3. TypeScript conventions

### Discriminated unions over flat optional fields

If only certain combinations of fields are valid together, model that with a discriminated union, not a flat interface full of optional properties. This is how `RequestState<T>` and `Result<T>` are defined in `src/types/api.ts`:

```ts
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

Every function in `src/api/` returns a `Result<T>` instead of throwing, so pages can render loading/error/success without try/catch at the call site. Pages hold async UI state as a `RequestState<T>` instead of juggling separate `loading`/`error`/`data` booleans that can disagree with each other.

### Draft/Data type split for multi-step forms

For any multi-step form, `src/types/index.ts` defines a `*Draft` type (in-progress, allows empty/unselected values like `""`) separate from the matching `*Data` type (fully validated, submitted shape), plus a `validate*Draft` function that narrows Draft → Data. The pattern is used for `InstallerDraft`/`InstallerData`, `SiteAreaDraft`/`SiteAreaData`, `ChargerElectricalDraft`/`ChargerElectricalData`, and `ConnectorDraft`/`ConnectorData`:

```ts
export interface SiteAreaDraft {
  name: string;
  voltage: number | "";
  numberOfPhases: NumberOfPhases | "";
  phaseAssignment: PhaseAssignment | "";
  ampsPerPhase: string;
}

export interface SiteAreaData {
  name: string;
  voltage: number;
  numberOfPhases: NumberOfPhases;
  phaseAssignment: PhaseAssignment;
  ampsPerPhase: number;
  maxPowerKw: number;
}

export function validateSiteAreaDraft(
  draft: SiteAreaDraft,
  existingNames: string[],
): { data: SiteAreaData; errors: null } | { data: null; errors: SiteAreaDraftErrors } { /* ... */ }
```

Pages hold a Draft in local/session state and only ever hand a validated Data value to a flow (`src/flows/`) or API call.

### Generic components for shape-identical, type-varying components

If a component's structure is identical but the underlying option/value type varies, make it generic instead of duplicating it per type. `src/components/molecules/SelectField.tsx` is the example already in the codebase:

```ts
export interface SelectFieldProps<T extends string>
  extends Omit<SelectProps, "options" | "value" | "onChange"> {
  options: SelectFieldOption<T>[];
  value: T | "";
  onValueChange: (value: T) => void;
}

export function SelectField<T extends string>({ options, value, onValueChange, ...rest }: SelectFieldProps<T>) {
  /* wraps the Select atom, converting the raw change event into a typed value */
}
```

### Mock-function convention

Every real endpoint function in `src/api/endpoints.ts` branches on a build-time flag:

```ts
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

export async function getChargerByToken(/* ... */): Promise<Result<ChargerLookup>> {
  if (USE_MOCKS) return mockGetChargerByToken(chargerId);

  // TODO(api): replace mock with GET /api/registercharger/v1.0/:chargerId?TenantId=&SiteId=
  const result = await request<unknown>(/* ... */);
  // ...
}
```

The mock branch delegates to `src/api/mocks/realEndpoints.ts`, an in-memory, charger-ID-keyed stand-in for the real EVES API. The real branch is already wired (not a stub) and carries a `TODO(api)` comment naming the exact backend path it calls — this is the live convention for any endpoint whose real-backend wiring isn't fully confirmed yet, not just a placeholder pattern to copy once.

## 4. Verification standard

Before considering any change complete, run and confirm all pass (these are this repo's actual `npm` scripts — see `package.json`):

```
npm run typecheck          # tsc --noEmit -p tsconfig.app.json
npm run typecheck:server   # tsc --noEmit -p server/tsconfig.json
npm run lint                # oxlint
npm run build                # tsc -b && vite build && tsc -p server/tsconfig.json
npm test                      # vitest run
```

Note: this project's root `tsconfig.json` is a solution-style file (`"files": []`, only `references`), so a bare `npx tsc --noEmit` silently checks nothing. Always use `npm run typecheck` (which passes `-p tsconfig.app.json`) or `npm run build` (whose `tsc -b` correctly follows the project references).

`npm test` runs Vitest once (`vitest run`). Two test files exist today — `src/navigation/resolveRoute.test.ts` and `src/types/index.test.ts` — as the first suite covering the status→screen routing logic and the Draft/Data validators. This is a starting point, not comprehensive coverage: more tests should be added alongside new pages and flows, not treated as already covered.

## 5. Component reuse rule

Before creating any new component, search `src/components/` for an existing atom or molecule that already covers the need. Prefer extending an existing component (via props) over creating a near-duplicate. Only create a new component when no existing one can reasonably be adapted. When the need is a new size or visual style of an existing atom, that's exactly the parametric-atoms pattern in section 1 — add a prop, don't fork a component. When the need is a differently-typed `Select`, that's the `SelectField<T>` pattern — don't hand-roll another generic wrapper.

## 6. Backend integration (EVES-5453)

The browser never talks to the EVES API directly. Every call from `src/` goes to `/api/*` on this repo's own Node/Express proxy (`server/`), which fetches and caches a bearer token (endpoint 1 below, `server/src/tokenService.ts`) and injects `Authorization: Bearer <token>` (`server/src/proxy.ts`). The browser only sends what the installer legitimately has: `installerToken`, charger ID, query params and request bodies.

### Rules

- **The mobile app is the source of truth** for endpoints, payloads, dropdown values, validation and screen routing (`eves-charger-installerapp`, reference only — never edit it). When unsure, open the matching mobile screen and copy its behaviour — but fix its bugs rather than porting them.
- **`TOKEN_API_KEY` / `TOKEN_API_SECRET` exist only in the server's environment.** `server/src/proxy.ts` forwards only four request headers from the browser — `installerToken`, `chargerID`, `appname`, `content-type` — and drops cookies and any `Authorization` header the browser sends. Every request under `/api/auth/*` gets a `403`, with the path normalised (decoded, `.`/`..` collapsed, lower-cased) first so an encoded or traversal bypass attempt (`/api/x/../AUTH`, `/api%2Fauth`) can't get through.
- **Every API function is typed and returns a `Result`.** Request and response types live in `src/types/api.ts`. Treat a response as failed if the HTTP status is not OK **or** the body says so. The backend uses two envelope shapes — `{ returnCode, isError, message, data }` and `{ status, result, errorCode, description, token }` — and `src/api/normalize.ts` reconciles both; endpoints with no payload must positively report success via either (`expectSuccess`).
- **Existing rules still apply** — atomic design (§1), design tokens (§2), Draft/Data split and discriminated unions (§3), component reuse (§5). The mock-function rule in §3 applies to any endpoint not yet confirmed against the real backend.
- **Verification before finishing any task** is the list in §4.

### The 5 real endpoints

Paths are relative to the backend's `BASE_URL_API`. The browser calls the same path under this app's own `/api` proxy. Mobile sources and payload shapes below are as documented in the authoritative CLAUDE.md; the TypeScript shapes actually implemented are in `src/types/api.ts` and `src/api/endpoints.ts`.

| # | Method & path | Mobile source | Inputs → outputs |
|---|---|---|---|
| 1 | `POST /api/auth/1.0.0/token` | `api/authService.js` | **Proxy-only, never called from the browser.** Headers `appname: RegisterCharger`, `appkey`, `appsecret` → `access_token` (cached ~1h; `server/src/tokenService.ts` refreshes 5 minutes before expiry or on an upstream 401). |
| 2 | `GET /api/registercharger/v1.0/:chargerId` | `ValidateCharger.js`, `tokenId.js` | Query `TenantId`, `SiteId`; header `installerToken` → `data { chargerId, qrCodeUrl, serialNumber, noOfConnector, connectors[{ connectorType }], site { siteName, siteAreas[] } }`. Note: the real `ChargerLookup` response nests **one** `site` object with multiple `siteAreas` — there is no multi-site-selection step anywhere in this flow (see the note below). |
| 3 | `GET /api/registercharger/v1.0/status/:chargerId` and `POST …/status/:chargerId?installationStep=<step>` | GET: `tokenId.js`. POST: `ValidateCharger.js`, `CommunicationProgress.js`, `OCPPTesting.js`, `OCPPInProgress.js` | Header `installerToken` (GET also sends `chargerID`). GET → `data { status, installationStep }`. POST advances the step and succeeds when `returnCode === 200` or `status` is `"Success"`. |
| 4 | `PUT /api/registertoken/v1.0` | `tokenId.js` | Query `token`, `chargerID`; header `appname: RegisterCharger`; body `{ Email, FirstName, LastName, CompanyName, PhoneNumber, ContractLicenseNumber }` → `result { tenantId, siteId }`. |
| 5 | `POST /api/registercharger/v1.0/installed/:chargerId` | `ConnectorInfo.js` | Header `installerToken`; body `{ chargerId, tenantId, siteId, siteArea {...}, chargerInfo {...}, connectors[...] }` → success when `returnCode === 200` or `status` is `"Success"`. `phaseAssignment` must be a string (the API rejects `{}`). |

### No multi-site selection step

An earlier version of this app had a `SelectSitePage` and a `src/constants/sites.ts` for choosing among several *sites*. **Both were deleted during this restructure.** The real `ChargerLookup` response (endpoint 2) returns exactly one `site` per charger, with that site's `siteAreas[]` as the only thing to choose among (zero/one/several site *areas*, handled by Site Information / Create Site Area — not a site picker). If you see any reference to selecting between multiple sites, it describes a flow that never existed against the real API and should not be reintroduced.

### Status → screen routing

Implemented in `src/navigation/resolveRoute.ts` (covered by `src/navigation/resolveRoute.test.ts`). After the token is registered (endpoint 4), the app re-reads the status (endpoint 3, GET) and routes on `status` + `installationStep`.

| `status` | `installationStep` | Web route |
|---|---|---|
| `Active` | any | `/ready-to-charge` |
| `Registered` | `null` | `/validate-charger-details` |
| `Registered` | `CDCheckComplete` | `/site-area/new` if the site has 0 site areas, else `/site-information` |
| `Installed` | `null` | `/communication-checklist` |
| `Installed` | `ChargerCommCheckComplete` | `/physical-healthiness` |
| `Installed` | `ChargerHWCheckComplete` | `/ocpp-testing` |
| `Connected` | any | `/ready-to-be-commissioned` |
| lookup rejected (4xx) / `isError` | — | `/no-charger-found` |
| lookup can't connect (network, timeout, 5xx) | — | *(stays on `/enter-token` with the error + Retry — web-only, see `docs/Parity.md`)* |

Step advances (endpoint 3, POST) happen at Validate Charger confirm (→ `CDCheckComplete`), CommunicationProgress (→ `ChargerCommCheckComplete`), and OCPPTesting (→ `ChargerHWCheckComplete`). The final OCPP step value is a known placeholder — see `docs/KNOWN-LIMITATIONS.md` and `docs/Parity.md`.
