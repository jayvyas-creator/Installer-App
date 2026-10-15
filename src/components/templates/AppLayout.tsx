import { AppShell, type AppShellProps } from "@/components/organisms/AppShell";

export type AppLayoutProps = AppShellProps;

// The "template" tier DESIGN-HANDOFF.md's component inventory calls for:
// pages compose this, not AppShell directly, so the organism stays free to
// gain template-agnostic chrome (header/offline banner/toaster) without
// every page import changing.
export function AppLayout(props: AppLayoutProps) {
  return <AppShell {...props} />;
}
