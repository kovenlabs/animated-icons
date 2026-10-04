"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    type: "draw" | "blink"
  }
}

/** The T's three strokes in drawing order: the crossbar with its serifs, the stem, then the foot. */
const STROKES = [
  { part: "bar", d: "M3 7V4h14v3", start: 0.2, end: 0.45 },
  { part: "stem", d: "M10 4v16", start: 0.45, end: 0.65 },
  { part: "foot", d: "M7 20h6", start: 0.65, end: 0.8 },
] as const

/** 2 colors: letter (primary), text caret (accent). */
export const Type = createAnimatedIcon({
  name: "type",
  category: "text",
  keywords: ["text", "font", "typography", "typeface", "letter", "caret", "write"],
  slots: { primary: "letter", accent: "caret" },
  defaultVariant: "draw",
  variants: {
    // the letter fades and is written again stroke by stroke while the caret waits; the caret blinks
    // once the letter is done. Each stroke is hidden until it starts: a square cap paints a dot at 0
    draw: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...STROKES.map(({ part, start, end }) =>
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
          animate(
            "[data-part=caret]",
            { opacity: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.82, 0.9, 1], ease: "linear" },
          ),
        ]),
    },
    // the caret blinks twice beside the letter, as if waiting for the next keystroke
    blink: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=caret]",
          { opacity: [1, 1, 0, 0, 1, 1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.1, 0.15, 0.35, 0.4, 0.6, 0.65, 0.85, 0.9], ease: "linear" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="letter">
        {STROKES.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} />
        ))}
      </g>
      {/* a cap-height caret, 2 clear of the crossbar's corner */}
      <path data-part="caret" d="M21 6v14" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
