import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { Heading } from "@/components/atoms/Heading";
import { Wordmark } from "@/components/atoms/Wordmark";
import { BoardIntro } from "./BoardIntro";
import { BoardHeadingLevels } from "./BoardHeadingLevels";
import { BoardWordmarkSizes } from "./BoardWordmarkSizes";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function TypographyAndBrandCanvas() {
  return (
    <Canvas name="Typography and Brand" backgroundColor="#232323">
      <Storyboard
        id="BoardIntro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 900, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardHeadingLevels"
        name="Heading Levels"
        component={BoardHeadingLevels}
        layout={{ x: 950, y: 0, width: 1000, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardWordmarkSizes"
        name="Wordmark Sizes"
        component={BoardWordmarkSizes}
        layout={{ x: 2000, y: 0, width: 900, height: 700, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="BoardDesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 0, y: 950, width: 1700, height: 2600, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(Heading, {
  libraries: ["Design System"],
  usageInstructions:
    "page/section titles — level 1 for the main page heading, level 2 for a nested sub-section, level 3 for a smaller in-page heading. Renders h1/h2/h3 in the Lato heading font; never hand-roll a raw <h1>/<h2>/<h3> for a titled section — see the Design System Debt storyboard for the real call sites that still do.",
  variants: {
    "Level 1 — page title": {
      props: { level: 1, children: "Site information" },
    },
    "Level 2 — sub-section": {
      props: { level: 2, children: "North Lot — Area A" },
    },
    "Level 3": {
      props: { level: 3, children: "Connector details" },
    },
  },
});

defineAsset(Wordmark, {
  libraries: ["Design System"],
  usageInstructions:
    "the DYNACHRG brand logotype — use for brand moments (splash/processing chrome), not as a generic heading. sm/md/lg map to the body/title/display type-scale tokens. Never retype \"DYNA\"/\"CHRG\" as literal text — reach for this component.",
  variants: {
    Small: { props: { size: "sm" } },
    Medium: { props: { size: "md" } },
    "Large — real usage (ProcessingPage)": { props: { size: "lg" } },
  },
});
