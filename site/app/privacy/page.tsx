import Link from "next/link";
export default function Privacy() {
  return (
    <main className="document wrap">
      <Link className="back" href="/">
        ← Back to On Hand
      </Link>
      <h1>Your clipboard stays local.</h1>
      <p>On Hand 0.1.0 · Updated October 5, 2026</p>
      <h2>What the app stores</h2>
      <p>
        On Hand stores text, links, and images locally in your Mac’s Application
        Support folder. The app does not upload clipboard contents, collect
        analytics, or require an account. History is stored in a local SQLite
        database protected by your user account’s file permissions; it is not
        separately encrypted. FileVault can protect your Mac’s disk.
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
        by default. These are conventions, not guarantees: unmarked passwords
        and secrets can still be saved. Pause capture before copying sensitive
        information. Clearing On Hand’s history does not clear the macOS system
        clipboard or backups.
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
        This local preview does not check for updates. Signed releases may
        contact an update server through Sparkle. Any future sync service will
        be optional and will have its own clearly described data practices.
      </p>
    </main>
  );
}
