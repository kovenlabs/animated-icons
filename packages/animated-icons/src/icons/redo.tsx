"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    redo: "forward" | "wind" | "draw"
  }
}

/** 1 color: a curved arrow turning forward on itself; the mirror image of `undo`. */
export const Redo = createAnimatedIcon({
  name: "redo",
  category: "actions",
  keywords: ["repeat", "forward", "next", "again", "history", "reapply", "step forward"],
  slots: { primary: "arrow" },
  defaultVariant: "forward",
  variants: {
    // lunges right leaning into it, recoils, and lunges again softer: undo's knock, mirrored and bolder
    forward: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 2, -1, 1, 0], skewX: [0, -8, 4, -2, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // winds forward with the clock and springs back past rest before settling: time moving on
    wind: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { rotate: [0, 20, -6, 2, 0] },
          { duration: seconds, times: [0, 0.4, 0.7, 0.85, 1], ease: "easeInOut" },
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
            { opacity: [1, 0, 0, 1, 1], x: [0, 0, -1.5, 0, 0], scale: [1, 1, 0.6, 1.2, 1] },
            { duration: seconds, times: [0, 0.15, 0.68, 0.82, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="arrow" style={pivot("50% 50%")}>
      {/* undo's octagonal half-turn mirrored, authored from the tail so it draws on toward the head */}
      <path data-part="curve" d="M13 19h-3l-4-4v-2l4-4h9.5" />
      {/* a right-angled chevron: its miter makes the point */}
      <path data-part="head" d="M15 4l5 5-5 5" style={pivot("100% 50%")} />
    </g>
  ),
})
