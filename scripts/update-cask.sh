#!/usr/bin/env bash
# Points the Homebrew cask in coreyhaines31/homebrew-tap at a published release.
# Usage: bash scripts/update-cask.sh 1.1.0
set -euo pipefail
VERSION="${1:?Usage: bash scripts/update-cask.sh VERSION}"
TEMPLATE="$(cd "$(dirname "$0")" && pwd)/homebrew/onhand.rb"
WORK=$(mktemp -d)
trap 'command -v trash >/dev/null && trash "$WORK"' EXIT

gh release download "v$VERSION" --repo coreyhaines31/onhand --pattern SHA256SUMS.txt --dir "$WORK"
SHA=$(awk -v file="OnHand-$VERSION.zip" '$2 == file { print $1 }' "$WORK/SHA256SUMS.txt")
[ -n "$SHA" ] || { echo "No checksum for OnHand-$VERSION.zip in the v$VERSION release" >&2; exit 1; }

TAP="$WORK/homebrew-tap"
gh repo clone coreyhaines31/homebrew-tap "$TAP" -- --quiet --depth 1
CASK="$TAP/Casks/onhand.rb"
# The first run adds the cask from scripts/homebrew.
[ -f "$CASK" ] || cp "$TEMPLATE" "$CASK"
sed -i '' -e "s/^  version \".*\"/  version \"$VERSION\"/" -e "s/^  sha256 \".*\"/  sha256 \"$SHA\"/" "$CASK"
git -C "$TAP" add Casks/onhand.rb
if git -C "$TAP" diff --cached --quiet; then
  echo "Cask already at $VERSION"
else
  git -C "$TAP" commit -qm "onhand $VERSION"
  git -C "$TAP" push -q
  echo "✓ Cask updated to $VERSION"
fi
