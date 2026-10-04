"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "align-left": "align" | "justify"
  }
}

/**
 * A full line over two shorter ones, all flush left at x 4 and ending by x 20. `center` is how far
 * each line travels to sit centred under the full one; `stretch` is the scaleX that makes it full.
 */
const LINES = [
  { part: "line-1", d: "M4 6h16", center: 0, stretch: 1 },
  { part: "line-2", d: "M4 12h8", center: 4, stretch: 2 },
  { part: "line-3", d: "M4 18h12", center: 2, stretch: 16 / 12 },
] as const

/** 1 color. */
export const AlignLeftIcon = createAnimatedIcon({
  name: "align-left",
  category: "text",
  keywords: ["align left", "text align", "left align", "paragraph", "alignment", "format", "flush left"],
  slots: { primary: "lines" },
  defaultVariant: "align",
  variants: {
    // the short lines glide over to centred, hold a beat, and glide back flush left
    align: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          LINES.filter(({ center }) => center > 0).map(({ part, center }) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, center, center, 0] },
              { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeInOut", "linear", "easeInOut"] },
            ),
          ),
        ),
    },
    // the short lines stretch out to the full measure, justified, then spring back to ragged
    justify: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all(
          LINES.filter(({ stretch }) => stretch > 1).map(({ part, stretch }, i) =>
            animate(
              `[data-part=${part}]`,
              { scaleX: [1, stretch, stretch, 1] },
              {
                duration: seconds * 0.9,
                delay: seconds * 0.1 * i,
                times: [0, 0.4, 0.6, 1],
                ease: ["easeInOut", "linear", ease.out],
              },
            ),
          ),
        ),
    },
  },
  render: () => (
    <>
      {LINES.map(({ part, d }) => (
        <path key={part} data-part={part} d={d} style={pivot("0% 50%")} />
      ))}
    </>
  ),
})
