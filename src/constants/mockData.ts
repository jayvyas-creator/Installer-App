import type { OcppStep } from "@/types";

// Communication Checklist items (DESIGN-HANDOFF.md §2.9). Nothing here is
// sent to the backend — it's a local gate before the Processing screen
// advances the installation step.
export const COMMUNICATION_CHECKLIST_ITEMS = [
  {
    key: "rated-current",
    label:
      "Rated current configuration is matching with wiring and circuit breaker and is properly configured on the charger",
    description:
      "If charger has dial knob to adjust the current, it has to be properly configured by electrician.",
  },
  {
    key: "wifi-ocpp",
    label: "Wifi and OCPP URL configuration updated as per instruction manual",
  },
  {
    key: "hard-reset",
    label: "Perform a hard reset of the charger and wait at least 2 minutes",
  },
];

// Physical Healthiness checklist (DESIGN-HANDOFF.md §2.11), nothing sent to
// the backend. Verified verbatim against §2.11; the only correction needed
// was the status-led item's quote characters (curly -> straight).
export const PHYSICAL_HEALTH_CHECKLIST_ITEMS = [
  { key: "mounting-structure", label: "Mounting & structure secure" },
  { key: "correct-model", label: "Correct charger model" },
  { key: "clearances-access", label: "Clearances & access" },
  { key: "labels-visible", label: "Labels visible" },
  { key: "conduits-sealed", label: "Conduits & entries sealed" },
  { key: "grounding-bonding", label: "Grounding & bonding" },
  { key: "breaker-size", label: "Correct breaker size" },
  { key: "terminations-torqued", label: "Terminations torqued" },
  { key: "voltage-input", label: "Voltage at input correct" },
  { key: "no-damage", label: "No obvious damage" },
  { key: "amp-limit-dial", label: "Amp Limit Dial" },
  { key: "sim-installed", label: "SIM installed" },
  { key: "powers-on", label: "Charger powers on" },
  { key: "status-led", label: 'Status LED "normal"' },
  { key: "lcd-on", label: "LCD turns on" },
  { key: "no-lcd-fault", label: "No fault on LCD" },
  { key: "local-ui", label: "Local UI accessible" },
  { key: "estop-not-latched", label: "Emergency stop not latched" },
  { key: "estop-functional", label: "Emergency stop functional" },
  { key: "holster-fit", label: "Connector holster fit" },
  { key: "connector-condition", label: "Connector condition" },
  { key: "cable-routing", label: "Cable routing & strain relief" },
  { key: "pedestal-base", label: "Pedestal/install base" },
  { key: "weather-protection", label: "Weather protection" },
  { key: "antenna-installed", label: "Antenna installed" },
  { key: "ethernet-ready", label: "Ethernet port ready" },
  { key: "breaker-operation", label: "External breaker operation" },
  { key: "panel-covers", label: "Panel & covers closed" },
  { key: "photos-captured", label: "Photos captured" },
  { key: "documentation-noted", label: "Documentation noted" },
];

// The 4 real OCPP commands the backend runs during the final OCPP check
// (CLAUDE.md §6, mobile source of truth), replacing an earlier placeholder
// list of boot/heartbeat/auth/status/transaction steps that never matched
// what the backend actually sends.
export const DEFAULT_OCPP_STEPS: OcppStep[] = [
  { key: "getConfiguration", label: "Get Configuration", status: "waiting" },
  { key: "changeConfiguration", label: "Change Configuration", status: "waiting" },
  { key: "reset", label: "Reset (Hard)", status: "waiting" },
  { key: "changeAvailability", label: "Change Availability", status: "waiting" },
];
