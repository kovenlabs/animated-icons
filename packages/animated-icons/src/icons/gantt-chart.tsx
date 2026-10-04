"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "gantt-chart": "grow" | "shift"
  }
}

/**
 * Three 2-tall task bars, 5 apart, each starting later than the one above. Filled rects rather than
 * strokes, so a bar grows from its own start and never reaches behind it. The first starts 2 clear
 * of the axis; the last stays 2 clear of the bottom one.
 */
const BARS = [
  { part: "bar-0", x: 6, y: 5, width: 7 },
  { part: "bar-1", x: 10, y: 10, width: 7 },
  { part: "bar-2", x: 14, y: 15, width: 6 },
] as const

const sel = (part: string) => `[data-part=${part}]`

/** 2 colors: axes (primary), task bars (accent). */
export const GanttChart = createAnimatedIcon({
  name: "gantt-chart",
  category: "charts",
  keywords: ["timeline", "schedule", "roadmap", "project plan", "tasks", "planning", "milestones"],
  slots: { primary: "axes", accent: "task bars" },
  defaultVariant: "grow",
  variants: {
    // the bars shrink back to their start dates, then stretch out again one after another
    grow: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          BARS.map(({ part }, i) =>
            animate(
              sel(part),
              { scaleX: [1, 0, 0, 1] },
              { duration: seconds, times: [0, 0.15, 0.25 + i * 0.15, 0.6 + i * 0.15], ease: ["easeIn", "linear", ease.out] },
            ),
          ),
        ),
    },
    // the schedule slips: each task slides later in turn, then they all move back to plan
    shift: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          BARS.map(({ part }, i) =>
            animate(
              sel(part),
              { x: [0, 0, 2, 2, 0] },
              { duration: seconds, times: [0, i * 0.12, 0.3 + i * 0.12, 0.7, 1], ease: "easeInOut" },
            ),
          ),
        ),
    },
  },
  render: () => (
    <>
      <path d="M3 3v18h18" />
      <g fill={slot.accent} stroke="none">
        {BARS.map(({ part, x, y, width }) => (
          <rect key={part} data-part={part} x={x} y={y} width={width} height="2" style={pivot("0% 50%")} />
        ))}
      </g>
    </>
  ),
})
