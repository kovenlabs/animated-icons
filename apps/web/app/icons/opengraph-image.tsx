import { readdir } from "node:fs/promises"
import { join } from "node:path"

import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og"

export const alt = "The Animated Icons catalog"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  // the real count, from the package's icon files (icon modules are client code: not importable here)
  const files = await readdir(join(process.cwd(), "../../packages/animated-icons/src/icons"))
  const count = files.filter((file) => file.endsWith(".tsx")).length
  return ogImage({
    label: "/icons",
    title: `${count} animated icons`,
    description: "Search, customize colors, size, speed and corners, then copy the JSX or the install command.",
  })
}
