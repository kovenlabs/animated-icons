"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    italic: "lean" | "straighten" | "draw"
  }
}

/**
 * The letter's three strokes in drawing order: the top serif, the slanted stem, then the foot serif.
 * The stem leans 6 across over its 16 of height, so a skew of `UPRIGHT` degrees stands it straight.
 */
const STROKES = [
  { part: "top", d: "M10 4h9", start: 0.2, end: 0.4 },
  { part: "stem", d: "M15 4 9 20", start: 0.4, end: 0.65 },
  { part: "foot", d: "M5 20h9", start: 0.65, end: 0.85 },
] as const
const UPRIGHT = (Math.atan(6 / 16) * 180) / Math.PI

/** 1 color. */
export const Italic = createAnimatedIcon({
  name: "italic",
  category: "text",
  keywords: ["italic", "slanted", "oblique", "emphasis", "text style", "format", "typography"],
  slots: { primary: "letter" },
  defaultVariant: "lean",
  variants: {
    // the letter tips further into its slant, then swings back past upright a touch and settles
    lean: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=letter]",
          { skewX: [0, -12, 4, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeInOut", "easeInOut", "easeOut"] },
        ),
    },
    // the letter stands bolt upright, holds a beat, then tips back into its slant and lands
    straighten: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=letter]",
          { skewX: [0, UPRIGHT, UPRIGHT, 0] },
          { duration: seconds, times: [0, 0.35, 0.55, 1], ease: ["easeInOut", "linear", ease.overshoot] },
        ),
    },
    // the letter fades and is written again serif, stem, serif. Each stroke is hidden until it
    // starts: a square cap paints a dot at pathLength 0
    draw: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          STROKES.map(({ part, start, end }) =>
            Promise.all([
              animate(
                `[data-part=${part}]`,
                { opacity: [1, 0, 0, 1] },
                { duration: seconds, times: [0, 0.12, start, start + 0.01] },
              ),
              animate(
                `[data-part=${part}]`,
                { pathLength: [1, 1, 0, 1, 1] },
                { duration: seconds, times: [0, start - 0.01, start, end, 1], ease: "easeOut" },
              ),
            ]),
          ),
        ),
    },
  },
  render: () => (
    // skews about its centre (12, 12), which is also the stem's midpoint, so upright stays centred
    <g data-part="letter" style={pivot("50% 50%")}>
      {STROKES.map(({ part, d }) => (
        <path key={part} data-part={part} d={d} />
      ))}
    </g>
  ),
})
