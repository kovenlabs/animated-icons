"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    hash: "type" | "pop" | "tilt"
  }
}

/** Two bars across, two raked strokes down, 6px apart both ways so every gap stays wide at 16px. */
const STROKES = [
  { part: "stroke-1", d: "M10 3 8 21" },
  { part: "stroke-2", d: "M16 3l-2 18" },
  { part: "stroke-3", d: "M4 9h16" },
  { part: "stroke-4", d: "M4 15h16" },
] as const

/** 1 color. */
export const Hash = createAnimatedIcon({
  name: "hash",
  category: "text",
  keywords: ["hashtag", "number", "channel", "pound", "tag", "sharp", "topic"],
  slots: { primary: "strokes" },
  defaultVariant: "type",
  variants: {
    // fades out, then writes itself again stroke by stroke: the two downstrokes, then the two bars.
    // Each stroke is hidden while too short to read (a square cap paints a dot at length 0)
    type: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          STROKES.map(({ part }, i) => {
            const start = 0.15 + i * 0.18
            return Promise.all([
              animate(
                `[data-part=${part}]`,
                { opacity: [1, 0, 0, 1, 1] },
                { duration: seconds, times: [0, 0.12, start, start + 0.01, 1] },
              ),
              animate(
                `[data-part=${part}]`,
                { pathLength: [1, 1, 0, 1, 1] },
                { duration: seconds, times: [0, start - 0.01, start, start + 0.2, 1], ease: "easeOut" },
              ),
            ])
          }),
        ),
    },
    // punches out from its middle and settles
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=hash]", { scale: [1, 1.15, 0.97, 1] }, { duration: seconds, ease: ease.out }),
    },
    // rocks on its centre, like a tag being flicked
    tilt: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=hash]", { rotate: [0, -14, 9, -4, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <g data-part="hash" style={pivot("50% 50%")}>
      {STROKES.map(({ part, d }) => (
        <path key={part} data-part={part} d={d} />
      ))}
    </g>
  ),
})
