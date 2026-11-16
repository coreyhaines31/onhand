import Image from "next/image";
import Link from "next/link";
import { familyApps } from "@/lib/family";
import { sourceUrl } from "@/lib/site";

export default function SiteFooter() {
  return (
    <>
      <aside className="bx-family" aria-labelledby="family-heading">
        <div className="bx-wrap">
          <h2 id="family-heading" className="bx-eyebrow">
            More free Mac apps
          </h2>
          <ul>
            {familyApps.map((app) => (
              <li key={app.key}>
                <a
                  href={app.url}
                  title={app.tagline}
                  aria-current={app.key === "hand" ? "page" : undefined}
                >
                  <Image src={`/family/${app.key}.png`} width={56} height={56} alt="" />
                  {app.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <footer className="bx-footer">
        <div className="bx-wrap">
          <span>
            On Hand <span className="copyright">© 2026 Corey Haines</span>
          </span>
          <div className="footer-links">
            <Link href="/mac-clipboard-history">Mac clipboard history</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/features/search-text-in-images">Search screenshots</Link>
            <Link href="/features/command-line">Command line</Link>
            <Link href="/features/protect-api-keys">Protect API keys</Link>
            <Link href="/best-clipboard-managers-for-mac">Best clipboard managers</Link>
            <Link href="/alternatives">Compare</Link>
            <Link href="/install">Install</Link>
            <Link href="/privacy">Privacy</Link>
            <a href={sourceUrl}>View source code</a>
          </div>
        </div>
      </footer>
    </>
  );
}
