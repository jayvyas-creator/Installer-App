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
      <h1 className={styles.title}>The full 16-screen install flow, mock data only</h1>
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
      label="Designed, not yet wired up"
      body="This screen exists for an unrecognized charger ID, but Home's current mock lookup always resolves a DC-prefixed ID — see handoff notes."
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
