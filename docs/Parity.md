# Mobile parity: intentional differences

The mobile app (`eves-charger-installerapp`) is the source of truth for
endpoints, payloads, dropdown values, validation and routing (see
[CLAUDE.md](../CLAUDE.md), section 6). The web app copies it, except where this
page lists a deliberate difference. Anything not listed here should behave the
same. If it doesn't, that is a bug.

Each section lists what mobile does, what the web does, and why.

> This page is carried over from the product/engineering documentation this
> restructure was built against. Code paths it cites have been checked against
> this repo and updated where the file or constant name has since changed;
> the described product behaviour itself is unchanged.

## Validation and number inputs

| Area | Mobile | Web | Why |
|---|---|---|---|
| Charger voltage vs site area voltage (`chargerElectrical.js`) | Compares the two voltages as **text**. `'1000' < '400'` is true as strings. | Compares them as **numbers**. The error shows as soon as the voltage exceeds the site area's, and Next stays disabled until it is fixed. | Comparing strings gives wrong answers. Showing the error immediately makes it clear why Next is disabled. |
| Amps inputs: charger *Amp Per Phase*, connector *Total Amperage* | Digits only, no upper limit. | Digits only, at most 4 digits, **1–1000**. An out-of-range value shows an inline error as it is typed, and Next stays disabled while it is invalid. | With no upper limit, a long digit string made Rated Power display in exponent notation (`1e+23`). 1000 A per phase is above any realistic single charger. |
| Site area *Amps Per Phase* (create site area) | Free text. | Digits only, at most 4 digits, **1–9999**. | A site supply can be larger than one charger, so it doesn't get the 1000 A cap. The real limit is an open question for the backend (below). |
| Connector *Supply Voltage* | Free text. Only checked as "filled". | Digits only, at most 4 digits, a whole number from 1 to 9999. | Rejects `0`, signs, decimals and exponent notation, which the API can't use. |
| Rated Power / Max Power display | Varies; the connector panel shows a hard-coded value (below). | Always 2 decimals (`5.29`, `11.00`), never exponent notation. **Display only:** the install payload still sends the unrounded value. | Readability. The payload is left unchanged on purpose. |
| Next button on the electrical, connector and create-site-area forms | Enabled once fields are filled. | Enabled only when the whole form validates. | Prevents submitting `0` amps, a voltage over the site's limit, or a duplicate site area name. |

These ranges are implemented as inline checks inside the `validate*Draft` functions in `src/types/index.ts` (`validateChargerElectricalDraft`, `validateConnectorDraft`, `validateSiteAreaDraft`) — see [CLAUDE.md](../CLAUDE.md) section 3 for the Draft/Data pattern they're part of.

## Connector Information (`ConnectorInfo.js`)

| Mobile | Web | Why |
|---|---|---|
| Choices that are no longer valid are kept after the site, phase count or connector type changes. | Any choice the change makes unavailable is **cleared**. | Otherwise an invalid combination could be submitted. |
| The connector type list starts with a `'Not set'` entry. | `'Not set'` removed; the empty placeholder plays that role. | `'Not set'` is not a real connector type and would be sent to the API. |
| Voltage and amperage only need to be "filled". | Both are **required and must be > 0** (amperage 1–1000). | The API rejects zero or empty values. |
| "Maximum Power (Watts)" always shows the hard-coded `1456.00`. | **Removed** from the connector panels. | The number was meaningless. Rated power is shown, correctly calculated, on Charger Electrical Information. |
| CCS and CHAdeMO always get phase assignment `ABC`. | **Same as mobile.** | Kept on purpose to match the backend's expectations. |

## Steps, guards and error handling

