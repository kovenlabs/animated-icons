"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "archive-x": "cross" | "shake"
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

/** The X, 5 across, centred in the box: 2 clear of the lid and the floor. */
const STROKES = [
  { part: "stroke-0", d: "M9.5 12.5l5 5", start: 0.25, end: 0.55 },
  { part: "stroke-1", d: "M14.5 12.5l-5 5", start: 0.55, end: 0.85 },
] as const

/** 2 colors: box and lid (primary), X (accent). */
export const ArchiveX = createAnimatedIcon({
  name: "archive-x",
  family: "archive",
  category: "files",
  keywords: ["delete archive", "remove from archive", "discard", "purge", "clear archive", "trash", "cancel"],
  slots: { primary: "box + lid", accent: "X" },
  defaultVariant: "cross",
  variants: {
    // the X is struck again, one stroke after the other
    cross: {
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
    // the box shakes its head: no
    shake: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=archive]",
          { x: [0, -1.5, 1.5, -1, 1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="archive" style={pivot("50% 100%")}>
      {/* archive's box, open on top: the lid's bottom edge closes it */}
      <path d="M4 9v12h16V9" />
      {/* archive's lid, overhanging the box by 2 each side */}
      <path d="M2 4h20v5H2z" />
      <g stroke={slot.accent}>
        {STROKES.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} />
        ))}
      </g>
    </g>
  ),
})
