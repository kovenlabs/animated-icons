import site from "../site.config.json"

/** The site's public URL (no trailing slash). One home: site.config.json. */
export const SITE_URL = site.url.replace(/\/$/, "")
export const GITHUB_URL = "https://github.com/kovenlabs/animated-icons"
