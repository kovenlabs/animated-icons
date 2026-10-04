"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bold: "thicken" | "punch"
  }
}

/** 1 color. */
export const Bold = createAnimatedIcon({
  name: "bold",
  category: "text",
  keywords: ["bold", "strong", "text weight", "format", "emphasis", "typography", "font"],
  slots: { primary: "letter" },
  defaultVariant: "thicken",
  variants: {
    // the letter swells to a heavier weight, holds, and slims back to its regular stroke
    thicken: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=letter]",
          { strokeWidth: [2, 3.25, 3.25, 2], scale: [1, 1.06, 1.06, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeOut", "linear", "easeInOut"] },
        ),
    },
    // wound back small, it punches out big and lands
    punch: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=letter]",
          { scale: [1, 0.86, 1.16, 1] },
          { duration: seconds, times: [0, 0.3, 0.55, 1], ease: ["easeInOut", ease.out, "easeInOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="letter" style={pivot("50% 50%")}>
      {/* a straight stem with the two faceted bowls opening off it, the lower one a step wider.
          The bowls start and end on the stem, so its corners stay tight when the rest is rounded */}
      <path d="M6 4v16" />
      <path d="M6 4h8l3 3v2l-3 3H6M6 12h9l3 3v2l-3 3H6" />
    </g>
  ),
})
