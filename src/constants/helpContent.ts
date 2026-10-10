export interface FaqEntry {
  question: string;
  answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    question: "Where do I find the charger's token ID?",
    answer:
      "The token ID is printed on a label inside the charger's front access panel, directly beneath the serial number sticker.",
  },
  {
    question: "What if the QR code won't scan?",
    answer:
      "Enter the charger ID manually using the \"Enter ID instead\" link below the scanner. Double-check for a camera permission prompt if the viewfinder stays black.",
  },
  {
    question: "Can I change the site area after submitting?",
    answer:
      "Not after the electrical configuration step is confirmed. If the wrong area was selected, restart the install and choose again before confirming.",
  },
  {
    question: "What happens if the OCPP test fails?",
    answer:
      "You'll see exactly which step failed with a retry option. Most failures clear on a second attempt once the network connection stabilizes.",
  },
  {
    question: "The app says this charger is already commissioned. What now?",
    answer:
      "That charger is already live. You'll be routed straight to the Ready to Charge screen — no further setup is needed.",
  },
  {
    question: "Who do I contact for hardware issues the checklist flags?",
    answer:
      "Call DynaChrg field support at 1-800-555-0199. Keep the charger ID and serial number on hand for faster triage.",
  },
];

export const SUPPORT_PHONE = "1-800-555-0199";
export const SUPPORT_EMAIL = "fieldsupport@dynachrg.com";
