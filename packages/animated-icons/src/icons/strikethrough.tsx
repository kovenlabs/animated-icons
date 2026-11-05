"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    strikethrough: "strike" | "tilt"
  }
}

/** 2 colors: letter (primary), strike line (accent). */
export const Strikethrough = createAnimatedIcon({
  name: "strikethrough",
  category: "text",
  keywords: ["strikethrough", "strike", "cross out", "deleted text", "line through", "format", "typography"],
  slots: { primary: "letter", accent: "strike line" },
  defaultVariant: "strike",
  variants: {
    // the strike line is lifted off and drawn through the letter again, left to right. Hidden until
    // it has length: a square cap paints a dot at pathLength 0
    strike: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=strike]", { opacity: [1, 0, 0, 1] }, { duration: seconds, times: [0, 0.15, 0.3, 0.31] }),
          animate(
            "[data-part=strike]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.29, 0.3, 0.85, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the strike line rocks like a hasty pen stroke, then settles level
    tilt: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=strike]",
          { rotate: [0, -8, 5, 0] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* a faceted S: the upper half stops 2 clear of the strike, the lower half grows out of it */}
      <path d="M17 4H9L6 7v1M14 12l3 3v2l-3 3H6" />
      <path data-part="strike" d="M4 12h16" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
