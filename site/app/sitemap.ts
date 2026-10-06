import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const paths = ["/", "/mac-clipboard-history", "/install", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }));
}
