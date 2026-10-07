"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "square-x": "turn" | "draw" | "press"
  }
}

/** The two strokes of the cross, 3px each side of the centre: the first falls left to right, the second crosses it. */
const STROKES = [
  { part: "stroke-a", d: "M9 9l6 6" },
  { part: "stroke-b", d: "M15 9l-6 6" },
] as const

/** 2 colors: box (primary), cross (accent). The box is square-check's, so the pair reads as one control. */
export const SquareX = createAnimatedIcon({
  name: "square-x",
  family: "square",
  category: "actions",
  keywords: ["checkbox", "deselect all", "clear", "close", "cancel", "remove", "unchecked"],
  slots: { primary: "box", accent: "cross" },
  defaultVariant: "turn",
  variants: {
    // a quarter turn that lands with a small overshoot. The cross looks the same a quarter turn
    // back, so it starts there and comes to rest at 0 without a visible jump.
    turn: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cross]",
          { rotate: [-90, 0], scale: [1, 0.8, 1] },
          { duration: seconds, ease: ease.overshoot },
        ),
    },
    // fades out, then the strokes redraw one after the other; each is hidden while it is too short
    // to read, so the square cap never leaves a stray dot
    draw: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stroke-a]",
            { opacity: [1, 0, 0, 1, 1, 1], pathLength: [1, 1, 0, 0.15, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.15, 0.2, 0.26, 0.6, 1],
              ease: "easeInOut",
            },
          ),
          animate(
            "[data-part=stroke-b]",
            { opacity: [1, 0, 0, 1, 1], pathLength: [1, 1, 0, 0.15, 1] },
            {
              duration: seconds,
              times: [0, 0.15, 0.45, 0.51, 1],
              ease: "easeInOut",
            },
          ),
        ]),
    },
    // the whole box is pressed like a clicked checkbox and springs back
    press: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=box]",
          { scale: [1, 0.86, 1.04, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="box" style={pivot("50% 50%")}>
      <path d="M3 3h18v18H3z" />
      <g data-part="cross" stroke={slot.accent} style={pivot("50% 50%")}>
        {STROKES.map(({ part, d }) => (
          <path d={d} data-part={part} key={part} />
        ))}
      </g>
    </g>
  ),
})
