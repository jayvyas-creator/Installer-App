import { Canvas, Storyboard, RouteStoryboard } from "tempo-sdk/canvas";
import { ProcessingLookup as ProcessingLookup2 } from "./FlowHarness";
import { InstallerInfoSeeded } from "./FlowHarness";
import { EnterTokenSeeded } from "./FlowHarness";
import { ProcessingValidate as ProcessingValidate2 } from "./FlowHarness";
import { SiteInformationSeeded } from "./FlowHarness";
import { ChargerElectricalSeeded } from "./FlowHarness";
import { ConnectorInfoEmptySeeded } from "./FlowHarness";
import { ProcessingFinalize as ProcessingFinalize2 } from "./FlowHarness";
import { InstallationSuccessSeeded } from "./FlowHarness";
import { CommChecklistSeeded } from "./FlowHarness";
import { ProcessingCommVerify as ProcessingCommVerify2 } from "./FlowHarness";
import { PhysicalHealthinessSeeded } from "./FlowHarness";
import { OcppTestingSeeded } from "./FlowHarness";
import { ReadyToBeCommissionedSeeded } from "./FlowHarness";
import { ReadyToChargeSeeded } from "./FlowHarness";
import { NoChargerFoundSeeded } from "./FlowHarness";
import { CommChecklistCheckedSeeded } from "./FlowHarness";
import { ProcessingCommFail as ProcessingCommFail2 } from "./FlowHarness";
import { ConnectorInfoAddedSeeded } from "./FlowHarness";
import { SiteInformationNoArea as SiteInformationNoArea2 } from "./FlowHarness";
import { OcppTestingFailSeeded } from "./FlowHarness";
import { IntroLegend as IntroLegend2 } from "./Narration";
import { CalloutActiveBranch as CalloutActiveBranch2 } from "./Narration";
import { CalloutNoChargerFound as CalloutNoChargerFound2 } from "./Narration";
import { CalloutCommFail as CalloutCommFail2 } from "./Narration";
import { CalloutOcppFail as CalloutOcppFail2 } from "./Narration";

export default function DynachrgFlowCanvas() {
  return (
    <Canvas name="Dynachrg Flow">
      <Storyboard
        id="IntroLegend"
        name="Legend"
        component={IntroLegend2}
        layout={{ x: 0, y: -460, width: 980, height: 380, intrinsicSizing: "root-element" }}
      />

      {/* Happy path — left to right, the order a field technician walks it */}
      <RouteStoryboard
        id="Home"
        name="01 · Home"
        route="/"
        layout={{ x: 302, y: -60, width: 390, height: 844 }}
      />
      <Storyboard
        id="ProcessingLookup"
        name="02 · Processing — Looking up charger"
        component={ProcessingLookup2}
        layout={{ x: -154, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="InstallerInfo"
        name="03 · Installer information"
        component={InstallerInfoSeeded}
        layout={{ x: 752, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="EnterToken"
        name="04 · Enter token ID"
        component={EnterTokenSeeded}
        layout={{ x: 1300, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingValidate"
        name="05 · Processing — Validating details"
        component={ProcessingValidate2}
        layout={{ x: 1840, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="SiteInformation"
        name="06 · Site information"
        component={SiteInformationSeeded}
        layout={{ x: 2250, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ChargerElectrical"
        name="07 · Charger electrical info"
        component={ChargerElectricalSeeded}
        layout={{ x: 2740, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ConnectorInfoEmpty"
        name="08 · Connector information (empty)"
        component={ConnectorInfoEmptySeeded}
        layout={{ x: 3220, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingFinalize"
        name="09 · Processing — Finalizing install"
        component={ProcessingFinalize2}
        layout={{ x: 3680, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="InstallationSuccess"
        name="10 · Installation success"
        component={InstallationSuccessSeeded}
        layout={{ x: 4042, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="CommChecklist"
        name="11 · Communication checklist"
        component={CommChecklistSeeded}
        layout={{ x: 4580, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingCommVerify"
        name="12 · Processing — Verifying comms"
        component={ProcessingCommVerify2}
        layout={{ x: 5118, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="PhysicalHealthiness"
        name="13 · Physical healthiness checklist"
        component={PhysicalHealthinessSeeded}
        layout={{ x: 5490, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="OcppTesting"
        name="14 · Automated OCPP testing"
        component={OcppTestingSeeded}
        layout={{ x: 6056, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ReadyToBeCommissioned"
        name="15 · Ready to be commissioned"
        component={ReadyToBeCommissionedSeeded}
        layout={{ x: 6650, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      {/* Branches and alternate states — stacked beneath the screen that produces them */}
      <Storyboard
        id="CalloutActiveBranch"
        name="Note"
        component={CalloutActiveBranch2}
        layout={{ x: 0, y: 804, width: 390, height: 110, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ReadyToCharge"
        name="Branch · Already active → Ready to charge"
        component={ReadyToChargeSeeded}
        layout={{ x: 0, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="CalloutNoChargerFound"
        name="Note"
        component={CalloutNoChargerFound2}
        layout={{ x: 0, y: 1738, width: 390, height: 130, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="NoChargerFound"
        name="Branch · No EV charger found"
        component={NoChargerFoundSeeded}
        layout={{ x: 0, y: 1868, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="SiteInformationNoArea"
        name="Alt · No site areas configured"
        component={SiteInformationNoArea2}
        layout={{ x: 2300, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="ConnectorInfoAdded"
        name="Alt · Connector added"
        component={ConnectorInfoAddedSeeded}
        layout={{ x: 3220, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="CommChecklistChecked"
        name="Alt · Checklist complete"
        component={CommChecklistCheckedSeeded}
        layout={{ x: 4489, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="CalloutCommFail"
        name="Note"
        component={CalloutCommFail2}
        layout={{ x: 5060, y: 804, width: 390, height: 110, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingCommFail"
        name="Alt · Communication check failed"
        component={ProcessingCommFail2}
        layout={{ x: 5060, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="CalloutOcppFail"
        name="Note"
        component={CalloutOcppFail2}
        layout={{ x: 5980, y: 804, width: 390, height: 110, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="OcppTestingFail"
        name="Alt · OCPP test failed"
        component={OcppTestingFailSeeded}
        layout={{ x: 5902, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      {/* Utility — reachable via the help icon from most mid-flow screens */}
      <RouteStoryboard
        id="Help"
        name="Utility · Help & support"
        route="/help"
        layout={{ x: 6440, y: 934, width: 390, height: 844 }}
      />
    </Canvas>
  );
}
