import Link from "next/link";

export default function ScreenshotToClipboardMac() {
  return (
    <>
      <p className="lede">
        Most of the time you take a screenshot to paste it somewhere: a message, a document, a bug
        report. Copying it skips the file on your desktop.
      </p>
      <div className="answer">
        <p>
          <strong>The shortcut:</strong> add <kbd>⌃</kbd> Control to any screenshot shortcut.
          Press <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>4</kbd> and drag to copy part of the
          screen, then press <kbd>⌘</kbd> <kbd>V</kbd> to paste it.
        </p>
      </div>

      <h2>Every way to copy a screenshot</h2>
      <table>
        <thead>
          <tr>
            <th>To copy</th>
            <th>Press</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Part of the screen</td>
            <td>
              <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>4</kbd>, then drag
            </td>
          </tr>
          <tr>
            <td>One window</td>
            <td>
              <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>4</kbd>, then <kbd>Space</kbd>, then
              click the window
            </td>
          </tr>
          <tr>
            <td>The whole screen</td>
            <td>
              <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>3</kbd>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        You can also hold <kbd>⌃</kbd> while you drag or click with the regular{" "}
        <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>4</kbd> shortcut. Holding Control at the moment you finish
        sends the screenshot to the clipboard instead of a file.
      </p>

      <h2>Copy screenshots by default</h2>
      <p>If you rarely want screenshot files, change where screenshots go:</p>
      <ol>
        <li>
          Press <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>5</kbd> to open the Screenshot toolbar.
        </li>
        <li>Click Options.</li>
        <li>
          Under Save to, choose <strong>Clipboard</strong>.
        </li>
      </ol>
      <p>
        Screenshots you take with <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>3</kbd>, <kbd>⇧</kbd>{" "}
        <kbd>⌘</kbd> <kbd>4</kbd>, or the toolbar are then copied instead of saved. Choose Desktop
        again to go back.
      </p>

      <h2>Paste it</h2>
      <p>
        Click where you want the screenshot, in Messages, Mail, Slack, Notes, or a document, and
        press <kbd>⌘</kbd> <kbd>V</kbd>. To get a file after all, open Preview and choose File ›
        New from Clipboard (<kbd>⌘</kbd> <kbd>N</kbd>), then save it.
      </p>

      <h2>When it doesn’t paste</h2>
      <ul>
        <li>
          <strong>You copied something else since.</strong> The clipboard holds one item, so the
          next copy replaces the screenshot.
        </li>
        <li>
          <strong>The app only accepts text.</strong> Terminal and many plain-text fields ignore
          images. Paste into a document or a chat window instead.
        </li>
        <li>
          <strong>The shortcut took a file instead.</strong> If a thumbnail appeared in the corner,
          Control wasn’t held down. Drag the thumbnail where you want it, or try again with{" "}
          <kbd>⌃</kbd>.
        </li>
      </ul>

      <h2>With On Hand</h2>
      <p>
        Because the clipboard keeps only your last copy, a screenshot you copied an hour ago is
        gone. On Hand, the free clipboard manager for Mac, keeps every screenshot you copy and
        reads the text in it on your Mac, so you can{" "}
        <Link href="/features/search-text-in-images">find a screenshot by a word in it</Link> and
        paste it again.
      </p>
    </>
  );
}
