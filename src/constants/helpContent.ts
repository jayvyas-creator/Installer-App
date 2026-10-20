// Help & Support content (DESIGN-HANDOFF.md "Screens reached from routing" > Help).
// Two FAQ groups ("Installation & Connectivity FAQs", "Support & Troubleshooting
// FAQs"), each with expandable questions, plus the "Need Further Assistance?"
// card's contact details.
//
// KNOWN-LIMITATIONS.md #9: Help (and No EV Charger Found) show +1 323-488-2846;
// the No Heartbeat / OCPP failure panels show a different number, (323) 488-2092
// — both copied from mobile, and not interchangeable.
//
// KNOWN-LIMITATIONS.md #11: a Wi-Fi/Ethernet/LTE question is deliberately left
// out of this list, because mobile shows the wrong answer for it. Don't add one
// back without a confirmed correct answer.

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  entries: FaqEntry[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Installation & Connectivity FAQs",
    entries: [
      {
        question: "Where do I find the charger's token ID?",
        answer:
          "The token ID is printed on a label inside the charger's front access panel, directly beneath the serial number sticker.",
      },
      {
        question: "What if the QR code won't scan?",
        answer:
          "You don't need the camera to continue — the Charger ID field on the Home screen is always available, so just type the ID instead of scanning. If the scanner won't open at all, make sure the page is loaded over HTTPS (or localhost) and that camera access is allowed in your browser settings.",
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
    ],
  },
  {
    title: "Support & Troubleshooting FAQs",
    entries: [
      {
        question: "The app says this charger is already commissioned. What now?",
        answer:
          "That charger has already been commissioned and is live elsewhere. You'll be routed to a dedicated screen confirming this — no further setup is needed on this device.",
      },
      {
        question: "Who do I contact for hardware issues the checklist flags?",
        answer:
          "Call DynaChrg support at +1 323-488-2846. Keep the charger ID and serial number on hand for faster triage.",
      },
    ],
  },
];

// "Need Further Assistance?" card (DESIGN-HANDOFF.md: "website, phone and
// address"). Only the phone number is documented anywhere (KNOWN-LIMITATIONS.md
// #9); no real website or mailing address is specified in the handoff docs, so
// only verified contact info is exported here rather than inventing one.
export const SUPPORT_PHONE = "+1 323-488-2846";
export const SUPPORT_WEBSITE = "dynachrg.com";
