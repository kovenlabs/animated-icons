"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "arrow-right-to-line": "dash" | "arrive" | "knock"
  }
}

/** 2 colors: line (primary), arrow (accent). */
export const ArrowRightToLine = createAnimatedIcon({
  name: "arrow-right-to-line",
  family: "arrow",
  category: "arrows",
  keywords: ["import", "move to", "send to", "to end", "last", "align right", "collapse"],
  slots: { primary: "line", accent: "arrow" },
  defaultVariant: "dash",
  variants: {
    // draws back, then dashes up to the line and settles; at its furthest the point stays clear of the
    // line's stroke. Head and shaft move as one piece.
    dash: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, -2.5, 1.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // fades out, then slides in again from the left edge and lands against the line
    arrive: {
      clip: true,
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 0, -7, 1, 0], opacity: [1, 0, 0, 1, 1] },
          { duration: seconds, times: [0, 0.2, 0.25, 0.8, 1], ease: "easeOut" },
        ),
    },
    // knocks on the line twice, the second time softer
    knock: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 1.5, -1, 1, 0] },
          {
            duration: seconds,
            times: [0, 0.3, 0.55, 0.75, 1],
            ease: "easeInOut",
          },
        ),
    },
  },
  render: () => (
    <>
      <path d="M21 4v16" />
      <g data-part="arrow" stroke={slot.accent} style={pivot("50% 50%")}>
        <path d="M4 12h11.5" />
        {/* a right-angled chevron: its miter makes the point, 2.5px clear of the line */}
        <path d="M10 6l6 6-6 6" />
      </g>
    </>
  ),
})
