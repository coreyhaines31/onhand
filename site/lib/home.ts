import { sourceUrl } from "@/lib/site";

export type Faq = { question: string; answer: string; link?: { href: string; label: string } };

export const faqs: Faq[] = [
  {
    question: "Is On Hand free?",
    answer:
      "Yes. On Hand is free, with no account, trial, or subscription. The local app’s source is available under the MIT license. Optional paid services may come later.",
  },
  {
    question: "Will it run on my Mac?",
    answer:
      "On Hand supports Apple silicon and Intel Macs running macOS 14 or later. It is signed and notarized by Apple.",
    link: { href: "/install", label: "Read the installation guide" },
  },
  {
    question: "What does On Hand save?",
    answer:
      "Text, web links, and images you copy after turning on capture. On Hand reads the text in images on your Mac so you can search screenshots. History holds up to 500 clips or 50 MB. Unpinned clips expire after seven days by default. Text over 1 MB, images over 10 MB, and copied files are skipped; rich text is saved as plain text.",
  },
  {
    question: "Does it capture passwords?",
    answer:
      "On Hand skips concealed and temporary clipboard items and excludes several common password managers by default. It also won’t save card numbers, Social Security numbers, or secret keys, including in screenshots. When you copy one as text, it marks it so other clipboard managers that respect the concealed signal skip it too, and clears it from your clipboard after 90 seconds. It can’t recognize every secret, so pause capture before copying other private information, or press ⌃⌥⌘⌫ to forget your last copy.",
    link: { href: "/features/protect-api-keys", label: "See which secrets it recognizes" },
  },
  {
    question: "Does it paste for me?",
    answer:
      "No. Choosing a clip puts it back on your clipboard and switches you to the app you were in, and you press ⌘V. That keeps On Hand from typing into the wrong window, and it’s why On Hand doesn’t need Accessibility access unless you turn on Sent messages.",
  },
  {
    question: "Will it slow down my Mac or drain the battery?",
    answer:
      "It shouldn’t. Four times a second, On Hand checks one number macOS keeps for the clipboard, which changes only when something new is copied. It reads the clipboard only when that number changes. Text recognition runs once for each new image, on your Mac.",
  },
  {
    question: "Can AI agents use my clipboard history?",
    answer:
      "Yes, when you let them. On Hand includes the onhand command, so Claude Code, Codex, or a script can search your history, read a clip or the text in a screenshot, copy it back, or pause capture from Terminal. Whatever an agent reads goes to its AI provider, so search shows only one-line previews and the full text comes one clip at a time.",
    link: { href: "/features/command-line", label: "See how the command works" },
  },
  {
    question: "Can it save messages I send?",
    answer:
      "Yes, if you turn on Sent messages in Settings. In apps you choose, like Slack or Messages, On Hand saves what you send so you can find it again, and ⌃⌥↑ brings your last message back into the box, like ↑ in Terminal. It needs Accessibility access, reads only the message box, never records keystrokes, and skips password fields.",
  },
  {
    question: "Does it sync between Macs?",
    answer:
      "No. Your history stays on the Mac where you copied it. On Hand has no cloud sync.",
  },
  {
    question: "How does it update?",
    answer:
      "On Hand checks for updates with Sparkle, which downloads signed releases from GitHub. That update check is the only network request the app makes. You can also check by hand in ⋯ › Settings, or update with Homebrew if you installed it that way.",
  },
  {
    question: "How do I uninstall it?",
    answer:
      "Quit On Hand from ⋯ › Settings and drag On Hand.app to the Trash. To delete your history and settings too, remove ~/Library/Application Support/OnHand and ~/Library/Preferences/com.onhandformac.OnHand.plist. With Homebrew, brew uninstall --zap --cask onhand does all of it.",
  },
  {
    question: "I’m on macOS Tahoe. Do I still need a clipboard manager?",
    answer:
      "Maybe not. If you only need what you copied a few minutes ago, Spotlight’s clipboard history on macOS Tahoe may be enough. On Hand adds pinned clips and boards, search inside screenshots, secret-key detection, and a command for scripts and agents, and it works on macOS 14 and 15 too.",
    link: { href: "/mac-clipboard-history", label: "How to see clipboard history on a Mac" },
  },
  {
    question: "Can I inspect or build the code?",
    answer:
      "Yes. The source is MIT-licensed, so you can inspect the code, build the app, report an issue, or contribute.",
    link: { href: sourceUrl, label: "View the source on GitHub" },
  },
];

export const shortcuts: { keys: string; action: string }[] = [
  { keys: "⌘⇧Space", action: "Open or close history from any app. Change it in Settings." },
  { keys: "↑ ↓ then Return", action: "Select a clip and copy it back." },
  { keys: "⌘1 – ⌘9", action: "Copy one of the first nine results." },
  { keys: "⌘F", action: "Jump to search." },
  { keys: "⌘O", action: "Preview the selected clip, including the text in an image." },
  { keys: "⌘P", action: "Pin or unpin the selected clip." },
  { keys: "Esc", action: "Leave a preview, or close history." },
  { keys: "⌃⌥⌘⌫", action: "Forget your last copy: delete it from history and clear the clipboard." },
  { keys: "⌃⌥↑ / ⌃⌥↓", action: "In a message box, step back and forward through what you sent from that app." },
];

