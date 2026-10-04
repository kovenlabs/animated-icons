"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-text": "type" | "scroll"
  }
}

/** A short heading over two body lines, each 2px clear of the page, the fold and each other. */
const LINES = [
  { part: "line-1", d: "M8 10h2" },
  { part: "line-2", d: "M8 14h6" },
  { part: "line-3", d: "M8 18h4" },
] as const

/**
 * Each line fades out with the others, then draws on left to right, one after the other.
 * Hidden while its stroke is too short to read: a square cap paints a dot at length 0.
 */
const typeLine = (start: number, end: number) => ({
  opacity: { values: [1, 0, 0, 1, 1], times: [0, 0.15, start, start + 0.01, 1] },
  pathLength: { values: [1, 1, 0, 1, 1], times: [0, start - 0.01, start, end, 1] },
})

/** 2 colors: page (primary), text lines (accent). */
export const FileText = createAnimatedIcon({
  name: "file-text",
  family: "file",
  category: "files",
  keywords: ["document", "text file", "page", "notes", "article", "report", "doc"],
  slots: { primary: "page", accent: "text lines" },
  defaultVariant: "type",
  variants: {
    // the lines type in again, top to bottom
    type: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          LINES.map(({ part }, i) => {
            const { opacity, pathLength } = typeLine(0.2 + i * 0.25, 0.45 + i * 0.25)
            return Promise.all([
              animate(`[data-part=${part}]`, { opacity: opacity.values }, { duration: seconds, times: opacity.times }),
              animate(
                `[data-part=${part}]`,
                { pathLength: pathLength.values },
                { duration: seconds, times: pathLength.times, ease: "easeOut" },
              ),
            ])
          }),
        ),
    },
    // the text scrolls up and fades before it reaches the fold, then the next screen rises from
    // the bottom of the page: it never leaves the page or crosses its edges
    scroll: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=text]",
          { y: [0, -3, 2, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.4, 0.5, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <>
        {/* the file page, as in `file` */}
        <path d="M18 7v15H4V2h9z" />
        <path d="M13 2v5h5" />
        <g data-part="text" stroke={slot.accent} style={pivot("50% 50%")}>
          {LINES.map(({ part, d }) => (
            <path key={part} data-part={part} d={d} />
          ))}
        </g>
      </>
    </g>
  ),
})
