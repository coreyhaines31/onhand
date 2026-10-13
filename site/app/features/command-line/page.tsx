import type { Metadata } from "next";
import Link from "next/link";
import CopyBlock from "@/components/copy-block";
import DownloadCta from "@/components/download-cta";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { agentInstruction, brewCommand, cliExamples, cliLinkCommand } from "@/lib/install";
import { siteUrl, sourceUrl } from "@/lib/site";

const title = "Mac Clipboard History From the Command Line, for AI Agents";
const description =
  "With the onhand command, you or an AI agent like Claude Code or Codex can search your Mac clipboard history, read text in screenshots, and copy clips back.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/features/command-line" },
  openGraph: {
    title,
    description,
    url: "/features/command-line",
    type: "article",
    images: "/opengraph-image",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  url: `${siteUrl}/features/command-line`,
  datePublished: "2026-10-13",
  dateModified: "2026-10-13",
  author: { "@type": "Person", name: "Corey Haines" },
  image: `${siteUrl}/opengraph-image`,
};

const commands: [string, string][] = [
  ["onhand search [words]", "Newest clips containing all the words, one line each. Leave out the words for recent clips."],
  ["onhand get ID", "A clip’s full text. For an image, the text On Hand found in it; add --image out.png to save the image."],
  ["onhand copy ID", "Put a clip back on the clipboard."],
  ["onhand pin ID --board NAME", "Pin a clip so it never expires, optionally to a board. unpin undoes it."],
  ["onhand boards", "Your boards and how many clips each holds."],
  ["onhand delete ID", "Delete a clip from history."],
  ["onhand forget-last", "Clear the clipboard and delete what On Hand saved from it."],
  ["onhand pause / resume", "Stop saving copies, then start again."],
  ["onhand status", "Whether On Hand is saving copies, and how many clips it holds."],
];

export default function CommandLine() {
  return (
    <>
      <SiteNav />
      <main className="document article wrap">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <h1>Your clipboard history, from Terminal</h1>
        <p className="lede">
          You copied a link, an error, or a screenshot an hour ago, and now your coding agent needs
          it. Instead of digging it up and pasting it in, tell the agent to find it.
        </p>
        <div className="answer">
          <p>
            <strong>How it works:</strong> On Hand 1.3.0 and later include the <code>onhand</code>{" "}
            command. It searches the history On Hand keeps on your Mac, prints a clip’s text
            (including the text in screenshots), copies clips back, and pauses capture. Claude
            Code, Codex, or any script can run it.
          </p>
        </div>

        <h2>Try it</h2>
        <CopyBlock text={cliExamples} label="onhand examples" />
        <p>
          That finds clips mentioning “invoice,” prints the full text of one, copies it back, and
          pins it to a board. IDs come from <code>onhand search</code>, and any unique start of one works, like a short
          Git hash. Add <code>--json</code> to <code>search</code>, <code>get</code>,{" "}
          <code>boards</code>, or <code>status</code> for output a script can parse.
        </p>

        <h2>Every command</h2>
        <table>
          <thead>
            <tr>
              <th>Command</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(([command, summary]) => (
              <tr key={command}>
                <td>
                  <code>{command}</code>
                </td>
                <td>{summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <code>search</code> takes <code>--kind text|link|image</code>, <code>--pinned</code>,{" "}
          <code>--board NAME</code>, and <code>--limit N</code> (10 by default, at most 50). Run{" "}
          <code>onhand help</code> for the full list.
        </p>

        <h2>Tell your agent about it</h2>
        <p>
          Add this line to your <code>CLAUDE.md</code>, <code>AGENTS.md</code>, or your agent’s
          instructions, so it reaches for your clipboard history when you mention something you
          copied:
        </p>
        <CopyBlock text={agentInstruction} label="agent instruction" />
        <p>Then ask things like:</p>
        <ul>
          <li>“Use the error I copied a few minutes ago and fix it.”</li>
          <li>“What was the order number in the screenshot I copied this morning?”</li>
          <li>“Pin the API docs link I copied to my Snippets board.”</li>
          <li>“Pause On Hand while you set up these credentials, then resume it.”</li>
        </ul>

        <h2>Install the command</h2>
        <p>
          If you installed On Hand with Homebrew, <code>onhand</code> is already on your PATH:
        </p>
        <CopyBlock text={brewCommand} label="Homebrew install command" />
        <p>
          If you downloaded the app instead, link the command once. It asks for your Mac password:
        </p>
        <CopyBlock text={cliLinkCommand} label="link command" />
        <p>
          New to On Hand? Start with the <Link href="/install">installation guide</Link>.
        </p>

        <h2>What your agent can see</h2>
        <ul>
          <li>
            <code>onhand</code> itself sends nothing anywhere. But whatever an agent reads with it
            goes to that agent’s AI provider, like any file it opens.
          </li>
          <li>
            <code>search</code> shows only a one-line preview of each clip, at most 50 at a time.
            The full text comes from <code>get</code>, one clip at a time.
          </li>
          <li>
            Card numbers, Social Security numbers, and secret keys are never saved, so there’s
            nothing to find. Pause capture before copying anything else private.
          </li>
        </ul>
        <p>
          Read the <Link href="/privacy">privacy policy</Link> for details.
        </p>

        <h2>Questions</h2>
        <h3>Does On Hand have to be running?</h3>
        <p>
          No. The command reads and changes the same history file the app uses, so it works either
          way, and a running app shows the changes right away. On Hand has to be running to save
          new copies.
        </p>
        <h3>Which agents does it work with?</h3>
        <p>
          Any agent that can run Terminal commands, including Claude Code, Codex, Cursor, and
          Gemini CLI. There’s nothing to set up beyond the line in your instructions file.
        </p>
        <h3>Can I use it in my own scripts?</h3>
        <p>
          Yes. Use <code>--json</code> for structured output. Errors go to stderr, and the command
          exits with 1 when something fails and 2 for a typo in the command. The source is on{" "}
          <a href={sourceUrl}>GitHub</a>.
        </p>

        <DownloadCta
          title="Give your agent your clipboard history."
          body="On Hand is a free, open-source clipboard manager for macOS 14 and later. Everything stays on your Mac."
        />
      </main>
      <SiteFooter />
    </>
  );
}
