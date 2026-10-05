import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "On Hand — Everything you copy, close at hand.",
  description:
    "A small, native clipboard manager for Mac. Find your copied text, links, and images. Local by default, open-source by design.",
  metadataBase: new URL("https://onhandformac.com"),
  openGraph: {
    title: "On Hand",
    description: "Everything you copy, close at hand.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
