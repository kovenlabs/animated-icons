"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "folder-search": "look" | "zoom"
  }
}

/** 2 colors: folder (primary), lens (accent). */
export const FolderSearch = createAnimatedIcon({
  name: "folder-search",
  family: "folder",
  category: "files",
  keywords: ["find folder", "search directory", "browse", "lookup", "explore", "magnifier", "find files"],
  slots: { primary: "folder", accent: "lens" },
  defaultVariant: "look",
  variants: {
    // the lens circles a little over the corner, hunting; it never closes on the folder's cut ends
    look: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=lens]",
          { x: [0, -1.5, 0, 1, 0], y: [0, -0.5, -1, -0.5, 0], rotate: [0, -6, 0, 6, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the lens magnifies and settles
    zoom: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate("[data-part=lens]", { scale: [1, 1.15, 1] }, { duration: seconds, ease: ease.out }),
    },
  },
  render: () => (
    <>
      {/* the folder icon's back panel and tab; its bottom and right edges stop short of the lens,
          like file-search's page */}
      <path d="M10 20H2V3h7l2 3h11v5" />
      <g data-part="lens" stroke={slot.accent} style={pivot("40% 40%")}>
        <circle cx="17" cy="17" r="3" />
        <path d="M19.5 19.5 21.5 21.5" />
      </g>
    </>
  ),
})
