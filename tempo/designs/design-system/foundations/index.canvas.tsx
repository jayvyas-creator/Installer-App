import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { BoardIntro } from "./BoardIntro";
import { BoardColors } from "./BoardColors";
import { BoardTypography } from "./BoardTypography";
import { BoardSpacingRadiusElevation } from "./BoardSpacingRadiusElevation";
import { BoardMotion } from "./BoardMotion";

export default function FoundationsCanvas() {
  return (
    <Canvas name="Foundations" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 900, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Colors"
        name="Color"
        component={BoardColors}
        layout={{ x: 950, y: 0, width: 1400, height: 2700, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Typography"
        name="Typography"
        component={BoardTypography}
        layout={{ x: 0, y: 2750, width: 1000, height: 1500, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="SpacingRadiusElevation"
        name={"Spacing, Radius & Elevation"}
        component={BoardSpacingRadiusElevation}
        layout={{ x: 0, y: 4300, width: 1200, height: 1900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Motion"
        name="Motion"
        component={BoardMotion}
        layout={{ x: 0, y: 6250, width: 1000, height: 1100, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(FoundationsCanvas, {
  libraries: ["Design System"],
  usageInstructions:
    "The design token reference for this app — every color, type, spacing, radius, elevation, and motion value is defined once in src/styles/tokens.css and rendered here from the real var(--token) (not re-typed duplicates). Componentless: this is the source of truth every other design-system canvas's components draw their CSS custom properties from. Check here before inventing a new raw hex, px, or ms value anywhere in the app.",
});
