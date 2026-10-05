import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Command,
  Copy,
  Github,
  LockKeyhole,
  Pin,
  Search,
} from "lucide-react";
import ClipboardDemo from "@/components/clipboard-demo";

const source = "https://github.com/coreyhaines31/onhand";
const download = "/downloads/on-hand-0.1.0-preview.zip";

export default function Home() {
  return (
    <main>
      <nav className="nav wrap" aria-label="Main navigation">
        <a className="brand" href="#">
          <span className="mark">
            <Copy size={23} />
          </span>
          On Hand<span className="for-mac">for Mac</span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#questions">Questions</a>
          <a className="nav-source" href={source}>
            <Github size={16} /> Source <ArrowUpRight size={13} />
          </a>
        </div>
      </nav>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> A SMALL UTILITY. A DAILY RELIEF.
          </div>
          <h1>
            Everything you copy,
            <br />
            <em>close at hand.</em>
          </h1>
          <p className="intro">
            That link. That line. That thing you just copied.
            <br className="desktop-break" /> Give it a little place to stay.
          </p>
          <p className="hero-detail">
            On Hand quietly remembers your clipboard, so you can get back to
            what you were doing.
          </p>
          <a className="button primary" href={download} download>
            <ArrowDown size={17} /> Download for Mac{" "}
            <span className="button-version">v0.1</span>
          </a>
          <p className="download-note">
            Free developer preview · Apple silicon · macOS 14+
            <br />
            Not yet notarized. <a href="/install">Installation notes ↗</a>
          </p>
          <div className="hero-promises">
            <span>
              <Check size={13} /> No account
            </span>
            <span>
              <Check size={13} /> No subscription
            </span>
            <span>
              <Check size={13} /> Stays on your Mac
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-caption">
            A home for the things between things.
          </div>
          <ClipboardDemo />
          <div className="demo-caption">
            <span className="caption-line" /> Try the search. Pin something.
            Make yourself at home.
          </div>
        </div>
      </section>
      <section className="shortcut-strip wrap" aria-label="Keyboard shortcut">
        <span>A familiar habit. One handy shortcut.</span>
        <div>
          <kbd>
            <Command size={16} />
          </kbd>
          <kbd>⇧</kbd>
          <kbd className="space-key">space</kbd>
          <span>and it’s all there.</span>
        </div>
      </section>
      <section id="how-it-works" className="how wrap">
        <div className="section-heading">
          <span className="eyebrow">LESS RETRACING. MORE DOING.</span>
          <h2>
            You had it.
            <br />
            <em>You still do.</em>
          </h2>
          <p>
            Your clipboard shouldn’t have a short memory. On Hand keeps the
            useful bits without getting in the way.
          </p>
        </div>
        <div className="steps">
          <article>
            <span className="step-number">01</span>
            <div>
              <h3>Copy as you always do.</h3>
              <p>
                Text, links, and images land in your history. No new ritual. No
                extra button.
              </p>
            </div>
            <Copy size={20} />
          </article>
          <article>
            <span className="step-number">02</span>
            <div>
              <h3>Find the thing you need.</h3>
              <p>
                Open On Hand from the menu bar or your keyboard. Search by words
                or source app.
              </p>
            </div>
            <Search size={20} />
          </article>
          <article>
            <span className="step-number">03</span>
            <div>
              <h3>Keep the good bits close.</h3>
              <p>
                Copy it back with a click or Return, then paste. Pin your
                regulars so they’re always there.
              </p>
            </div>
            <Pin size={20} />
          </article>
        </div>
      </section>
      <section className="privacy wrap">
        <div className="privacy-icon">
          <LockKeyhole size={31} strokeWidth={1.3} />
        </div>
        <div>
          <span className="eyebrow">YOUR CLIPBOARD IS YOUR BUSINESS.</span>
          <h2>
            A little history.
            <br />
            Kept to yourself.
          </h2>
        </div>
        <div className="privacy-copy">
          <p>
            Your clips live on your Mac. No account, no analytics, no cloud
            upload. Password-marked clips are skipped, and you can pause capture
            or exclude apps anytime.
          </p>
          <p>
            Unpinned clips expire after seven days by default. Keep your
            favorites. Let the rest go.
          </p>
          <a href="/privacy">
            The straightforward privacy policy <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
      <section id="questions" className="faq wrap">
        <div>
          <span className="eyebrow">GOOD TO KNOW</span>
          <h2>
            Small app.
            <br />
            <em>No big mysteries.</em>
          </h2>
        </div>
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
              <a href={source}>development repository</a> may require access
              during preview.
            </p>
          </details>
        </div>
      </section>
      <section className="closing wrap">
        <span className="mark">
          <Copy size={26} />
        </span>
        <h2>
          A little less lost.
          <br />
          <em>A lot more handy.</em>
        </h2>
        <a className="button primary" href={download} download>
          <ArrowDown size={17} /> Get On Hand
        </a>
        <p>Made for the way you already work.</p>
      </section>
      <footer className="footer wrap">
        <a className="brand" href="#">
          On Hand
        </a>
        <span>A small, independent Mac app.</span>
        <div>
          <a href="/privacy">Privacy</a>
          <a href="/downloads/on-hand-source.zip" download>
            Source code
          </a>
          <a href={source}>GitHub ↗</a>
        </div>
        <span>© 2026 Corey Haines</span>
      </footer>
    </main>
  );
}
