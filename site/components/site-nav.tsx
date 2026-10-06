import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sourceUrl } from "@/lib/site";

export default function SiteNav() {
  return (
    <nav className="nav wrap" aria-label="Main navigation">
      <Link className="brand" href="/" aria-label="On Hand home">
        <span className="mark">
          <Image src="/brand-symbol.svg" width={29} height={29} alt="" />
        </span>
        On Hand
      </Link>
      <div className="nav-links">
        <Link href="/#features">Features</Link>
        <Link href="/alternatives">Compare</Link>
        <a href={sourceUrl}>
          View source code <ArrowUpRight size={12} />
        </a>
      </div>
    </nav>
  );
}
