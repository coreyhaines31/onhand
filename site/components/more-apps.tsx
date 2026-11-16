import Image from "next/image";
import { familyApps } from "@/lib/family";

export default function MoreApps() {
  return (
    <section className="bx-section" id="apps">
      <div className="bx-wrap">
        <span className="bx-eyebrow">From the same bench</span>
        <h2>More free Mac apps</h2>
        <p className="bx-intro">
          Small, free menu bar apps that each answer one question about your Mac. Same look, same
          rules: nothing leaves your Mac, no account, no subscription.
        </p>
        <div className="bx-apps">
          {familyApps
            .filter((app) => app.key !== "hand")
            .map((app) => (
              <a key={app.key} href={app.url}>
                <Image src={`/family/${app.key}.png`} width={56} height={56} alt="" />
                <div>
                  <b>{app.name}</b>
                  <span>{app.tagline}</span>
                </div>
              </a>
            ))}
          <div className="soon">
            <Image src="/family/kill.png" width={56} height={56} alt="" />
            <div>
              <b>
                Kill Cord <em>Coming soon</em>
              </b>
              <span>See your API spend before the bill does</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
