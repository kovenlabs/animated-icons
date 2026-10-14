"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    variable: "assign" | "flip" | "hop"
  }
}

/** 2 colors: parentheses (primary), the x (accent). */
export const Variable = createAnimatedIcon({
  name: "variable",
  category: "development",
  keywords: ["variable", "function", "math", "formula", "parameter", "code", "x", "expression"],
  slots: { primary: "parentheses", accent: "x" },
  defaultVariant: "assign",
  variants: {
    // the x spins away to nothing as the brackets clamp shut, then a new value spins in big and the
    // brackets spring back open around it
    assign: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.35, 0.45, 0.75, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate(
            "[data-part=glyph]",
            { scale: [1, 0, 0, 1.25, 1], rotate: [0, 180, 180, 360, 360] },
            { ...timing, ease: [ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate("[data-part=left]", { x: [0, 2.5, 2.5, -1.5, 0] }, timing),
          animate("[data-part=right]", { x: [0, -2.5, -2.5, 1.5, 0] }, timing),
        ])
      },
    },
    // the whole expression turns over like a card, leaning into the turn for perspective
    flip: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=variable]",
          { scaleX: [1, -1, 1], skewY: [0, 12, 0, -12, 0], scale: [1, 1.08, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the x crouches, springs up between the brackets with a stretch and lands squashed, the brackets
    // bowing out under the landing
    hop: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.5, 0.75, 1]
        const bow = { duration: seconds, times, ease: "easeOut" as const }
        return Promise.all([
          animate(
            "[data-part=x]",
            { y: [0, 0, -2.5, 0, 0], scaleY: [1, 0.7, 1.1, 0.75, 1], scaleX: [1, 1.25, 0.85, 1.2, 1] },
            { duration: seconds, times, ease: ["easeOut", "easeOut", "easeIn", "easeOut"] },
          ),
          animate("[data-part=left]", { x: [0, 0, 0, -1.2, 0], scaleY: [1, 1, 1, 0.92, 1] }, bow),
          animate("[data-part=right]", { x: [0, 0, 0, 1.2, 0], scaleY: [1, 1, 1, 0.92, 1] }, bow),
        ])
      },
    },
  },
  render: () => (
    <g data-part="variable" style={pivot("50% 50%")}>
      {/* faceted brackets: a raked top, a straight flank and a raked foot */}
      <path data-part="left" d="M8 3 5 7.5v9L8 21" style={pivot("50% 50%")} />
      <path data-part="right" d="M16 3l3 4.5v9L16 21" style={pivot("50% 50%")} />
      {/* hops from its feet, spins on its centre */}
      <g data-part="x" stroke={slot.accent} style={pivot("50% 100%")}>
        <path data-part="glyph" d="M9 9l6 6M15 9l-6 6" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
