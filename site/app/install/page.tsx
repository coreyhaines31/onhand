import type { Metadata } from "next";
import Link from "next/link";
import CopyBlock from "@/components/copy-block";
import { agentPrompt, brewCommand, cliLinkCommand, terminalCommand } from "@/lib/install";
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
      <CopyBlock text={brewCommand} label="Homebrew install command" />
      <p>It installs the same signed app, which keeps itself up to date.</p>
      <h2>Install from the Terminal</h2>
      <p>
        Without Homebrew, this downloads the latest release, checks Apple’s
        signature, installs it in Applications, and opens it. It stops if On
        Hand is already installed; installed copies update themselves.
      </p>
      <CopyBlock text={terminalCommand} label="Terminal install command" />
      <h2>Install with a coding agent</h2>
      <p>
        Paste this into Claude Code, Codex, or another coding agent. It checks
        your macOS version, asks before replacing an existing copy, verifies the
        download, and opens On Hand.
      </p>
      <CopyBlock text={agentPrompt} label="coding agent prompt" />
      <h2>Everyday use</h2>
      <p>
        Press <strong>⌘⇧Space</strong> to open history. Search for a word or
        app, choose a clip with the arrow keys, and press Return to copy it.
        Switch to your destination and paste with <strong>⌘V</strong>.
      </p>
      <p>
        Use <strong>⌘1–9</strong> to copy a numbered result, <strong>⌘O</strong>{" "}
        to preview, <strong>⌘P</strong> to pin, and <strong>⌘F</strong> to
        search. <strong>⌃⌥⌘⌫</strong> forgets your last copy. The full list is
        under ⋯ › Keyboard Shortcuts.
      </p>
      <p>
        Turn on ⋯ › Keep Window Open While Switching Apps to reuse several clips
        across apps. In Settings, you can change the shortcut, choose excluded
        apps, adjust retention, turn on launch at login, or clear history.
      </p>
      <h2>Use it from the command line</h2>
      <p>
        The <code>onhand</code> command lets you or an AI agent search history,
        read a clip, copy it back, or pause capture from Terminal. Homebrew
        links it for you. If you downloaded the app, link it once:
      </p>
      <CopyBlock text={cliLinkCommand} label="link command" />
      <p>
        See <Link href="/features/command-line">every command</Link> and the
        line to add to your agent’s instructions.
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
