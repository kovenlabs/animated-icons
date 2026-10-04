"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    tag: "swing" | "pop"
  }
}

/** The tag's box is 3..21; the hole's centre (7, 7) sits at 22.2% on both axes. */
const HOLE = pivot("22.2% 22.2%")

/** 2 colors: tag (primary), hole (accent). */
export const Tag = createAnimatedIcon({
  name: "tag",
  category: "commerce",
  keywords: ["price", "label", "sale", "discount", "offer", "pricing", "deal"],
  slots: { primary: "tag", accent: "hole" },
  defaultVariant: "swing",
  variants: {
    // hangs from its hole and swings, dying away
    swing: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=tag]", { rotate: [0, 14, -10, 6, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the price pops: the tag swells and settles with an overshoot
    pop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=tag]",
          { scale: [1, 1.15, 0.97, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <g data-part="tag" style={HOLE}>
      {/* a square-shouldered tag laid on the diagonal, its point at the bottom right */}
      <path d="M3 3h8.5l9.5 9.5-8.5 8.5L3 11.5z" />
      <rect x="6" y="6" width="2" height="2" fill={slot.accent} stroke="none" />
    </g>
  ),
})
