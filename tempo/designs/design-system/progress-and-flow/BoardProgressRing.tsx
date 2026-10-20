import { ProgressRing } from "@/components/atoms/ProgressRing";
import { Demo, PageFrame, PageTitle, Row } from "./Chrome";

export function BoardProgressRing() {
  return (
    <PageFrame>
      <PageTitle
        title="ProgressRing"
        description={
          <>
            Two fundamentally different render modes depending on whether{" "}
            <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
              progress
            </code>{" "}
            is set. Omit it for an indeterminate, unknown-duration spinner (
            <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
              role=&quot;status&quot;
            </code>
            ); pass a 0-100 number for a determinate ring (
            <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
              role=&quot;progressbar&quot;
            </code>
            , with <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">aria-valuenow</code>).
            Values outside 0-100 are clamped.
          </>
        }
      />

      <Row
        name="Indeterminate"
        description="Unknown-duration waits. SplashPage uses size 28 for an inline chrome spinner; OutcomePanel's pending tone uses size 44 for a standalone outcome icon."
      >
        <Demo label="size 28 (Splash)">
          <ProgressRing size={28} strokeWidth={3} tone="brand" />
        </Demo>
        <Demo label="size 44 (Outcome)">
          <ProgressRing size={44} strokeWidth={4} />
        </Demo>
        <Demo label="size 64 (default)">
          <ProgressRing />
        </Demo>
      </Row>

      <Row
        name="Determinate progress"
        description="A known 0-100 value. The indicator stroke animates its dash-offset on change (--duration-moderate)."
      >
        <Demo label="0%">
          <ProgressRing progress={0} />
        </Demo>
        <Demo label="25%">
          <ProgressRing progress={25} />
        </Demo>
        <Demo label="65%">
          <ProgressRing progress={65} />
        </Demo>
        <Demo label="100%">
          <ProgressRing progress={100} />
        </Demo>
      </Row>

      <Row
        name="Tones"
        description="brand (default) for ordinary in-progress waits, success for a completed/passing check, error for a failed one — all three take the same progress value."
      >
        <Demo label="brand">
          <ProgressRing progress={70} tone="brand" />
        </Demo>
        <Demo label="success">
          <ProgressRing progress={100} tone="success" />
        </Demo>
        <Demo label="error">
          <ProgressRing progress={40} tone="error" />
        </Demo>
      </Row>
    </PageFrame>
  );
}
