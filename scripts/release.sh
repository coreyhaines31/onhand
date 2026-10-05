#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
export DEVELOPER_DIR="${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}"
: "${SIGNING_IDENTITY:?Set your Developer ID Application identity}"
: "${APPLE_TEAM_ID:?Set your Apple Developer team ID}"
: "${NOTARY_PROFILE:?Set the notarytool keychain profile name}"
: "${SPARKLE_PUBLIC_KEY:?Set your Sparkle Ed25519 public key}"
: "${SPARKLE_FEED_URL:?Set the public HTTPS appcast URL}"
[[ "$SPARKLE_FEED_URL" == https://* ]] || { echo 'The appcast URL must use HTTPS.'; exit 1; }
make lint
make test
mkdir -p .build-app/OnHand.iconset dist/release
swift scripts/icon.swift .build-app/OnHand.iconset
iconutil -c icns .build-app/OnHand.iconset -o Resources/OnHand.icns
xcodegen generate
/usr/libexec/PlistBuddy -c "Add :SUFeedURL string $SPARKLE_FEED_URL" Resources/Info.plist
/usr/libexec/PlistBuddy -c "Add :SUPublicEDKey string $SPARKLE_PUBLIC_KEY" Resources/Info.plist
cleanup() {
  /usr/libexec/PlistBuddy -c 'Delete :SUFeedURL' Resources/Info.plist
  /usr/libexec/PlistBuddy -c 'Delete :SUPublicEDKey' Resources/Info.plist
}
trap cleanup EXIT
xcodebuild -project OnHand.xcodeproj -scheme OnHand -configuration Release \
  -derivedDataPath .build-release ARCHS='arm64 x86_64' ONLY_ACTIVE_ARCH=NO \
  DEVELOPMENT_TEAM="$APPLE_TEAM_ID" CODE_SIGN_IDENTITY="$SIGNING_IDENTITY" \
  CODE_SIGN_STYLE=Manual build
app='.build-release/Build/Products/Release/On Hand.app'
codesign --verify --deep --strict "$app"
ditto -c -k --sequesterRsrc --keepParent "$app" dist/release/OnHand-notarization.zip
xcrun notarytool submit dist/release/OnHand-notarization.zip --keychain-profile "$NOTARY_PROFILE" --wait
xcrun stapler staple "$app"
xcrun stapler validate "$app"
spctl --assess --type execute --verbose "$app"
ditto -c -k --sequesterRsrc --keepParent "$app" dist/release/OnHand.zip
printf 'Signed and notarized app: %s/dist/release/OnHand.zip\n' "$PWD"
printf 'Generate and sign the appcast with Sparkle before publishing the update.\n'
