"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "book-open": "flip" | "open" | "hop"
  }
}

/** The right-hand page, open from the spine: a shallow V at top and bottom where the pages meet. */
const RIGHT = "M12 7l3-2h7v13h-7l-3 2"
const LEFT = "M12 7 9 5H2v13h7l3 2"

/** 2 colors: pages (primary), spine and turning page (accent). */
export const BookOpen = createAnimatedIcon({
  name: "book-open",
  family: "book",
  category: "education",
  keywords: ["read", "reading", "course", "lesson", "library", "documentation", "study", "education"],
  slots: { primary: "pages", accent: "spine + turning page" },
  defaultVariant: "flip",
  variants: {
    // a page lifts from the right, turns over the spine and settles onto the left
    flip: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=leaf]",
          { scaleX: [1, -1], opacity: [0, 1, 1, 0] },
          { duration: seconds, times: [0, 0.1, 0.85, 1], ease: "easeInOut" },
        ),
    },
    // the book claps shut on its spine and falls open again
    open: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["left", "right"].map((side) =>
            animate(
              `[data-part=${side}]`,
              { scaleX: [1, 0.2, 0.2, 1] },
              { duration: seconds, times: [0, 0.35, 0.5, 1], ease: ease.overshoot },
            ),
          ),
        ),
    },
    // a small hop that lands with a squash
    hop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=book]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <g data-part="book" style={pivot("50% 100%")}>
      <path data-part="left" d={LEFT} style={pivot("100% 50%")} />
      <path data-part="right" d={RIGHT} style={pivot("0% 50%")} />
      <path d="M12 7v13" stroke={slot.accent} />
      {/* the turning page: a copy of the right page, hinged on the spine, only there while it turns */}
      <path data-part="leaf" d={RIGHT} stroke={slot.accent} style={flash("0% 50%")} />
    </g>
  ),
})
