import { Stepper } from "@/components/molecules/Stepper";
import { FLOW_STEPS } from "@/constants/flowSteps";
import { PageFrame, PageTitle, Row } from "./Chrome";

/** Stepper is a full-width block, so its demos stack a caption above the
 * component rather than sitting beside it like the shared <Demo> pattern. */
function StepperDemo({ label, currentIndex }: { label: string; currentIndex: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-label text-text-tertiary">{label}</div>
      <div className="rounded-md border border-neutral-200 bg-white">
        <Stepper steps={FLOW_STEPS} currentIndex={currentIndex} />
      </div>
    </div>
  );
}

export function BoardStepper() {
  return (
    <PageFrame>
      <PageTitle
        title="Stepper"
        description={
          <>
            The install flow's main wizard indicator — rendered once, inside{" "}
            <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
              AppShell
            </code>
            's header via its <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">stepper</code> prop,
            across the real <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
              FLOW_STEPS
            </code> sequence (<code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">src/constants/flowSteps.ts</code>) —
            10 pages pass it. A segmented track shows done / current / upcoming
            per step, alongside the current step name and an &quot;NN/NN&quot;
            counter, i18n'd via <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
              t(&quot;stepper.ariaLabel&quot;, …)
            </code>.
          </>
        }
      />

      <Row
        name="The real sequence"
        description={
          <>
            All 9 steps, in the order the flow actually visits them:
            Installer Information → Enter Token ID → Validate Charger Details
            → Site Information → Charger Electrical Information → Connector
            Information Details → Communication Checklist → Physical
            Healthiness → Automated OCPP Testing.
          </>
        }
      >
        <Stepper steps={FLOW_STEPS} currentIndex={0} />
      </Row>

      <Row
        name="Done / current / upcoming"
        description="Each segment's data-state drives its fill: done is fully filled, current is filled and taller with a subtle pulse, upcoming stays empty. Real currentIndex values from real call sites below."
      >
        <div className="flex flex-col gap-5">
          <StepperDemo label="InstallerInformationPage — currentIndex 0" currentIndex={0} />
          <StepperDemo label="ValidateChargerDetailsPage — currentIndex 2" currentIndex={2} />
          <StepperDemo label="ChargerElectricalInformationPage — currentIndex 4" currentIndex={4} />
          <StepperDemo label="ConnectorInformationDetailsPage — currentIndex 5" currentIndex={5} />
          <StepperDemo label="AutomatedOcppTestingPage — last step, currentIndex 8" currentIndex={8} />
        </div>
      </Row>
    </PageFrame>
  );
}
