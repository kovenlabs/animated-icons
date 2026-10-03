import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og"
import { SITE_TAGLINE } from "@/lib/seo"

export const alt = "Animated Icons: icons that move, colors that follow your theme"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    label: "react · shadcn/ui · motion",
    title: SITE_TAGLINE,
    description: "70 animated icons with 1–3 theme color slots and their own animations.",
  })
}
