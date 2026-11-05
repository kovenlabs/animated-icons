"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "signal-high": "climb" | "fluctuate"
  }
}

/**
 * The `signal` bars on the same baseline and spacing, 5.5 apart and each 4 taller than the last, with
 * the tallest of the four left out: strong, not full, reception.
 */
const BARS = [
  { part: "bar-1", d: "M3.5 21v-4" },
  { part: "bar-2", d: "M9 21v-8" },
  { part: "bar-3", d: "M14.5 21V9" },
] as const

/** Where each bar wavers to while the reception is patchy: a different rhythm per bar. */
const WAVER = [
  [1, 0.5, 1, 0.5, 1, 1],
  [1, 0.4, 0.8, 0.25, 0.9, 1],
  [1, 0.6, 0.3, 0.7, 0.2, 1],
]

const sel = (part: string) => `[data-part=${part}]`

/** 1 color: bars (primary). */
export const SignalHigh = createAnimatedIcon({
  name: "signal-high",
  family: "signal",
  category: "devices",
  keywords: ["good signal", "strong reception", "cellular", "bars", "network strength", "coverage", "connection"],
  slots: { primary: "bars" },
  defaultVariant: "climb",
  variants: {
    // the bars drop flat, then spring back up one after another, left to right, each overshooting
    climb: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          BARS.map(({ part }, i) =>
            animate(
              sel(part),
              { scaleY: [1, 0, 0, 1.15, 0.94, 1] },
              {
                duration: seconds,
                times: [0, 0.18, 0.28 + i * 0.14, 0.5 + i * 0.14, 0.6 + i * 0.14, 0.72 + i * 0.14],
                ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"],
              },
            ),
          ),
        ),
    },
    // patchy reception: every bar wavers on its own rhythm before the signal settles back
    fluctuate: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all(
          BARS.map(({ part }, i) =>
            animate(sel(part), { scaleY: WAVER[i]! }, { duration: seconds, times: [0, 0.18, 0.36, 0.54, 0.72, 1], ease: "easeInOut" }),
          ),
        ),
    },
  },
  render: () => (
    <>
      {BARS.map(({ part, d }) => (
        <path key={part} data-part={part} d={d} style={pivot("50% 100%")} />
      ))}
    </>
  ),
})
