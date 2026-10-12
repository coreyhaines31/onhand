export const brewCommand = "brew install --cask coreyhaines31/tap/onhand";

export const terminalCommand = `cd "$(mktemp -d)" && curl -fsSL -o OnHand.zip https://onhandformac.com/download \\
  && ditto -x -k OnHand.zip . && spctl --assess --type execute "On Hand.app" \\
  && ditto "On Hand.app" "/Applications/On Hand.app" && open -a "On Hand"`;

export const agentPrompt = `Install On Hand, a free, open-source clipboard manager for Mac (https://github.com/coreyhaines31/onhand).
1. Run \`sw_vers -productVersion\` and stop if macOS is older than 14.
2. If /Applications/On Hand.app already exists, tell me its version and ask before replacing it.
3. If Homebrew is installed (\`command -v brew\`), run \`brew install --cask coreyhaines31/tap/onhand\` (add \`--force\` when replacing a copy that wasn't installed with Homebrew). Otherwise, in a new temporary folder: download https://onhandformac.com/download with \`curl -fsSL -o OnHand.zip\`, unzip it with \`ditto -x -k OnHand.zip .\`, make sure \`codesign --verify --deep --strict "On Hand.app"\` and \`spctl --assess --type execute "On Hand.app"\` both pass, then install it with \`ditto "On Hand.app" "/Applications/On Hand.app"\`.
4. Open it with \`open -a "On Hand"\`.
5. Tell me to click "Start keeping my clipboard" in the window that opens, and that ⌘⇧Space opens my clipboard history from any app.`;
