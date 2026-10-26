import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { siteUrl } from "@/lib/site";
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
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.VERCEL_ENV === "production" && (
          <>
            <Script
              src="https://cdn.usefathom.com/script.js"
              data-site="CWVCJNNN"
              data-spa="auto"
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
