"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    tornado: "twist" | "spin" | "drift"
  }
}

/**
 * Five bands narrowing from the storm cloud down to the tip, their centres wandering left and right so
 * the funnel snakes. Each band sways further than the one above it in `twist`.
 */
const BANDS = [
  { d: "M3 4h18", sway: 0.5 },
  { d: "M5 8h12", sway: 1 },
  { d: "M9 12h10", sway: 1.5 },
  { d: "M8 16h7", sway: 2 },
  { d: "M10 20h3", sway: 2.5 },
]

/** 1 color: funnel. */
export const Tornado = createAnimatedIcon({
  name: "tornado",
  category: "weather",
  keywords: ["twister", "cyclone", "storm", "whirlwind", "hurricane", "funnel", "wind", "weather"],
  slots: { primary: "funnel" },
  defaultVariant: "twist",
  variants: {
    // the funnel snakes: each band sways in turn from the cloud down, wider towards the tip
    twist: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          BANDS.map(({ sway }, i) =>
            animate(
              `[data-part=band-${i}]`,
              { x: [0, sway, -sway, 0] },
              { duration: seconds * 0.7, delay: seconds * 0.075 * i, ease: "easeInOut" },
            ),
          ),
        ),
    },
    // the funnel whirls: each band narrows and widens again, from the tip up, like it is turning
    spin: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=band]",
          { scaleX: [1, 0.4, 1] },
          { duration: seconds * 0.6, delay: stagger(seconds * 0.1, { from: "last" }), ease: "easeInOut" },
        ),
    },
    // the twister tears off through the right edge and moves back in from the left
    drift: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=tornado]",
          { x: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.4, 0.45, 1], ease: [ease.in, "linear", ease.out] },
        ),
    },
  },
  render: () => (
    <g data-part="tornado">
      {BANDS.map(({ d }, i) => (
        <g key={d} data-part={`band-${i}`}>
          <path data-part="band" d={d} style={pivot("50% 50%")} />
        </g>
      ))}
    </g>
  ),
})
