"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    undo: "back" | "rewind" | "draw"
  }
}

/** 1 color: a curved arrow turning back on itself. */
export const Undo = createAnimatedIcon({
  name: "undo",
  category: "actions",
  keywords: ["revert", "back", "previous", "cancel", "history", "restore", "step back"],
  slots: { primary: "arrow" },
  defaultVariant: "back",
  variants: {
    // knocks back to the left twice, the second time softer
    back: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, -3, 0, -1.5, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // winds back a little against the clock, then settles: turning back time
    rewind: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { rotate: [0, -16, 4, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // fades out, the curve redraws from its tail round to the head, then the head pops back on;
    // each is hidden while too short to read, so the square cap never leaves a stray dot
    draw: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=curve]",
            { opacity: [1, 0, 0, 1, 1, 1], pathLength: [1, 1, 0, 0.1, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.2, 0.25, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { opacity: [1, 0, 0, 1, 1], x: [0, 0, 1.5, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.68, 0.82, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="arrow" style={pivot("50% 50%")}>
      {/* an octagonal half-turn, authored from the tail so it draws on toward the head */}
      <path data-part="curve" d="M11 19h3l4-4v-2l-4-4H4.5" />
      {/* a right-angled chevron: its miter makes the point */}
      <path data-part="head" d="M9 4 4 9l5 5" />
    </g>
  ),
})
