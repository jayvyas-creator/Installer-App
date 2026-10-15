# Known limitations (EVES-5453)

This page lists what the web installer does **not** do yet, what it does provisionally, and what is still waiting on an answer.

- Deliberate differences from the mobile app, which are not limitations, are in [Parity.md](Parity.md).
- How to run and deploy the app is in the [README](../README.md).
- Code paths below are checked against this repo and updated where a file or constant name has changed since this page was first written; the described behaviour itself is unchanged. Several named constants this page originally pointed at (e.g. `AMPS_RANGE`, `SITE_AREA_AMPS_RANGE`, `DEFAULT_SITE_AREA_PHASE_CODE`) don't exist as standalone exports in this codebase — the same ranges/defaults are implemented as inline checks where noted.

## Open backend questions

Each of these items works today, but the current behaviour is copied from the mobile app or is a reasonable guess. The backend team needs to confirm it.

| # | Question | Current behaviour | Where in the code |
|---|---|---|---|
| 1 | **What is the final OCPP step value?** | A **placeholder** copied from mobile's `OCPPInProgress.js`, which re-posts the communication step (`ChargerCommCheckComplete`). Because of this, the OCPP check result is tracked separately in the install session and never inferred from the step. | `src/flows/commissioningFlow.ts`, `src/api/mocks/realEndpoints.ts` (models the placeholder step as `"OcppCheckComplete"`), `src/types/api.ts` |
| 2 | **Where should `siteArea.maxAmp` in the install payload come from?** | As mobile sends it. | `src/flows/installFlow.ts` (`buildInstallPayload`, TODO(backend)) |
| 3 | **How should a new site area send `isNew` / `siteAreaId`?** | `isNew: true` with a temporary id made by the app, as mobile does. | `src/flows/installFlow.ts` (`buildInstallPayload`, the `isNew: true` branch, TODO(api)) |
| 4 | **What `phaseAssignment` should an existing site area send?** | The value the backend returned, falling back when it returned none. Always sent as a string, because the API rejects `{}`. | `src/flows/installFlow.ts` (`buildInstallPayload`, the `isNew: false` branch) |
| 5 | **What format should `PhoneNumber` use?** | The national number **without** the country code, as mobile sends it. The number is checked against the chosen country's rules, but the country code is not sent. | `src/api/mappers.ts` (`mapInstallerToRegisterTokenPayload`), `src/components/molecules/PhoneNumberField.tsx` |
| 6 | **What are the real amps limits?** | Charger *Amp Per Phase* and connector *Total Amperage*: **1–1000**. Site area *Amps Per Phase*: **1–9999**. Connector *Supply Voltage*: 1–9999. | `src/types/index.ts` (`validateChargerElectricalDraft`, `validateConnectorDraft`, `validateSiteAreaDraft`, TODO(api)) |
| 7 | **Is a connector amperage of `0` allowed?** | No. It is rejected, because the API appeared to reject zero or empty values. Mobile only checks that the field is filled. | `src/types/index.ts` (`validateConnectorDraft`) |
| 8 | **Can an installed charger's details be re-submitted or edited?** | No. Once the install succeeds, or when a resumed charger is already *Installed* or *Connected*, the install is never posted again and the screens are read-only with "Contact support to change these details." | `src/state/InstallFlowContext.tsx` (`installed`, `markInstalled`) |
| 9 | **Which support number belongs where?** | Help and No Charger Found show **+1 323-488-2846**. The No Heartbeat and OCPP failure panels show **(323) 488-2092**. Both are copied from mobile. | `src/constants/helpContent.ts` (`SUPPORT_PHONE`) |
| 10 | **"CPO" or "support team"?** | The heartbeat panel says "contact your **CPO**"; the OCPP panel says "contact your **support team**". Both are copied from mobile. | `src/pages/CommunicationChecklistPage.tsx`, `src/pages/AutomatedOcppTestingPage.tsx` |
| 11 | **What is the answer to the Wi-Fi/Ethernet/LTE FAQ?** | The question is **left out**, because mobile shows the wrong answer for it. | `src/constants/helpContent.ts` (TODO(content)) |
| 12 | **Does a wiring diagram exist?** | The "won't power on" answer mentions "the wiring diagram available in the Help section". Neither app has one. The text is kept as written. | `src/constants/helpContent.ts` (TODO(content)) |
| 13 | **What version label should Home show?** | It is hard-coded to `v1.0.0`. | `src/pages/HomePage.tsx` (TODO) |
| 14 | **maxPower/maxAmp are 0 for existing site areas.** Should the backend fill them in, or should the app calculate them? | Dev can return `"maxPower": 0, "maxAmp": 0` for existing site areas. Site Information shows the backend value as-is, as mobile does; only the create-site-area form calculates V × A × phases / 1000. The install payload's `siteArea.maxPower` is likewise the backend value, so 0 is sent back for an existing area. | `src/pages/SiteInformationPage.tsx`, `src/flows/installFlow.ts` (`buildInstallPayload`) |
| 15 | **What does a failure in the `status`/`result` shape look like?** | The install POST and token PUT answer `{"status":"Success","result":…,"errorCode":null,"description":null,"token":null}`; no failure in that shape has been seen on dev. The app assumes one is a `status` other than "Success" (any case), and shows `description`, else `errorCode`, else a generic message. Every endpoint accepts either envelope shape, so this also covers a failure the step POST or a GET might send in it. | `src/api/normalize.ts`, `src/api/mocks/realEndpoints.ts` |

## Validation questions (for ops and backend)

The web app does **not** check the following, and neither does the mobile app. Decide whether they should be checked:

- **Charger capacity vs site area capacity:** should the app warn or block when the charger's amps per phase or rated power is **higher than the chosen site area's** capacity? Today only the voltage is compared (the charger voltage may not exceed the site area voltage).
- **Connector voltage vs charger voltage:** should each connector's Supply Voltage have to **match the charger's** Supply Voltage? Today they are independent.

## Not done in this ticket

- **Docker and deployment:** owned by DevOps. The [README](../README.md) has a deploy section with the commands and environment variables.
- **Proxy hardening:**
  - The Express proxy (`server/src/proxy.ts`) does not set security headers (e.g. `helmet`).
  - `/api` has no rate limiting.
  - Both should be added, either in the proxy or in front of it at the load balancer or ingress.
- **End-to-end test against the real dev backend.** All flows are covered by unit/integration tests and mock mode as those tests are written out. A full run with real test data is still pending: it needs test charger IDs in known states and their installer tokens from the backend team. The [ops test guide](OPS-TEST-GUIDE.md) is written for that run.
- **Remaining `npm audit` findings:** see the "Dependencies" section of [Parity.md](Parity.md).
- **Node version not pinned.** There is no `engines` field in `package.json` and no `.nvmrc`. The [README](../README.md) states the minimum (20.19+ or 22.13+).

## Operational notes

- **Deploys can reset sessions in progress.**
  - The installer's progress is saved in the browser's `sessionStorage` under a versioned key (`dynachrg.installSession.v6`, `src/state/InstallFlowContext.tsx`).
  - When a release raises that version, any installation in progress in an open tab starts over from Home. Older keys are deleted.
  - The charger's state in EVES is not affected, so entering the charger ID and token again resumes from the backend status.
- **Mock mode can't test resume.** With `VITE_USE_MOCKS=true` the status is always *Registered* with no step. Resume routing can only be tested against a real backend.
- **Mock mode must be off in deployed builds.** `VITE_USE_MOCKS` is compiled into the bundle at build time (see the [README](../README.md) deploy notes).
