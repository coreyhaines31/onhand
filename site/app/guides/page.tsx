import type { Metadata } from "next";
import Link from "next/link";
import DownloadCta from "@/components/download-cta";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { guides } from "@/lib/guides";

const title = "Mac Clipboard Guides";
const description =
  "Short, tested guides to copying and pasting on a Mac: paste without formatting, copy from iPhone to Mac, screenshot to the clipboard, and clipboard history.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides" },
  openGraph: { title, description, url: "/guides", images: "/opengraph-image" },
};

export default function Guides() {
  return (
    <>
      <SiteNav />
      <main className="document article wrap">
        <h1>Mac clipboard guides</h1>
        <p className="lede">
          Copy and paste is the most-used shortcut on a Mac, and it does more than most people
          know. Each guide answers one question, checked on current macOS.
        </p>
        <ul className="alternative-list">
          <li>
            <Link href="/mac-clipboard-history">
              <strong>See your clipboard history</strong>
              <span>Where the clipboard lives, and how to see more than your last copy.</span>
            </Link>
          </li>
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`}>
                <strong>{guide.h1.replace(/^How to /, "").replace(/^./, (c) => c.toUpperCase())}</strong>
                <span>{guide.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
        <DownloadCta
          title="Keep everything you copy."
          body="On Hand is a free, open-source clipboard manager for macOS 14 and later. History stays on your Mac."
        />
      </main>
      <SiteFooter />
    </>
  );
}
