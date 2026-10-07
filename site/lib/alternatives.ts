export type Comparison = {
  price: string;
  source: string;
  images: string;
  search: string;
  pins: string;
  ocr: string;
  sync: string;
  exclusions: string;
  shortcuts: string;
  requires: string;
};

export type Alternative = {
  slug: string;
  name: string;
  url: string;
  summary: string;
  status: string;
  verdict: string;
  chooseThem: string[];
  chooseOnHand: string[];
  comparison: Comparison;
  sources: string[];
};

export const comparisonRows: { key: keyof Comparison; label: string }[] = [
  { key: "price", label: "Price" },
  { key: "source", label: "Source code" },
  { key: "images", label: "Images" },
  { key: "search", label: "Search" },
  { key: "pins", label: "Pinned clips" },
  { key: "ocr", label: "Search text in images" },
  { key: "sync", label: "Sync" },
  { key: "exclusions", label: "Skip password managers and apps" },
  { key: "shortcuts", label: "Shortcuts" },
  { key: "requires", label: "Requires" },
];

export const checkedOn = "October 6, 2026";

export const onHand: Comparison = {
  price: "Free",
  source: "Open source (MIT)",
  images: "Yes",
  search: "Yes, by text or source app",
  pins: "Yes, with named boards",
  ocr: "Yes, on your Mac",
  sync: "No. History stays on your Mac",
  exclusions: "Yes. Password managers skipped; card numbers, SSNs, and keys never saved",
  shortcuts: "⌘⇧Space to open (changeable), ⌘1–9 to copy",
  requires: "macOS 14 or later, Apple silicon or Intel",
};

