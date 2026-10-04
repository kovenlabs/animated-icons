"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "chevron-down": "bounce" | "flip" | "drop"
  }
}

/** 1 color. */
export const ChevronDown = createAnimatedIcon({
  name: "chevron-down",
  family: "chevron",
  category: "arrows",
  keywords: ["expand", "dropdown", "open", "more", "caret", "disclosure", "down"],
  slots: { primary: "chevron" },
  defaultVariant: "bounce",
  variants: {
    // knocks downward twice, the second time softer
    bounce: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevron]",
          { y: [0, 3, 0, 1.5, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // folds over to point up, holds a beat, folds back: open, then closed
    flip: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevron]",
          { scaleY: [1, -1, -1, 1] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // slips out through the bottom edge, back in from the top
    drop: {
      clip: true,
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevron]",
          { y: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // a right-angled chevron, centred on the grid
    <path data-part="chevron" d="M6 9l6 6 6-6" style={pivot("50% 50%")} />
  ),
})
