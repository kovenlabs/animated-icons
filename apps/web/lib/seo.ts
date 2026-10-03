import type { Metadata } from "next"

export const SITE_NAME = "Animated Icons"
export const SITE_TAGLINE = "Icons that move. Colors that follow your theme."
export const SITE_DESCRIPTION =
  "70 animated React icons with one to three color slots that read from your shadcn/ui theme. Per-icon variants, round or sharp corners, hover, click or in-view triggers. Install from npm or copy them with the shadcn CLI."

/**
 * Title, description, canonical URL and social cards for one page. Social images come from the route's
 * `opengraph-image` / `twitter-image` files, or are passed in (docs pages).
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title?: string
  description: string
  path: string
  image?: { url: string; alt: string }
}): Metadata {
  const socialTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: ${SITE_TAGLINE}`
  const images = image ? [{ ...image, width: 1200, height: 630 }] : undefined
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", url: path, title: socialTitle, description, images },
    twitter: { card: "summary_large_image", title: socialTitle, description, images },
  }
}
