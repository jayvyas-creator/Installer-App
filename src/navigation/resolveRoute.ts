import type { ChargerStatusResponse } from "@/types/api";

export interface RouteContext {
  // Number of site areas on the charger's site, used only when status is
  // Registered/CDCheckComplete to pick which Site Information variant to
  // land on (CLAUDE.md §6 routing table).
  siteAreaCount: number;
}

// Pure function implementing CLAUDE.md §6's status -> screen routing table.
// Flows call this after every status-changing call (postStatus, postInstall)
// instead of a page deciding "what's next" for itself.
export function resolveRoute(status: ChargerStatusResponse, context: RouteContext): string {
  const { status: chargerStatus, installationStep } = status;

  if (chargerStatus === "Active") return "/ready-to-charge";
  if (chargerStatus === "Connected") return "/ready-to-be-commissioned";

  if (chargerStatus === "Registered") {
    if (installationStep === "CDCheckComplete") {
      if (context.siteAreaCount === 0) return "/site-area/new";
      return "/site-information";
    }
    return "/validate-charger-details";
  }

  if (chargerStatus === "Installed") {
    if (installationStep === "ChargerCommCheckComplete") return "/physical-healthiness";
    if (installationStep === "ChargerHWCheckComplete") return "/ocpp-testing";
    return "/communication-checklist";
  }

  return "/no-charger-found";
}

// A lookup that fails outright (4xx / rejected / "not found") routes to the
// dead-end screen. A network/timeout/5xx failure during lookup is a web-only
// deviation: the user stays on Enter Token ID with an inline error + Retry
// instead of being routed away, so this is intentionally not part of
// resolveRoute — EnterTokenIdPage branches on the lookup Result directly.
export const NO_CHARGER_FOUND_ROUTE = "/no-charger-found";

// Routes that represent a backend call in flight. History pushes for these
// are suppressed (see src/navigation/useHistorySync.ts) so back/forward never
// lands a user mid-check.
export const PROCESSING_ROUTES = new Set(["/processing"]);
