"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    signal: "climb" | "fluctuate" | "turn"
  }
}

/** Four bars standing on one baseline, 5.5 apart, each 4 taller than the last. */
const BARS = [
  { part: "bar-1", d: "M3.5 21v-4" },
  { part: "bar-2", d: "M9 21v-8" },
  { part: "bar-3", d: "M14.5 21V9" },
  { part: "bar-4", d: "M20 21V5" },
] as const

/** Where each bar wavers to while the reception is patchy: a different rhythm per bar. */
const WAVER = [
  [1, 0.5, 1, 0.5, 1, 1],
  [1, 0.4, 0.8, 0.25, 0.9, 1],
  [1, 0.6, 0.3, 0.7, 0.2, 1],
  [1, 0.3, 0.6, 0.15, 0.5, 1],
]

const sel = (part: string) => `[data-part=${part}]`

/** 1 color: bars (primary). */
export const Signal = createAnimatedIcon({
  name: "signal",
  category: "devices",
  keywords: ["reception", "cellular", "bars", "strength", "network", "mobile", "coverage", "connection"],
  slots: { primary: "bars" },
  defaultVariant: "climb",
  variants: {
    // the bars drop flat, then spring back up one after another, left to right, each overshooting
    climb: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all(
          BARS.map(({ part }, i) =>
            animate(
              sel(part),
              { scaleY: [1, 0, 0, 1.15, 0.94, 1] },
              {
                duration: seconds,
                times: [0, 0.16, 0.24 + i * 0.12, 0.42 + i * 0.12, 0.52 + i * 0.12, 0.62 + i * 0.12],
                ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"],
              },
            ),
          ),
        ),
    },
    // patchy reception: every bar wavers on its own rhythm before the signal locks back at full
    fluctuate: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all(
          BARS.map(({ part }, i) =>
            animate(sel(part), { scaleY: WAVER[i]! }, { duration: seconds, times: [0, 0.18, 0.36, 0.54, 0.72, 1], ease: "easeInOut" }),
          ),
        ),
    },
    // the bars turn a full revolution like a sign on a pole, swelling toward you as they go edge-on,
    // and ripple once as they face front again
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("signal"),
            { scaleX: [1, 0, -1, 0, 1], scale: [1, 1.08, 1, 1.08, 1] },
            { duration: seconds * 0.7, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            sel("bar"),
            { scaleY: [1, 1.12, 0.92, 1] },
            { duration: seconds * 0.3, delay: stagger(seconds * 0.05, { startDelay: seconds * 0.62 }), ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="signal" style={pivot("50% 50%")}>
      {BARS.map(({ part, d }) => (
        <g key={part} data-part="bar" style={pivot("50% 100%")}>
          <path data-part={part} d={d} style={pivot("50% 100%")} />
        </g>
      ))}
    </g>
  ),
})
