"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "text-select": "select" | "grab"
  }
}

/**
 * The dashed selection frame on 3..21: an L at each corner and two short dashes along each side,
 * every gap 2 wide once the square caps are drawn.
 */
const FRAME = [
  "M3 5V3h2M19 3h2v2M21 19v2h-2M5 21H3v-2",
  "M9 3h1M14 3h1M9 21h1M14 21h1",
  "M3 9v1M3 14v1M21 9v1M21 14v1",
].join("")

/** Text lines 4 apart inside the frame, flush left at x 7. */
const LINES = [
  { part: "line-0", d: "M7 8h8" },
  { part: "line-1", d: "M7 12h10" },
  { part: "line-2", d: "M7 16h6" },
] as const

/** 2 colors: text lines (primary), selection frame (accent). */
export const TextSelect = createAnimatedIcon({
  name: "text-select",
  category: "text",
  keywords: ["text select", "select text", "selection", "highlight", "marquee", "text box", "cursor"],
  slots: { primary: "lines", accent: "selection frame" },
  defaultVariant: "select",
  variants: {
    // the lines are swept away and drawn out again one after another, as a drag selects them
    select: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          LINES.map(({ part }, i) => {
            const start = 0.3 + i * 0.15
            return animate(
              `[data-part=${part}]`,
              { scaleX: [1, 0, 0, 1] },
              { duration: seconds, times: [0, 0.25, start, start + 0.3], ease: ["easeIn", "linear", "easeOut"] },
            )
          }),
        ),
    },
    // the frame closes in on the text, springs out a little past its edge and settles
    grab: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=frame]",
          { scale: [1, 0.9, 1.05, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ["easeInOut", ease.out, "easeInOut"] },
        ),
    },
  },
  render: () => (
    <>
      <path data-part="frame" d={FRAME} stroke={slot.accent} style={pivot("50% 50%")} />
      {LINES.map(({ part, d }) => (
        <path key={part} data-part={part} d={d} style={pivot("0% 50%")} />
      ))}
    </>
  ),
})
