# On Hand

**Copy it once. Find it again.** On Hand is a free, open-source clipboard manager for Mac. It remembers the text, links, and images you copy, so you can search for them later and copy them back, and it keeps everything on your Mac.

<p align="center">
  <img src="docs/images/history.png" alt="On Hand's history panel listing recent clips" width="400">
</p>

- **Search everything you copied**, including the text inside screenshots.
- **Pin what you reuse** and group pins into boards, like Snippets or Addresses.
- **Keyboard first:** open history from any app with ⌘⇧Space.
- **Private by default:** no account, no sync, no analytics. Card numbers, Social Security numbers, and secret keys are never saved.
- **Keeps what you send, if you want it to:** turn on Sent messages and On Hand also saves what you send in apps you choose, like Slack, so you can find a message again or bring it back with ⌃⌥↑.
- **Works with AI agents:** the `onhand` command lets Claude Code, Codex, or a script search and reuse your clips from Terminal.

[Website](https://onhandformac.com) · [Download](https://onhandformac.com/download) · [Releases](https://github.com/coreyhaines31/onhand/releases)

## Requirements

macOS 14 Sonoma or later, on Apple silicon or Intel.

## Install

**Download:** get the latest release from [onhandformac.com](https://onhandformac.com/download), unzip it, and move **On Hand.app** to your Applications folder. The app is signed and notarized by Apple.

**Homebrew:**

```sh
brew install --cask coreyhaines31/tap/onhand
```

**Terminal, without Homebrew:** downloads the latest release, checks Apple's signature, and installs it. It stops if On Hand is already installed; installed copies update themselves.

```sh
test ! -e "/Applications/On Hand.app" && cd "$(mktemp -d)" \
  && curl -fsSL -o OnHand.zip https://onhandformac.com/download \
  && ditto -x -k OnHand.zip . && spctl --assess --type execute "On Hand.app" \
  && ditto "On Hand.app" "/Applications/On Hand.app" && open -a "On Hand"
```

**Ask Claude Code, Codex, or another coding agent:** paste this prompt.

```text
Install On Hand, a free, open-source clipboard manager for Mac (https://github.com/coreyhaines31/onhand).
1. Run `sw_vers -productVersion` and stop if macOS is older than 14.
2. If /Applications/On Hand.app already exists, tell me its version and ask before replacing it.
3. If Homebrew is installed (`command -v brew`), run `brew install --cask coreyhaines31/tap/onhand` (add `--force` when replacing a copy that wasn't installed with Homebrew). Otherwise, in a new temporary folder: download https://onhandformac.com/download with `curl -fsSL -o OnHand.zip`, unzip it with `ditto -x -k OnHand.zip .`, make sure `codesign --verify --deep --strict "On Hand.app"` and `spctl --assess --type execute "On Hand.app"` both pass, then move any existing /Applications/On Hand.app to the Trash and install with `ditto "On Hand.app" "/Applications/On Hand.app"`.
4. Open it with `open -a "On Hand"`.
5. Tell me to click "Start keeping my clipboard" in the window that opens, and that ⌘⇧Space opens my clipboard history from any app.
```

On Hand updates itself. Check anytime from ⋯ › Settings › Check for updates.

## Getting started

1. **Open On Hand** from Applications. A paperclip appears in your menu bar and the history window opens.
2. **Choose "Start keeping my clipboard."** On Hand only saves things you copy from now on. It never imports what was on your clipboard before.
3. **Copy something** in any app, the way you normally would.
4. **Press ⌘⇧Space** (or click the paperclip) to open your history. Type to search, then press Return to copy a clip back.
5. **Paste with ⌘V** in the app you're working in. On Hand switches you back to it automatically.

On Hand starts with your Mac. To stop that, turn off **Launch at login** in Settings.

## Everyday use

| Shortcut | What it does |
|---|---|
| ⌘⇧Space | Open or close history from any app (change it in Settings) |
| ↑ ↓, then Return | Select a clip and copy it |
| ⌘1–⌘9 | Copy one of the first nine results |
| ⌘F | Search |
| ⌘O | Preview the selected clip |
| ⌘P | Pin or unpin the selected clip |
| Esc | Leave a preview, or close history |
| ⌃⌥⌘⌫ | Forget your last copy: deletes it from history and clears the clipboard |
| ⌃⌥↑ / ⌃⌥↓ | In a message box, step back and forward through what you sent from that app (when Sent messages is on) |

- **Filter** with the All, Pinned, Links, and Images tabs.
- **Pin to a board:** right-click a clip and choose **Pin to Board**. Under **Pinned**, click a board to see just its clips. Pinned clips never expire.
- **Find a screenshot by its text:** search for any word in it. Preview an image to select and copy its text.
- **Copy several clips into another app:** turn on ⋯ › **Keep Window Open While Switching Apps**.
- **Delete a clip:** right-click it and choose **Delete**.
- **Pause capture** with the pause button in the header before copying something private.

### Sent messages

Like ↑ in Terminal, but for every app you choose. Turn it on in ⋯ › Settings › **Sent messages**, then add the apps you send from, such as Slack, Messages, or Claude.

- **What it saves:** when a message box empties after you send, On Hand saves what was in it as a clip labeled *Sent*. Find them under the **Sent** tab, or search like any other clip.
- **Bring one back:** in a message box, press ⌃⌥↑ to fill in your last message from that app, again for the one before, and ⌃⌥↓ to go forward. Change the shortcuts in Settings.
- **What it needs:** Accessibility access, which macOS asks for when you turn it on. On Hand uses it only to read the message box in the apps you listed. It never records keystrokes, and password fields are skipped. A message you delete all at once may also be saved.
- **Where it works:** apps with standard text fields, including Slack, Messages, and Claude. Some apps don't share their text fields with macOS, and On Hand can't see messages sent from those.

<p align="center">
  <img src="docs/images/screenshot-text.png" alt="Previewing a copied screenshot with its recognized text" width="330">
  &nbsp;
  <img src="docs/images/pinboards.png" alt="Pinned clips grouped into boards" width="330">
</p>

## Command line

The `onhand` command searches and reuses your history from Terminal, so you, a script, or an AI agent can find something you copied without opening the panel.

```sh
onhand search invoice              # newest matching clips, one line each
onhand search --kind link --limit 5
onhand get 3f2a91c0                # the full text; for a screenshot, the text in it
onhand copy 3f2a91c0               # put it back on the clipboard
onhand pin 3f2a91c0 --board Snippets
onhand pause                       # stop saving copies; `onhand resume` to start again
```

- **IDs** come from `onhand search`. Any unique start of one works, like a short Git hash.
- **Everything else:** `unpin`, `boards`, `delete`, `forget-last` (clears the clipboard and deletes it from history), and `status`. `search --sent` lists only messages you sent. Run `onhand help` for details.
- **`--json`** on `search`, `get`, `boards`, and `status` prints JSON for scripts.
- It works whether or not On Hand is running, and the app picks up changes right away. `get --image out.png` saves an image clip.

**Installing the command:** Homebrew links it for you. If you installed another way, link it once:

```sh
sudo mkdir -p /usr/local/bin
sudo ln -sf "/Applications/On Hand.app/Contents/MacOS/onhand" /usr/local/bin/onhand
```

**For AI agents:** add a line like this to your `CLAUDE.md` or `AGENTS.md`:

```text
On Hand keeps my clipboard history. When I mention something I copied earlier, find it with `onhand search <words>` and read it with `onhand get <id>`. Ask before deleting anything.
```

Anything your agent reads with `onhand` is sent to its AI provider, like any file it reads. `search` shows only a one-line preview of each clip; the full text comes from `get`, one clip at a time.

## Privacy

- **Everything stays on your Mac.** History is a local database in `~/Library/Application Support/OnHand`. Nothing is uploaded, and the app has no analytics. Text in images is recognized on your Mac with Apple's Vision framework.
- **Sensitive copies are skipped.** On Hand ignores clipboard items that apps mark as concealed or temporary. It also excludes 1Password, Bitwarden, Apple Passwords, Dashlane, and LastPass by default, and doesn't save card numbers, US Social Security numbers, or common secret keys, including ones inside screenshots.
- **These checks can't catch everything.** Addresses, passwords you type yourself, and other private details can still be saved. Pause capture first, or press ⌃⌥⌘⌫ to forget a copy.
- **Sent messages are off by default.** When you turn them on, On Hand reads only the message box in the apps you choose, never records keystrokes, skips password fields, and checks what you send for card numbers, Social Security numbers, and secret keys like any copy.
- **Agents only see what they ask for.** The `onhand` command doesn't send anything anywhere itself, but whatever an AI agent reads with it goes to that agent's provider.
- **You control retention.** Unpinned clips expire after 7 days by default; choose 1, 7, 30, or 90 days in Settings. History holds up to 500 clips or 50 MB.

Read the full [privacy policy](https://onhandformac.com/privacy).

## Troubleshooting

**Nothing new shows up in history.** Check whether capture is paused: a banner says so under the search field. Click **Resume**. Copies from excluded apps (Settings › Privacy) and copied files are never saved.

**⌘⇧Space doesn't open On Hand.** Another app may use the same shortcut. Pick a different one in Settings › Open On Hand.

**macOS asks whether On Hand can paste from other apps.** Choose **Allow**. On Hand needs to read the clipboard to save your history. You can change this later in System Settings › Privacy & Security.

**I can't see the paperclip in the menu bar.** Your menu bar may be full or hiding icons. Press ⌘⇧Space instead, or open On Hand again from Applications.

**A copy I expected was skipped.** On Hand skips text over 1 MB, images over 10 MB, and anything that looks like a card number, Social Security number, or secret key. The menu bar icon briefly shows a raised hand when it skips one of those. You can turn this off in Settings › Privacy.

Something else? [Open an issue](https://github.com/coreyhaines31/onhand/issues/new/choose). Please describe the problem without pasting your real clipboard history.

## Uninstall

Quit On Hand from ⋯ › Settings, then drag **On Hand.app** to the Trash. If you linked the `onhand` command, also remove `/usr/local/bin/onhand`. To also delete your history and settings, remove:

```
~/Library/Application Support/OnHand
~/Library/Preferences/com.onhandformac.OnHand.plist
```

With Homebrew, `brew uninstall --zap --cask onhand` does all of this.

## Build from source

You need macOS 14+, Xcode 16 or later, and [Homebrew](https://brew.sh).

```sh
git clone https://github.com/coreyhaines31/onhand.git
cd onhand
brew install xcodegen swiftlint
make app
open "dist/On Hand.app"
```

Or ask your coding agent to set it up; [CONTRIBUTING.md](CONTRIBUTING.md#set-up-with-a-coding-agent) has a prompt to paste. It also covers tests, project layout, and how to submit changes.

## License

[MIT](LICENSE). Free to use, modify, and share.
