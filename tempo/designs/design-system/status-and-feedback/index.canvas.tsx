import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { Radio } from "lucide-react";
import { StatusPill } from "../../../../src/components/atoms/StatusPill";
import { SuccessCheck } from "../../../../src/components/atoms/SuccessCheck";
import { Tooltip } from "../../../../src/components/atoms/Tooltip";
import { ErrorBanner } from "../../../../src/components/molecules/ErrorBanner";
import { OutcomePanel } from "../../../../src/components/molecules/OutcomePanel";
import { PulsingBadge } from "../../../../src/components/atoms/PulsingBadge";
import { BoardIntro } from "./BoardIntro";
import { BoardStatusPillTones } from "./BoardStatusPillTones";
import { BoardBannersOutcomes } from "./BoardBannersOutcomes";
import { BoardPulsingBadge } from "./BoardPulsingBadge";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function StatusAndFeedbackCanvas() {
  return (
    <Canvas name="Status and Feedback" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 900, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="StatusPillTones"
        name="StatusPill Tones"
        component={BoardStatusPillTones}
        layout={{ x: 950, y: 0, width: 1000, height: 850, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BannersOutcomes"
        name={"Banners & Outcomes"}
        component={BoardBannersOutcomes}
        layout={{ x: 0, y: 950, width: 1300, height: 1900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="PulsingBadge"
        name="PulsingBadge"
        component={BoardPulsingBadge}
        layout={{ x: 2000, y: 0, width: 900, height: 650, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 0, y: 2900, width: 1700, height: 1800, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(StatusPill, {
  libraries: ["Design System"],
  usageInstructions:
    "A tagged state label — step status, connection state, any short state word that needs a consistent tone. Visible text is required (tone color alone is never the only signal, WCAG 1.4.1). The one real caller is AutomatedOcppTestingPage's per-step status column.",
  variants: {
    Passed: { props: { tone: "success", children: "Passed" } },
    Failed: { props: { tone: "error", children: "Failed" } },
    Running: { props: { tone: "brand", children: "Running" } },
    Pending: { props: { tone: "neutral", children: "Pending" } },
    "Needs attention (warning)": { props: { tone: "warning", children: "Needs attention" } },
    "Info, no dot": { props: { tone: "info", children: "Info", showDot: false } },
  },
});

defineAsset(SuccessCheck, {
  libraries: ["Design System"],
  usageInstructions:
    "Animated checkmark-in-circle for a confirmed, successful outcome. Its only production use is inside OutcomePanel's success icon at size={48} — reach for OutcomePanel directly for a full-screen success state rather than composing this by hand.",
  variants: {
    Default: { props: { size: 56 } },
    "OutcomePanel size": { props: { size: 48 } },
  },
});

defineAsset(Tooltip, {
  libraries: ["Design System"],
  usageInstructions:
    "An info-icon trigger that reveals a short text bubble on hover/focus/click — for a field hint that's too long to fit as helper text. Known gap: the 16px trigger's hit area is well under the 44x44 touch-target minimum (see the Design System Debt storyboard); don't scale this up to compensate without the documented fix.",
  variants: {
    Default: {
      props: { text: "The current draw per phase, in amps, that this charger pulls under full load." },
    },
  },
});

defineAsset(ErrorBanner, {
  libraries: ["Design System"],
  usageInstructions:
    "An inline, non-blocking banner for a form- or page-level problem — missing session data, a failed submit, an already-installed warning. error for a blocking problem, warning for something to notice but proceed past. Used by AppShell for the offline banner (tone=\"warning\") plus 13 other call sites across pages.",
  variants: {
    "Error — incomplete details": {
      props: {
        tone: "error",
        title: "Charger electrical details incomplete",
        description: "The charger electrical details are incomplete. Please go back and check them.",
      },
    },
    "Warning — offline (AppShell)": {
      props: {
        tone: "warning",
        title: "You're offline",
        description:
          "Check your connection — you can keep working, and we'll pick back up once you're back online.",
      },
    },
  },
});

defineAsset(OutcomePanel, {
  libraries: ["Design System"],
  usageInstructions:
    "The full-screen resolution at the end of an install-flow step — success, error, warning, or pending. Composes Button, SuccessCheck, and ProgressRing (ProgressRing is declared on the sibling Progress & Flow canvas). primaryAction/secondaryAction take a real onClick; pending has no confirmed production caller yet (see Design System Debt).",
  variants: {
    "Success — InstallationSuccessPage": {
      props: {
        tone: "success",
        title: "Charger successfully installed",
        description:
          "Congratulations on successfully completing all the setup steps! You can now proceed to the Communication Checklist to ensure everything is connected and ready for use.",
        primaryAction: { label: "Continue", onClick: () => {} },
      },
    },
    "Error — NoEvChargerFoundPage": {
      props: {
        tone: "error",
        title: "No EV Charger Found",
        description:
          "We couldn't find this charger. Check the Charger ID and Token ID, or scan a different QR code.",
        primaryAction: { label: "Try again", onClick: () => {} },
        secondaryAction: { label: "Back to Home", onClick: () => {} },
      },
    },
    "Warning — NotFoundPage": {
      props: {
        tone: "warning",
        title: "Page not found",
        description:
          "That address doesn't match a step in the install flow. Head back to the start and pick up from there.",
        primaryAction: { label: "Go to Home", onClick: () => {} },
      },
    },
  },
});

defineAsset(PulsingBadge, {
  libraries: ["Design System"],
  usageInstructions:
    "A pulsing-ring wrapper around a brand mark or icon for an in-progress wait with no determinate percentage — the two Processing/OCPP-hardware-check screens. Respects prefers-reduced-motion. children is any renderable node (a Wordmark, a lucide icon); aria-label is required so screen readers get a name for the animation.",
  variants: {
    "Checking hardware": {
      props: { "aria-label": "Checking hardware", children: <Radio size={28} /> },
    },
  },
});
