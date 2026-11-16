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
import {
  faqs,
} from "@/lib/home";
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
      <section id="story" className="bx-section">
        <div className="bx-wrap lf-story">
          <div className="lf-head">
            <span className="bx-eyebrow">A Tuesday, 4:52 PM</span>
            <h2>The tracking link you copied at lunch is gone.</h2>
            <p>
              A customer asks where their order is. You copied the tracking link
              at 12:40, meaning to send it later. Since then you’ve copied a Git
              command, a hex color, a reply from Slack, and a screenshot of an
              error.
            </p>
            <p>
              Your Mac kept one of those: the screenshot. So you dig back through
              Mail for the shipping email, again, and copy the link a second time.
            </p>
            <p>
              With On Hand, you press <kbd>⌘⇧Space</kbd>, type “ups”, press Return,
              and paste. The link was there the whole time, along with everything
              else you copied that afternoon.
            </p>
          </div>
          <ol className="lf-timeline" aria-label="An afternoon of copies">
            <li className="lost">
              <time>12:40</time>
              <span>Tracking link from the shipping email</span>
            </li>
            <li className="lost">
              <time>1:15</time>
              <span>
                <code>git switch -c fix/checkout-total</code>
              </span>
            </li>
            <li className="lost">
              <time>2:30</time>
              <span>
                <code>#b43a9e</code> for the new banner
              </span>
            </li>
            <li className="lost">
              <time>3:05</time>
              <span>A teammate’s Slack reply you meant to reuse</span>
            </li>
            <li>
              <time>4:10</time>
              <span>A screenshot of the error. The only thing left on your clipboard.</span>
            </li>
            <li className="now">
              <time>4:52</time>
              <span>
                <kbd>⌘⇧Space</kbd>, “ups”, Return. All five are still in On Hand.
              </span>
            </li>
          </ol>
        </div>
      </section>
      <section id="problem" className="bx-section">
        <div className="bx-wrap">
          <div className="lf-head">
            <span className="bx-eyebrow">The problem</span>
            <h2>Your Mac’s clipboard holds one thing.</h2>
            <p>
              Every copy replaces the one before it. Nothing warns you, and
              nothing keeps the old one. You only notice when you need it back.
            </p>
          </div>
          <div className="lf-cards">
            <article className="bx-card">
              <blockquote>“I literally just copied that.”</blockquote>
              <p>
                You copied an address, then copied a name to go with it, and the
                address is gone. Now you’re switching windows to find it again.
              </p>
            </article>
            <article className="bx-card">
              <blockquote>“Where did I see that link?”</blockquote>
              <p>
                It was in a tab, or a message, or a doc, sometime this morning.
                You remember a word from it. You don’t remember where it lived.
              </p>
            </article>
            <article className="bx-card">
              <blockquote>“I’ll just take the screenshot again.”</blockquote>
              <p>
                Error dialogs close and receipts scroll away. A screenshot you
                copied but didn’t save is gone the moment you copy anything else.
              </p>
            </article>
          </div>
          <p className="lf-note">
            macOS Tahoe added clipboard history to Spotlight, which helps with
            “what did I just copy?” Apple’s guide covers opening and clearing it,
            and nothing about pinning clips or skipping apps. Before Tahoe, macOS
            keeps only your last copy.{" "}
            <a href="/mac-clipboard-history">How clipboard history works on a Mac</a>
          </p>
        </div>
      </section>
      <section id="features" className="bx-section" aria-labelledby="features-heading">
        <div className="bx-wrap">
          <div className="lf-head">
            <span className="bx-eyebrow">What it does</span>
            <h2 id="features-heading">A clipboard manager for Mac that remembers for you.</h2>
          </div>
          <div className="bx-grid features">
            <article className="bx-card">
              <Search size={25} strokeWidth={1.5} />
              <h3>Find the link you lost.</h3>
              <p>
                Search a word you remember or the app you copied from, even{" "}
                <a href="/features/search-text-in-images">text inside a screenshot</a>.
                Filter by type and preview a clip before you copy it back.
              </p>
            </article>
            <article className="bx-card">
              <Pin size={25} strokeWidth={1.5} />
              <h3>Keep the clips you reuse.</h3>
              <p>
                Pin a reply, an address, or a useful snippet, and group pins into
                boards. They stay until you remove them. Leave history open to
                reuse clips across apps.
              </p>
            </article>
            <article className="bx-card">
              <Keyboard size={25} strokeWidth={1.5} />
              <h3>Keep your hands on the keys.</h3>
              <p>
                Press <kbd>⌘⇧Space</kbd> to open history. Choose a clip with the
                arrow keys and Return, or use <kbd>⌘1–9</kbd>. Paste with{" "}
                <kbd>⌘V</kbd>.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section id="how" className="bx-section">
        <div className="bx-wrap">
          <div className="lf-head">
            <span className="bx-eyebrow">How it works</span>
            <h2>Three steps, then you just copy.</h2>
            <p>
              There’s nothing new to learn. You copy the way you always have. On
              Hand keeps each copy, and brings any of them back when you ask.
            </p>
          </div>
          <ol className="lf-steps">
            <li>
              <h3>Install it</h3>
              <p>
                Download the app and drag it to Applications, or run{" "}
                <code>brew install --cask coreyhaines31/tap/onhand</code>. A
                clipboard icon appears in your menu bar.
              </p>
            </li>
            <li>
              <h3>Choose “Start keeping my clipboard”</h3>
              <p>
                On Hand saves what you copy from that moment on. It never imports
                what was on your clipboard before you said yes.
              </p>
            </li>
            <li>
              <h3>Copy as usual, then press ⌘⇧Space</h3>
              <p>
                Type a word to search, press Return to copy a clip back, and
                paste with <kbd>⌘V</kbd>. On Hand switches you back to the app you
                were in.
              </p>
            </li>
          </ol>
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
      <MakerNote />
      <MoreApps />
      <SiteFooter />
    </main>
  );
}
