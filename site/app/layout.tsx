import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
export const metadata: Metadata = {
  title: "On Hand — Free clipboard manager for Mac",
  description:
    "Find and reuse copied text, links, and images with On Hand, a native clipboard manager for Mac. Local history, pinned clips, and keyboard shortcuts. Free and open source.",
  metadataBase: new URL("https://onhandformac.com"),
  openGraph: {
    title: "On Hand",
    description:
      "Copy it once. Find it again. A native clipboard manager that keeps your history on your Mac.",
    type: "website",
  },
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
