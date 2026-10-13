import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "On Hand keeps your clipboard history on your Mac. What the app stores, what you control, and what the website collects.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "On Hand privacy policy", url: "/privacy", images: "/opengraph-image" },
};

export default function Privacy() {
  return (
    <>
      <SiteNav />
      <main className="document wrap">
        <h1>Your clipboard stays local.</h1>
        <p>On Hand 1.4.0 · Updated October 13, 2026</p>
        <h2>What the app stores</h2>
        <p>
          On Hand stores text, links, and images locally in your Mac’s Application
          Support folder. The app does not upload clipboard contents, collect
          analytics, or require an account. History is stored in a local SQLite
          database protected by your user account’s file permissions; it is not
          separately encrypted. FileVault can protect your Mac’s disk.
        </p>
        <p>
          To make screenshots searchable, On Hand reads the text in copied images
          with Apple’s on-device Vision framework. Recognition happens on your
          Mac, and the text is stored in the same local database as the image.
        </p>
        <h2>What you control</h2>
        <p>
          Recording begins after you choose “Start keeping my clipboard.” You can
          pause it, choose apps to exclude, delete individual clips, or clear
          history from Settings. Unpinned clips expire after seven days by
          default. You can choose a different retention period. Pinned clips stay
          until removed.
        </p>
        <h2>Sensitive information</h2>
        <p>
          On Hand ignores clipboard items marked concealed, transient, or
          automatically generated, and excludes several common password managers
          by default. It also checks what you copy, on your Mac, for card numbers,
          US Social Security numbers, and common secret keys, and doesn’t save
          them. If a screenshot’s text contains one, the image is deleted as soon
          as its text is read. You can turn this off in Settings.
        </p>
        <p>
          These checks are conventions and patterns, not guarantees: passwords
          you type yourself, addresses, and other private details can still be
          saved. Pause capture before copying sensitive information, or press
          ⌃⌥⌘⌫ to forget your last copy, which also clears the system clipboard.
          Clearing On Hand’s history does not clear backups.
        </p>
        <h2>Sent messages</h2>
        <p>
          Sent messages are off until you turn them on in Settings. Then, in the
          apps you choose, On Hand uses macOS Accessibility access to read the
          message box you’re typing in, and saves its text when it empties after
          you send. It doesn’t record keystrokes, doesn’t watch other apps, and
          skips password fields. Sent messages are stored, checked for sensitive
          information, and expire like any other clip. A message you delete all
          at once may also be saved; delete it from history like any clip.
        </p>
        <h2>The onhand command</h2>
        <p>
          On Hand 1.3.0 and later include the <code>onhand</code> command, which
          reads and changes your history from Terminal. It works only on your Mac
          and sends nothing anywhere. If you let an AI agent, like Claude Code or
          Codex, run it, whatever the agent reads is sent to that agent’s AI
          provider, like any other file it opens. <code>onhand search</code> shows
          one-line previews; the full text of a clip comes only from{" "}
          <code>onhand get</code>.
        </p>
        <h2>What the website collects</h2>
        <p>
          The website uses Fathom Analytics to measure visits and page views without
          cookies. See{" "}
          <a href="https://usefathom.com/privacy">Fathom’s privacy policy</a> for
          details. Vercel may process request information to serve the website.
          The site uses system fonts. The interactive demo uses sample clips; it only writes a sample
          to your clipboard when you click one. It never reads your clipboard.
        </p>
        <h2>Updates and future services</h2>
        <p>
          On Hand uses Sparkle to check for signed app updates hosted on GitHub.
          Update checks request the release feed; they do not upload your clipboard
          history. Automatic checks are optional, and you can check manually in
          Settings. Any future sync service will be optional and will describe its
          data practices before you enable it.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
