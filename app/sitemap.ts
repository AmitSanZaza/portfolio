import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const publicPaths = ["/", "/about", "/skills", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return publicPaths.map((path) => ({ url: new URL(path, base).toString() }));
}
