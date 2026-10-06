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
    "Find and reuse copied text, links, and images with On Hand, a native clipboard manager for Mac. Local history, pinned clips, and keyboard shortcuts. Free and open source.",
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
          <Script
            src="https://cdn.usefathom.com/script.js"
            data-site="CWVCJNNN"
            data-spa="auto"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
