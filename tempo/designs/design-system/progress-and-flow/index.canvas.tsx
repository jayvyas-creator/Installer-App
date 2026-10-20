import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { BoardIntro as BoardIntro2 } from "./BoardIntro";
import { BoardProgressRing as BoardProgressRing2 } from "./BoardProgressRing";
import { BoardStepper as BoardStepper2 } from "./BoardStepper";
import { BoardChecklistAndCollapsible as BoardChecklistAndCollapsible2 } from "./BoardChecklistAndCollapsible";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { CollapsiblePanel } from "@/components/molecules/CollapsiblePanel";
import { Stepper } from "@/components/molecules/Stepper";
import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { FLOW_STEPS } from "@/constants/flowSteps";

export default function ProgressAndFlowCanvas() {
  return (
    <Canvas name="Progress and Flow" backgroundColor="#232323">
      <Storyboard
        id="BoardIntro"
        name="Intro"
        component={BoardIntro2}
        layout={{ x: 0, y: 0, width: 900, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardProgressRing"
        name="Progress Ring"
        component={BoardProgressRing2}
        layout={{ x: 950, y: 0, width: 1000, height: 760, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardStepper"
        name="Stepper"
        component={BoardStepper2}
        layout={{ x: 2000, y: 0, width: 1000, height: 760, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardChecklistAndCollapsible"
        name={"Checklist & Collapsible"}
        component={BoardChecklistAndCollapsible2}
        layout={{ x: 0, y: 1050, width: 1100, height: 1500, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(ProgressRing, {
  libraries: ["Design System"],
  usageInstructions:
    "Loading/progress indicator with two render modes: omit `progress` for an indeterminate spinner (unknown-duration waits — SplashPage), pass a 0-100 `progress` for a determinate ring (OutcomePanel's `pending` tone). tone recolors the indicator stroke (brand default, success, error).",
  variants: {
    "Indeterminate (Splash)": { props: { size: 28, strokeWidth: 3, tone: "brand" } },
    "Determinate 65%": { props: { progress: 65, tone: "brand" } },
    "Success 100%": { props: { progress: 100, tone: "success" } },
    "Error 40%": { props: { progress: 40, tone: "error" } },
  },
});

defineAsset(Stepper, {
  libraries: ["Design System"],
  usageInstructions:
    "The install flow's main wizard indicator. Rendered once per screen via AppShell's `stepper` prop — never render it standalone on a page. `steps` is the real FLOW_STEPS sequence from src/constants/flowSteps.ts; `currentIndex` drives the done/current/upcoming segment states.",
  variants: {
    "Step 1 of 9": { props: { steps: FLOW_STEPS, currentIndex: 0 } },
    "Step 5 of 9": { props: { steps: FLOW_STEPS, currentIndex: 4 } },
    "Step 9 of 9": { props: { steps: FLOW_STEPS, currentIndex: 8 } },
  },
});

defineAsset(ChecklistItem, {
  libraries: ["Design System"],
  usageInstructions:
    "A labeled, tappable checklist row wrapping the Checkbox atom — used by Communication Checklist (3 items, one with a description) and Physical Healthiness (30 label-only items). checked/onToggle are controlled; disabled exists but is unused by either production page today.",
  variants: {
    "Checked, with description": {
      props: {
        label: "Rated current configuration is matching with wiring and circuit breaker and is properly configured on the charger",
        description: "If charger has dial knob to adjust the current, it has to be properly configured by electrician.",
        checked: true,
        onToggle: () => {},
      },
    },
    Unchecked: {
      props: {
        label: "Wifi and OCPP URL configuration updated as per instruction manual",
        checked: false,
        onToggle: () => {},
      },
    },
    Disabled: {
      props: {
        label: "Mounting & structure secure",
        checked: true,
        disabled: true,
        onToggle: () => {},
      },
    },
  },
});

defineAsset(CollapsiblePanel, {
  libraries: ["Design System"],
  usageInstructions:
    "Simple accordion-style disclosure, chevron rotates on open — used per-connector on Connector Information Details and per-FAQ-question on Help. trigger is the always-visible label; children only mount while open.",
  variants: {
    "Open (Connector 1)": {
      props: { trigger: "Connector 1", defaultOpen: true, children: "Type 2 · AC · Three Phase · 32A · 400V" },
    },
    "Closed, needs attention (Connector 2)": {
      props: {
        trigger: "Connector 2 — needs attention",
        defaultOpen: false,
        children: "Incomplete — expand to finish this connector's details.",
      },
    },
    "FAQ entry": {
      props: {
        trigger: "Where do I find the charger's token ID?",
        defaultOpen: false,
        children:
          "The token ID is printed on a label inside the charger's front access panel, directly beneath the serial number sticker.",
      },
    },
  },
});
