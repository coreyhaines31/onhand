import type { Metadata } from "next";
import Link from "next/link";
import { downloadUrl } from "@/lib/site";
export const metadata: Metadata = {
  title: "Install On Hand on your Mac",
  description:
    "Download, install, and start using On Hand, the free clipboard manager for Mac. Keyboard shortcuts, settings, and how to build it from source.",
  alternates: { canonical: "/install" },
  openGraph: { title: "Install On Hand on your Mac", url: "/install", images: "/opengraph-image" },
};

export default function Install() {
  return (
    <main className="document wrap">
      <Link className="back" href="/">
        ← Back to On Hand
      </Link>
      <h1>Install On Hand.</h1>
      <p>
        On Hand supports Apple silicon and Intel Macs running macOS 14 or later.
        The app is signed with Developer ID and notarized by Apple.
      </p>
      <h2>Install the app</h2>
      <ol>
        <li>
          <a href={downloadUrl}>
            Download On Hand
          </a>{" "}
          and unzip it.
        </li>
        <li>
          Move <strong>On Hand.app</strong> to Applications.
        </li>
        <li>
          Open On Hand from Applications. Confirm Open if macOS asks whether
          you want to open an app downloaded from the internet.
        </li>
        <li>
          Choose “Start keeping my clipboard.” Only new copies are captured.
        </li>
      </ol>
      <h2>Install with Homebrew</h2>
      <p>
        If you use Homebrew, run <code>brew install --cask coreyhaines31/tap/onhand</code>. It
        installs the same signed app, which keeps itself up to date.
      </p>
      <h2>Everyday use</h2>
      <p>
        Press <strong>⌘⇧Space</strong> to open history. Search for a word or
        app, choose a clip with the arrow keys, and press Return to copy it.
        Switch to your destination and paste with <strong>⌘V</strong>.
      </p>
      <p>
        Use <strong>⌘1–9</strong> to copy a numbered result, <strong>⌘O</strong>{" "}
        to preview, <strong>⌘P</strong> to pin, and <strong>⌘F</strong> to
        search. The keyboard button in On Hand shows the shortcut reference.
      </p>
      <p>
        Turn on “Keep window open” to reuse several clips across apps. In
        Settings, you can change the global shortcut, choose excluded apps,
        adjust retention, pause capture, or clear history.
      </p>
      <h2>Build it yourself</h2>
      <p>
        <a href="https://github.com/coreyhaines31/onhand">
          View the source on GitHub
        </a>
        . Install Xcode, XcodeGen, and SwiftLint, then run{" "}
        <code>make test</code>, <code>make lint</code>, and{" "}
        <code>make app</code>. The built app is in <code>dist/On Hand.app</code>
        . Full instructions are in the README.
      </p>
    </main>
  );
}
