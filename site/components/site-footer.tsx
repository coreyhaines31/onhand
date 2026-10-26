import Link from "next/link";
import { sourceUrl } from "@/lib/site";

type SiblingApp = {
  name: string;
  url: string;
  tagline: string;
};

const siblingApps: SiblingApp[] = [
  { name: "Green Room", url: "https://greenroomformac.com", tagline: "Check your camera, mic, and speakers" },
  { name: "WiFi or ISP", url: "https://wifiorisp.com", tagline: "Is slow internet your Wi-Fi or your ISP?" },
  { name: "Midnight Oil", url: "https://midnightoil.app", tagline: "Keep your Mac awake" },
  { name: "Disk Forecast", url: "https://diskforecast.com", tagline: "Know before your Mac runs out of space" },
  { name: "Spare", url: "https://spareformac.com", tagline: "See what's using your Mac" },
  { name: "Coat Check", url: "https://coatcheckformac.com", tagline: "Reach the menu bar icons the notch hides" },
  { name: "Fuel Gauge", url: "https://fuelgauge.app", tagline: "Know if you'll make it to reset" },
];

export default function SiteFooter() {
  return (
    <>
      <aside className="family wrap" aria-labelledby="family-heading">
        <h2 id="family-heading">More free Mac apps</h2>
        <ul>
          {siblingApps.map((app) => (
            <li key={app.url}>
              <a href={app.url}>
                <strong>{app.name}</strong>
                <span>{app.tagline}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>
      <footer className="footer wrap">
        <span>
          On Hand <span className="copyright">© 2026 Corey Haines</span>
        </span>
        <div>
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
      </footer>
    </>
  );
}
