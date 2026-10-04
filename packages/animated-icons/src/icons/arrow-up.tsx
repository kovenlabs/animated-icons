"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "arrow-up": "dash" | "through" | "bounce"
  }
}

/** 1 color. */
export const ArrowUp = createAnimatedIcon({
  name: "arrow-up",
  family: "arrow",
  category: "arrows",
  keywords: ["up", "rise", "increase", "top", "scroll up", "ascend", "north"],
  slots: { primary: "arrow + speed lines" },
  defaultVariant: "dash",
  variants: {
    // a quick push upward, speed lines trailing below it
    dash: {
      duration: 500,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=arrow]", { y: [0, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=speed]",
            { opacity: [0, 1, 0], y: [-1, 0, 1] },
            { duration: seconds * 0.6, delay: seconds * 0.1 },
          ),
        ]),
    },
    // exits through the top, re-enters from the bottom
    through: {
      clip: true,
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, -7, 7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // knocks upward twice, the second time softer; head and shaft move as one piece
    bounce: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, -3, 0, -1.5, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="speed" style={flash()}>
        <path d="M8 21v-2" />
        <path d="M16 21v-2" />
      </g>
      <g data-part="arrow" style={pivot("50% 50%")}>
        <path d="M12 20V4.5" />
        {/* a right-angled chevron: its miter makes the point */}
        <path d="M5.5 10.5 12 4l6.5 6.5" />
      </g>
    </>
  ),
})
