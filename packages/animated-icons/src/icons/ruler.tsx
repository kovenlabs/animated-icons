"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    ruler: "measure" | "slide"
  }
}

/** Where each tick leaves the upper edge: 3 apart along it, 2 in from either end. */
const TICKS = [
  { x: 10, y: 5 },
  { x: 13, y: 8 },
  { x: 16, y: 11 },
  { x: 19, y: 14 },
] as const

/** 2 colors: ruler (primary), ticks (accent). */
export const Ruler = createAnimatedIcon({
  name: "ruler",
  category: "design",
  keywords: ["measure", "dimensions", "size", "length", "scale", "units", "guides"],
  slots: { primary: "ruler", accent: "ticks" },
  defaultVariant: "measure",
  variants: {
    // the ticks run along the ruler like a count: one after another each shrinks back into the edge
    // and grows out again
    measure: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=tick]",
          { scale: [1, 0, 1] },
          { duration: seconds * 0.5, times: [0, 0.35, 1], delay: stagger(seconds * 0.15), ease: "easeInOut" },
        ),
    },
    // the ruler slides along its own length, out a little and back, and settles
    slide: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ruler]",
          { x: [0, 1.5, -1.5, 0.5, 0], y: [0, 1.5, -1.5, 0.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="ruler" style={pivot("50% 50%")}>
      {/* a 45° bar, square at both ends */}
      <path d="M8 3l13 13-5 5L3 8Z" />
      <g stroke={slot.accent}>
        {TICKS.map(({ x, y }) => (
          <path key={x} data-part="tick" d={`M${x} ${y}l-2 2`} style={pivot("100% 0%")} />
        ))}
      </g>
    </g>
  ),
})
