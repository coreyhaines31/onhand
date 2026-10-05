#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
case "${DEVELOPER_DIR:-}" in
  ""|*CommandLineTools*) export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer ;;
esac
: "${APPLE_TEAM_ID:?Set your Apple Developer team ID}"
: "${NOTARY_PROFILE:?Set the notarytool keychain profile name}"
SPARKLE_ACCOUNT="${SPARKLE_ACCOUNT:-onhand}"
SPARKLE_FEED_URL="${SPARKLE_FEED_URL:-https://github.com/coreyhaines31/onhand/releases/latest/download/appcast.xml}"
[[ "$SPARKLE_FEED_URL" == https://* ]] || { echo 'The appcast URL must use HTTPS.'; exit 1; }
make lint
make test
make app
SPARKLE_BIN='.build-app/SourcePackages/artifacts/sparkle/Sparkle/bin'
SPARKLE_PUBLIC_KEY=$("$SPARKLE_BIN/generate_keys" --account "$SPARKLE_ACCOUNT" -p)
RELEASE_DIR=$(mktemp -d "$PWD/dist/release.XXXXXX")
PLIST_BACKUP="$RELEASE_DIR/Info.plist.original"
cp Resources/Info.plist "$PLIST_BACKUP"
trap 'cp "$PLIST_BACKUP" Resources/Info.plist' EXIT
/usr/libexec/PlistBuddy -c "Add :SUFeedURL string $SPARKLE_FEED_URL" Resources/Info.plist
/usr/libexec/PlistBuddy -c "Add :SUPublicEDKey string $SPARKLE_PUBLIC_KEY" Resources/Info.plist
xcodebuild -project OnHand.xcodeproj -scheme OnHand -configuration Release \
  -derivedDataPath .build-release -archivePath "$RELEASE_DIR/OnHand.xcarchive" \
  ARCHS='arm64 x86_64' ONLY_ACTIVE_ARCH=NO CODE_SIGNING_ALLOWED=NO archive
codesign --force --sign - --options runtime \
  "$RELEASE_DIR/OnHand.xcarchive/Products/Applications/On Hand.app"
export RELEASE_DIR APPLE_TEAM_ID
python3 - <<'PY'
import os
import plistlib
from pathlib import Path
Path(os.environ['RELEASE_DIR'], 'export.plist').write_bytes(plistlib.dumps(dict(
    method='developer-id', teamID=os.environ['APPLE_TEAM_ID'], signingStyle='automatic'
)))
PY
xcodebuild -exportArchive -archivePath "$RELEASE_DIR/OnHand.xcarchive" \
  -exportOptionsPlist "$RELEASE_DIR/export.plist" -exportPath "$RELEASE_DIR/export" \
  -allowProvisioningUpdates
app="$RELEASE_DIR/export/On Hand.app"
codesign --verify --deep --strict "$app"
ditto -c -k --sequesterRsrc --keepParent "$app" "$RELEASE_DIR/notarize.zip"
xcrun notarytool submit "$RELEASE_DIR/notarize.zip" --keychain-profile "$NOTARY_PROFILE" \
  --wait --output-format json > "$RELEASE_DIR/notarization.json"
python3 - <<'PYNOTARY'
import json
import os
from pathlib import Path
result = json.loads(Path(os.environ['RELEASE_DIR'], 'notarization.json').read_text())
if result['status'] != 'Accepted':
    raise SystemExit(f"Notarization {result['status']}; inspect submission {result['id']}")
print(f"Notarization accepted: {result['id']}")
PYNOTARY
xcrun stapler staple "$app"
xcrun stapler validate "$app"
spctl --assess --type execute --verbose "$app"
VERSION=$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$app/Contents/Info.plist")
mkdir -p "$RELEASE_DIR/updates"
ditto -c -k --sequesterRsrc --keepParent "$app" "$RELEASE_DIR/updates/OnHand-$VERSION.zip"
"$SPARKLE_BIN/generate_appcast" --account "$SPARKLE_ACCOUNT" \
  --download-url-prefix "https://github.com/coreyhaines31/onhand/releases/download/v$VERSION/" \
  --link 'https://onhand-tan.vercel.app' "$RELEASE_DIR/updates"
(cd "$RELEASE_DIR/updates" && shasum -a 256 "OnHand-$VERSION.zip" > SHA256SUMS.txt)
printf 'Signed release and update feed ready: %s/updates\n' "$RELEASE_DIR"
