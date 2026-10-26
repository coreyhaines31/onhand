import type { MetadataRoute } from "next";
import { alternatives } from "@/lib/alternatives";
import { guides } from "@/lib/guides";
import { siteUrl } from "@/lib/site";

const paths = [
  "/",
  "/mac-clipboard-history",
  "/guides",
  ...guides.map(({ slug }) => `/guides/${slug}`),
  "/features/search-text-in-images",
  "/features/command-line",
  "/features/protect-api-keys",
  "/best-clipboard-managers-for-mac",
  "/alternatives",
  ...alternatives.map(({ slug }) => `/alternatives/${slug}`),
  "/install",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }));
}
