import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  Keyboard,
  LockKeyhole,
  Pin,
  Search,
} from "lucide-react";
import Image from "next/image";
import ClipboardDemo from "@/components/clipboard-demo";

const source = "https://github.com/coreyhaines31/onhand";
const download = "https://github.com/coreyhaines31/onhand/releases/download/v1.0.0/OnHand-1.0.0.zip";

export default function Home() {
  return (
    <main>
      <nav className="nav wrap" aria-label="Main navigation">
        <a className="brand" href="#" aria-label="On Hand home">
          <span className="mark">
            <Image src="/brand-symbol.svg" width={29} height={29} alt="" />
          </span>
          On Hand
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#questions">Questions</a>
          <a href={source}>
            View source code <ArrowUpRight size={12} />
          </a>
        </div>
      </nav>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">Free, open-source clipboard manager for Mac</p>
          <h1>
            Copy it once.
            <br />
            <span>Find it again.</span>
          </h1>
          <p className="intro">
            Bring back the text, links, and images you copied earlier. On Hand
            keeps them in your Mac’s menu bar, ready to reuse.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={download} download>
              <ArrowDown size={18} />
              Download for free
            </a>
            <a className="button secondary" href={source}>
              <Code2 size={18} />
              View source code
            </a>
          </div>
          <p className="download-note">
            Free · Apple silicon and Intel · macOS 14+
            <br />
            Signed and notarized by Apple. <a href="/install">Installation guide</a>
          </p>
          <p className="hero-note">
            No account. No subscription. Stored on your Mac.
          </p>
        </div>
        <div className="hero-visual">
          <ClipboardDemo />
          <p className="demo-caption">
            Try searching, pinning, or previewing a sample clip.
          </p>
        </div>
      </section>
      <section id="features" className="features wrap" aria-label="Features">
        <article>
          <Search size={25} strokeWidth={1.5} />
          <h2>Find the link you lost.</h2>
          <p>
            Search a word you remember or the app you copied from. Filter by
            type and preview a clip before you copy it back.
          </p>
        </article>
        <article>
          <Pin size={25} strokeWidth={1.5} />
          <h2>Keep the clips you reuse.</h2>
          <p>
            Pin a reply, an address, or a useful snippet. It stays saved until
            you remove it. Leave history open to reuse clips across apps.
          </p>
        </article>
        <article>
          <Keyboard size={25} strokeWidth={1.5} />
          <h2>Keep your hands on the keys.</h2>
          <p>
            Press <kbd>⌘⇧Space</kbd> to open history. Choose a clip with the
            arrow keys and Return, or use <kbd>⌘1–9</kbd>. Paste with{" "}
            <kbd>⌘V</kbd>.
          </p>
        </article>
      </section>
      <section className="privacy wrap">
        <LockKeyhole size={30} strokeWidth={1.4} />
        <h2>Your history. On your Mac.</h2>
        <p>
          Your clips stay local, with no app analytics or clipboard uploads.
          Pause capture anytime, choose apps to exclude, and set how long
          unpinned clips stay.
        </p>
        <a href="/privacy">
          Read the privacy policy <ArrowUpRight size={14} />
        </a>
      </section>
      <section id="questions" className="faq wrap">
        <h2>Before you download.</h2>
        <div className="questions">
          <details>
            <summary>Is On Hand free?</summary>
            <p>
              Yes. On Hand is free, with no account, trial, or
              subscription. The local app’s source is available under the MIT
              license. Optional paid services may come later.
            </p>
          </details>
          <details>
            <summary>Will it run on my Mac?</summary>
            <p>
              On Hand supports Apple silicon and Intel Macs running macOS 14 or
              later. It is signed and notarized by Apple. Follow the{" "}
              <a href="/install">installation guide</a> to set it up.
            </p>
          </details>
          <details>
            <summary>What does On Hand save?</summary>
            <p>
              Text, web links, and images you copy after turning on capture.
              History holds up to 500 clips or 50 MB. Unpinned clips expire
              after seven days by default. Text over 1 MB, images over 10 MB,
              and copied files are skipped; rich text is saved as plain text.
            </p>
          </details>
          <details>
            <summary>Does it capture passwords?</summary>
            <p>
              On Hand skips concealed and temporary clipboard items and excludes
              several common password managers by default. Not every app marks
              secrets, so pause capture before copying sensitive information.
            </p>
          </details>
          <details>
            <summary>Does it sync between Macs?</summary>
            <p>
              No. Your history stays on the Mac where you copied it. On Hand
              has no cloud sync.
            </p>
          </details>
          <details>
            <summary>Can I inspect or build the code?</summary>
            <p>
              Yes. <a href={source}>View the MIT-licensed source on GitHub</a>
              {" "}to inspect the code, build the app, report an issue, or contribute.
            </p>
          </details>
        </div>
      </section>
      <section className="download-row wrap" aria-label="Download On Hand">
        <div>
          <h2>Free. Open source. On your Mac.</h2>
          <p>
            Free for macOS 14+.{" "}
            <a href="/install">Installation guide</a>
          </p>
        </div>
        <div className="download-actions">
          <a className="button primary" href={download} download>
            <ArrowDown size={18} />
            Download for free
          </a>
          <a className="button secondary" href={source}>
            <Code2 size={18} />
            View source code
          </a>
        </div>
      </section>
      <footer className="footer wrap">
        <span>
          On Hand <span className="copyright">© 2026 Corey Haines</span>
        </span>
        <div>
          <a href="/install">Install</a>
          <a href="/privacy">Privacy</a>
          <a href={source}>View source code</a>
        </div>
      </footer>
    </main>
  );
}
