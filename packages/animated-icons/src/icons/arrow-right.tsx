"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "arrow-right": "dash" | "through" | "bounce"
  }
}

/** 1 color. */
export const ArrowRight = createAnimatedIcon({
  name: "arrow-right",
  family: "arrow",
  category: "arrows",
  keywords: ["next", "forward", "continue", "go", "direction", "proceed"],
  slots: { primary: "arrow + speed lines" },
  defaultVariant: "dash",
  variants: {
    dash: {
      duration: 500,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=arrow]", { x: [0, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=speed]",
            { opacity: [0, 1, 0], x: [1, 0, -1] },
            { duration: seconds * 0.6, delay: seconds * 0.1 },
          ),
        ]),
    },
    // exits right, re-enters from the left
    through: {
      clip: true,
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // knocks forward twice, the second time softer. Head and shaft move as one piece: animated
    // apart, the shaft overtook the head and poked out through the point.
    bounce: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 3, 0, 1.5, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="speed" style={flash()}>
        <path d="M3 8h2" />
        <path d="M3 16h2" />
      </g>
      <g data-part="arrow" style={pivot("50% 50%")}>
        <path d="M4 12h15.5" />
        {/* a right-angled chevron: its miter makes the point */}
        <path d="M13.5 5.5 20 12l-6.5 6.5" />
      </g>
    </>
  ),
})
