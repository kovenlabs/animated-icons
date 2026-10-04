import * as library from "@kovenlabs/animated-icons"
import type { AnimatedIconProps, IconCategory, IconMeta } from "@kovenlabs/animated-icons"
import type { ComponentType } from "react"

export type CatalogIcon = ComponentType<AnimatedIconProps> & { meta: IconMeta }

const isIcon = (value: unknown): value is CatalogIcon =>
  typeof value === "function" && "meta" in value

/**
 * Every icon the package exports, discovered by its `meta`: a new icon shows up with no wiring. Each icon is
 * exported twice (`Bell` and its alias `BellIcon`), so keep one entry per component.
 */
export const icons: CatalogIcon[] = [...new Set((Object.values(library) as unknown[]).filter(isIcon))]
  .sort((a, b) => a.meta.name.localeCompare(b.meta.name))

export const iconsByName = new Map(icons.map((icon) => [icon.meta.name, icon]))

export const categories = [...new Set(icons.map((icon) => icon.meta.category))]
  .sort()
  .map((category) => ({
    category,
    count: icons.filter((icon) => icon.meta.category === category).length,
  }))

/** The other shapes in an icon's family, e.g. message → message-text, messages. */
export function siblingsOf(icon: CatalogIcon) {
  return icons.filter((other) => other.meta.family === icon.meta.family && other !== icon)
}

export interface IconFilter {
  query: string
  category: IconCategory | null
  colors: number | null
}

const haystack = ({ meta }: CatalogIcon) =>
  [meta.name, meta.family, meta.category, ...meta.keywords, ...meta.variants, ...Object.values(meta.slots)]
    .join(" ")
    .toLowerCase()

/** Every word must match somewhere; names that start with the query rank first. */
export function searchIcons({ query, category, colors }: IconFilter) {
  const q = query.trim().toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  return icons
    .filter(
      (icon) =>
        (category === null || icon.meta.category === category) &&
        (colors === null || icon.meta.colors === colors) &&
        words.every((word) => haystack(icon).includes(word)),
    )
    .sort((a, b) => Number(b.meta.name.startsWith(q)) - Number(a.meta.name.startsWith(q)))
}
