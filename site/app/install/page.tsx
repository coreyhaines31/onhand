import Link from "next/link";
export default function Install() {
  return (
    <main className="document wrap">
      <Link className="back" href="/">
        ← Back to On Hand
      </Link>
      <h1>Install On Hand.</h1>
      <p>
        This is a developer preview for Apple silicon Macs running macOS 14 or
        later. It is locally signed, but has not been signed with Developer ID
        or notarized by Apple.
      </p>
      <h2>Install the preview</h2>
      <ol>
        <li>
          <a href="/downloads/on-hand-0.1.0-preview.zip" download>
            Download the preview
          </a>{" "}
          and unzip it.
        </li>
        <li>
          Move <strong>On Hand.app</strong> to Applications.
        </li>
        <li>
          Open the app. macOS may block an unnotarized download. If you trust
          this preview, use the per-app <strong>Open Anyway</strong> option in
          System Settings → Privacy &amp; Security.
        </li>
        <li>
          Choose “Start keeping my clipboard.” Only new copies are captured.
        </li>
      </ol>
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
