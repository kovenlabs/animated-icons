"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "arrow-left": "dash" | "through" | "bounce"
  }
}

/** 1 color. */
export const ArrowLeft = createAnimatedIcon({
  name: "arrow-left",
  family: "arrow",
  category: "arrows",
  keywords: ["back", "previous", "return", "go back", "direction", "left"],
  slots: { primary: "arrow + speed lines" },
  defaultVariant: "dash",
  variants: {
    // a quick push to the left, speed lines trailing behind it
    dash: {
      duration: 500,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=arrow]", { x: [0, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=speed]",
            { opacity: [0, 1, 0], x: [-1, 0, 1] },
            { duration: seconds * 0.6, delay: seconds * 0.1 },
          ),
        ]),
    },
    // exits left, re-enters from the right
    through: {
      clip: true,
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, -7, 7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // knocks back twice, the second time softer; head and shaft move as one piece
    bounce: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, -3, 0, -1.5, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="speed" style={flash()}>
        <path d="M21 8h-2" />
        <path d="M21 16h-2" />
      </g>
      <g data-part="arrow" style={pivot("50% 50%")}>
        <path d="M20 12H4.5" />
        {/* a right-angled chevron: its miter makes the point */}
        <path d="M10.5 5.5 4 12l6.5 6.5" />
      </g>
    </>
  ),
})
