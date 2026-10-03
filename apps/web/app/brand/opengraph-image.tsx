import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og"

export const alt = "Escape, the Animated Icons mark"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    label: "/brand",
    title: "Escape",
    description: "An open-cornered canvas, an accent badge escaping along a motion trail: an icon, alive.",
  })
}
