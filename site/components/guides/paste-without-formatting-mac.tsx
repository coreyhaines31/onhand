import Link from "next/link";

export default function PasteWithoutFormattingMac() {
  return (
    <>
      <p className="lede">
        You copy a sentence from a web page, paste it into an email, and it arrives in the wrong
        font, size, and color. Here’s how to paste just the words.
      </p>
      <div className="answer">
        <p>
          <strong>The shortcut:</strong> press <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>V</kbd>{" "}
          (Option-Shift-Command-V) to paste without formatting. Apple calls this Paste and Match
          Style. In Chrome, Google Docs, and Slack, use <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>V</kbd>{" "}
          instead.
        </p>
      </div>

      <h2>The shortcut in each app</h2>
      <table>
        <thead>
          <tr>
            <th>App</th>
            <th>Paste without formatting</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Notes, Mail, Pages, TextEdit, Keynote</td>
            <td>
              <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>V</kbd> (Edit › Paste and Match Style)
            </td>
          </tr>
          <tr>
            <td>Safari, including Gmail and other web apps</td>
            <td>
              <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>V</kbd>
            </td>
          </tr>
          <tr>
            <td>Chrome, including Gmail and Google Docs</td>
            <td>
              <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>V</kbd>, or <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd>{" "}
              <kbd>V</kbd>
            </td>
          </tr>
          <tr>
            <td>Slack</td>
            <td>
              <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>V</kbd>
            </td>
          </tr>
          <tr>
            <td>Microsoft Word</td>
            <td>
              <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>V</kbd> (Edit › Paste and Match
              Formatting)
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        If a shortcut does nothing, open the app’s Edit menu. The plain-text paste is listed there
        with its shortcut, when the app has one.
      </p>

      <h2>Make Command-V always paste plain text</h2>
      <p>
        If you almost never want formatting, give Paste and Match Style the regular paste
        shortcut:
      </p>
      <ol>
        <li>Open System Settings › Keyboard, and click Keyboard Shortcuts.</li>
        <li>Choose App Shortcuts, then click the add button.</li>
        <li>
          Leave Application set to All Applications. For Menu title, type{" "}
          <strong>Paste and Match Style</strong> exactly.
        </li>
        <li>
          Click Keyboard Shortcut, press <kbd>⌘</kbd> <kbd>V</kbd>, and click Done.
        </li>
      </ol>
      <p>
        Now <kbd>⌘</kbd> <kbd>V</kbd> pastes plain text in every app with a Paste and Match Style
        menu item, including Safari and Chrome. Apps without that menu item keep their normal
        paste. To paste with formatting in Apple apps, use Edit › Paste.
      </p>

      <h2>Strip formatting from what you already copied</h2>
      <p>
        Open Terminal and run <code>pbpaste | pbcopy</code>. <code>pbpaste</code> prints only the
        plain text on the clipboard, and <code>pbcopy</code> copies it back, so the clipboard now
        holds the same words with no formatting. Paste normally after that.
      </p>
      <p>
        In TextEdit, you can also paste the text into a new document, choose Format › Make Plain
        Text (<kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>T</kbd>), and copy it again.
      </p>

      <h2>With On Hand</h2>
      <p>
        On Hand, the free clipboard manager for Mac, saves rich text as plain text. When you copy
        a clip back from its history, it pastes without formatting in any app, with a regular{" "}
        <kbd>⌘</kbd> <kbd>V</kbd>. It also keeps everything else you copied, so you can find that
        sentence again later. See{" "}
        <Link href="/mac-clipboard-history">how clipboard history works on Mac</Link>.
      </p>
    </>
  );
}
