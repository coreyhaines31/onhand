import Link from "next/link";

export default function CopyFromIphoneToMac() {
  return (
    <>
      <p className="lede">
        You found an address, a code, or a link on your iPhone and need it on your Mac. You don’t
        have to text it to yourself. Apple’s Universal Clipboard moves it for you.
      </p>
      <div className="answer">
        <p>
          <strong>How it works:</strong> copy on your iPhone as usual, then press <kbd>⌘</kbd>{" "}
          <kbd>V</kbd> on your Mac within a couple of minutes. Both devices need the same Apple
          Account, Wi-Fi and Bluetooth turned on, and Handoff turned on.
        </p>
      </div>

      <h2>Set up Universal Clipboard</h2>
      <h3>On your Mac</h3>
      <ol>
        <li>
          Open System Settings and click your name at the top. Check that it’s the same Apple
          Account your iPhone uses.
        </li>
        <li>Turn on Wi-Fi and Bluetooth.</li>
        <li>
          Go to General › AirDrop & Handoff, and turn on{" "}
          <strong>Allow Handoff between this Mac and your iCloud devices</strong>.
        </li>
      </ol>
      <h3>On your iPhone</h3>
      <ol>
        <li>Open Settings and tap your name. Check that it’s the same Apple Account.</li>
        <li>Turn on Wi-Fi and Bluetooth.</li>
        <li>
          Go to General › AirPlay & Continuity (called AirPlay & Handoff in iOS 17 and earlier),
          and turn on <strong>Handoff</strong>.
        </li>
      </ol>
      <p>
        That’s all. There’s no app to open and no button to press. Keep the devices near each
        other, in Bluetooth range.
      </p>

      <h2>Copy and paste</h2>
      <ol>
        <li>On your iPhone, select text, a photo, or a link, and tap Copy.</li>
        <li>
          On your Mac, click where you want it and press <kbd>⌘</kbd> <kbd>V</kbd>. A large item,
          like a photo, may show a short progress indicator first.
        </li>
      </ol>
      <p>
        It works the other way too. Copy on your Mac with <kbd>⌘</kbd> <kbd>C</kbd>, then touch and
        hold a text field on your iPhone and tap Paste.
      </p>

      <h2>When Universal Clipboard doesn’t work</h2>
      <ul>
        <li>
          <strong>Turn Handoff off and on again</strong> on both devices. This fixes it more often
          than anything else.
        </li>
        <li>
          <strong>Paste sooner.</strong> A copy only stays available to your other devices for a
          short time. Copy it again and paste right away.
        </li>
        <li>
          <strong>Check the Apple Account</strong> on both devices. Universal Clipboard doesn’t work
          across two accounts, even in the same family.
        </li>
        <li>
          <strong>Turn Bluetooth and Wi-Fi off and on</strong>, and make sure the devices are close
          to each other.
        </li>
        <li>
          <strong>Restart both devices</strong> if it still doesn’t work.
        </li>
      </ul>

      <h2>With On Hand</h2>
      <p>
        Universal Clipboard holds one item, and only briefly. On Hand, the free clipboard manager
        for Mac, keeps what you paste from your iPhone like anything else you copy on your Mac,
        so you can find that address or code again tomorrow. Read more about{" "}
        <Link href="/mac-clipboard-history">clipboard history on Mac</Link>.
      </p>
    </>
  );
}
