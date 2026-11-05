"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "list-ordered": "count" | "slide"
  }
}

/**
 * Rows on the same 6, 12, 18 rhythm as `list`. The numerals need more room than a bullet, so the
 * lines start at x 11, 2 clear of the numerals' right edge (x 7 plus its cap). Like Lucide, only the
 * first and last rows are numbered; the middle row's numeral would crowd them at 16px.
 */
const ROWS = [
  { part: "row-0", y: 6, numeral: "M3 3h2v6M3 9h4" },
  { part: "row-1", y: 12, numeral: undefined },
  { part: "row-2", y: 18, numeral: "M3 16l1-1h2l1 1v1l-4 4h4" },
] as const

/** 2 colors: lines (primary), numerals (accent). */
export const ListOrdered = createAnimatedIcon({
  name: "list-ordered",
  family: "list",
  category: "layout",
  keywords: ["ordered list", "numbered list", "numbers", "steps", "sequence", "ranking", "items"],
  slots: { primary: "lines", accent: "numerals" },
  defaultVariant: "count",
  variants: {
    // the numerals pop one after the other, counting down the list
    count: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["numeral-0", "numeral-2"].map((part, i) =>
            animate(
              `[data-part=${part}]`,
              { scale: [1, 0.7, 1.2, 1] },
              {
                duration: seconds * 0.6,
                delay: seconds * 0.4 * i,
                times: [0, 0.3, 0.65, 1],
                ease: ["easeInOut", ease.out, "easeInOut"],
              },
            ),
          ),
        ),
    },
    // the rows fade out together, then slide back in from the left edge in order
    slide: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          ROWS.map(({ part }, i) => {
            const start = 0.25 + i * 0.17
            const end = start + 0.4
            return Promise.all([
              animate(
                `[data-part=${part}]`,
                { opacity: [1, 0, 0, 1] },
                { duration: seconds, times: [0, 0.15, start, end], ease: "easeOut" },
              ),
              animate(
                `[data-part=${part}]`,
                { x: [0, 0, -7, 0] },
                { duration: seconds, times: [0, start - 0.01, start, end], ease: ["linear", "linear", ease.out] },
              ),
            ])
          }),
        ),
    },
  },
  render: () => (
    <>
      {ROWS.map(({ part, y, numeral }, i) => (
        <g key={part} data-part={part}>
          {numeral && (
            <path data-part={`numeral-${i}`} d={numeral} stroke={slot.accent} style={pivot("50% 50%")} />
          )}
          <path d={`M11 ${y}h9`} />
        </g>
      ))}
    </>
  ),
})
