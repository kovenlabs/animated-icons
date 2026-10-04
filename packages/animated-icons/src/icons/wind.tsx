"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    wind: "sweep" | "blow"
  }
}

/** Three gusts from the left edge, each ending in an octagonal curl: up, up (the longest), down. */
const GUSTS = [
  "M2 8h9l1-1V5l-1-1H9L8 5",
  "M2 12h17.5l1.5-1.5v-2L19.5 7h-2L16 8.5",
  "M2 16h12l1 1v2l-1 1h-2l-1-1",
]

/** 1 color: gusts. */
export const WindIcon = createAnimatedIcon({
  name: "wind",
  category: "weather",
  keywords: ["air", "breeze", "gust", "weather", "blow", "windy", "fan", "ventilation"],
  slots: { primary: "gusts" },
  defaultVariant: "sweep",
  variants: {
    // each gust fades and redraws from the left into its curl, one after another
    sweep: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=gust]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds * 0.7, times: [0, 0.2, 0.3, 0.36, 1], delay: stagger(seconds * 0.15), ease: "easeOut" },
          ),
          animate(
            "[data-part=gust]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.7, times: [0, 0.3, 0.3, 1], delay: stagger(seconds * 0.15), ease: "easeOut" },
          ),
        ]),
    },
    // the gusts blow out through the right edge and blow back in from the left
    blow: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=gust]",
          { x: [0, 5, -5, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds * 0.7, times: [0, 0.4, 0.45, 1], delay: stagger(seconds * 0.15), ease: [ease.in, "linear", ease.out] },
        ),
    },
  },
  render: () => (
    <>
      {GUSTS.map((d) => (
        <path key={d} data-part="gust" d={d} />
      ))}
    </>
  ),
})
