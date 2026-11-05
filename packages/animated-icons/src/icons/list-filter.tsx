"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "list-filter": "narrow" | "sift" | "settle"
  }
}

/** Three centred lines 7 apart, each shorter than the one above: the list narrows to what is kept. */
const LINES = [
  { part: "line-0", d: "M3 5h18" },
  { part: "line-1", d: "M6 12h12" },
  { part: "line-2", d: "M9 19h6" },
] as const

/** 2 colors: lines (primary), the kept line at the bottom (accent). */
export const ListFilter = createAnimatedIcon({
  name: "list-filter",
  family: "list",
  category: "actions",
  keywords: ["filter", "refine", "narrow", "sort", "funnel", "facets", "list options"],
  slots: { primary: "lines", accent: "kept line" },
  defaultVariant: "narrow",
  variants: {
    // a squeeze runs down the list: each line pulls in toward the middle and springs back
    narrow: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part^=line]",
          { scaleX: [1, 0.6, 1.06, 1] },
          { duration: seconds * 0.6, times: [0, 0.4, 0.75, 1], ease: "easeInOut", delay: stagger(seconds * 0.2) },
        ),
    },
    // the lines dip in turn, like something sifting down through them, and the kept line lands last
    sift: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part^=line]",
          { y: [0, 2.5, -0.5, 0] },
          { duration: seconds * 0.6, times: [0, 0.4, 0.75, 1], ease: "easeInOut", delay: stagger(seconds * 0.2) },
        ),
    },
    // the upper lines fade back while the kept line pops forward, then they return
    settle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=line-0], [data-part=line-1]",
            { opacity: [1, 0.3, 0.3, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=line-2]",
            { scale: [1, 1.25, 1.25, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {LINES.map(({ part, d }, i) => (
        <path
          key={part}
          data-part={part}
          d={d}
          stroke={i === LINES.length - 1 ? slot.accent : undefined}
          style={pivot("50% 50%")}
        />
      ))}
    </>
  ),
})
