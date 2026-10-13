export type Guide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  summary: string;
  published: string;
  faqs: { question: string; answer: string }[];
  related: string[];
};

export const guides: Guide[] = [
  {
    slug: "paste-without-formatting-mac",
    title: "How to Paste Without Formatting on Mac",
    description:
      "Paste plain text on a Mac with Option-Shift-Command-V, the shortcut in Chrome and Slack, or make Command-V always paste without formatting.",
    h1: "How to paste without formatting on Mac",
    summary: "Paste plain text with one shortcut, or make Command-V do it every time.",
    published: "2026-10-13",
    faqs: [
      {
        question: "What is the shortcut to paste without formatting on a Mac?",
        answer:
          "Option-Shift-Command-V, which is Paste and Match Style in Apple apps like Notes, Mail, Pages, and TextEdit, and in Safari. In Chrome, Google Docs, and Slack, use Shift-Command-V.",
      },
      {
        question: "Can I make Command-V always paste without formatting?",
        answer:
          "Yes, in apps that have a Paste and Match Style menu item. In System Settings › Keyboard › Keyboard Shortcuts › App Shortcuts, add a shortcut for All Applications with the menu title Paste and Match Style and press Command-V as the shortcut.",
      },
      {
        question: "Why does Paste and Match Style not work in some apps?",
        answer:
          "It only works in apps that offer it in their Edit menu. Microsoft Word calls it Paste and Match Formatting, and some apps, like Terminal, paste plain text anyway.",
      },
      {
        question: "How do I remove formatting from text I already copied?",
        answer:
          "In Terminal, run pbpaste | pbcopy. pbpaste reads only the plain text, so copying it back replaces the clipboard with the same words and no formatting.",
      },
    ],
    related: ["screenshot-to-clipboard-mac", "copy-from-iphone-to-mac"],
  },
  {
    slug: "copy-from-iphone-to-mac",
    title: "How to Copy and Paste From iPhone to Mac",
    description:
      "Copy on your iPhone and paste on your Mac with Universal Clipboard. How to set it up, how long a copy lasts, and what to check when it stops working.",
    h1: "How to copy and paste from iPhone to Mac",
    summary: "Set up Universal Clipboard, and fix it when it stops working.",
    published: "2026-10-13",
    faqs: [
      {
        question: "How do I copy from my iPhone and paste on my Mac?",
        answer:
          "Copy on your iPhone as usual, then press Command-V on your Mac. This is Universal Clipboard. Both devices need the same Apple Account, Wi-Fi and Bluetooth turned on, and Handoff turned on.",
      },
      {
        question: "How long does Universal Clipboard keep what I copied?",
        answer:
          "Only for a short time. Apple doesn’t give an exact limit, and in practice it’s a couple of minutes. If it’s gone, copy it again.",
      },
      {
        question: "Why is Universal Clipboard not working?",
        answer:
          "Check that both devices use the same Apple Account, that Handoff is on in both places, that Wi-Fi and Bluetooth are on, and that the devices are near each other. Turning Handoff off and on again on both devices fixes it most often.",
      },
      {
        question: "Can I copy from my Mac and paste on my iPhone?",
        answer:
          "Yes. Universal Clipboard works both ways: copy on your Mac, then touch and hold a text field on your iPhone and tap Paste.",
      },
    ],
    related: ["paste-without-formatting-mac", "screenshot-to-clipboard-mac"],
  },
  {
    slug: "screenshot-to-clipboard-mac",
    title: "How to Copy a Screenshot to the Clipboard on Mac",
    description:
      "Add Control to any Mac screenshot shortcut to copy it instead of saving a file. Control-Shift-Command-4 copies part of the screen, and Command-V pastes it.",
    h1: "How to copy a screenshot to the clipboard on Mac",
    summary: "Copy a screenshot instead of saving a file, and paste it anywhere.",
    published: "2026-10-13",
    faqs: [
      {
        question: "What is the shortcut to screenshot to the clipboard on a Mac?",
        answer:
          "Control-Shift-Command-4 copies the part of the screen you select. Control-Shift-Command-3 copies the whole screen. Then press Command-V to paste.",
      },
      {
        question: "How do I make screenshots go to the clipboard by default?",
        answer:
          "Press Shift-Command-5, click Options, and choose Clipboard under Save to. Screenshots you take from that toolbar are then copied instead of saved to the desktop.",
      },
      {
        question: "Where do screenshots copied to the clipboard go?",
        answer:
          "They aren’t saved as files. The screenshot waits on the clipboard until you paste it or copy something else, which replaces it. A clipboard manager like On Hand keeps every screenshot you copy.",
      },
      {
        question: "How do I screenshot a single window to the clipboard?",
        answer:
          "Press Control-Shift-Command-4, then press Space. The pointer turns into a camera. Click the window you want, and it’s copied.",
      },
    ],
    related: ["paste-without-formatting-mac", "copy-from-iphone-to-mac"],
  },
];

export function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
