"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "bar-chart": "grow" | "shuffle" | "highlight"
  }
}

/**
 * Three 2-wide bars standing on the baseline (their feet 2 clear of the axis), short, tall, medium.
 * Filled rects rather than strokes, so a bar scales from its own foot and never reaches below it.
 */
const BARS = [
  { part: "bar-0", x: 7, y: 12, height: 6 },
  { part: "bar-1", x: 12, y: 4, height: 14 },
  { part: "bar-2", x: 17, y: 8, height: 10 },
] as const

const sel = (part: string) => `[data-part=${part}]`

/** 2 colors: axes (primary), bars (accent). */
export const BarChart = createAnimatedIcon({
  name: "bar-chart",
  category: "charts",
  keywords: ["chart", "graph", "statistics", "analytics", "column chart", "report", "metrics", "data"],
  slots: { primary: "axes", accent: "bars" },
  defaultVariant: "grow",
  variants: {
    // the bars drop to the baseline together, then grow back one after another, left to right
    grow: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          BARS.map(({ part }, i) =>
            animate(
              sel(part),
              { scaleY: [1, 0, 0, 1] },
              { duration: seconds, times: [0, 0.15, 0.25 + i * 0.15, 0.6 + i * 0.15], ease: ["easeIn", "linear", ease.out] },
            ),
          ),
        ),
    },
    // new data comes in: every bar slides to another value, then they all return to their own
    shuffle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          [2, 0.5, 1.4].map((value, i) =>
            animate(
              sel(BARS[i]!.part),
              { scaleY: [1, value, value, 1] },
              { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
            ),
          ),
        ),
    },
    // the tall bar is picked out: it stretches a little while its neighbours dim
    highlight: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("bar-1"),
            { scaleY: [1, 1.14, 1.14, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          ...["bar-0", "bar-2"].map((part) =>
            animate(
              sel(part),
              { opacity: [1, 0.25, 0.25, 1] },
              { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path d="M3 3v18h18" />
      <g fill={slot.accent} stroke="none">
        {BARS.map(({ part, x, y, height }) => (
          <rect key={part} data-part={part} x={x} y={y} width="2" height={height} style={pivot("50% 100%")} />
        ))}
      </g>
    </>
  ),
})
