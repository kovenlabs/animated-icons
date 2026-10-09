import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og"
import { ICON_COUNT } from "@/lib/seo"

export const alt = "Animated Icons: icons that move, colors that follow your theme"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    label: "react · shadcn/ui · motion",
    // the landing's headline
    title: "Icons that move.",
    description: `${ICON_COUNT} animated React icons whose colors follow your shadcn/ui theme.`,
  })
}
