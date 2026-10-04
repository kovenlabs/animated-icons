"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "arrow-up-right": "dash" | "through" | "draw"
  }
}

/** 1 color. */
export const ArrowUpRight = createAnimatedIcon({
  name: "arrow-up-right",
  family: "arrow",
  category: "arrows",
  keywords: ["diagonal", "northeast", "launch", "go", "open", "trending up"],
  slots: { primary: "arrow" },
  defaultVariant: "dash",
  variants: {
    // a short push along its own diagonal that settles back
    dash: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 2.5, -0.5, 0], y: [0, -2.5, 0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // exits top-right, re-enters from the bottom-left
    through: {
      clip: true,
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 7, -7, 0], y: [0, -7, 7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // the arrow retracts into its tail and grows back out, head and shaft as one piece
    // (hidden at zero, so the square cap never leaves a stray dot)
    draw: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { scale: [1, 0, 1], opacity: [1, 0, 1] },
          { duration: seconds, times: [0, 0.4, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // head and shaft move as one piece, so the shaft can never poke through the point
    <g data-part="arrow" style={pivot("0% 100%")}>
      <path d="M5.5 18.5 17.5 6.5" />
      {/* a right-angled head, its arms as long as arrow-right's: the miter makes the point */}
      <path d="M9.5 5.5h9v9" />
    </g>
  ),
})
