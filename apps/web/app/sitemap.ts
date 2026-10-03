import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"
import { source } from "@/lib/source"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  })
  return [
    page("/", 1),
    page("/icons", 0.9),
    ...source.getPages().map((doc) => page(doc.url, doc.slugs.length ? 0.7 : 0.8)),
    page("/brand", 0.3),
  ]
}
