"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "arrow-down": "dash" | "through" | "bounce"
  }
}

/** 1 color. */
export const ArrowDown = createAnimatedIcon({
  name: "arrow-down",
  family: "arrow",
  category: "arrows",
  keywords: ["down", "fall", "decrease", "bottom", "scroll down", "descend", "south"],
  slots: { primary: "arrow + speed lines" },
  defaultVariant: "dash",
  variants: {
    // a quick push downward, speed lines trailing above it
    dash: {
      duration: 500,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=arrow]", { y: [0, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=speed]",
            { opacity: [0, 1, 0], y: [1, 0, -1] },
            { duration: seconds * 0.6, delay: seconds * 0.1 },
          ),
        ]),
    },
    // exits through the bottom, re-enters from the top
    through: {
      clip: true,
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // knocks downward twice, the second time softer; head and shaft move as one piece
    bounce: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, 3, 0, 1.5, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="speed" style={flash()}>
        <path d="M8 3v2" />
        <path d="M16 3v2" />
      </g>
      <g data-part="arrow" style={pivot("50% 50%")}>
        <path d="M12 4v15.5" />
        {/* a right-angled chevron: its miter makes the point */}
        <path d="M5.5 13.5 12 20l6.5-6.5" />
      </g>
    </>
  ),
})
