import type { Metadata } from "next";
import Link from "next/link";
import DownloadCta from "@/components/download-cta";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { alternatives, checkedOn, type Comparison, findAlternative, onHand } from "@/lib/alternatives";
import { siteUrl } from "@/lib/site";

const title = "The Best Clipboard Managers for Mac in 2026";
const description =
  "An honest guide to the best clipboard managers for Mac: free and open-source picks, apps that sync with iPhone, launcher add-ons, and what macOS Tahoe has built in.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/best-clipboard-managers-for-mac" },
  openGraph: {
    title,
    description,
    url: "/best-clipboard-managers-for-mac",
    type: "article",
    images: "/opengraph-image",
  },
};

const picks: { heading: string; slug?: string; body: string }[] = [
  {
    heading: "Best free and open source: On Hand or Maccy",
    body: "Both are free, MIT-licensed, keep history on your Mac, and need macOS 14. Both search text in images. Maccy is a compact popup with years of releases behind it. On Hand is a menu bar window with previews, pinboards, and a keep-open mode, and it won’t save card numbers or secret keys. Try both; they can run side by side.",
  },
  {
    heading: "Best if you also use an iPhone or iPad: Paste",
    slug: "paste",
    body: "Paste syncs your clipboard across Mac, iPhone, and iPad through iCloud, and it’s the most polished app here. It’s a subscription, from $2.49 a month on its website, with a lifetime option on the App Store.",
  },
  {
    heading: "Best one-time purchase with sync: PastePal",
    slug: "pastepal",
    body: "PastePal covers Mac, iPhone, and iPad for a one-time $14.99 Pro unlock, with collections and dozens of text transforms for developers.",
  },
  {
    heading: "Best if you already use a launcher: Raycast or Alfred",
    slug: "raycast-clipboard-history",
    body: "If Raycast or Alfred is already open all day, use its clipboard history. Raycast’s is free, with OCR, but Raycast 2 needs macOS Tahoe and Apple silicon. Alfred’s needs the paid Powerpack.",
  },
  {
    heading: "Best for reusable snippets: Clipy",
    slug: "clipy",
    body: "Clipy’s snippet folders are great for boilerplate you paste often. It’s free and open source, and it shipped its first release in years in June 2026.",
  },
  {
    heading: "Built in: Spotlight on macOS Tahoe",
    body: "macOS Tahoe 26 can show recent clipboard items in Spotlight. Turn it on, then press ⌘Space and ⌘4. Items expire, 8 hours by default, and you can’t pin anything, so it’s best for “what did I just copy?”",
  },
];

const tableColumns = [
  { label: "Price", value: (c: Comparison) => c.price },
  { label: "Source code", value: (c: Comparison) => c.source },
  { label: "Search text in images", value: (c: Comparison) => c.ocr },
  { label: "Sync", value: (c: Comparison) => c.sync },
  { label: "Requires", value: (c: Comparison) => c.requires },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  url: `${siteUrl}/best-clipboard-managers-for-mac`,
  datePublished: "2026-10-06",
  dateModified: "2026-10-07",
  author: { "@type": "Person", name: "Corey Haines" },
  image: `${siteUrl}/opengraph-image`,
};

export default function BestClipboardManagers() {
  const rows = [{ name: "On Hand", slug: undefined, comparison: onHand }, ...alternatives];
  return (
    <>
      <SiteNav />
      <main className="document article wrap">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <h1>The best clipboard managers for Mac</h1>
        <p className="lede">
          A clipboard manager remembers everything you copy, so you can search it and copy it back
          later. Here’s which one to pick, depending on how you work.
        </p>
        <p className="fine">
          We make On Hand, so we’re not neutral. We’ve tried to be fair: every fact below was
          checked on {checkedOn} against each app’s own site, release notes, or App Store listing,
          and we say when another app is the better fit.
        </p>

        <h2>Our picks</h2>
        {picks.map((pick) => {
          const alternative = pick.slug ? findAlternative(pick.slug) : undefined;
          return (
            <div key={pick.heading}>
              <h3>{pick.heading}</h3>
              <p>
                {pick.body}
                {alternative && (
                  <>
                    {" "}
                    <Link href={`/alternatives/${alternative.slug}`}>
                      Compare On Hand and {alternative.name}
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          );
        })}

        <h2>Every option side by side</h2>
        <div className="table-scroll">
          <table className="roundup">
            <thead>
              <tr>
                <th scope="col">App</th>
                {tableColumns.map((column) => (
                  <th scope="col" key={column.label}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">
                    {row.slug ? <Link href={`/alternatives/${row.slug}`}>{row.name}</Link> : row.name}
                  </th>
                  {tableColumns.map((column) => (
                    <td key={column.label}>{column.value(row.comparison)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>What to look for</h2>
        <ul>
          <li>
            <strong>Where your history lives.</strong> Your clipboard sees passwords, addresses, and
            private messages. Decide whether you want it synced to the cloud or kept on one Mac.
          </li>
          <li>
            <strong>Password manager exclusions.</strong> Good clipboard managers skip items that
            password managers mark as concealed, and let you exclude apps yourself.
          </li>
          <li>
            <strong>Keyboard speed.</strong> You’ll use it dozens of times a day. Check how fast you
            can open it, search, and copy without the mouse.
          </li>
          <li>
            <strong>Images and links.</strong> Some apps are text-only. If you copy screenshots,
            make sure images are kept, and ideally searchable by the text in them.
          </li>
          <li>
            <strong>Price and maintenance.</strong> A free app that’s actively maintained beats a
            paid one that stopped getting updates.
          </li>
        </ul>
        <p>
          New to this? Start with{" "}
          <Link href="/mac-clipboard-history">how to see clipboard history on Mac</Link>.
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
