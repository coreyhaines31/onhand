import {
  ArrowDown,
  ArrowUpRight,
  Copy,
  Keyboard,
  LockKeyhole,
  Pin,
  Search,
} from "lucide-react";
import ClipboardDemo from "@/components/clipboard-demo";

const source = "/downloads/on-hand-source.zip";
const download = "/downloads/on-hand-0.1.0-preview.zip";

export default function Home() {
  return (
    <main>
      <nav className="nav wrap" aria-label="Main navigation">
        <a className="brand" href="#" aria-label="On Hand home">
          <span className="mark">
            <Copy size={19} />
          </span>
          On Hand
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#questions">Questions</a>
          <a href={source} download>
            Source <ArrowUpRight size={12} />
          </a>
        </div>
      </nav>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">A native clipboard manager for Mac</p>
          <h1>
            Everything you copy.
            <br />
            <span>Close at hand.</span>
          </h1>
          <p className="intro">
            Find the text, links, and images you copied. Keep what you need. Get
            back to work.
          </p>
          <a className="button primary" href={download} download>
            <ArrowDown size={18} />
            Download for Mac
          </a>
          <p className="download-note">
            Free preview · Apple silicon · macOS 14+
            <br />
            Not yet notarized. <a href="/install">Installation guide</a>
          </p>
          <p className="hero-note">Local history. No account. Open source.</p>
        </div>
        <div className="hero-visual">
          <ClipboardDemo />
          <p className="demo-caption">
            Interactive preview · Sample clips only
          </p>
        </div>
      </section>
      <section id="features" className="features wrap" aria-label="Features">
        <article>
          <Search size={25} strokeWidth={1.5} />
          <h2>Find it again.</h2>
          <p>
            Search by content or app. Filter links, images, and pinned clips.
            Preview before you copy.
          </p>
        </article>
        <article>
          <Pin size={25} strokeWidth={1.5} />
          <h2>Keep it around.</h2>
          <p>
            Pin the things you use often. Keep the window open while you move
            between apps.
          </p>
        </article>
        <article>
          <Keyboard size={25} strokeWidth={1.5} />
          <h2>Stay on your keyboard.</h2>
          <p>
            Open with <kbd>⌘⇧Space</kbd>. Copy a result with <kbd>⌘1–9</kbd>,
            then paste as usual.
          </p>
        </article>
      </section>
      <section className="privacy wrap">
        <LockKeyhole size={30} strokeWidth={1.4} />
        <h2>Your clipboard stays on your Mac.</h2>
        <p>
          No clipboard uploads or app analytics. Pause capture, exclude apps,
          and choose how long history stays. Password-marked clips are skipped.
        </p>
        <a href="/privacy">
          Read the privacy policy <ArrowUpRight size={14} />
        </a>
      </section>
      <section id="questions" className="faq wrap">
        <h2>A few things to know.</h2>
        <div className="questions">
          <details>
            <summary>Is On Hand free?</summary>
            <p>
              Yes. The local clipboard manager is free and MIT-licensed.
              Optional paid services may come later, but this preview has no
              account, trial, or subscription.
            </p>
          </details>
          <details>
            <summary>What can it remember?</summary>
            <p>
              Plain text, web links, and images. History is limited to 500 clips
              or 50 MB. Text over 1 MB, images over 10 MB, and copied files are
              skipped. Rich text is saved as plain text.
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
              Not in this MVP. Your history stays on the Mac where it was
              captured. Optional sync is a possible future service.
            </p>
          </details>
          <details>
            <summary>Can I inspect or build the code?</summary>
            <p>
              Yes.{" "}
              <a href="/downloads/on-hand-source.zip" download>
                Download the MIT-licensed source
              </a>{" "}
              with build instructions. The{" "}
              <a href="https://github.com/coreyhaines31/onhand">
                development repository
              </a>{" "}
              may require access during preview.
            </p>
          </details>
        </div>
      </section>
      <footer className="footer wrap">
        <span>
          On Hand <span className="copyright">© 2026 Corey Haines</span>
        </span>
        <div>
          <a href="/install">Install</a>
          <a href="/privacy">Privacy</a>
          <a href={source} download>
            Source code
          </a>
        </div>
      </footer>
    </main>
  );
}
