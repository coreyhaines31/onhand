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
import PanelVisual from "@/components/panel-visual";
import CopyBlock from "@/components/copy-block";
import CopyPromptButton from "@/components/copy-prompt-button";
import MakerNote from "@/components/maker-note";
import MoreApps from "@/components/more-apps";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import {
  checkedOn,
  commands,
  compareColumns,
  compareRows,
  compareSources,
  faqs,
  passwordManagers,
  shortcuts,
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
              Press ⌘⇧Space and search what you’ve copied: text, links,
              and the words inside screenshots. Your history stays on your Mac.
            </p>
            <div className="bx-cta">
              <a className="bx-btn" href={download}>
                <ArrowDown size={18} aria-hidden />
                Download On Hand free
              </a>
              <a className="bx-btn sec" href={source}>
                <Code2 size={18} aria-hidden />
                Read the source
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
            <h2 id="features-heading">A clipboard manager for Mac that remembers what you copied.</h2>
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
      <section id="search" className="bx-section">
        <div className="bx-wrap lf-feature">
          <div className="lf-copy">
            <span className="bx-eyebrow">Search</span>
            <h2>Search your clipboard history by any word you remember.</h2>
            <p>
              Type a word or two and the list narrows as you type. A clip matches
              when every word appears somewhere in it: the text, the app you
              copied it from, or the text On Hand found in an image.
            </p>
            <ul className="lf-list">
              <li>
                <strong>Filter by type</strong> with the All, Pinned, Links,
                Images, and Sent tabs. Links are any copied web address.
              </li>
              <li>
                <strong>Preview before you copy.</strong> <kbd>⌘O</kbd> opens the
                full clip, so you can check a long one first.
              </li>
              <li>
                <strong>Copy the same thing twice</strong> and it’s kept once, moved
                to the top, so duplicates don’t crowd your history.
              </li>
              <li>
                <strong>Each clip shows where it came from:</strong> the app, how
                long ago, and its board if it’s pinned.
              </li>
            </ul>
          </div>
          <PanelVisual
            query="order"
            rows={[
              {
                text: "Order #4021 · Ships Thursday",
                sub: "Screenshot · text in image · 10m ago",
                shortcut: "⌘1",
                image: true,
                selected: true,
              },
              {
                text: "Your order ships Thursday. Tracking to follow.",
                sub: "Slack · 3h ago · Replies",
                shortcut: "⌘2",
                pinned: true,
              },
              {
                text: "shop.example.com/orders/4021",
                sub: "Mail · 4h ago",
                shortcut: "⌘3",
              },
            ]}
            status="3 matches · On this Mac only"
          />
        </div>
      </section>
      <section id="screenshots" className="bx-section">
        <div className="bx-wrap lf-feature flip">
          <PanelVisual tab="Images" status="Text found on this Mac">
            <div className="pv-shot">
              Payment failed: card declined (code 402)
              <small>Screenshot · Chrome · 22m ago</small>
            </div>
            <div className="pv-ocr">
              Text in image: Payment <mark>failed</mark>: card declined (code 402)
            </div>
          </PanelVisual>
          <div className="lf-copy">
            <span className="bx-eyebrow">Text in images</span>
            <h2>Search the text inside screenshots.</h2>
            <p>
              When you copy a screenshot, On Hand reads the words in it, on your
              Mac, with the text recognition built into macOS. Search for any of those
              words later and the screenshot comes up, like any other clip.
            </p>
            <ul className="lf-list">
              <li>
                <strong>Copy the text out.</strong> Preview an image to select and
                copy its text, without retyping an error message or an order
                number.
              </li>
              <li>
                <strong>Nothing leaves your Mac.</strong> Recognition runs
                locally, once for each new image.
              </li>
              <li>
                <strong>Secrets in screenshots count too.</strong> If the text in
                an image looks like a key or a card number, On Hand doesn’t keep
                it.
              </li>
            </ul>
            <a className="lf-more" href="/features/search-text-in-images">
              How search in screenshots works <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>
      </section>
      <section id="pins" className="bx-section">
        <div className="bx-wrap lf-feature">
          <div className="lf-copy">
            <span className="bx-eyebrow">Pinned clips</span>
            <h2>Pin snippets, replies, and addresses to boards.</h2>
            <p>
              Some text you paste every week: a support reply, a shipping
              address, a code snippet, a bank reference. Pin them once and they
              stay until you remove them, no matter how long history is set to
              keep everything else.
            </p>
            <ul className="lf-list">
              <li>
                <strong>Pin with <kbd>⌘P</kbd></strong>, or right-click a clip and
                choose Pin to Board to file it on a board like Snippets or
                Addresses.
              </li>
              <li>
                <strong>Open a board</strong> under the Pinned tab to see only its
                clips. Rename or delete a board from its menu.
              </li>
              <li>
                <strong>Copy several clips into one form.</strong> Turn on Keep
                Window Open While Switching Apps, and history stays put while you
                paste into another app.
              </li>
              <li>
                <strong>Pinning something that looks like a secret</strong> warns
                you first, so a key doesn’t end up kept forever by accident.
              </li>
            </ul>
          </div>
          <PanelVisual
            tab="Pinned"
            boards={{ names: ["All pinned", "Snippets", "Addresses", "Replies"], on: "Snippets" }}
            rows={[
              {
                text: "let smallThings = makeSomethingUseful()",
                sub: "Xcode · Oct 4 · Snippets",
                shortcut: "⌘1",
                pinned: true,
                code: true,
                selected: true,
              },
              {
                text: "npm run lint && npm run typecheck",
                sub: "Ghostty · Oct 9 · Snippets",
                shortcut: "⌘2",
                pinned: true,
                code: true,
              },
              {
                text: "SELECT * FROM orders WHERE status = 'late'",
                sub: "TablePlus · Oct 21 · Snippets",
                shortcut: "⌘3",
                pinned: true,
                code: true,
              },
            ]}
            status="Pinned clips never expire"
          />
        </div>
      </section>
      <section id="shortcuts" className="bx-section">
        <div className="bx-wrap">
          <div className="lf-head">
            <span className="bx-eyebrow">Keyboard</span>
            <h2>Keyboard shortcuts, so you never reach for the mouse.</h2>
            <p>
              On Hand is built to use without the mouse. Open it from any app,
              find the clip, copy it, and you’re back where you were.
            </p>
          </div>
          <div className="lf-table-wrap">
            <table className="lf-table">
              <thead>
                <tr>
                  <th scope="col">Shortcut</th>
                  <th scope="col">What it does</th>
                </tr>
              </thead>
              <tbody>
                {shortcuts.map((row) => (
                  <tr key={row.keys}>
                    <th scope="row" className="key">
                      <kbd>{row.keys}</kbd>
                    </th>
                    <td>{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="lf-note">
            You can change the open, forget, and message shortcuts in Settings.
            The message shortcuts are only active while Sent messages is on, so
            other apps keep them otherwise.
          </p>
        </div>
      </section>
      <section id="sent" className="bx-section">
        <div className="bx-wrap lf-feature flip">
          <PanelVisual
            tab="Sent"
            rows={[
              {
                text: "Ship it Monday, then the site.",
                sub: "Messages · Sent · 24m ago",
                shortcut: "⌘1",
                selected: true,
              },
              {
                text: "Can you send the Q3 numbers before standup?",
                sub: "Slack · Sent · 2h ago",
                shortcut: "⌘2",
              },
              {
                text: "Rewrite this so it’s half as long.",
                sub: "Claude · Sent · 5h ago",
                shortcut: "⌘3",
              },
            ]}
            status="Sent messages on · 3 apps"
          />
          <div className="lf-copy">
            <span className="bx-eyebrow">Sent messages · optional</span>
            <h2>Find a message you already sent.</h2>
            <p>
              Like pressing ↑ in Terminal, but for the apps you choose. Turn on
              Sent messages, add Slack, Messages, or Claude, and On Hand keeps
              what you send so you can find it again or send it again.
            </p>
            <ul className="lf-list">
              <li>
                <strong>Saved when the box empties.</strong> When a message box
                clears after you send, what was in it is saved as a clip labeled
                Sent.
              </li>
              <li>
                <strong>Bring it back.</strong> Click into a message box and press{" "}
                <kbd>⌃⌥↑</kbd> to fill in the last message you sent from that
                app. Press it again for older ones, or <kbd>⌃⌥↓</kbd> to go
                forward.
              </li>
              <li>
                <strong>Off until you turn it on.</strong> It needs Accessibility
                access, reads only the message box in apps you listed, never
                records keystrokes, and skips password fields.
              </li>
              <li>
                <strong>Works with standard text fields.</strong> Some apps don’t
                share their text fields with macOS, and On Hand can’t see
                messages sent from those. Deleting a whole draft at once looks
                the same as sending it, so that draft may be saved too.
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section id="skips" className="bx-section">
        <div className="bx-wrap">
          <div className="lf-head">
            <span className="bx-eyebrow">What it keeps</span>
            <h2>What On Hand saves, skips, and clears.</h2>
            <p>
              A clipboard manager sees everything you copy, so it should be
              exact about what it keeps. This is the full list, straight from
              the code.
            </p>
          </div>
          <div className="lf-safety">
            <article className="bx-card">
              <span className="bx-led">Saved</span>
              <ul className="lf-list go">
                <li>
                  <strong>Text</strong> up to 1 MB. Rich text is saved as plain
                  text.
                </li>
                <li>
                  <strong>Links</strong>: any copied http or https address, so the
                  Links tab can find them.
                </li>
                <li>
                  <strong>Images</strong> up to 10 MB, with the text in them
                  recognized for search.
                </li>
                <li>
                  <strong>Where and when:</strong> the app you copied from and the
                  time, shown on each clip.
                </li>
                <li>
                  <strong>Sent messages</strong>, only if you turn them on, only
                  from apps you choose.
                </li>
              </ul>
            </article>
            <article className="bx-card">
              <span className="bx-led st">Skipped</span>
              <ul className="lf-list st">
                <li>
                  <strong>Anything marked concealed, temporary, or
                  auto-generated</strong>, the signals password managers put on
                  what they copy.
                </li>
                <li>
                  <strong>Copies from {passwordManagers.length} password
                  managers</strong> by default: {passwordManagers.join(", ")}.
                  Add any other app in Settings.
                </li>
                <li>
                  <strong>Card numbers, US Social Security numbers, and secret
                  keys</strong>: more than 25 kinds of keys and tokens (GitHub,
                  Stripe, AWS, OpenAI, Anthropic, Slack, npm and more), database
                  URLs with a password, and <code>.env</code> lines like{" "}
                  <code>API_SECRET=…</code>. In screenshots too.
                </li>
                <li>
                  <strong>Copied files</strong>, text over 1 MB, and images over
                  10 MB.
                </li>
                <li>
                  <strong>Anything copied while capture is paused</strong>, or
                  before you chose to start.
                </li>
              </ul>
            </article>
          </div>
          <div className="lf-cards">
            <article className="bx-card">
              <h3>Concealed in a quarter second</h3>
              <p>
                When you copy a key or a card number as text, On Hand tags it as
                private within about a quarter second. Other clipboard managers
                that honor that tag usually skip it too.
              </p>
            </article>
            <article className="bx-card">
              <h3>Cleared after 90 seconds</h3>
              <p>
                Then it clears the secret from your clipboard after 90 seconds,
                long enough to paste it once. You can turn that off in Settings ›
                Privacy.
              </p>
            </article>
            <article className="bx-card">
              <h3>It tells you what it skipped</h3>
              <p>
                The menu bar icon briefly shows a raised hand when it skips
                something, and its tooltip says what it found, like “GitHub
                token”, so you know why a copy is missing.
              </p>
            </article>
          </div>
          <p className="lf-note">
            These checks can’t catch everything. Addresses, passwords you type
            yourself, and other private details can still be saved. Pause
            capture first, or press <kbd>⌃⌥⌘⌫</kbd> to forget a copy.{" "}
            <a href="/features/protect-api-keys">See every key it recognizes</a>
          </p>
        </div>
      </section>
      <section id="storage" className="bx-section">
        <div className="bx-wrap lf-feature">
          <div className="lf-copy">
            <span className="bx-eyebrow">Storage</span>
            <h2>Where your clipboard history lives.</h2>
            <p>
              Your history is one database file on your Mac. There’s no server,
              no account, and no sync, so there’s no copy of it anywhere else.
            </p>
            <ul className="lf-list">
              <li>
                <strong>Only your user can open it.</strong> The folder and the
                file are readable by your macOS account alone.
              </li>
              <li>
                <strong>Kept out of Time Machine</strong> and local snapshots, so a
                clip you delete doesn’t live on in a backup.
              </li>
              <li>
                <strong>Unpinned clips expire</strong> after 1, 7, 30, or 90 days.
                Seven is the default.
              </li>
              <li>
                <strong>History holds up to 500 clips or 50 MB.</strong> When it’s
                full, the oldest unpinned clips go first.
              </li>
              <li>
                <strong>Clear it anytime</strong> from Settings, with or without
                your pinned clips.
              </li>
            </ul>
          </div>
          <div>
            <div className="lf-path">
              <span>History</span>
              ~/Library/Application Support/OnHand/history.sqlite
            </div>
            <div className="lf-path">
              <span>Settings</span>
              ~/Library/Preferences/com.onhandformac.OnHand.plist
            </div>
            <p className="lf-note">
              Delete those two to erase everything On Hand has kept. With
              Homebrew, <code>brew uninstall --zap --cask onhand</code> does it
              for you.
            </p>
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
      <section id="cli" className="bx-section">
        <div className="bx-wrap">
          <div className="lf-head">
            <span className="bx-eyebrow">Command line</span>
            <h2>A clipboard history your coding agent can search.</h2>
            <p>
              You copied the error, the webhook URL, or the snippet an hour ago.
              Instead of pasting it into the chat, tell your agent you copied it.
              With the line above in its instructions, it runs{" "}
              <code>onhand search</code>, finds the clip, and reads it.
            </p>
          </div>
          <div className="lf-feature">
            <pre className="lf-term" aria-label="Example Claude Code session using onhand">
              <span className="you">&gt; Use the Stripe webhook URL I copied this morning.</span>
              {"\n\n"}
              <span className="ok">⏺</span> Bash(onhand search webhook --kind link)
              {"\n  "}
              <span className="c">⎿</span> ID       TYPE   COPIED    FROM          PINNED      PREVIEW
              {"\n     "}3f2a91c0 link   3h ago    Safari                    example.com/hooks/stripe
              {"\n\n"}
              <span className="ok">⏺</span> Bash(onhand get 3f2a91c0)
              {"\n  "}
              <span className="c">⎿</span> example.com/hooks/stripe
              {"\n\n"}
              <span className="ok">⏺</span> Found it. Adding it to .env.example and the
              {"\n  "}webhook setup in README.md.
            </pre>
            <ul className="lf-list">
              <li>
                <strong>It reads only what it asks for.</strong> Search returns
                one-line previews. The full text comes from <code>get</code>,
                one clip at a time.
              </li>
              <li>
                <strong>Short IDs.</strong> Any unique start of a clip’s ID works,
                like a short Git hash.
              </li>
              <li>
                <strong>JSON for scripts.</strong> <code>--json</code> works on
                search, get, boards, and status.
              </li>
              <li>
                <strong>Works with the app open or closed.</strong> The command
                edits the same history file, and a running app picks up changes
                right away.
              </li>
              <li>
                <strong>Your agent’s provider sees what it reads.</strong> The
                command sends nothing anywhere itself, but whatever an agent reads
                goes to its AI provider, like any file it opens.
              </li>
            </ul>
          </div>
          <div className="lf-table-wrap">
            <table className="lf-table">
              <thead>
                <tr>
                  <th scope="col">Command</th>
                  <th scope="col">What it does</th>
                </tr>
              </thead>
              <tbody>
                {commands.map((row) => (
                  <tr key={row.command}>
                    <th scope="row" className="key">
                      <code>{row.command}</code>
                    </th>
                    <td>
                      {row.does}
                      {row.flags && (
                        <>
                          {" "}
                          <code>{row.flags}</code>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="lf-note">
            Homebrew links the command for you. If you installed another way,{" "}
            <a href="/features/command-line">link it once</a> from the app bundle.
          </p>
        </div>
      </section>
      <section id="people" className="bx-section">
        <div className="bx-wrap">
          <div className="lf-head">
            <span className="bx-eyebrow">Who it’s for</span>
            <h2>For developers, writers, and anyone who answers messages all day.</h2>
          </div>
          <div className="lf-cards">
            <article className="bx-card">
              <h3>Developers</h3>
              <p>
                Commands, branch names, stack traces, and the URL from the last
                deploy. Pin the snippets you type every day. Tokens you copy
                aren’t saved, and your coding agent can search the rest with{" "}
                <code>onhand</code>.
              </p>
            </article>
            <article className="bx-card">
              <h3>Writers, editors, and marketers</h3>
              <p>
                Links, quotes, headlines, and the paragraph you cut “for later”.
                Search by a word you remember, and pull text out of a screenshot
                instead of retyping it.
              </p>
            </article>
            <article className="bx-card">
              <h3>Support, sales, and ops</h3>
              <p>
                The same five replies, order numbers, and addresses, all day.
                Pin them to boards, keep the window open while you work through
                a form, and find what you sent yesterday under Sent.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section id="compare" className="bx-section">
        <div className="bx-wrap">
          <div className="lf-head">
            <span className="bx-eyebrow">Alternatives</span>
            <h2>Mac clipboard managers, honestly compared.</h2>
            <p>
              On Hand isn’t the only way to get clipboard history on a Mac, and
              it isn’t the best fit for everyone. Here’s how it compares with
              what people usually weigh it against, from each one’s own site and
              docs. Deeper comparisons:{" "}
              <a href="/alternatives/maccy">Maccy</a>,{" "}
              <a href="/alternatives/raycast-clipboard-history">Raycast</a>,{" "}
              <a href="/alternatives/paste">Paste</a>,{" "}
              <a href="/alternatives/alfred-clipboard-history">Alfred</a>, and{" "}
              <a href="/alternatives">more</a>.
            </p>
          </div>
          <div className="lf-table-wrap">
            <table className="lf-table lf-compare">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Feature</span>
                  </th>
                  {compareColumns.map((column) => (
                    <th scope="col" key={column.name} className={column.href ? "" : "us"}>
                      {column.href ? <a href={column.href}>{column.name}</a> : column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.cells.map((cell, index) => (
                      <td key={compareColumns[index].name} className={index === 0 ? "us" : ""}>
                        <b className={cell.good ? "y" : ""}>{cell.text}</b>
                        {cell.note && <small>{cell.note}</small>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lf-better">
            <article className="bx-card">
              <h3>Where they’re better</h3>
              <ul className="lf-list">
                <li>
                  <strong>Paste</strong> syncs history to your iPhone and iPad,
                  keeps it with no limit, shares Pinboards with a team, and has
                  an MCP server for Claude, Codex, and Cursor.
                </li>
                <li>
                  <strong>Raycast and Alfred</strong> are whole launchers. If you
                  live in one already, its clipboard history is right there,
                  with snippets and much more beside it.
                </li>
                <li>
                  <strong>Maccy</strong> is the closest match: free, MIT, and
                  local, with years of releases, a compact popup, and optional
                  paste-on-select.
                </li>
                <li>
                  <strong>Most of them paste for you.</strong> On Hand puts the
                  clip back on your clipboard and you press <kbd>⌘V</kbd>.
                </li>
              </ul>
            </article>
            <article className="bx-card">
              <h3>Where On Hand is different</h3>
              <ul className="lf-list">
                <li>
                  <strong>It checks what you copy, not just where.</strong> Keys,
                  card numbers, and SSNs are caught in any app, concealed, and
                  cleared.
                </li>
                <li>
                  <strong>It’s free and open everywhere</strong>, with no paid
                  tier for longer history or sync, because there’s no server.
                </li>
                <li>
                  <strong>Unlike Spotlight and Raycast 2, it runs on macOS 14 and
                  15</strong> and on Intel Macs, and agents can use it through a
                  plain Terminal command.
                </li>
              </ul>
            </article>
          </div>
          <p className="lf-sources">
            Checked on {checkedOn} on each product’s own pages:{" "}
            {compareSources.map((url, index) => (
              <span key={url}>
                {index > 0 && ", "}
                <a href={url} rel="nofollow noopener">
                  {url.replace(/^https:\/\/(www\.)?/, "")}
                </a>
              </span>
            ))}
            . “Not documented” means we couldn’t find it on their site, not that it’s missing.
          </p>
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
          <div className="lf-safety">
            <article className="bx-card">
              <h3>What it touches</h3>
              <ul className="lf-list">
                <li>
                  <strong>The clipboard.</strong> Four times a second it checks
                  whether anything new was copied, and reads it only when
                  something was.
                </li>
                <li>
                  <strong>One history file</strong> in your Library folder, and
                  its own settings.
                </li>
                <li>
                  <strong>Message boxes</strong> in apps you list, only if you
                  turn on Sent messages.
                </li>
              </ul>
            </article>
            <article className="bx-card">
              <h3>What it never does</h3>
              <ul className="lf-list">
                <li>
                  <strong>Upload anything.</strong> No account, no sync, no
                  analytics. Its only network request checks for updates.
                </li>
                <li>
                  <strong>Record keystrokes</strong>, read password fields, or
                  import what you copied before you started.
                </li>
                <li>
                  <strong>Paste on its own.</strong> Choosing a clip copies it, and
                  you press ⌘V. Only ⌃⌥↑ fills a message box, when you press it.
                </li>
              </ul>
            </article>
            <article className="bx-card">
              <h3>Permissions it asks for</h3>
              <ul className="lf-list">
                <li>
                  <strong>Clipboard access.</strong> If macOS asks whether On Hand
                  can paste from other apps, choose Allow. It can’t keep history
                  without it.
                </li>
                <li>
                  <strong>Accessibility</strong>, only for Sent messages, to read
                  the message box in apps you chose.
                </li>
                <li>
                  <strong>Login item.</strong> It starts with your Mac. Turn off
                  Launch at login in Settings to stop that.
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>
      <section id="settings" className="bx-section">
        <div className="bx-wrap">
          <div className="lf-head">
            <span className="bx-eyebrow">Settings</span>
            <h2>Every setting fits on one screen.</h2>
            <p>
              Open ⋯ › Settings from the history window. This is all of it, so
              there’s nothing hidden to find later.
            </p>
          </div>
          <div className="lf-cards">
            <article className="bx-card">
              <h3>General</h3>
              <ul className="lf-list">
                <li>The shortcut that opens On Hand, and the one that forgets your last copy</li>
                <li>Keep history open while switching apps</li>
                <li>Launch at login</li>
                <li>Keep unpinned clips for 1, 7, 30, or 90 days</li>
              </ul>
            </article>
            <article className="bx-card">
              <h3>Privacy</h3>
              <ul className="lf-list">
                <li>Pause capture</li>
                <li>Don’t save card numbers, Social Security numbers, or secret keys</li>
                <li>Clear them from the clipboard after 90 seconds</li>
                <li>Apps whose copies are never kept</li>
                <li>Clear history, with or without pinned clips</li>
              </ul>
            </article>
            <article className="bx-card">
              <h3>Sent messages</h3>
              <ul className="lf-list">
                <li>Save messages you send, off by default</li>
                <li>The apps to save them from</li>
                <li>The shortcuts that step through what you sent</li>
                <li>Below them: your version, Check for updates, and Quit</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
      <section id="new" className="bx-section">
        <div className="bx-wrap lf-new">
          <span className="bx-strip">New in 1.6.0</span>
          <div className="lf-head">
            <h2>A new look, history kept out of backups, and safer pins.</h2>
            <p>
              On Hand 1.6.0 shipped on November 16, 2026. The history panel is
              redesigned to match my other free Mac apps, with a new app icon and
              menu bar icon, and every feature and shortcut works as before. History is now kept out of Time Machine backups and local
              snapshots. On Hand skips copies from an excluded app even when
              another app is in front, and pinning a clip that looks like a
              secret warns you first.{" "}
              <a href={`${source}/releases`}>All release notes</a>
            </p>
          </div>
        </div>
      </section>
      <section id="free" className="bx-section">
        <div className="bx-wrap lf-feature">
          <div className="lf-copy">
            <span className="bx-eyebrow">Price</span>
            <h2>Free. No account. No subscription.</h2>
            <p>
              There’s no server behind On Hand, so there’s no monthly bill to
              pass on to you. There’s no trial, no feature held back for a paid
              tier, and nothing to sign up for. The source is MIT-licensed on GitHub, so you can read
              exactly what it does with your clipboard, build it yourself, or
              send a fix. Optional paid services may come later.
            </p>
          </div>
          <div className="bx-card">
            <h3>System requirements</h3>
            <ul className="lf-list">
              <li>macOS 14 Sonoma or later, including Sequoia and Tahoe</li>
              <li>Apple silicon or Intel</li>
              <li>Signed and notarized by Apple</li>
              <li>Updates itself, or with Homebrew</li>
              <li>
                Source on <a href={source}>GitHub</a> under the MIT license
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section id="questions" className="bx-section">
        <div className="bx-wrap faq">
          <h2>Questions before you download.</h2>
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
              For macOS 14 or later, on Apple silicon and Intel.{" "}
              <a href="/install">Installation guide</a>
            </p>
          </div>
          <div className="download-actions">
            <a className="bx-btn" href={download}>
              <ArrowDown size={18} aria-hidden />
              Download On Hand free
            </a>
            <a className="bx-btn sec" href={source}>
              <Code2 size={18} aria-hidden />
              Read the source
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
