import { ProgressRing } from "@/components/atoms/ProgressRing";
import { Stepper } from "@/components/molecules/Stepper";
import { ChecklistItem } from "@/components/molecules/ChecklistItem";
import { CollapsiblePanel } from "@/components/molecules/CollapsiblePanel";
import { FLOW_STEPS } from "@/constants/flowSteps";
import { PageFrame } from "./Chrome";

export function BoardIntro() {
  return (
    <PageFrame>
      <div className="flex max-w-[680px] flex-col gap-6">
        <div className="text-label uppercase tracking-widest text-neutral-400">
          Components
        </div>
        <h1 className="text-[34px] font-semibold leading-[40px] tracking-tight">
          Progress & Flow
        </h1>
        <p className="text-body leading-relaxed text-neutral-500">
          Four primitives for a long, linear, multi-step install flow:{" "}
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            Stepper
          </code>{" "}
          is the wizard's own position indicator, rendered once inside{" "}
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            AppShell
          </code>{" "}
          via its <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">stepper</code>{" "}
          prop.{" "}
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            ProgressRing
          </code>{" "}
          renders two fundamentally different things depending on whether{" "}
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            progress
          </code>{" "}
          is set: an indeterminate spinner (<code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">role=&quot;status&quot;</code>)
          when it's omitted, or a determinate ring (<code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">role=&quot;progressbar&quot;</code>)
          when it's a 0-100 number.{" "}
          <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            ChecklistItem
          </code>{" "}
          wraps the Form Fields <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">Checkbox</code> atom
          in a labeled, tappable row, and <code className="mx-1 rounded bg-neutral-100 px-1 py-0.5 text-[12px]">
            CollapsiblePanel
          </code>{" "}
          is a simple accordion disclosure for content that doesn't need to be
          on screen all at once.
        </p>

        <div className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-surface-container-lowest p-6 pt-5">
          <div className="text-micro uppercase tracking-widest text-neutral-400">
            Live sample
          </div>
          <Stepper steps={FLOW_STEPS} currentIndex={4} />
          <div className="flex items-center gap-8 px-1">
            <ProgressRing size={44} strokeWidth={4} progress={65} />
            <ProgressRing size={44} strokeWidth={4} />
            <div className="flex flex-1 flex-col gap-2">
              <ChecklistItem
                label="Rated current configuration is matching with wiring and circuit breaker"
                description="If charger has dial knob to adjust the current, it has to be properly configured by electrician."
                checked
                onToggle={() => {}}
              />
              <ChecklistItem
                label="Wifi and OCPP URL configuration updated as per instruction manual"
                checked={false}
                onToggle={() => {}}
              />
            </div>
          </div>
          <CollapsiblePanel trigger="Connector 2" defaultOpen={false}>
            <span className="text-body text-neutral-500">Collapsed by default — expands on tap.</span>
          </CollapsiblePanel>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-micro uppercase tracking-widest text-neutral-400">
              Stepper
            </div>
            <div className="text-title-2 font-semibold">10</div>
            <div className="pt-1 text-label text-neutral-500">
              pages pass a <code>stepper</code> prop to AppShell, across the real
              9-step <code>FLOW_STEPS</code> sequence
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-micro uppercase tracking-widest text-neutral-400">
              ProgressRing
            </div>
            <div className="text-title-2 font-semibold">2</div>
            <div className="pt-1 text-label text-neutral-500">
              call sites — SplashPage (indeterminate) and OutcomePanel's{" "}
              <code>pending</code> tone
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-micro uppercase tracking-widest text-neutral-400">
              ChecklistItem
            </div>
            <div className="text-title-2 font-semibold">33</div>
            <div className="pt-1 text-label text-neutral-500">
              rows across 2 pages — 3 on Communication Checklist, 30 on
              Physical Healthiness
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-micro uppercase tracking-widest text-neutral-400">
              CollapsiblePanel
            </div>
            <div className="text-title-2 font-semibold">2</div>
            <div className="pt-1 text-label text-neutral-500">
              callers — per-connector rows on Connector Information Details,
              per-question on Help
            </div>
          </div>
          <div className="col-span-2 rounded-xl border border-neutral-200 p-4">
            <div className="pb-2 text-micro uppercase tracking-widest text-neutral-400">
              Design System Debt check
            </div>
            <div className="text-body font-medium text-neutral-700">None found.</div>
            <div className="pt-1 text-label text-neutral-500">
              Searched src/pages for hand-rolled step-dot/progress-bar markup
              and duplicated checklist-row patterns — every progress/stepper
              surface already renders through ProgressRing or Stepper, and
              every checklist row already renders through ChecklistItem. No
              Design System Debt storyboard on this canvas.
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
