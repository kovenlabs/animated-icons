"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-type": "type" | "stamp" | "lift"
  }
}

/**
 * A stroke fades out with the other, then draws on from its start, hidden while too short to read
 * (a square cap paints a dot at length 0).
 */
const drawOn = (start: number, end: number) => ({
  opacity: { values: [1, 0, 0, 1, 1], times: [0, 0.15, start, start + 0.01, 1] },
  pathLength: { values: [1, 1, 0, 1, 1], times: [0, start - 0.01, start, end, 1] },
})

/** The letter T: its bar 2 clear of the fold, its stem 2 clear of the page's foot. */
const STROKES = [
  { part: "bar", d: "M8 11h6", start: 0.25, end: 0.55 },
  { part: "stem", d: "M11 11v7", start: 0.5, end: 0.85 },
] as const

/** 2 colors: page (primary), letter T (accent). */
export const FileType = createAnimatedIcon({
  name: "file-type",
  family: "file",
  category: "files",
  keywords: ["font file", "typeface", "text type", "letter", "typography", "font", "document"],
  slots: { primary: "page", accent: "letter T" },
  defaultVariant: "type",
  variants: {
    // the T is written again: its bar left to right, then its stem top to bottom
    type: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          STROKES.map(({ part, start, end }) => {
            const { opacity, pathLength } = drawOn(start, end)
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
    // the T is pressed onto the page like a stamp: it squashes down and springs back
    stamp: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=letter]",
          { y: [0, -1.5, 0, 0], scaleY: [1, 1.05, 0.85, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
        ),
    },
    // the page lifts off the desk, letter and all, and settles back with a little squash
    lift: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=file]",
          { y: [0, -2, 0, 0], scaleY: [1, 1, 0.95, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <g data-part="file" style={pivot("50% 100%")}>
        {/* the file page and its folded corner, as in `file` */}
        <path d="M18 7v15H4V2h9z" />
        <path d="M13 2v5h5" />
        <g data-part="letter" stroke={slot.accent} style={pivot("50% 100%")}>
          {STROKES.map(({ part, d }) => (
            <path key={part} data-part={part} d={d} />
          ))}
        </g>
      </g>
    </g>
  ),
})
