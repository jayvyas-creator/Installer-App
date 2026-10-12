// Canvas-only narration: an intro legend and a few labelled callouts marking
// transitions that aren't obvious from adjacency alone. Token-styled, never
// shipped to the app.

import "@/styles/global.css";
import styles from "./Narration.module.css";

export function IntroLegend() {
  return (
    <div className={styles.legend}>
      <span className={styles.kicker}>
        <span className={styles.dot} />
        DynaChrg Installer — design canvas
      </span>
      <h1 className={styles.title}>00 Splash through 16 Ready to be commissioned</h1>
      <p className={styles.body}>
        Read left to right: the top row is the happy path a field technician walks,
        start to finish. Alternate and failure states branch underneath the screen
        that produces them. Every frame renders the real production page and
        component tree from <code>src/</code> — light mode only, no dark-mode
        variant exists or should be added.
      </p>
      <div className={styles.key}>
        <span className={styles.keyItem}>
          <span className={[styles.swatch, styles.swatchHappy].join(" ")} />
          Happy path
        </span>
        <span className={styles.keyItem}>
          <span className={[styles.swatch, styles.swatchAlt].join(" ")} />
          Alternate / empty state
        </span>
        <span className={styles.keyItem}>
          <span className={[styles.swatch, styles.swatchFail].join(" ")} />
          Failure outcome
        </span>
      </div>
    </div>
  );
}

function Callout({
  tone,
  label,
  body,
}: {
  tone: "brand" | "error" | "neutral";
  label: string;
  body: string;
}) {
  const toneClass =
    tone === "brand" ? styles.toneBrand : tone === "error" ? styles.toneError : styles.toneNeutral;
  return (
    <div className={[styles.callout, toneClass].join(" ")}>
      <span className={styles.calloutArrow}>↓</span>
      <span className={styles.calloutLabel}>{label}</span>
      <span className={styles.calloutBody}>{body}</span>
    </div>
  );
}

export function CalloutActiveBranch() {
  return (
    <Callout
      tone="brand"
      label="Already-commissioned charger → fast path"
      body='Home resolves an "ACTIVE" charger ID straight to Ready to charge, skipping the entire install wizard.'
    />
  );
}

export function CalloutNoChargerFound() {
  return (
    <Callout
      tone="neutral"
      label="NOTFOUND charger ID → reachable now"
      body='Home&apos;s mock lookup resolves any ID containing "NOTFOUND" (case-insensitive) straight to this screen, skipping the install wizard entirely.'
    />
  );
}

export function CalloutResumeDraft() {
  return (
    <Callout
      tone="brand"
      label="In-progress install → resumable"
      body="Home shows this banner whenever a charger ID and installer name are already saved but the install hasn't finished — Resume jumps back to wherever the draft left off, Discard clears it."
    />
  );
}

export function CalloutOffline() {
  return (
    <Callout
      tone="neutral"
      label="Offline → back online, any screen"
      body="AppShell listens for the browser's online/offline events globally, so this banner can appear over any screen in the flow — it isn't a dedicated route."
    />
  );
}

export function CalloutMultiSite() {
  return (
    <Callout
      tone="brand"
      label="Token covers > 1 site → pick one first"
      body='A token containing "MULTI" routes here before Site information, so the installer picks a site before picking a site area within it.'
    />
  );
}

export function CalloutInstallFail() {
  return (
    <Callout
      tone="error"
      label="INSTALLFAIL → token doesn't match the charger"
      body="Reuses the shared Processing-failure pattern: retry validation, or back out to re-enter the token."
    />
  );
}

export function CalloutNoHeartbeat() {
  return (
    <Callout
      tone="error"
      label="NOHEARTBEAT → distinct from a generic comm failure"
      body="The charger connected once but stopped responding — a hardware/power-cycle issue, not a network-check failure like COMMFAIL. Worded and routed differently so the installer knows what to try next."
    />
  );
}

export function CalloutCreateSiteArea() {
  return (
    <Callout
      tone="neutral"
      label='"No site areas configured" → add one inline'
      body="Reachable from Site information's empty state. Duplicate names are rejected inline, matching the app's other inline-validation patterns."
    />
  );
}

export function CalloutCommFail() {
  return (
    <Callout
      tone="error"
      label="COMMFAIL → network check fails"
      body="Same retry/secondary-action pattern as the other failure outcomes (install, step, hardware checks)."
    />
  );
}

export function CalloutOcppFail() {
  return (
    <Callout
      tone="error"
      label="OCPPFAIL → last protocol step fails"
      body="Failure renders inline below the step list, not via the shared Processing screen — a distinct pattern worth noting."
    />
  );
}
