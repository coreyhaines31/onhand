import type { Metadata } from "next";
import Link from "next/link";
import DownloadCta from "@/components/download-cta";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { alternatives } from "@/lib/alternatives";

const title = "Clipboard Manager Alternatives for Mac";
const description =
  "How On Hand, a free, open-source clipboard manager for Mac, compares with Maccy, Clipy, Paste, Raycast, Alfred, and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/alternatives" },
  openGraph: { title, description, url: "/alternatives", images: "/opengraph-image" },
};

export default function Alternatives() {
  return (
    <>
      <SiteNav />
      <main className="document article wrap">
        <h1>Compare clipboard managers for Mac</h1>
        <p className="lede">
          On Hand is a free, open-source clipboard manager that keeps your history on your Mac.
          Here’s how it compares with the apps people usually switch from.
        </p>
        <ul className="alternative-list">
          {alternatives.map((alternative) => (
            <li key={alternative.slug}>
              <Link href={`/alternatives/${alternative.slug}`}>
                <strong>{alternative.name}</strong>
                <span>{alternative.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p>
          Want a recommendation? See{" "}
          <Link href="/best-clipboard-managers-for-mac">the best clipboard managers for Mac</Link>.
          Not sure you need one? Read{" "}
          <Link href="/mac-clipboard-history">how to see clipboard history on Mac</Link>, including
          what macOS Tahoe has built in.
        </p>
        <DownloadCta
          title="Try On Hand for free."
          body="Free and open source for macOS 14 and later. Your history stays on your Mac."
        />
      </main>
      <SiteFooter />
    </>
  );
}
