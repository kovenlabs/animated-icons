"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-search": "look" | "zoom"
  }
}

/** 2 colors: page (primary), lens (accent). */
export const FileSearch = createAnimatedIcon({
  name: "file-search",
  family: "file",
  category: "files",
  keywords: ["find file", "search document", "lookup", "browse", "inspect", "magnifier"],
  slots: { primary: "page", accent: "lens" },
  defaultVariant: "look",
  variants: {
    // the lens circles a little over the corner, hunting; it never closes on the page's cut ends
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
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <>
        {/* a page with a folded corner; its right and bottom edges stop short of the lens, like mail's open corner */}
        <path d="M18 10V7l-5-5H4v20h6" />
        <path d="M13 2v5h5" />
        <g data-part="lens" stroke={slot.accent} style={pivot("40% 40%")}>
          <circle cx="16" cy="17" r="3" />
          <path d="M18.5 19.5 21 22" />
        </g>
      </>
    </g>
  ),
})
