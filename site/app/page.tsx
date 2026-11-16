import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  Keyboard,
  LockKeyhole,
  Pin,
  Search,
} from "lucide-react";
import ClipboardDemo from "@/components/clipboard-demo";
import CopyBlock from "@/components/copy-block";
import CopyPromptButton from "@/components/copy-prompt-button";
import MakerNote from "@/components/maker-note";
import MoreApps from "@/components/more-apps";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { faqs } from "@/lib/home";
import { agentInstruction, agentPrompt, brewCommand, cliExamples } from "@/lib/install";
import { downloadUrl as download, siteUrl, sourceUrl as source } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "On Hand — Free, Open-Source Clipboard Manager for Mac",
    description:
      "Copy it once. Find it again. A native clipboard manager that keeps your history on your Mac.",
    url: "/",
    images: { url: "/og-video.png", width: 1200, height: 630, alt: "On Hand — free, open-source clipboard manager for Mac" },
    // iMessage and Discord autoplay this loop inline; everywhere else shows the still above.
    videos: {
      url: `${siteUrl}/og.mp4`,
      secureUrl: `${siteUrl}/og.mp4`,
      type: "video/mp4",
      width: 1200,
      height: 630,
    },
  },
  twitter: { card: "summary_large_image", images: "/og-video.png" },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "On Hand",
    description:
      "A free, open-source clipboard manager for Mac that keeps your clipboard history of text, links, and images on your Mac.",
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    operatingSystem: "macOS 14 or later",
    applicationCategory: "UtilitiesApplication",
    featureList: [
      "Searchable history of copied text, links, and images",
      "Search the text inside copied screenshots",
      "Pinned clips grouped into boards",
      "Skips card numbers, Social Security numbers, and secret keys",
      "onhand command-line tool for scripts and AI agents",
    ],
    downloadUrl: `${siteUrl}${download}`,
    license: "https://opensource.org/licenses/MIT",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Person", name: "Corey Haines" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <SiteNav>
        <section className="hero bx-hero-grid">
          <div className="hero-copy">
            <h1 className="bx-badge">
              <i aria-hidden="true" />
              Free, open-source clipboard manager for Mac
            </h1>
            <p className="headline">
              Copy it once.
              <br />
              <span>Find it again.</span>
            </p>
            <p className="bx-lede">
              Bring back the text, links, and images you copied earlier. On Hand
              keeps them in your Mac’s menu bar, ready to reuse.
            </p>
            <div className="bx-cta">
              <a className="bx-btn" href={download}>
                <ArrowDown size={18} aria-hidden />
                Download for free
              </a>
              <a className="bx-btn sec" href={source}>
                <Code2 size={18} aria-hidden />
                View source code
              </a>
            </div>
            <CopyPromptButton text={agentPrompt} />
            <p className="bx-meta download-note">
              Free · Apple silicon and Intel · macOS 14+
              <br />
              Signed and notarized by Apple. <a href="/install">Installation guide</a>
            </p>
            <p className="hero-note">
              No account. No subscription. Stored on your Mac.
            </p>
          </div>
          <div className="hero-visual">
            <div className="bx-mount">
              <span className="bx-screw" />
              <span className="bx-screw" />
              <span className="bx-screw" />
              <span className="bx-screw" />
              <ClipboardDemo />
            </div>
            <p className="demo-caption">
              Try searching, pinning, or previewing a sample clip.
            </p>
          </div>
        </section>
      </SiteNav>
      <section id="features" className="bx-section" aria-label="Features">
        <div className="bx-wrap bx-grid features">
          <article className="bx-card">
            <Search size={25} strokeWidth={1.5} />
            <h2>Find the link you lost.</h2>
            <p>
              Search a word you remember or the app you copied from, even{" "}
              <a href="/features/search-text-in-images">text inside a screenshot</a>.
              Filter by type and preview a clip before you copy it back.
            </p>
          </article>
          <article className="bx-card">
            <Pin size={25} strokeWidth={1.5} />
            <h2>Keep the clips you reuse.</h2>
            <p>
              Pin a reply, an address, or a useful snippet, and group pins into
              boards. They stay until you remove them. Leave history open to
              reuse clips across apps.
            </p>
          </article>
          <article className="bx-card">
            <Keyboard size={25} strokeWidth={1.5} />
            <h2>Keep your hands on the keys.</h2>
            <p>
              Press <kbd>⌘⇧Space</kbd> to open history. Choose a clip with the
              arrow keys and Return, or use <kbd>⌘1–9</kbd>. Paste with{" "}
              <kbd>⌘V</kbd>.
            </p>
          </article>
        </div>
      </section>
      <section className="bx-band privacy">
        <div className="bx-wrap">
          <LockKeyhole size={30} strokeWidth={1.4} aria-hidden />
          <h2>Your history. On your Mac.</h2>
          <p>
            Your clips stay local, with no app analytics or clipboard uploads.
            Card numbers, Social Security numbers, and secret keys aren’t saved,
            and they’re cleared from your clipboard after 90 seconds.
            Pause capture anytime, choose apps to exclude, and set how long
            unpinned clips stay.
          </p>
          <a href="/privacy">
            Read the privacy policy <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>
      </section>
      <section id="install" className="bx-section" aria-label="Install from the command line">
        <div className="bx-wrap quick-install">
          <div>
            <h2>Install in one line.</h2>
            <p>
              Use Homebrew, or paste the prompt into Claude Code, Codex, or
              another coding agent. It checks your Mac, verifies the download, and
              opens On Hand.
            </p>
            <a href="/install">
              More install options <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
          <div>
            <h3>Homebrew</h3>
            <CopyBlock text={brewCommand} label="Homebrew install command" />
            <h3>Coding agent prompt</h3>
            <CopyBlock text={agentPrompt} label="coding agent prompt" />
          </div>
        </div>
      </section>
      <section id="agents" className="bx-section" aria-label="Use On Hand from AI agents">
        <div className="bx-wrap quick-install">
          <div>
            <h2>Let your agent find it.</h2>
            <p>
              The <code>onhand</code> command lets Claude Code, Codex, or any
              script search your history, read the text in a screenshot, and
              copy a clip back, right from Terminal. Add one line to your
              agent’s instructions and it knows where to look.
            </p>
            <a href="/features/command-line">
              How the command works <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
          <div>
            <h3>Add to CLAUDE.md or AGENTS.md</h3>
            <CopyBlock text={agentInstruction} label="agent instruction" />
            <h3>Or run it yourself</h3>
            <CopyBlock text={cliExamples} label="onhand examples" />
          </div>
        </div>
      </section>
      <MakerNote />
      <section id="questions" className="bx-section">
        <div className="bx-wrap faq">
          <h2>Before you download.</h2>
          <div className="questions bx-faq">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>
                  {faq.answer}
                  {faq.link && (
                    <>
                      {" "}
                      <a href={faq.link.href}>{faq.link.label}</a>.
                    </>
                  )}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="bx-section" aria-label="Download On Hand">
        <div className="bx-wrap download-row">
          <div>
            <h2>Free. Open source. On your Mac.</h2>
            <p>
              Free for macOS 14+.{" "}
              <a href="/install">Installation guide</a>
            </p>
          </div>
          <div className="download-actions">
            <a className="bx-btn" href={download}>
              <ArrowDown size={18} aria-hidden />
              Download for free
            </a>
            <a className="bx-btn sec" href={source}>
              <Code2 size={18} aria-hidden />
              View source code
            </a>
          </div>
        </div>
      </section>
      <MoreApps />
      <SiteFooter />
    </main>
  );
}
