"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    leaf: "sway" | "vein"
  }
}

/**
 * A faceted leaf laid along the diagonal, symmetric about it: the base at (6, 18), the point at
 * (20, 4), widest just short of halfway, so it tapers to a long point.
 */
const LEAF = "M6 18 5 11l3-3.5L20 4l-3.5 12L13 19z"

/** 2 colors: leaf and stem (primary), midrib (accent). */
export const Leaf = createAnimatedIcon({
  name: "leaf",
  category: "nature",
  keywords: ["nature", "plant", "eco", "green", "organic", "environment", "spring", "vegan"],
  slots: { primary: "leaf + stem", accent: "midrib" },
  defaultVariant: "sway",
  variants: {
    // the leaf sways on its stem, as if a breeze caught it
    sway: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate("[data-part=leaf]", { rotate: [0, -9, 7, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the midrib fades, then draws itself from the stem out to the point
    vein: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=vein]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.25, 0.3, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=vein]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.25, 0.25, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="leaf" style={pivot("0% 100%")}>
      <path d="M3 21l3-3" />
      <path d={LEAF} />
      <path data-part="vein" d="M6 18 16 8" stroke={slot.accent} />
    </g>
  ),
})
