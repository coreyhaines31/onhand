import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ComparisonTable from "@/components/comparison-table";
import DownloadCta from "@/components/download-cta";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { alternatives, checkedOn, findAlternative } from "@/lib/alternatives";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return alternatives.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const alternative = findAlternative((await params).slug);
  if (!alternative) return {};
  const title = `${alternative.name} Alternative for Mac: On Hand vs ${alternative.name}`;
  const description = `Compare ${alternative.name} and On Hand, a free, open-source clipboard manager for Mac. Price, features, and when to choose each.`;
  const url = `/alternatives/${alternative.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: "/opengraph-image" },
  };
}

export default async function AlternativePage({ params }: Props) {
  const alternative = findAlternative((await params).slug);
  if (!alternative) notFound();
  const { name } = alternative;
  const others = alternatives.filter((other) => other.slug !== alternative.slug);

  return (
    <>
      <SiteNav />
      <main className="document article wrap">
        <Link className="back" href="/alternatives">
          ← All clipboard managers
        </Link>
        <h1>A free {name} alternative for Mac</h1>
        <p className="lede">
          On Hand vs {name}: what each is good at, what they cost, and which one fits how you copy
          and paste.
        </p>
        <div className="answer">
          <p>
            <strong>The short version:</strong> {alternative.verdict}
          </p>
        </div>

        <h2>On Hand vs {name} at a glance</h2>
        <ComparisonTable alternative={alternative} />
        <p className="fine">
          Checked {checkedOn} against {name}’s own site, release notes, and App Store listing.
          Prices and features change, so check before you buy. Something out of date?{" "}
          <a href="https://github.com/coreyhaines31/onhand/issues">Open an issue</a>.
        </p>

        <h2>Choose {name} if</h2>
        <ul>
          {alternative.chooseThem.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>

        <h2>Choose On Hand if</h2>
        <ul>
          {alternative.chooseOnHand.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>

        <h2>Is {name} still maintained?</h2>
        <p>{alternative.status}</p>

        <h2>Switching from {name}</h2>
        <p>
          On Hand starts fresh. It doesn’t import history from {name}, so pin anything you want to
          keep after you copy it again. Both apps can run at the same time while you try On Hand;
          give them different shortcuts. On Hand opens with <kbd>⌘</kbd> <kbd>⇧</kbd>{" "}
          <kbd>Space</kbd>, and you can change that in Settings.
        </p>

        <DownloadCta
          title={`Try On Hand alongside ${name}.`}
          body="Free and open source for macOS 14 and later. Your history stays on your Mac."
        />

        <h2>Sources</h2>
        <ul className="sources">
          {alternative.sources.map((source) => (
            <li key={source}>
              <a href={source} rel="nofollow">
                {source.replace(/^https:\/\/(www\.)?/, "")}
              </a>
            </li>
          ))}
        </ul>

        <h2>Other alternatives</h2>
        <ul className="other-alternatives">
          {others.map((other) => (
            <li key={other.slug}>
              <Link href={`/alternatives/${other.slug}`}>{other.name} alternative</Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
