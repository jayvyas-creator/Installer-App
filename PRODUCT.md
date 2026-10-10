# Product

## Register

product

## Users

Field technicians and electricians commissioning EV chargers on-site. They use a phone outdoors, often one-handed, sometimes with gloves, in variable light, mid-install with real electrical equipment in front of them. The job is procedural and must not get in the way of it: enter a charger ID, confirm site/electrical details, run checks, commission. Errors and retries are routine (bad signal, failed hardware checks), not exceptional.

## Product Purpose

DynaChrg Installer is a standalone, frontend-only (mock-data, no backend) guided installation wizard: a fixed 16-screen flow from charger lookup through installer info, site/electrical/connector configuration, communication and physical-health checklists, automated OCPP testing, to final commissioning. Success looks like a technician completing the full flow without confusion or wasted taps, with every failure state (network, hardware, protocol) recoverable without restarting the flow.

## Brand Personality

Precise, trustworthy, efficient. A professional field tool, not a consumer app: confidence and competence over delight-for-its-own-sake. Premium craft (Stripe / Linear / Revolut / Apple-level visual and interaction polish) applied to a utility task, not a redesign of the task.

## Anti-references

Generic AI-generated SaaS template look: default purple/blue gradients, cookie-cutter card grids, symmetric centered single-column forms with no personality, gratuitous/decorative motion that distracts from the job, dark mode of any kind (explicitly excluded — this product is light-mode only, always).

## Design Principles

- Light mode only, no exceptions — outdoor/on-site legibility over theme flexibility.
- One fixed step order, always visible (progress stepper) — the technician always knows where they are and how much is left.
- Every failure state is a recoverable dead end, never a reset: retry and secondary actions, not "start over."
- Motion marks real state change (step transitions, success, failure) — never decorative, capped around the system's 1000ms ceiling for big transitions, snappier for micro-interactions.
- Compose only from the project's existing tokens and production components — no new one-off visual language per screen.

## Accessibility & Inclusion

Minimum WCAG 2.1 AA. Touch targets at least 44×44px (gloved/outdoor use). No reliance on color alone to convey status (checklist/step states need icon or text, not just color). Light mode only is itself an accessibility/legibility decision for outdoor glare, not a stylistic default.
