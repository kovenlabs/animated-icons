import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    // /api is machinery. /og stays crawlable: X fetches
    // card images only where robots.txt allows
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
