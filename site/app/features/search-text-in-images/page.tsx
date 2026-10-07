import type { Metadata } from "next";
import Link from "next/link";
import DownloadCta from "@/components/download-cta";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { siteUrl } from "@/lib/site";

const title = "Search Text in Screenshots and Copied Images on Mac";
const description =
  "On Hand reads the text in every image you copy, on your Mac, so you can find a screenshot later by searching a word in it and copy the text out.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/features/search-text-in-images" },
  openGraph: {
    title,
    description,
    url: "/features/search-text-in-images",
    type: "article",
    images: "/opengraph-image",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  url: `${siteUrl}/features/search-text-in-images`,
  datePublished: "2026-10-07",
  dateModified: "2026-10-07",
  author: { "@type": "Person", name: "Corey Haines" },
  image: `${siteUrl}/opengraph-image`,
};

export default function SearchTextInImages() {
  return (
    <>
      <SiteNav />
      <main className="document article wrap">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <h1>Search the text in your screenshots</h1>
        <p className="lede">
          You copied a screenshot of an order number, an error message, or a slide. Days later you
          remember a word in it, not when you took it. On Hand finds it by that word.
        </p>
        <div className="answer">
          <p>
            <strong>How it works:</strong> when you copy an image, On Hand reads the text in it with
            Apple’s Vision framework, on your Mac. Search for any word in that text, and the image
            shows up. Open it to see and copy the text.
          </p>
        </div>

        <h2>Find a screenshot by what’s in it</h2>
        <ol>
          <li>
            Copy a screenshot or image as usual. For example, press <kbd>⌃</kbd> <kbd>⇧</kbd>{" "}
            <kbd>⌘</kbd> <kbd>4</kbd> to screenshot part of the screen straight to the clipboard.
          </li>
          <li>
            Later, press <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>Space</kbd> to open On Hand.
          </li>
          <li>Type a word you remember from the image, like an order number or a name.</li>
          <li>
            Press Return to copy the image again, or <kbd>⌘</kbd> <kbd>O</kbd> to preview it.
          </li>
        </ol>
        <p>
          Images in the list show the text they contain instead of “Copied image,” so you can tell
          screenshots apart at a glance.
        </p>

        <h2>Copy the text out of an image</h2>
        <p>
          Preview an image clip to see its text under <strong>Text in image</strong>. Select what
          you need and press <kbd>⌘</kbd> <kbd>C</kbd>.
        </p>
        <p>
          If you only need the text from one image you have open right now, macOS Live Text also
          works: in Preview, Photos, Quick Look, or Safari, drag across the text in the image and
          copy it. On Hand is for the screenshots you copied earlier and need to find again.
        </p>

        <h2>Private by design</h2>
        <ul>
          <li>Text recognition runs on your Mac. Images and their text are never uploaded.</li>
          <li>The text is stored in On Hand’s local history, next to the image.</li>
          <li>
            If a screenshot contains a card number, Social Security number, or secret key, On Hand
            deletes it from history instead of keeping it. Pinned images are kept, but their text
            isn’t searchable.
          </li>
        </ul>
        <p>
          Read the <Link href="/privacy">privacy policy</Link> for details.
        </p>

        <h2>Questions</h2>
        <h3>Which images does it read?</h3>
        <p>
          Every image you copy after capture is on, up to 10 MB, plus images already in your
          history when you install On Hand 1.1.0.
        </p>
        <h3>What kinds of text does it read?</h3>
        <p>
          It uses the Vision text recognition built into macOS and reads English text best, especially
          printed and on-screen text like screenshots, receipts, and slides. Results for handwriting
          vary.
        </p>
        <h3>Which Macs does it run on?</h3>
        <p>
          On Hand 1.1.0 and later, on Apple silicon and Intel Macs running macOS 14 or later.
        </p>

        <DownloadCta
          title="Find any screenshot by the words in it."
          body="On Hand is a free, open-source clipboard manager for macOS 14 and later. Everything stays on your Mac."
        />
      </main>
      <SiteFooter />
    </>
  );
}
