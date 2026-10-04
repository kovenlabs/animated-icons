"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "chevron-right": "bounce" | "flip" | "slide"
  }
}

/** 1 color. */
export const ChevronRight = createAnimatedIcon({
  name: "chevron-right",
  family: "chevron",
  category: "arrows",
  keywords: ["next", "forward", "continue", "caret", "expand", "right", "more"],
  slots: { primary: "chevron" },
  defaultVariant: "bounce",
  variants: {
    // knocks to the right twice, the second time softer
    bounce: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevron]",
          { x: [0, 3, 0, 1.5, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // folds over to point the other way, holds a beat, folds back
    flip: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevron]",
          { scaleX: [1, -1, -1, 1] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // slips out through the right edge, back in from the other side
    slide: {
      clip: true,
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevron]",
          { x: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // a right-angled chevron, centred on the grid
    <path data-part="chevron" d="M9 6l6 6-6 6" style={pivot("50% 50%")} />
  ),
})
