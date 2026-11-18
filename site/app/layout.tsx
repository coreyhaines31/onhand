import type { Metadata } from "next";
import Script from "next/script";
import { preload } from "react-dom";
import "./brushed/brushed.css";
import "./brushed/popover.css";
import "./globals.css";
import "./styles/hero.css";
import "./styles/demo.css";
import "./styles/home.css";
import "./styles/longform.css";
import "./styles/footer.css";
import { siteUrl } from "@/lib/site";

// Self-hosted Barlow from mac-app-kit site-kit (fonts.html). font-display: optional keeps text from shifting.
const latin =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const fontFaces = [
  ["Barlow", 400, "barlow-400"],
  ["Barlow", 500, "barlow-500"],
  ["Barlow", 600, "barlow-600"],
  ["Barlow Semi Condensed", 300, "barlow-semi-condensed-300"],
  ["Barlow Semi Condensed", 600, "barlow-semi-condensed-600"],
  ["Barlow Semi Condensed", 700, "barlow-semi-condensed-700"],
]
  .map(
    ([family, weight, file]) =>
      `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:optional;src:url(/fonts/${file}.woff2) format("woff2");unicode-range:${latin};}`,
  )
  .join("");
export const metadata: Metadata = {
  title: {
    default: "On Hand — Free, Open-Source Clipboard Manager for Mac",
    template: "%s · On Hand",
  },
  description:
    "On Hand is a free, open-source clipboard manager for Mac. Search and reuse the text, links, and images you copied, pin what you reuse, and keep it all local.",
  metadataBase: new URL(siteUrl),
  openGraph: { siteName: "On Hand", type: "website" },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  preload("/fonts/barlow-400.woff2", { as: "font", type: "font/woff2", crossOrigin: "" });
  preload("/fonts/barlow-semi-condensed-600.woff2", { as: "font", type: "font/woff2", crossOrigin: "" });
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: fontFaces }} />
      </head>
      <body className="bx">
        {children}
        {process.env.VERCEL_ENV === "production" && (
          <>
            <Script
              src="https://tracerkit.com/t.js"
              data-key="tk_reSNBkS6vAJ2q-uW"
              strategy="afterInteractive"
            />
            <Script
              src="https://ingest.getuserproof.com/sdk.js"
              data-site="542c6d00-5847-4cda-84c2-dccc11b80915"
              strategy="afterInteractive"
            />
          </>
        )}
      </body>
    </html>
  );
}
