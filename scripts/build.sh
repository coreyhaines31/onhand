#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
export DEVELOPER_DIR="${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}"
mkdir -p .build-app/OnHand.iconset
swiftc App/BrandIcon.swift scripts/icon.swift -o .build-app/render-icon
.build-app/render-icon .build-app/OnHand.iconset
iconutil -c icns .build-app/OnHand.iconset -o Resources/OnHand.icns
xcodegen generate
xcodebuild -project OnHand.xcodeproj -scheme OnHand -configuration Release \
  -derivedDataPath .build-app CODE_SIGNING_ALLOWED=NO build
mkdir -p dist
ditto '.build-app/Build/Products/Release/On Hand.app' 'dist/On Hand.app'
codesign --force --deep --sign - 'dist/On Hand.app'
printf '\nBuilt %s/dist/On Hand.app\n' "$PWD"
