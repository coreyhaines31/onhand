import type { Metadata } from "next";
import Script from "next/script";
import "./brushed/brushed.css";
import "./brushed/popover.css";
import "./globals.css";
import "./styles/demo.css";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Semi+Condensed:wght@300;600;700&display=swap"
        />
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
