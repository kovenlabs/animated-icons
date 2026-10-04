"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    library: "tip" | "pull"
  }
}

/** Three upright spines of different heights, 4 apart, standing on the shelf (their feet meet its top). */
const SPINES = ["M4 6v14", "M8 3v17", "M12 7v13"] as const

/** 2 colors: shelf and books (primary), the leaning book (accent). */
export const Library = createAnimatedIcon({
  name: "library",
  category: "education",
  keywords: ["books", "bookshelf", "reading", "collection", "catalog", "resources", "study", "archive"],
  slots: { primary: "shelf + books", accent: "leaning book" },
  defaultVariant: "tip",
  variants: {
    // the leaning book is pushed upright, then falls back to its lean, overshooting a touch before it settles
    tip: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=leaning]",
          { rotate: [0, 16, 16, -2, 0] },
          { duration: seconds, times: [0, 0.35, 0.5, 0.8, 1], ease: "easeInOut" },
        ),
    },
    // the leaning book is taken by its top: drawn up off the shelf, straightening as it comes, and set back
    pull: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=leaning]",
          { y: [0, -3, -3, 0], rotate: [0, 10, 10, 0] },
          { duration: seconds, times: [0, 0.35, 0.55, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {SPINES.map((d) => (
        <path key={d} d={d} />
      ))}
      {/* a book leaning to the right, its foot on the shelf: it pivots on that foot */}
      <path data-part="leaning" d="M16 6l4 14" stroke={slot.accent} style={pivot("100% 100%")} />
      <path d="M2 22h20" />
    </>
  ),
})
