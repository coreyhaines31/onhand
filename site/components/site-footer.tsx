import Image from "next/image";
import Link from "next/link";
import { sourceUrl } from "@/lib/site";

type FamilyApp = {
  key: string;
  name: string;
  url: string;
  tagline: string;
};

const familyApps: FamilyApp[] = [
  { key: "fuel", name: "Fuel Gauge", url: "https://fuelgauge.app", tagline: "Know if you'll make it to reset" },
  { key: "spare", name: "Spare", url: "https://spareformac.com", tagline: "See what's using your Mac" },
  { key: "disk", name: "Disk Forecast", url: "https://diskforecast.com", tagline: "Know before your Mac runs out of space" },
  { key: "oil", name: "Midnight Oil", url: "https://midnightoil.app", tagline: "Keep your Mac awake" },
  { key: "wifi", name: "WiFi or ISP", url: "https://wifiorisp.com", tagline: "Is slow internet your Wi-Fi or your ISP?" },
  { key: "green", name: "Green Room", url: "https://greenroomformac.com", tagline: "Check your camera, mic, and speakers" },
  { key: "hand", name: "On Hand", url: "https://onhandformac.com", tagline: "Copy it once. Find it again." },
  { key: "coat", name: "Coat Check", url: "https://coatcheckformac.com", tagline: "Reach the menu bar icons the notch hides" },
];

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
