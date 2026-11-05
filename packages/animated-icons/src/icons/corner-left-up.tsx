"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "corner-left-up": "nudge" | "draw" | "bounce"
  }
}

/** 1 color: an L-shaped arrow that runs left, turns the corner and points up. */
export const CornerLeftUp = createAnimatedIcon({
  name: "corner-left-up",
  family: "corner",
  category: "arrows",
  keywords: ["turn up", "back up", "return", "go up", "parent", "level up", "corner arrow"],
  slots: { primary: "arrow" },
  defaultVariant: "nudge",
  variants: {
    // the arrow pushes up along its last leg and settles back
    nudge: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, -3, 0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the path is wiped, then redraws from the right round the corner and the head lands on its end;
    // each is hidden while too short to read, so a square cap never leaves a stray dot
    draw: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=shaft]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.2, 0.22, 1] },
          ),
          animate(
            "[data-part=shaft]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.19, 0.2, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { opacity: [1, 0, 0, 1, 1], scale: [1, 1, 0.4, 1.1, 1] },
            { duration: seconds, times: [0, 0.15, 0.6, 0.78, 1], ease: ["easeOut", "linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // knocks upward twice, the second time softer; shaft and head move as one piece
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
    <g data-part="arrow" style={pivot("50% 50%")}>
      {/* drawn sharp at the corner; the factory rounds it at render */}
      <path data-part="shaft" d="M20 20H9V4.5" />
      {/* a right-angled chevron: its miter makes the point */}
      <path data-part="head" d="M3.5 9.5 9 4l5.5 5.5" style={pivot("50% 0%")} />
    </g>
  ),
})
