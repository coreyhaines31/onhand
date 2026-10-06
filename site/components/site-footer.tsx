import Link from "next/link";
import { sourceUrl } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="footer wrap">
      <span>
        On Hand <span className="copyright">© 2026 Corey Haines</span>
      </span>
      <div>
        <Link href="/mac-clipboard-history">Mac clipboard history</Link>
        <Link href="/alternatives">Compare</Link>
        <Link href="/install">Install</Link>
        <Link href="/privacy">Privacy</Link>
        <a href={sourceUrl}>View source code</a>
      </div>
    </footer>
  );
}
