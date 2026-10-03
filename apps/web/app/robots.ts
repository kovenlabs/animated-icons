import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    // /e2e is a test harness (404 outside e2e builds); /api is machinery. /og stays crawlable: X fetches
    // card images only where robots.txt allows
    rules: { userAgent: "*", allow: "/", disallow: ["/e2e/", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
