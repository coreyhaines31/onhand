import type { MetadataRoute } from "next";
import { alternatives } from "@/lib/alternatives";
import { siteUrl } from "@/lib/site";

const paths = [
  "/",
  "/mac-clipboard-history",
  "/alternatives",
  ...alternatives.map(({ slug }) => `/alternatives/${slug}`),
  "/install",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }));
}
