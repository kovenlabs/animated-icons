"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "line-chart": "draw" | "ride" | "rise"
  }
}

/** The line's vertices, left to right: up 4, down 3, up 5, every leg at 45°. */
const POINTS = [
  [7, 14],
  [11, 10],
  [14, 13],
  [19, 8],
] as const

const LINE = `M${POINTS.map(([x, y]) => `${x} ${y}`).join(" ")}`

/** The marker is a 4×4 square centred on the first vertex; it rides by offsets from there. */
const [[X0, Y0]] = POINTS
const RIDE_X = POINTS.map(([x]) => x - X0)
const RIDE_Y = POINTS.map(([, y]) => y - Y0)
/** Legs of 4, 3 and 5: the marker keeps one speed along the whole line. */
const RIDE_TIMES = [0, 4 / 12, 7 / 12, 1]

/** 2 colors: axes (primary), line and marker (accent). */
export const LineChartIcon = createAnimatedIcon({
  name: "line-chart",
  category: "charts",
  keywords: ["chart", "graph", "trend", "analytics", "statistics", "time series", "growth", "report"],
  slots: { primary: "axes", accent: "line + marker" },
  defaultVariant: "draw",
  variants: {
    // the line fades out and draws itself back on from the left (hidden while it is too short to read)
    draw: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=line]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=line]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.14, 0.15, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // a marker appears on the first point and rides the line to the last, where it fades away
    ride: {
      duration: 1100,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=marker]",
            { x: RIDE_X, y: RIDE_Y },
            { duration: seconds * 0.8, delay: seconds * 0.1, times: RIDE_TIMES, ease: "linear" },
          ),
          animate(
            "[data-part=marker]",
            { opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 1.25] },
            { duration: seconds, times: [0, 0.12, 0.85, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the values sag towards the baseline and spring back up past where they were
    rise: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=line]",
          { scaleY: [1, 0.7, 1.1, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ["easeInOut", ease.out, "easeInOut"] },
        ),
    },
  },
  render: () => (
    <>
      <path d="M3 3v18h18" />
      <path data-part="line" d={LINE} stroke={slot.accent} style={pivot("50% 100%")} />
      <rect data-part="marker" x={X0 - 2} y={Y0 - 2} width="4" height="4" fill={slot.accent} stroke="none" style={flash()} />
    </>
  ),
})