| Area | Mobile | Web | Why |
|---|---|---|---|
| Validate Charger *Confirm* with no site in the details response | Does nothing. No routing branch in `ValidateCharger.js` matches, so the installer is stuck with no message. | Shows an error and stays. | No silent dead end. The next screens need the site and its areas. |
| Re-posting installation steps (Back + Next, refresh) | Each screen posts its step again. | Completed steps and passed checks (tracked in the install session, `src/state/InstallFlowContext.tsx`) skip any step or check already done, so **no step is posted twice**. | Avoids repeat writes to the backend. This matters because the final OCPP step currently re-uses the communication step (below). |
| Token registration (`PUT /registertoken`) after Back + Continue | Sent again on every submit. | **Skipped** when the charger, token and every installer field are unchanged (tracked by the `registered` flag in the install session). The status is re-read and the flow resumes from where the backend is. If anything changed, the PUT is sent again. | Re-sending identical data changes nothing. Changed details still reach the backend. |
| Install submit (`POST /installed`) after Back + Next | Sent again. | **Never sent again** once it has succeeded for this charger, even if the details changed (the `installed` flag in `src/state/InstallFlowContext.tsx`, set via `markInstalled`). This flag is also set when the resume status is `Installed` or `Connected`. Going Back to Site Information, Charger Electrical Information or Connector Information shows the values read-only, with the note "This charger is already installed. Contact support to change these details." Site Information shows only the installed site area: no switching and no "create new site area". Next moves on without posting or changing anything. | An installed charger's electrical details shouldn't change from the installer flow. Whether editing should ever be allowed is an open question for the backend. |
| First status lookup on Enter Token ID fails | Any failure goes to No Charger Found. | A **network error, timeout or 5xx** stays on the page with the error and a Retry button. A 4xx or `isError` response still goes to No Charger Found. | A dropped connection is not "charger not found". Retrying is the right next step. |
| Later failures on Enter Token ID (registration, second status read, site details) | Errors logged with `console.log`; nothing shown to the user. | The message is shown on the page. Connection and server errors also get a Retry button. A registration that already succeeded is kept, so Retry doesn't send it again. | No silent failures. |
| Heartbeat and OCPP error panels | Shown only on the first failure. | Shown **on every failure**, with the backend's error message under the standard text. | Each failure needs the same guidance. |
| OCPP Testing *Next* | Enabled even if the hardware check (`ChargerHWCheckComplete`) failed. That failure is ignored. | Disabled until the hardware check passes. A failure shows the error and a Retry button, and hides "Processing… this may take a few minutes." | Prevents posting the final OCPP step with no hardware check behind it. |
| Loading states | Varies, often none. | Every page that calls the API shows a busy, disabled button with a spinner or a "Loading…" status, and on failure a clear error with a retry path. | No screen should look frozen. |

## Navigation (web only)

| Area | Web behaviour | Why |
|---|---|---|
| Browser Back/Forward | Moves between screens through history state (`src/navigation/useHistorySync.ts`). Nothing goes into the URL, and the session in `sessionStorage` stays the source of truth. Processing screens are never history entries (see `PROCESSING_ROUTES` in `src/navigation/resolveRoute.ts`), and Back can't leave one while its check is running. Entries for a charger the session no longer holds (after Cancel or a new charger) are refused. | Mobile has a native back stack; the browser needs an equivalent that can't revisit screens with no data behind them. |
| Refresh (F5) | Restores the same screen and drafts from `sessionStorage`. | Already the case before this restructure. |
| New charger ID scanned or entered | Clears completed steps, passed checks, the token, tenant and site, site areas, the registration and every charger-specific draft (`resetForNewChargerId` in `src/state/InstallFlowContext.tsx`). **Keeps** the Installer Information draft. | Nothing from the previous charger can leak into the new one. The installer's own details stay filled in. |
| Saved-session format | The version is in the storage key (`dynachrg.installSession.v6`, `src/state/InstallFlowContext.tsx`). A version bump resets any session in progress, and older keys are deleted on load. | Old saved shapes can't be trusted against new code. |

## Help and support content

| Mobile | Web | Why |
|---|---|---|
| FAQ "How do I connect the charger to Wi-Fi, Ethernet, or LTE?" | **Left out.** | Mobile shows the "won't power on" answer for it, which is wrong. It will be added back once there is a real answer (TODO(content)). |
| The "won't power on" answer refers to "the wiring diagram available in the Help section of the app". | Kept as written. | Neither app has a wiring diagram. Flagged for content review (TODO(content)). |
| Typos, e.g. "escalate it to support further diagnostics". | Obvious typos fixed ("…to support for further diagnostics"). | Copy quality. |
| Help shows **+1 323-488-2846**; the error panels show **(323) 488-2092**. | **Same numbers**, copied from mobile. | Kept as in mobile until support confirms which number is right where. |
| Heartbeat panel says "contact your **CPO**"; OCPP panel says "contact your **support team**". | **Same wording as mobile.** | Kept as in mobile. |
| FAQ rows use a small "▸" toggle. | Full-row button with a rotating chevron, `aria-expanded`/`aria-controls`, and Enter/Space support (native button). | Accessibility and touch target size. |

