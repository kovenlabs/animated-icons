"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    newspaper: "read" | "pop" | "flip"
  }
}

/** Two column lines under the headline, each 2px clear of it, of the page edges and of each other. */
const LINES = [
  { part: "line-1", d: "M10 14h8" },
  { part: "line-2", d: "M10 18h5" },
] as const

/**
 * Each line fades out with the other, then draws on left to right, one after the other.
 * Hidden while its stroke is too short to read: a square cap paints a dot at length 0.
 */
const readLine = (start: number, end: number) => ({
  opacity: {
    values: [1, 0, 0, 1, 1],
    times: [0, 0.15, start, start + 0.01, 1],
  },
  pathLength: {
    values: [1, 1, 0, 1, 1],
    times: [0, start - 0.01, start, end, 1],
  },
})

/** 2 colors: front page and back column (primary), headline and column lines (accent). */
export const Newspaper = createAnimatedIcon({
  name: "newspaper",
  category: "communication",
  keywords: ["news", "article", "press", "blog", "journal", "career page", "job board", "publication"],
  slots: {
    primary: "front page + back column",
    accent: "headline + column lines",
  },
  defaultVariant: "read",
  variants: {
    // the column lines are printed in again, top to bottom
    read: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          LINES.map(({ part }, i) => {
            const { opacity, pathLength } = readLine(0.25 + i * 0.3, 0.55 + i * 0.3)
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
    // the headline block pops like breaking news
    pop: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=headline]",
          { scale: [1, 1.25, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ease.out },
        ),
    },
    // the front page folds in toward the back column and flaps open again
    flip: {
      clip: false,
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=front]",
          { scaleX: [1, 0.55, 1.04, 1] },
          { duration: seconds, times: [0, 0.4, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the back column, tucked behind the front page's left edge */}
      <path d="M6 9H2v13h4" />
      {/* the front page, hinged on its left edge (x 6) where it meets the column */}
      <g data-part="front" style={pivot("0% 50%")}>
        <path d="M6 22V2h16v20z" />
        <g stroke={slot.accent}>
          <path d="M10 6h8v4h-8z" data-part="headline" style={pivot("50% 50%")} />
          {LINES.map(({ part, d }) => (
            <path key={part} data-part={part} d={d} />
          ))}
        </g>
      </g>
    </>
  ),
})
