import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { ChevronLeft, Headphones, Plus, Trash2, X } from "lucide-react";
import { Button } from "../../../../src/components/atoms/Button";
import { IconButton } from "../../../../src/components/atoms/IconButton";
import { BoardIntro } from "./BoardIntro";
import { BoardVariants } from "./BoardVariants";
import { BoardIconButtonTones } from "./BoardIconButtonTones";
import { BoardPolymorphism } from "./BoardPolymorphism";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function ButtonsAndIconActionsCanvas() {
  return (
    <Canvas name="Buttons and Icon Actions" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 900, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Variants"
        name="Variants"
        component={BoardVariants}
        layout={{ x: 950, y: 0, width: 1100, height: 1300, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="IconButtonTones"
        name="IconButton Tones"
        component={BoardIconButtonTones}
        layout={{ x: 2100, y: 0, width: 900, height: 800, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Polymorphism"
        name="asChild Polymorphism"
        component={BoardPolymorphism}
        layout={{ x: 0, y: 1350, width: 900, height: 700, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 0, y: 2100, width: 1600, height: 2200, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(Button, {
  libraries: ["Design System"],
  usageInstructions:
    "The only action trigger in the install flow — form submits, step continue/cancel, destructive confirms. Not for navigation that should be a real link (use asChild with an <a>/router Link instead).",
  variants: {
    Primary: { props: { children: "Continue" } },
    "Secondary md": {
      props: { variant: "secondary", size: "md", children: "Discard" },
    },
    Ghost: { props: { variant: "ghost", children: "Discard changes" } },
    "Danger with icon": {
      props: {
        variant: "danger",
        leadingIcon: <Trash2 size={18} />,
        children: "Remove connector",
      },
    },
    Loading: { props: { loading: true, children: "Confirming…" } },
    "Full width lg": {
      props: { fullWidth: true, size: "lg", leadingIcon: <Plus size={18} />, children: "New file" },
    },
  },
});

defineAsset(IconButton, {
  libraries: ["Design System"],
  usageInstructions:
    "Icon-only actions that need a required aria-label — header back/help buttons, a field's trailing action, a dialog's close button. Pick tone by the surface it sits on: subtle for app chrome, onBrand for a filled brand-colored surface, default for a plain card.",
  variants: {
    Subtle: {
      props: { "aria-label": "Go back", tone: "subtle", children: <ChevronLeft size={22} /> },
    },
    OnBrand: {
      props: { "aria-label": "Close scanner", tone: "onBrand", children: <X size={20} /> },
    },
    Default: {
      props: { "aria-label": "Help and support", children: <Headphones size={20} /> },
    },
  },
});
