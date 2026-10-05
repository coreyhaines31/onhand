# Releasing On Hand

The MVP is an ad-hoc-signed developer preview. Do not label it notarized or enable a public update feed until the steps below pass.

## Public release prerequisites

- A public source repository and versioned release destination.
- A Developer ID Application signing identity with access to its private key.
- An Apple Developer team ID and a `notarytool` keychain profile.
- A Sparkle Ed25519 key pair. Keep the private key in the macOS keychain or protected CI secrets; never commit it.
- A stable HTTPS URL for the signed appcast and publicly downloadable release archive.

The local preview deliberately omits `SUFeedURL` and `SUPublicEDKey`. The app only initializes Sparkle when both are present.

## Build a signed universal release

Update `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` in `project.yml`. Set the following environment variables without committing their values:

```sh
export SIGNING_IDENTITY='Developer ID Application: YOUR NAME (TEAMID)'
export APPLE_TEAM_ID='TEAMID'
export NOTARY_PROFILE='onhand-notary'
export SPARKLE_PUBLIC_KEY='YOUR_ED25519_PUBLIC_KEY'
export SPARKLE_FEED_URL='https://YOUR_HOST/appcast.xml'
bash scripts/release.sh
```

The script validates, builds both arm64 and x86_64, signs through Xcode, submits to Apple's notary service, staples the ticket, and verifies Gatekeeper acceptance. It stops on errors and creates `dist/release/OnHand.zip`. The signing/notarization path requires your Apple credentials and has not been exercised by the local MVP checks.

Use the `generate_appcast` tool from the resolved Sparkle package to generate the appcast for the release directory and sign each update with the matching private key. Confirm its download URL, version, minimum macOS version, and Ed25519 signature. Publish the appcast and archive together only after testing an upgrade from the previous signed version.

## Website

For a developer preview, `bash scripts/package-preview.sh` packages the local app and the committed source tree. Commit all intended source before running it. The ZIP files are ignored by Git; they must be generated before a Vercel CLI deployment, or supplied as build artifacts for a Git-based deployment.

For public release, replace the preview download URLs and unnotarized labels in `site/app/page.tsx` and `site/app/install/page.tsx` with the signed release URL and accurate installation copy. Set the Vercel project's root to `site`. Register and verify the domain before adding it; no domain was purchased by the MVP workflow.
