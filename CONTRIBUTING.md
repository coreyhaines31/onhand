# Contributing to On Hand

Thanks for helping. Bug reports, fixes, and small focused features are all welcome. For anything large, open an issue first so we can agree on the approach before you build it.

## Ground rules

- **Never share real clipboard history.** Don't attach your `history.sqlite`, screenshots of your real history, or copied text to issues, pull requests, or tests. Use made-up examples, or the demo mode below.
- **Keep capture local.** On Hand doesn't upload clipboard contents or collect analytics, and changes must keep it that way.
- **Keep the opt-in.** Nothing is captured until the person chooses "Start keeping my clipboard."

## Set up

You need macOS 14 or later, Xcode 16 or later in `/Applications`, and [Homebrew](https://brew.sh).

```sh
git clone https://github.com/coreyhaines31/onhand.git
cd onhand
brew install xcodegen swiftlint
make test      # core library tests
make lint      # SwiftLint, strict
make app       # builds dist/On Hand.app
```

The Makefile uses `/Applications/Xcode.app` directly, so it works even if `xcode-select` points somewhere else. `make app` generates the Xcode project with XcodeGen, resolves the pinned Swift packages, renders the app icon, and builds a release app with an ad-hoc signature for local use. Local builds don't check for updates.

### Set up with a coding agent

Paste this into Claude Code, Codex, or another coding agent:

```text
Set up On Hand (https://github.com/coreyhaines31/onhand) for development on this Mac.
1. Check that macOS is 14 or later and that Xcode 16 or later is installed in /Applications. Stop and tell me if not.
2. Clone the repository and install the build tools with `brew install xcodegen swiftlint`.
3. Run `make test`, `make lint`, and `make app`, and show me any failures.
4. Quit any installed copy of On Hand, then run `open "dist/On Hand.app" --args --demo`
   so the app runs with sample clips and never reads my real clipboard history.
5. Read CONTRIBUTING.md and summarize the ground rules before making any changes.
```

## Run it without touching your history

Quit any running copy of On Hand first, then:

```sh
open "dist/On Hand.app" --args --demo
```

Demo mode uses sample clips in memory, keeps its own preferences, and never reads your clipboard. Copying a sample does write it to your clipboard. Add `--paused` to see the paused state.

To check a UI change without screen-recording permission, render the panel to a PNG and quit:

```sh
"dist/On Hand.app/Contents/MacOS/On Hand" --demo --snapshot /tmp/panel.png
```

Combine it with `--filter Pinned`, `--board Snippets`, `--query coffee`, `--preview` (opens the first result), or `--paused`.

## Project layout

| Path | What's there |
|---|---|
| `Sources/OnHandCore/` | The core library: SQLite history store, capture rules, sensitive-content detection, on-device text recognition. No UI. |
| `Tests/OnHandCoreTests/` | Swift Testing tests for the core library (`make test`). |
| `App/` | The macOS app: menu bar item, history panel (SwiftUI), settings, updates. |
| `CLI/` | The `onhand` command. It's bundled at `On Hand.app/Contents/MacOS/onhand` and reads the same history file. |
| `Resources/` | App icon and `Info.plist`. |
| `project.yml` | XcodeGen spec: app target, version numbers, and pinned dependencies (KeyboardShortcuts, Sparkle). |
| `scripts/` | Local build, app icon rendering, release, and Homebrew cask scripts. |
| `site/` | The onhandformac.com website (Next.js). |

## How capture works

The app polls the general pasteboard about every 0.6 seconds. Each new copy is checked against `CapturePolicy` (concealed, transient, and auto-generated types, plus excluded apps) and `SensitiveContent` (card numbers, US Social Security numbers, secret keys) before it's saved. Images are saved first, then read in the background with `TextRecognizer`; if their text matches `SensitiveContent`, the image is deleted.

History lives in `~/Library/Application Support/OnHand/history.sqlite`: owner-only permissions, SQLite secure delete on, not separately encrypted. It's capped at 500 clips and 50 MB, evicting the oldest unpinned clips first. Text over 1 MB, images over 10 MB, and copied files are skipped. Rich text is saved as plain text. New columns are added automatically when an older history file is opened, so add a test that opens an old-format file whenever you change the schema.

To try the command against throwaway history instead of yours, point it at another home folder. Preferences, like pause, still use your real ones:

```sh
mkdir -p /tmp/onhand-home/Library/Application\ Support/OnHand
touch /tmp/onhand-home/Library/Application\ Support/OnHand/history.sqlite
CFFIXED_USER_HOME=/tmp/onhand-home "dist/On Hand.app/Contents/MacOS/onhand" status
```

## Making a change

1. Branch from the default branch and keep each commit to one change.
2. Add or update tests in `Tests/OnHandCoreTests/` for anything in `OnHandCore`.
3. Run `make lint` and `make test`.
4. For UI changes, run `make app`, try the change in demo mode, and attach a `--snapshot` image to your pull request.
5. Open a pull request that explains what changed and why.

CI runs lint, tests, and a full app build on every pull request, plus lint, typecheck, and build for the website.

## The website

```sh
cd site
npm ci
npm run dev
npm run lint && npm run typecheck && npm run build
```

Node 22 or later. The site doesn't need any environment variables.

## Releases

Maintainers sign, notarize, and publish releases. See [RELEASING.md](RELEASING.md).

## License

On Hand is MIT-licensed, and so are contributions. There's no contributor license agreement or copyright assignment.