export const commands: { command: string; does: string; flags?: string }[] = [
  { command: "onhand search [words]", does: "Newest clips containing every word, one line each.", flags: "--kind --pinned --sent --board --limit" },
  { command: "onhand get ID", does: "The full text of one clip. For a screenshot, the text in it.", flags: "--image FILE" },
  { command: "onhand copy ID", does: "Put a clip back on the clipboard." },
  { command: "onhand pin ID --board NAME", does: "Pin a clip so it never expires, on a board you name." },
  { command: "onhand unpin ID · delete ID", does: "Unpin a clip, or delete it from history." },
  { command: "onhand boards", does: "Your boards and how many clips each holds." },
  { command: "onhand forget-last", does: "Clear the clipboard and delete what On Hand saved from it." },
  { command: "onhand pause · resume · status", does: "Stop saving copies, start again, or check which it’s doing." },
];

export const passwordManagers = [
  "1Password",
  "Bitwarden",
  "Apple Passwords",
  "Keychain Access",
  "Dashlane",
  "LastPass",
  "KeePassXC",
  "Proton Pass",
  "Enpass",
  "Strongbox",
];

export const checkedOn = "November 16, 2026";

export type Cell = { text: string; good?: boolean; note?: string };

export const compareColumns = [
  { name: "On Hand", href: undefined },
  { name: "Spotlight (macOS Tahoe)", href: "/mac-clipboard-history" },
  { name: "Raycast", href: "/alternatives/raycast-clipboard-history" },
  { name: "Paste", href: "/alternatives/paste" },
  { name: "Maccy", href: "/alternatives/maccy" },
  { name: "Alfred", href: "/alternatives/alfred-clipboard-history" },
];

export const compareRows: { label: string; cells: Cell[] }[] = [
  {
    label: "Price",
    cells: [
      { text: "Free", good: true },
      { text: "Free, built in", good: true },
      { text: "Free", good: true, note: "Pro $10/month or $96/year" },
      { text: "$2.49/month or $29.99/year", note: "lifetime $89.99 on the App Store" },
      { text: "Free on GitHub", good: true, note: "$9.99 on the Mac App Store" },
      { text: "Powerpack from £34", note: "one-time" },
    ],
  },
  {
    label: "Source code public",
    cells: [
      { text: "Yes", good: true, note: "MIT" },
      { text: "No" },
      { text: "No" },
      { text: "No" },
      { text: "Yes", good: true, note: "MIT" },
      { text: "No" },
    ],
  },
  {
    label: "How long history lasts",
    cells: [
      { text: "1, 7, 30, or 90 days", note: "500 clips or 50 MB; pins stay" },
      { text: "Not stated by Apple" },
      { text: "Up to 3 months free", note: "unlimited with Pro" },
      { text: "No limit", good: true },
      { text: "200 clips by default" },
      { text: "24 hours to 3 months" },
    ],
  },
  {
    label: "Pinned clips",
    cells: [
      { text: "Yes, on named boards", good: true },
      { text: "Not in Apple’s guide" },
      { text: "Yes", good: true },
      { text: "Yes, Pinboards", good: true, note: "shareable with a team" },
      { text: "Yes", good: true },
      { text: "Not documented" },
    ],
  },
  {
    label: "Search text in screenshots",
    cells: [
      { text: "Yes, on your Mac", good: true },
      { text: "Not in Apple’s guide" },
      { text: "Yes", good: true },
      { text: "Yes", good: true },
      { text: "Yes", good: true },
      { text: "Not documented" },
    ],
  },
  {
    label: "Skips password managers",
    cells: [
      { text: "Yes, 10 by default", good: true },
      { text: "Not in Apple’s guide" },
      { text: "Yes", good: true, note: "Passwords and Keychain Access" },
      { text: "Yes", good: true, note: "concealed items" },
      { text: "Yes", good: true, note: "concealed items and 1Password" },
      { text: "Yes", good: true, note: "Keychain Access and 1Password" },
    ],
  },
  {
    label: "Spots keys and card numbers copied from anywhere",
    cells: [
      { text: "Yes", good: true, note: "25+ kinds of keys, cards, SSNs" },
      { text: "Not documented" },
      { text: "Not documented" },
      { text: "Not documented" },
      { text: "Not documented" },
      { text: "Not documented" },
    ],
  },
  {
    label: "Pastes into the app for you",
    cells: [
      { text: "No, you press ⌘V" },
      { text: "Not in Apple’s guide" },
      { text: "Yes", good: true },
      { text: "Yes", good: true, note: "with Accessibility access" },
      { text: "Optional", good: true, note: "off by default" },
      { text: "Yes", good: true, note: "on by default" },
    ],
  },
  {
    label: "Sync across devices",
    cells: [
      { text: "No, by design" },
      { text: "Not in Apple’s guide" },
      { text: "Pro only" },
      { text: "Yes, iCloud", good: true, note: "Mac, iPhone, iPad" },
      { text: "Not documented" },
      { text: "Not documented" },
    ],
  },
  {
    label: "Requires",
    cells: [
      { text: "macOS 14+", good: true, note: "Apple silicon or Intel" },
      { text: "macOS Tahoe 26" },
      { text: "Raycast 2: macOS Tahoe", note: "and Apple silicon" },
      { text: "macOS 14+", good: true },
      { text: "macOS 14+", good: true },
      { text: "macOS 10.14+", good: true },
    ],
  },
];

export const compareSources = [
  "https://support.apple.com/guide/mac-help/mchl40d5b86b/mac",
  "https://manual.raycast.com/clipboard-history",
  "https://www.raycast.com/pricing",
  "https://www.raycast.com/new",
  "https://pasteapp.io/pricing",
  "https://apps.apple.com/us/app/paste-limitless-clipboard/id967805235",
  "https://pasteapp.io/help/what-paste-captures",
  "https://pasteapp.io/help/paste-on-mac",
  "https://maccy.app",
  "https://github.com/p0deje/Maccy",
  "https://www.alfredapp.com/help/features/clipboard/",
  "https://www.alfredapp.com/powerpack/buy/",
];
