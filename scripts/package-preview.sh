#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ ! -d 'dist/On Hand.app' ]]; then
  make app
fi
mkdir -p site/public/downloads
ditto -c -k --sequesterRsrc --keepParent 'dist/On Hand.app' site/public/downloads/on-hand-0.1.0-preview.zip
git archive --format=zip --prefix=onhand/ HEAD -o site/public/downloads/on-hand-source.zip
printf 'Packaged local preview and committed source in site/public/downloads/\n'
