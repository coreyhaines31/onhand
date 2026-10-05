import Link from "next/link";
export default function Install() {
  return (
    <main className="document wrap">
      <Link className="back" href="/">
        ← Back to On Hand
      </Link>
      <h1>
        A little setup.
        <br />
        <em>Then it’s on hand.</em>
      </h1>
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
          System Settings → Privacy &amp; Security. Do not disable Gatekeeper
          globally.
        </li>
        <li>
          Choose “Start keeping my clipboard.” Only new copies are captured.
        </li>
      </ol>
      <h2>Everyday use</h2>
      <p>
        Press <strong>⌘⇧Space</strong> or click the overlapping-squares icon in
        your menu bar. Type to search, use the arrow keys to browse, and press
        Return to copy. Then paste with ⌘V. Click the pin to keep a clip.
        Right-click a clip to preview or delete it. Settings lets you change
        your shortcut, start at login, pause, or clear history.
      </p>
      <h2>Build it yourself</h2>
      <p>
        <a href="/downloads/on-hand-source.zip" download>
          Download the source
        </a>
        . Install Xcode, XcodeGen, and SwiftLint, then run{" "}
        <code>make test</code>, <code>make lint</code>, and{" "}
        <code>make app</code>. The built app is in <code>dist/On Hand.app</code>
        . Full instructions are in the README.
      </p>
    </main>
  );
}
