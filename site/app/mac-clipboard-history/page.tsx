import type { Metadata } from "next";
import Link from "next/link";
import DownloadCta from "@/components/download-cta";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { siteUrl } from "@/lib/site";

const title = "How to See Clipboard History on Mac";
const description =
  "Macs only keep the last thing you copied, unless you’re on macOS Tahoe or use a clipboard manager. Here’s how to see your current clipboard, your clipboard history, and how to clear it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/mac-clipboard-history" },
  openGraph: { title, description, url: "/mac-clipboard-history", type: "article", images: "/opengraph-image" },
};

const faqs = [
  {
    question: "Does Mac have a clipboard history?",
    answer:
      "Only on macOS Tahoe 26 and later, where Spotlight can show recent clipboard items once you turn it on. Earlier versions of macOS keep just one item: the last thing you copied. To keep more on macOS Sonoma or Sequoia, use a clipboard manager.",
  },
  {
    question: "How do I open the clipboard on a Mac?",
    answer:
      "In Finder, choose Edit › Show Clipboard to see what’s on the clipboard right now. On macOS Tahoe, press Command-Space and then Command-4 to open clipboard history in Spotlight.",
  },
  {
    question: "Where are copied items stored on a Mac?",
    answer:
      "The current clipboard lives in memory and is replaced every time you copy something new. It isn’t saved as a file you can browse. Clipboard managers like On Hand save a history in a local database on your Mac.",
  },
  {
    question: "How do I clear the clipboard on a Mac?",
    answer:
      "Copy something harmless, like a single space, to replace what’s there. In Terminal, run pbcopy < /dev/null to empty it. To erase Spotlight’s clipboard history on macOS Tahoe, open it with Command-Space then Command-4, click More, and choose Clear History.",
  },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${siteUrl}/mac-clipboard-history`,
    datePublished: "2026-10-06",
    dateModified: "2026-10-07",
    author: { "@type": "Person", name: "Corey Haines" },
    image: `${siteUrl}/opengraph-image`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

export default function MacClipboardHistory() {
  return (
    <>
      <SiteNav />
      <main className="document article wrap">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <h1>How to see clipboard history on Mac</h1>
        <p className="lede">
          Copied something an hour ago and now it’s gone? Here’s where your Mac keeps what you copy,
          and how to get older clips back.
        </p>
        <div className="answer">
          <p>
            <strong>Short answer:</strong> on <strong>macOS Tahoe 26</strong>, turn on clipboard
            results in Spotlight, then press <kbd>⌘</kbd> <kbd>Space</kbd> and <kbd>⌘</kbd>{" "}
            <kbd>4</kbd>. On <strong>macOS Sonoma or Sequoia</strong>, your Mac only remembers the
            last thing you copied, so you need a clipboard manager like{" "}
            <Link href="/">On Hand</Link> (free) to keep a history.
          </p>
        </div>

        <h2>Does a Mac keep a clipboard history?</h2>
        <p>
          For most of the Mac’s history, no. The clipboard holds one item. Every time you press{" "}
          <kbd>⌘</kbd> <kbd>C</kbd>, the new copy replaces the old one, and the old one is gone.
        </p>
        <p>
          macOS Tahoe 26 changed that. Spotlight can now show things you copied recently, but it’s
          off until you allow it, and it only keeps items for a limited time. If your Mac runs an
          older version, there’s no built-in history at all.
        </p>

        <h2>See what’s on your clipboard right now</h2>
        <p>This works on every version of macOS:</p>
        <ol>
          <li>Click Finder in the Dock.</li>
          <li>
            In the menu bar, choose <strong>Edit › Show Clipboard</strong>.
          </li>
        </ol>
        <p>
          A window shows the current item and whether it’s text, an image, or something else. It
          only shows the latest copy, not earlier ones.
        </p>
        <p>
          If you use Terminal, <code>pbpaste</code> prints the text on your clipboard.
        </p>

        <h2>See clipboard history on macOS Tahoe</h2>
        <ol>
          <li>
            Press <kbd>⌘</kbd> <kbd>Space</kbd> to open Spotlight.
          </li>
          <li>
            Press <kbd>⌘</kbd> <kbd>4</kbd>, or click the clipboard button to the right of the
            search field.
          </li>
          <li>
            The first time, macOS asks whether to allow results from the clipboard. Click{" "}
            <strong>Allow</strong>.
          </li>
          <li>Type to search what you copied, then select an item and press ⌘C to copy it again.</li>
        </ol>
        <p>
          You can also turn this on, or change how long items stay, in{" "}
          <strong>System Settings › Spotlight</strong> under <strong>Results from Clipboard</strong>.
          By default items are kept for 8 hours.
        </p>
        <h3>Where Tahoe’s clipboard history falls short</h3>
        <ul>
          <li>Items expire. There’s no way to keep a snippet, address, or reply around for good.</li>
          <li>You can’t pin favorites to keep them.</li>
          <li>It needs macOS Tahoe 26. Earlier versions of macOS don’t have it.</li>
        </ul>

        <h2>See clipboard history on macOS Sonoma or Sequoia</h2>
        <p>
          On macOS 14 and 15, you need a clipboard manager. It runs in the menu bar and saves each
          thing you copy, so you can search it and copy it back later. Here’s how it works with On
          Hand, which is free and open source:
        </p>
        <ol>
          <li>
            <a href="/download">Download On Hand</a>, unzip it, and move it to Applications.
          </li>
          <li>Open it and choose “Start keeping my clipboard.” Only new copies are saved.</li>
          <li>
            Press <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>Space</kbd> at any time to open your history.
          </li>
          <li>
            Search for a word you remember or the app you copied from. Press Return to copy a clip,
            or <kbd>⌘</kbd> <kbd>1</kbd>–<kbd>9</kbd> to copy one of the first nine.
          </li>
          <li>
            Paste it with <kbd>⌘</kbd> <kbd>V</kbd> as usual.
          </li>
        </ol>
        <p>
          On Hand keeps text, links, and images, searches the text inside screenshots, lets you
          pin the clips you reuse to boards, and stores everything on your Mac. It also works on macOS Tahoe if you want pins and a longer
          history than Spotlight offers.{" "}
          <Link href="/alternatives">Compare clipboard managers for Mac</Link>.
        </p>

        <h2>Mac clipboard shortcuts</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Shortcut</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <kbd>⌘</kbd> <kbd>C</kbd>
                </td>
                <td>Copy</td>
              </tr>
              <tr>
                <td>
                  <kbd>⌘</kbd> <kbd>X</kbd>
                </td>
                <td>Cut</td>
              </tr>
              <tr>
                <td>
                  <kbd>⌘</kbd> <kbd>V</kbd>
                </td>
                <td>Paste</td>
              </tr>
              <tr>
                <td>
                  <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>V</kbd>
                </td>
                <td>Paste and match style (paste without the original formatting)</td>
              </tr>
              <tr>
                <td>
                  <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>4</kbd>
                </td>
                <td>Screenshot part of the screen straight to the clipboard</td>
              </tr>
              <tr>
                <td>
                  <kbd>⌘</kbd> <kbd>Space</kbd>, then <kbd>⌘</kbd> <kbd>4</kbd>
                </td>
                <td>Open clipboard history in Spotlight (macOS Tahoe)</td>
              </tr>
              <tr>
                <td>
                  <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>Space</kbd>
                </td>
                <td>Open On Hand’s clipboard history (you can change it)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>How to clear your clipboard history</h2>
        <ul>
          <li>
            <strong>The current clipboard:</strong> copy something harmless, like a space. In
            Terminal, <code>pbcopy &lt; /dev/null</code> empties it.
          </li>
          <li>
            <strong>Spotlight on macOS Tahoe:</strong> open clipboard history, click{" "}
            <strong>More</strong> next to the search field, and choose{" "}
            <strong>Clear History</strong>.
          </li>
          <li>
            <strong>On Hand:</strong> delete a single clip from its menu, or clear all history in
            Settings. You can also pause capture before copying something sensitive.
          </li>
        </ul>

        <h2>Questions</h2>
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}

        <DownloadCta
          title="Keep everything you copy."
          body="On Hand is a free, open-source clipboard manager for macOS 14 and later. History stays on your Mac."
        />
      </main>
      <SiteFooter />
    </>
  );
}
