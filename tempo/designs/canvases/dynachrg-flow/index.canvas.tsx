import { Canvas, Storyboard, RouteStoryboard } from "tempo-sdk/canvas";
import { SplashSeeded } from "./FlowHarness";
import { ProcessingLookup as ProcessingLookup2 } from "./FlowHarness";
import { ValidateChargerDetailsSeeded } from "./FlowHarness";
import { ValidateChargerDetailsMultiSeeded } from "./FlowHarness";
import { InstallerInfoSeeded } from "./FlowHarness";
import { EnterTokenSeeded } from "./FlowHarness";
import { SelectSiteSeeded } from "./FlowHarness";
import { ProcessingValidate as ProcessingValidate2 } from "./FlowHarness";
import { ProcessingInstallFail } from "./FlowHarness";
import { SiteInformationSeeded } from "./FlowHarness";
import { ChargerElectricalSeeded } from "./FlowHarness";
import { ConnectorInfoEmptySeeded } from "./FlowHarness";
import { ProcessingFinalize as ProcessingFinalize2 } from "./FlowHarness";
import { InstallationSuccessSeeded } from "./FlowHarness";
import { CommChecklistSeeded } from "./FlowHarness";
import { ProcessingCommVerify as ProcessingCommVerify2 } from "./FlowHarness";
import { ProcessingNoHeartbeat } from "./FlowHarness";
import { PhysicalHealthinessSeeded } from "./FlowHarness";
import { OcppTestingSeeded } from "./FlowHarness";
import { ReadyToBeCommissionedSeeded } from "./FlowHarness";
import { ReadyToChargeSeeded } from "./FlowHarness";
import { NoChargerFoundSeeded } from "./FlowHarness";
import { HomeWithDraftSeeded } from "./FlowHarness";
import { HomeOfflineSeeded } from "./FlowHarness";
import { HomeBackOnlineSeeded } from "./FlowHarness";
import { CommChecklistCheckedSeeded } from "./FlowHarness";
import { ProcessingCommFail as ProcessingCommFail2 } from "./FlowHarness";
import { ConnectorInfoAddedSeeded } from "./FlowHarness";
import { SiteInformationNoArea as SiteInformationNoArea2 } from "./FlowHarness";
import { SiteAreaFormSeeded } from "./FlowHarness";
import { SiteAreaFilledSeeded } from "./FlowHarness";
import { SiteAreaErrorSeeded } from "./FlowHarness";
import { OcppTestingFailSeeded } from "./FlowHarness";
import { IntroLegend as IntroLegend2 } from "./Narration";
import { CalloutActiveBranch as CalloutActiveBranch2 } from "./Narration";
import { CalloutNoChargerFound as CalloutNoChargerFound2 } from "./Narration";
import { CalloutResumeDraft } from "./Narration";
import { CalloutOffline } from "./Narration";
import { CalloutMultiSite } from "./Narration";
import { CalloutInstallFail } from "./Narration";
import { CalloutNoHeartbeat } from "./Narration";
import { CalloutCreateSiteArea } from "./Narration";
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
      <Storyboard
        id="Splash"
        name="00 · Splash"
        component={SplashSeeded}
        layout={{ x: -650, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
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
        id="ValidateChargerDetails"
        name="03 · Validate charger details"
        component={ValidateChargerDetailsSeeded}
        layout={{ x: 752, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="InstallerInfo"
        name="04 · Installer information"
        component={InstallerInfoSeeded}
        layout={{ x: 1292, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="EnterToken"
        name="05 · Enter token ID"
        component={EnterTokenSeeded}
        layout={{ x: 1840, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingValidate"
        name="06 · Processing — Validating details"
        component={ProcessingValidate2}
        layout={{ x: 2380, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="SiteInformation"
        name="07 · Site information"
        component={SiteInformationSeeded}
        layout={{ x: 2790, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ChargerElectrical"
        name="08 · Charger electrical info"
        component={ChargerElectricalSeeded}
        layout={{ x: 3280, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ConnectorInfoEmpty"
        name="09 · Connector information (empty)"
        component={ConnectorInfoEmptySeeded}
        layout={{ x: 3760, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingFinalize"
        name="10 · Processing — Finalizing install"
        component={ProcessingFinalize2}
        layout={{ x: 4220, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="InstallationSuccess"
        name="11 · Installation success"
        component={InstallationSuccessSeeded}
        layout={{ x: 4582, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="CommChecklist"
        name="12 · Communication checklist"
        component={CommChecklistSeeded}
        layout={{ x: 5120, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingCommVerify"
        name="13 · Processing — Verifying comms"
        component={ProcessingCommVerify2}
        layout={{ x: 5658, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="PhysicalHealthiness"
        name="14 · Physical healthiness checklist"
        component={PhysicalHealthinessSeeded}
        layout={{ x: 6030, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="OcppTesting"
        name="15 · Automated OCPP testing"
        component={OcppTestingSeeded}
        layout={{ x: 6596, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ReadyToBeCommissioned"
        name="16 · Ready to be commissioned"
        component={ReadyToBeCommissionedSeeded}
        layout={{ x: 7190, y: 0, width: 390, height: 844, intrinsicSizing: "root-element" }}
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

      {/* Home column continues: resumable draft → offline → back online */}
      <Storyboard
        id="CalloutResumeDraft"
        name="Note"
        component={CalloutResumeDraft}
        layout={{ x: 0, y: 2742, width: 390, height: 110, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="HomeWithDraft"
        name="Branch · Home with a resumable draft"
        component={HomeWithDraftSeeded}
        layout={{ x: 0, y: 2872, width: 390, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="CalloutOffline"
        name="Note"
        component={CalloutOffline}
        layout={{ x: 0, y: 3802, width: 390, height: 130, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="HomeOffline"
        name="Branch · Offline"
        component={HomeOfflineSeeded}
        layout={{ x: 0, y: 3962, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="HomeBackOnline"
        name="Branch · Back online"
        component={HomeBackOnlineSeeded}
        layout={{ x: 420, y: 3962, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      {/* Alt · Validate charger details with multiple connectors detected */}
      <Storyboard
        id="ValidateChargerDetailsMulti"
        name="Alt · Multiple connectors detected"
        component={ValidateChargerDetailsMultiSeeded}
        layout={{ x: 752, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      {/* Branch under Enter token ID: a token covering more than one site */}
      <Storyboard
        id="CalloutMultiSite"
        name="Note"
        component={CalloutMultiSite}
        layout={{ x: 1840, y: 804, width: 390, height: 110, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="SelectSite"
        name="Branch · Select site (multi-site token)"
        component={SelectSiteSeeded}
        layout={{ x: 1840, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      {/* Branch under Processing — Validating details: the token doesn't match */}
      <Storyboard
        id="CalloutInstallFail"
        name="Note"
        component={CalloutInstallFail}
        layout={{ x: 2380, y: 804, width: 390, height: 110, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingInstallFail"
        name="Alt · Validation failed"
        component={ProcessingInstallFail}
        layout={{ x: 2380, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="SiteInformationNoArea"
        name="Alt · No site areas configured"
        component={SiteInformationNoArea2}
        layout={{ x: 2840, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      {/* Create New Site Area sub-flow, stacked beneath the empty state that reaches it */}
      <Storyboard
        id="CalloutCreateSiteArea"
        name="Note"
        component={CalloutCreateSiteArea}
        layout={{ x: 2840, y: 1808, width: 390, height: 130, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="SiteAreaForm"
        name="Sub-flow · New site area (empty)"
        component={SiteAreaFormSeeded}
        layout={{ x: 2840, y: 1958, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="SiteAreaFilled"
        name="Sub-flow · New site area (filled in)"
        component={SiteAreaFilledSeeded}
        layout={{ x: 2840, y: 2832, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="SiteAreaError"
        name="Sub-flow · New site area (duplicate-name error)"
        component={SiteAreaErrorSeeded}
        layout={{ x: 2840, y: 3706, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="ConnectorInfoAdded"
        name="Alt · Connector added"
        component={ConnectorInfoAddedSeeded}
        layout={{ x: 3760, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="CommChecklistChecked"
        name="Alt · Checklist complete"
        component={CommChecklistCheckedSeeded}
        layout={{ x: 5029, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      {/* Branch under Communication checklist: charger stops responding entirely */}
      <Storyboard
        id="CalloutNoHeartbeat"
        name="Note"
        component={CalloutNoHeartbeat}
        layout={{ x: 5120, y: 1808, width: 390, height: 130, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingNoHeartbeat"
        name="Alt · No heartbeat received"
        component={ProcessingNoHeartbeat}
        layout={{ x: 5120, y: 1938, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="CalloutCommFail"
        name="Note"
        component={CalloutCommFail2}
        layout={{ x: 5600, y: 804, width: 390, height: 110, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProcessingCommFail"
        name="Alt · Communication check failed"
        component={ProcessingCommFail2}
        layout={{ x: 5600, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      <Storyboard
        id="CalloutOcppFail"
        name="Note"
        component={CalloutOcppFail2}
        layout={{ x: 6520, y: 804, width: 390, height: 110, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="OcppTestingFail"
        name="Alt · OCPP test failed"
        component={OcppTestingFailSeeded}
        layout={{ x: 6442, y: 934, width: 390, height: 844, intrinsicSizing: "root-element" }}
      />

      {/* Utility — reachable via the help icon from most mid-flow screens */}
      <RouteStoryboard
        id="Help"
        name="Utility · Help & support"
        route="/help"
        layout={{ x: 6980, y: 934, width: 390, height: 844 }}
      />
    </Canvas>
  );
}
