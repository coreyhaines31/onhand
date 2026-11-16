import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { sourceUrl } from "@/lib/site";

export default function SiteNav({ children }: { children?: ReactNode }) {
  return (
    <div className={children ? "bx-hero" : "bx-hero site-top"}>
      <div className="bx-wrap">
        <nav className="bx-nav" aria-label="Main navigation">
          <Link className="bx-brand" href="/" aria-label="On Hand home">
            <Image src="/on-hand-icon.png" width={32} height={32} alt="" priority />
            On Hand
          </Link>
          <div className="nav-links">
            <Link href="/#features">Features</Link>
            <Link href="/alternatives">Compare</Link>
            <a href={sourceUrl}>
              View source code <ArrowUpRight size={12} aria-hidden />
            </a>
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}
