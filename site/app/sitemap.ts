import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const paths = ["/", "/install", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }));
}