The support phone number and FAQ copy live in `src/constants/helpContent.ts` (`SUPPORT_PHONE`).

## Accessibility and layout (web only)

- Every input has a `<label>` or an `aria-label`. Errors and notes are linked with `aria-describedby`.
- There is a visible `:focus-visible` ring on every interactive element.
- The Help link and link-style buttons are at least 44×44 px.
- A collapsed connector panel with an invalid field shows "— needs attention" in its header and a red border, so a disabled Next always has a visible reason.
- Below 640px the page and card padding shrink and action buttons stack full width, primary on top. Tooltips and the phone country code can't overflow the screen.

## Placeholders pending backend confirmation

- The final OCPP step value is a **placeholder**: it copies what mobile's `OCPPInProgress.js` sends, which re-posts the communication step (`ChargerCommCheckComplete`). The commissioning sequence lives in `src/flows/commissioningFlow.ts`; the placeholder step literal is currently modeled in `src/api/mocks/realEndpoints.ts` as `"OcppCheckComplete"`. Because of this, the OCPP check is tracked separately in the install session (`src/state/InstallFlowContext.tsx`, `ocppSteps`) and never trusted from the backend's `installationStep` alone.

## Open questions for backend

| # | Question | Where |
|---|---|---|
| 1 | What is the correct installation step value after OCPP testing? Mobile re-posts `ChargerCommCheckComplete`. | `src/flows/commissioningFlow.ts`, `src/api/mocks/realEndpoints.ts`, `src/types/api.ts` (TODO(backend)) |
| 2 | How should a new site area send `isNew` / `siteAreaId`? Mobile sends a client-made id, `area-${Date.now()}`. | `src/flows/installFlow.ts` (`buildInstallPayload`, the `isNew: true` branch, TODO(api)) |
| 3 | Should `siteArea.maxAmp` in the install payload be the charger's amps per phase? That is what mobile sends. | `src/flows/installFlow.ts` (`buildInstallPayload`, TODO(backend)) |
| 4 | Site area Amps Per Phase: the web allows 1–9999 (4 digits). What is the real backend limit? Charger and connector amps are capped at 1000. | `src/types/index.ts` (`validateSiteAreaDraft`, TODO(api)) |
| 5 | Re-submitting install after success is blocked; confirm with backend if editing should be allowed. | `src/state/InstallFlowContext.tsx` (`installed`, `markInstalled`) |
| 6 | Content: what is the real answer to the Wi-Fi/Ethernet/LTE FAQ, and does a wiring diagram exist to link to? | `src/constants/helpContent.ts` (TODO(content)) |
| 7 | Which support number belongs where: +1 323-488-2846 (Help) or (323) 488-2092 (error panels)? | `src/constants/helpContent.ts` |
| 8 | The home screen's version label is hard-coded to `v1.0.0`. | `src/pages/HomePage.tsx` (TODO) |

## Dependencies (`npm audit`)

- **Fixed** with `npm audit fix` (no breaking changes): `brace-expansion`, `nanoid`, `source-map-js`.
- **Fixed** with a `package.json` override: `shell-quote` → `^1.12.0`. It is pulled in by `concurrently` (used by `npm run dev` to run Vite and the proxy together), which otherwise pins an older, vulnerable version (critical: GHSA-pqg4-j6r4-53mv). Dev-only; `concurrently` was checked to still run.
- **Left (3 high):** `braces` ≤ 3.0.3 (GHSA-vfj7-8cjw-p6xm), reached through `micromatch` and then `http-proxy-middleware` (a transitive dependency of Vite's dev proxy).
  - No patched version exists: 3.0.3 is the latest release, so an override can't fix it.
  - npm's suggested fix downgrades `http-proxy-middleware`, which would break the proxy.
  - It can't be reached in practice. This app's own proxy (`server/src/proxy.ts`) builds the upstream URL directly rather than passing a glob pattern anywhere `micromatch`/`braces` would parse one.
  - Revisit when `braces` or `http-proxy-middleware` releases a fix. Re-run `npm audit` periodically, since dependency versions in this repo (Vite, Vitest, React, Express) have moved on from whatever was current when this note was first written.
