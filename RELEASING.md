# Releasing On Hand

Public source and releases: https://github.com/coreyhaines31/onhand

## Prerequisites

- Full Xcode, XcodeGen, SwiftLint, and authenticated GitHub CLI.
- An Xcode account with Developer ID cloud-signing access to the Apple Developer team.
- A working `notarytool` Keychain profile for that team.
- A Sparkle Ed25519 key in the login Keychain under account `onhand`.

Generate the update key once using `.build-app/SourcePackages/artifacts/sparkle/Sparkle/bin/generate_keys --account onhand`. Back up the private key securely outside the repository. Never rotate it without planning how existing installations will trust subsequent updates.

## Build and verify

Update `MARKETING_VERSION` and monotonically increase `CURRENT_PROJECT_VERSION` in `project.yml`, then run:

```sh
APPLE_TEAM_ID=YOUR_TEAM_ID NOTARY_PROFILE=YOUR_PROFILE bash scripts/release.sh
```

The script runs lint and core tests, builds a universal archive, preserves hardened runtime in the archive signature, exports with cloud-managed Developer ID signing, submits to Apple's notary service, checks acceptance, staples the ticket, and verifies Gatekeeper. It creates a new `dist/release.XXXXXX/updates` directory with the versioned ZIP, signed appcast, and SHA-256 checksum. Release-specific plist changes are restored on exit.

The stable update feed is `https://github.com/coreyhaines31/onhand/releases/latest/download/appcast.xml`. Override `SPARKLE_FEED_URL` only for isolated testing or an intentional migration. `SPARKLE_ACCOUNT` defaults to `onhand`. Local `make app` builds deliberately omit the update configuration.

## Publish

Complete release QA and merge the tested feature PR into `cf/development`. Create the version tag from that exact commit, then publish the generated ZIP, appcast, and checksum as a GitHub release. The latest-release feed requires a regular release, not a draft or prerelease.

Before replacing an existing release, test an upgrade from the previous signed version. The original ad-hoc developer preview has no updater; its users must install the first signed release manually. Confirm the update archive's signature matches the public key embedded in the app, and verify the public download checksum after publishing.

Do not overwrite published versioned archives. A changed binary requires a new version and build number.

## Website

The website links to versioned GitHub release assets and the public source repository. Update the download URL when publishing a new version. Keep compatibility and installation copy aligned with the tested release.

Run `npm --prefix site run lint`, `npm --prefix site run typecheck`, and `npm --prefix site run build` before deploying. Fathom is enabled only for Vercel production builds. Deploy from the repository root with `vercel deploy --cwd site --prod --scope coreys-apps`.

`bash scripts/package-preview.sh` remains available for local developer previews; its output is not a signed public release.