export const alternatives: Alternative[] = [
  {
    slug: "maccy",
    name: "Maccy",
    url: "https://maccy.app",
    summary: "Free, open-source, keyboard-first clipboard manager.",
    status: "Actively maintained. Version 2.7.1 shipped in August 2026.",
    verdict:
      "Maccy is a great app, and it’s the closest thing to On Hand. Both are free, MIT-licensed, local-only, need macOS 14, and search text in images. The real difference is feel: Maccy is a compact popup you drive with ⇧⌘C, while On Hand is a menu bar window with previews, filters, and a keep-open mode.",
    chooseThem: [
      "You want the most established free option, with years of releases and a large community.",
      "You want to paste straight from the list with ⌥1–9, or paste without formatting from a shortcut.",
      "You like tuning settings, such as ignoring specific clipboard types.",
    ],
    chooseOnHand: [
      "You want a larger window that previews clips and filters by text, links, images, or pins.",
      "You want history to stay open while you copy from it into several apps.",
      "You want the free version everywhere. Maccy is free on GitHub but $9.99 on the Mac App Store.",
    ],
    comparison: {
      price: "Free on GitHub, $9.99 on the Mac App Store",
      source: "Open source (MIT)",
      images: "Yes",
      search: "Yes",
      pins: "Yes",
      ocr: "Yes",
      sync: "No",
      exclusions: "Yes. 1Password ignored by default",
      shortcuts: "⇧⌘C to open, ⌘1–9 to copy, ⌥1–9 to paste",
      requires: "macOS 14 or later",
    },
    sources: [
      "https://maccy.app",
      "https://github.com/p0deje/Maccy",
      "https://github.com/p0deje/Maccy/releases/tag/2.4.0",
      "https://apps.apple.com/us/app/maccy/id1527619437",
    ],
  },
  {
    slug: "clipy",
    name: "Clipy",
    url: "https://clipy-app.com",
    summary: "Free clipboard and snippet manager, revived in 2026.",
    status:
      "Version 1.3.0 shipped in June 2026, the first release in about eight years. It moved to SQLite and added Firebase.",
    verdict:
      "Clipy is back after a long pause, and its snippet folders are still its best feature. If you mostly paste the same boilerplate, it’s a good fit. If you want to search and pin what you copied, On Hand is built around that.",
    chooseThem: [
      "You paste the same blocks of text often and want them organized in snippet folders.",
      "You used Clipy or ClipMenu before and like its menu-style list.",
      "You need to run on macOS 13 Ventura.",
    ],
    chooseOnHand: [
      "You want to search your history. Clipy’s 1.3.0 notes describe search as still in preparation.",
      "You want to pin clips and preview text and images before you copy them.",
      "You want an app with no analytics. On Hand’s app sends none.",
    ],
    comparison: {
      price: "Free",
      source: "Open source (MIT)",
      images: "Yes",
      search: "Not yet shipped",
      pins: "Not documented",
      ocr: "Not documented",
      sync: "No",
      exclusions: "Yes",
      shortcuts: "⇧⌘V menu, ⌃⌘V history, ⇧⌘B snippets",
      requires: "macOS 13 or later",
    },
    sources: [
      "https://clipy-app.com",
      "https://github.com/Clipy/Clipy",
      "https://github.com/Clipy/Clipy/releases/tag/1.3.0",
    ],
  },
  {
    slug: "paste",
    name: "Paste",
    url: "https://pasteapp.io",
    summary: "Polished subscription clipboard app with iCloud sync.",
    status: "Actively maintained. Version 7.0.1 shipped in October 2026.",
    verdict:
      "Paste is the most polished paid option, and it’s the one to pick if you need clipboard history on your iPhone and iPad too. If you only need it on one Mac and don’t want a subscription, On Hand covers the everyday parts for free.",
    chooseThem: [
      "You want the same clipboard history on Mac, iPhone, and iPad through iCloud.",
      "You want Pinboards to organize clips, Paste Stack, and AI and MCP integrations.",
      "You’re happy to pay for a mature, polished app.",
    ],
    chooseOnHand: [
      "You don’t want a subscription. Paste costs $29.99 a year, or $99.99 for lifetime on the App Store.",
      "You’d rather your clipboard never leaves your Mac.",
      "You want an open-source app whose code you can read.",
    ],
    comparison: {
      price: "From $2.49/month or $29.99/year. $99.99 lifetime on the App Store. 7-day trial",
      source: "Closed source",
      images: "Yes",
      search: "Yes",
      pins: "Yes, with Pinboards",
      ocr: "Yes",
      sync: "Yes, iCloud across Mac, iPhone, and iPad",
      exclusions: "Yes",
      shortcuts: "⇧⌘V to open, ⌘1–9 to paste",
      requires: "macOS 14 or later",
    },
    sources: [
      "https://pasteapp.io/pricing",
      "https://pasteapp.io/help/quick-paste-with-numbered-shortcuts",
      "https://apps.apple.com/us/app/paste-limitless-clipboard/id967805235",
    ],
  },
  {
    slug: "flycut",
    name: "Flycut",
    url: "https://github.com/TermiT/Flycut",
    summary: "Lightweight, open-source text clipboard for developers.",
    status:
      "Low activity. The last shipped release is 1.9.6 from December 2020. Its changelog points to a community fork.",
    verdict:
      "Flycut is a fast, keyboard-driven text clipboard that many developers have used for years. It hasn’t shipped a release since 2020 and focuses on text. On Hand is current, keeps images and links too, and is built for macOS 14 and later.",
    chooseThem: [
      "You only copy text and like Flycut’s bezel that you flip through with the keyboard.",
      "You need to run on a much older Mac.",
      "You want clippings to sync with Flycut on iPhone through iCloud.",
    ],
    chooseOnHand: [
      "You want an app that’s actively maintained.",
      "You copy images and links, not just text.",
      "You want to skip password managers and other apps you choose.",
    ],
    comparison: {
      price: "Free",
      source: "Open source (MIT)",
      images: "Text only",
      search: "Yes",
      pins: "Yes, as Favorites",
      ocr: "No",
      sync: "Optional iCloud sync",
      exclusions: "Filters password fields",
      shortcuts: "⇧⌘V to open, arrow or J/K keys to browse",
      requires: "macOS 10.10 or later (App Store version)",
    },
    sources: [
      "https://github.com/TermiT/Flycut",
      "https://github.com/TermiT/Flycut/releases",
      "https://apps.apple.com/us/app/flycut-clipboard-manager/id442160987",
    ],
  },
  {
    slug: "copyclip",
    name: "CopyClip",
    url: "https://fiplab.com/apps/copyclip-for-mac",
    summary: "Simple free menu bar list, with a paid CopyClip 2.",
    status: "Maintained. Both CopyClip and CopyClip 2 were updated in 2026.",
    verdict:
      "Free CopyClip is a very simple menu bar list of recent text. Search, pins, numbered shortcuts, and app exclusions are in the paid CopyClip 2. On Hand includes all of those for free, and keeps images too.",
    chooseThem: [
      "You want the simplest possible list of recent copies on an older Mac.",
      "You want CopyClip 2’s themes or room for up to 9,999 text clips.",
      "You prefer buying from the Mac App Store.",
    ],
    chooseOnHand: [
      "You want search, pins, ⌘1–9, and app exclusions without paying for CopyClip 2.",
      "You copy images as well as text.",
      "You want an open-source app.",
    ],
    comparison: {
      price: "CopyClip free. CopyClip 2 $7.99",
      source: "Closed source",
      images: "Not documented",
      search: "CopyClip 2 only",
      pins: "CopyClip 2 only",
      ocr: "No",
      sync: "No",
      exclusions: "CopyClip 2 only",
      shortcuts: "CopyClip 2: ⌘1–9",
      requires: "macOS 10.13 (CopyClip), 11.5 (CopyClip 2)",
    },
    sources: [
      "https://apps.apple.com/us/app/copyclip-clipboard-history/id595191960",
      "https://apps.apple.com/us/app/copyclip-2-clipboard-manager/id1020812363",
      "https://fiplab.com/apps/copyclip-for-mac",
    ],
  },
  {
    slug: "pastepal",
    name: "PastePal",
    url: "https://indiegoodies.com/pastepal",
    summary: "Mac, iPhone, and iPad clipboard app with a one-time Pro unlock.",
    status: "Actively maintained. Version 2.16.1 shipped in September 2026.",
    verdict:
      "PastePal does a lot: iCloud sync, an iPhone keyboard, collections, and dozens of text transforms. If you want all of that for a one-time price, it’s good value. If you just want your Mac’s clipboard history, On Hand is free and simpler.",
    chooseThem: [
      "You want your clipboard on iPhone and iPad too, including a keyboard extension.",
      "You use text transforms like JSON formatting, Base64, or case changes.",
      "You want collections to organize clips.",
    ],
    chooseOnHand: [
      "You don’t want to pay $14.99 to unlock Pro.",
      "You don’t want clipboard data in iCloud.",
      "You want an open-source app focused on history.",
    ],
    comparison: {
      price: "Free download. Pro $14.99 one-time",
      source: "Closed source",
      images: "Yes",
      search: "Yes",
      pins: "Yes, plus Collections",
      ocr: "Captures text from a screen area",
      sync: "iCloud (App Store version)",
      exclusions: "Yes",
      shortcuts: "⌘1–9 to paste",
      requires: "macOS 14 (App Store), macOS 12 (direct)",
    },
    sources: [
      "https://indiegoodies.com/pastepal",
      "https://apps.apple.com/us/app/clipboard-manager-pastepal/id1503446680",
    ],
  },
  {
    slug: "raycast-clipboard-history",
    name: "Raycast",
    url: "https://www.raycast.com",
    summary: "Launcher with clipboard history built in.",
    status: "Actively maintained. Raycast 2 needs macOS Tahoe and Apple silicon.",
    verdict:
      "If you already live in Raycast, its clipboard history is excellent, with OCR and type filters. If you don’t want a whole launcher to get clipboard history, or you’re on macOS 14 or 15, On Hand is a small standalone app.",
    chooseThem: [
      "You already use Raycast as your launcher.",
      "You want clipboard history, snippets, and window management in one app.",
      "You want sync across devices and AI features with Raycast Pro.",
    ],
    chooseOnHand: [
      "You want clipboard history without adopting a launcher.",
      "You’re on macOS Sonoma or Sequoia, or an Intel Mac. Raycast 2 needs Tahoe and Apple silicon.",
      "You want an open-source app whose code you can read.",
    ],
    comparison: {
      price: "Free. Pro $96/year for unlimited history and sync",
      source: "Closed source",
      images: "Yes",
      search: "Yes, with type filters",
      pins: "Yes",
      ocr: "Yes",
      sync: "Pro only",
      exclusions: "Yes. Passwords and Keychain Access by default",
      shortcuts: "A hotkey you choose",
      requires: "Raycast 2: macOS 26 and Apple silicon",
    },
    sources: [
      "https://manual.raycast.com/clipboard-history",
      "https://www.raycast.com/pricing",
      "https://www.raycast.com/new",
    ],
  },
  {
    slug: "alfred-clipboard-history",
    name: "Alfred",
    url: "https://www.alfredapp.com",
    summary: "Launcher whose Powerpack includes clipboard history.",
    status: "Actively maintained. Alfred 5.8.1 shipped in September 2026.",
    verdict:
      "Alfred’s clipboard history is part of the paid Powerpack, alongside snippets and workflows. If you already own it, use it. If you don’t, On Hand gives you clipboard history for free, with pins and no fixed cap on how long pinned clips stay.",
    chooseThem: [
      "You already own the Powerpack and use Alfred every day.",
      "You want to merge clips or turn a clip into an expanding snippet.",
      "You need to run on an older version of macOS.",
    ],
    chooseOnHand: [
      "You don’t want to buy the Powerpack, which starts at £34, for clipboard history.",
      "You want to pin clips so they never expire. Alfred keeps history for three months at most.",
      "You want a menu bar app with previews instead of a launcher.",
    ],
    comparison: {
      price: "Powerpack £34 one-time",
      source: "Closed source",
      images: "Yes",
      search: "Yes",
      pins: "Not documented",
      ocr: "Not documented",
      sync: "Not documented",
      exclusions: "Yes. Keychain Access and 1Password by default",
      shortcuts: "A hotkey or keyword you choose",
      requires: "macOS 10.14 or later",
    },
    sources: [
      "https://www.alfredapp.com/help/features/clipboard/",
      "https://www.alfredapp.com/powerpack/buy/",
    ],
  },
  {
    slug: "supaste",
    name: "Supaste",
    url: "https://www.supaste.com",
    summary: "New visual clipboard library with OCR and iCloud sync.",
    status: "New. Launched in June 2026; version 1.7 shipped in July 2026.",
    verdict:
      "Supaste is a visual clipboard library with categories, OCR, a notch shelf, and iCloud sync between Macs. It’s a one-time purchase for one device. On Hand is free, open source, and keyboard-first if you don’t need a full library.",
    chooseThem: [
      "You want a visual timeline with custom categories and drag and drop.",
      "You want iCloud sync between Macs.",
      "You like extras like the notch shelf and color picker.",
    ],
    chooseOnHand: [
      "You want a free app. Supaste is $29 for one device, or $15 as an early-user offer.",
      "You want to exclude password managers and other apps you choose.",
      "You want a smaller, keyboard-first tool with open-source code.",
    ],
    comparison: {
      price: "$29 one-time for one device ($15 early-user offer)",
      source: "Closed source",
      images: "Yes",
      search: "Yes",
      pins: "Yes, as favorites, plus categories",
      ocr: "Yes",
      sync: "iCloud",
      exclusions: "Detects sensitive content. App exclusions not documented",
      shortcuts: "⌃⌘V to open, ⌃⌘0–9 for recent items",
      requires: "macOS 14 or later",
    },
    sources: ["https://www.supaste.com/", "https://www.supaste.com/updates"],
  },
];

export function findAlternative(slug: string) {
  return alternatives.find((alternative) => alternative.slug === slug);
}
