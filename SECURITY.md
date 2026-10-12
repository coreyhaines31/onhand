# Security

On Hand stores clipboard history, which can include private information, so security reports matter a lot to us.

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub: open the [Security tab](https://github.com/coreyhaines31/onhand/security) and choose **Report a vulnerability**. Don't open a public issue.

Include the On Hand version (⋯ › Settings shows it), your macOS version, and steps to reproduce. Use made-up clipboard contents, never your real history.

You'll get a reply within a few days. Fixes ship as a signed release that existing installs receive through automatic updates.

## Supported versions

Only the latest release gets security fixes. On Hand updates itself, or you can check from ⋯ › Settings › Check for updates.

## In scope

- Clipboard contents leaving the Mac, or being readable by other users on it
- Sensitive clips being saved when they should be skipped (concealed items, excluded apps, card numbers, Social Security numbers, secret keys)
- The update mechanism, such as installing an update that isn't signed by On Hand's release key
