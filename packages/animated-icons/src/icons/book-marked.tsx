"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "book-marked": "mark" | "swing" | "spin"
  }
}

/** 2 colors: book (primary), bookmark ribbon (accent). */
export const BookMarked = createAnimatedIcon({
  name: "book-marked",
  family: "book",
  category: "education",
  keywords: ["bookmark", "saved", "reading list", "favorite book", "library", "marked page", "read later"],
  slots: { primary: "book", accent: "bookmark ribbon" },
  defaultVariant: "mark",
  variants: {
    // the ribbon is tucked up into the cover, then drops out, overstretching and springing back
    mark: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ribbon]",
          { scaleY: [1, 0, 0, 1.35, 0.85, 1.08, 1] },
          {
            duration: seconds,
            times: [0, 0.2, 0.3, 0.55, 0.7, 0.85, 1],
            ease: ["easeIn", "linear", "easeOut", "easeInOut", "easeInOut", "easeOut"],
          },
        ),
    },
    // the ribbon swings from the top edge like a pendulum (skewed, so its top stays pinned), stretching as it goes
    swing: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ribbon]",
          { skewX: [0, 20, -16, 10, -5, 0], scaleY: [1, 1.06, 1.04, 1.02, 1, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the book turns a full revolution on its spine, leaning into perspective, and lands with a squash
    spin: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=book]",
          { scaleX: [1, -1, 1, 1], skewY: [0, -8, 0, 0], scaleY: [1, 1, 0.92, 1] },
          { duration: seconds, times: [0, 0.35, 0.75, 1], ease: ["easeInOut", "easeInOut", ease.overshoot] },
        ),
    },
  },
  render: () => (
    <g data-part="book" style={pivot("50% 100%")}>
      {/* a closed book: the cover, with the page block peeking out underneath and a faceted curl at the spine */}
      <path d="M20 18H6l-2 2 2 2h14V2H4v18" />
      {/* the ribbon hangs from the top edge, its tail cut into a notch */}
      <path data-part="ribbon" d="M10 2v8l3-3 3 3V2" stroke={slot.accent} style={pivot("50% 0%")} />
    </g>
  ),
})
