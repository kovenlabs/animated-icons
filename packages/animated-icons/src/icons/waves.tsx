"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    waves: "roll" | "ripple" | "surf"
  }
}

/** One row of swell: two crests between three troughs, 5 wide and 3 deep, edge to edge. */
const row = (y: number) => `M2 ${y + 3}l5-3 5 3 5-3 5 3`

/** The three rows, far to near, 7 apart so 2px of water shows between them. */
const ROWS = [4, 11, 18]

/** The gap from one row to the next. */
const STEP = 7

/** 1 color: waves. */
export const Waves = createAnimatedIcon({
  name: "waves",
  category: "nature",
  keywords: ["water", "sea", "ocean", "swim", "beach", "tide", "pool", "surf"],
  slots: { primary: "waves" },
  defaultVariant: "roll",
  variants: {
    // the sea rolls toward you: every row moves forward one place, the nearest widening as it washes
    // out through the bottom, and a new row grows in from the distance at the top
    roll: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=swell]",
            { y: [0, STEP, 0] },
            { duration: seconds, times: [0, 0.999, 1], ease: [ease.inOut, snap] },
          ),
          animate(
            `[data-part=row-${ROWS.length - 1}]`,
            { scaleX: [1, 1.4, 1], opacity: [1, 0, 1] },
            { duration: seconds, times: [0, 0.999, 1], ease: [ease.inOut, snap] },
          ),
          animate(
            "[data-part=next]",
            { scaleX: [0.5, 1, 0.5], opacity: [0, 1, 0] },
            { duration: seconds, times: [0, 0.999, 1], ease: [ease.inOut, snap] },
          ),
        ]),
    },
    // a swell runs down through the rows: each turns over on its own axis, crests becoming troughs
    // and back, far row first
    ripple: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=wave]",
          { scaleY: [1, -1, 1] },
          { duration: seconds * 0.7, delay: stagger(seconds * 0.15), ease: "easeInOut" },
        ),
    },
    // the rows surge sideways against each other, the near ones further, and wash back
    surf: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all(
          ROWS.map((_, i) =>
            animate(
              `[data-part=row-${i}]`,
              { x: [0, (i % 2 ? -1 : 1) * (2 + i), (i % 2 ? 1 : -1) * (1 + i * 0.5), 0] },
              { duration: seconds * 0.8, times: [0, 0.4, 0.75, 1], delay: seconds * 0.1 * i, ease: "easeInOut" },
            ),
          ),
        ),
    },
  },
  render: () => (
    <>
      <g data-part="swell">
        {/* the next row, only seen while the sea rolls in, a step above the farthest */}
        <path data-part="next" d={row(ROWS[0]! - STEP)} style={flash("50% 50%")} />
        {ROWS.map((y, i) => (
          <g key={y} data-part={`row-${i}`} style={pivot("50% 50%")}>
            <path data-part="wave" d={row(y)} style={pivot("50% 50%")} />
          </g>
        ))}
      </g>
    </>
  ),
})
