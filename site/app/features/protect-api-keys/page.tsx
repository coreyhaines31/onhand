import type { Metadata } from "next";
import Link from "next/link";
import DownloadCta from "@/components/download-cta";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { siteUrl } from "@/lib/site";

const title = "Keep API Keys and Secrets Out of Your Mac Clipboard History";
const description =
  "On Hand recognizes API keys, tokens, database passwords, and card numbers when you copy them. It doesn’t save them, hides them from other clipboard managers, and clears them after 90 seconds.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/features/protect-api-keys" },
  openGraph: {
    title,
    description,
    url: "/features/protect-api-keys",
    type: "article",
    images: "/opengraph-image",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  url: `${siteUrl}/features/protect-api-keys`,
  datePublished: "2026-10-26",
  dateModified: "2026-10-26",
  author: { "@type": "Person", name: "Corey Haines" },
  image: `${siteUrl}/opengraph-image`,
};

const keyKinds = [
  "GitHub and GitLab tokens",
  "Stripe secret keys and webhook secrets",
  "AWS access keys",
  "OpenAI and Anthropic API keys",
  "Google API keys and OAuth client secrets",
  "Slack tokens",
  "npm and PyPI tokens",
  "Hugging Face tokens",
  "SendGrid and Mailgun API keys",
  "Shopify, DigitalOcean, Supabase, and Doppler tokens",
  "Linear, Notion, and Postman API keys",
  "Private keys, like SSH and TLS keys",
];

export default function ProtectApiKeys() {
  return (
    <>
      <SiteNav />
      <main className="document article wrap">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <h1>Keep secrets out of your clipboard history</h1>
        <p className="lede">
          You copy an API key to paste it into a dashboard once. A clipboard manager keeps it for
          weeks, and so does every other app that reads your clipboard. On Hand treats it
          differently.
        </p>
        <div className="answer">
          <p>
            <strong>How it works:</strong> when you copy something that looks like a secret, On Hand
            checks it on your Mac, doesn’t save it, marks the clipboard as concealed so other
            clipboard managers can skip it too, and clears it from your clipboard after 90 seconds.
            The menu bar icon shows a raised hand and tells you what it found, like “Didn’t save
            this GitHub token.”
          </p>
        </div>

        <h2>What On Hand recognizes</h2>
        <p>More than 25 kinds of keys and tokens, including:</p>
        <ul>
          {keyKinds.map((kind) => (
            <li key={kind}>{kind}</li>
          ))}
        </ul>
        <p>It also recognizes:</p>
        <ul>
          <li>
            Database URLs that include a password, like{" "}
            <code>postgresql://user:password@host/db</code>, for Postgres, MySQL, MongoDB, Redis, and
            RabbitMQ.
          </li>
          <li>
            <code>.env</code> lines that set a secret, like <code>API_SECRET=…</code> or{" "}
            <code>export DATABASE_PASSWORD=…</code>. Lines that point to another variable, like{" "}
            <code>API_KEY=$OTHER_KEY</code>, aren’t flagged.
          </li>
          <li>Card numbers that pass the card checksum, and US Social Security numbers.</li>
        </ul>
        <p>
          Each check looks for a key’s fixed prefix or structure, not a guess about random-looking
          text, so ordinary copies like UUIDs, hashes, and order numbers are kept as usual.
        </p>

        <h2>Hidden from your other clipboard apps</h2>
        <p>
          Password managers mark what they copy as concealed, and clipboard managers that follow the{" "}
          <a href="http://nspasteboard.org" rel="nofollow">
            nspasteboard.org
          </a>{" "}
          convention skip those items. When On Hand finds a secret you copied as text, it adds the
          same mark within a quarter of a second. The text you paste is unchanged.
        </p>
        <p>
          Whether another app skips it depends on that app honoring the mark and on On Hand getting
          there before the app reads your clipboard, so treat it as a second layer, not a guarantee.
        </p>

        <h2>Cleared after 90 seconds</h2>
        <p>
          Skipping history isn’t the whole story: a key also sits on the system clipboard until you
          copy something else, where any app can read it. If a secret is still on your clipboard 90
          seconds after you copied it, On Hand clears it. Copy something else first and nothing
          changes. If you paste the same key over and over, turn this off in{" "}
          <strong>Settings › Privacy</strong>.
        </p>

        <h2>Screenshots too</h2>
        <p>
          On Hand reads the text in images you copy so you can{" "}
          <Link href="/features/search-text-in-images">search your screenshots</Link>. If that text
          contains a secret, the screenshot is deleted from history as soon as it’s read.
        </p>

        <h2>Questions</h2>
        <h3>Does any of this leave my Mac?</h3>
        <p>
          No. Every check runs on your Mac, and On Hand has no account, sync, or analytics. Read the{" "}
          <Link href="/privacy">privacy policy</Link>.
        </p>
        <h3>Will it catch every secret?</h3>
        <p>
          No. It catches the formats above. Passwords you type yourself, addresses, and keys without a
          recognizable format can still be saved. Pause capture from the menu bar before copying
          something private, or press <kbd>⌃</kbd> <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⌫</kbd> to forget
          your last copy.
        </p>
        <h3>Can I keep a key in On Hand on purpose?</h3>
        <p>
          Turn off <strong>Don’t save card numbers, Social Security numbers, or secret keys</strong>{" "}
          in Settings › Privacy. For keys you reuse, a password manager is still the better home.
        </p>
        <h3>Which version do I need?</h3>
        <p>
          On Hand 1.5.1 or later, on macOS 14 or later. Installed copies update themselves.
        </p>

        <DownloadCta
          title="Copy keys without keeping them."
          body="On Hand is a free, open-source clipboard manager for macOS 14 and later. Everything stays on your Mac."
        />
      </main>
      <SiteFooter />
    </>
  );
}
