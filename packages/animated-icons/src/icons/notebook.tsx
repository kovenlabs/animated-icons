"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    notebook: "write" | "hop"
  }
}

/** Binding rings across the left edge, 4 apart, 4 clear of the top and bottom edges. */
const RINGS = "M3 6h4M3 10h4M3 14h4M3 18h4"

/** Two full lines and a short last one, 2 clear of the rings and of the cover's right edge. */
const LINES = [
  { part: "line-1", d: "M11 8h5" },
  { part: "line-2", d: "M11 12h5" },
  { part: "line-3", d: "M11 16h3" },
] as const

/**
 * Each line fades out with the others, then draws on left to right, one after the other.
 * Hidden while its stroke is too short to read: a square cap paints a dot at length 0.
 */
const writeLine = (start: number, end: number) => ({
  opacity: { values: [1, 0, 0, 1, 1], times: [0, 0.15, start, start + 0.01, 1] },
  pathLength: { values: [1, 1, 0, 1, 1], times: [0, start - 0.01, start, end, 1] },
})

/** 2 colors: cover and rings (primary), text lines (accent). */
export const Notebook = createAnimatedIcon({
  name: "notebook",
  category: "education",
  keywords: ["notes", "journal", "notepad", "diary", "homework", "copybook", "writing", "spiral"],
  slots: { primary: "cover + rings", accent: "text lines" },
  defaultVariant: "write",
  variants: {
    // the lines are written in again, top to bottom
    write: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          LINES.map(({ part }, i) => {
            const { opacity, pathLength } = writeLine(0.2 + i * 0.25, 0.45 + i * 0.25)
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
    // a small hop that lands with a squash
    hop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=notebook]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <g data-part="notebook" style={pivot("50% 100%")}>
      <path d="M5 2h15v20H5z" />
      <path d={RINGS} />
      <g stroke={slot.accent}>
        {LINES.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} />
        ))}
      </g>
    </g>
  ),
})
