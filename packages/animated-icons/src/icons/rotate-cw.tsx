"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "rotate-cw": "tumble" | "spin" | "flip"
  }
}

/**
 * `rotate-ccw` mirrored: one ring arrow running clockwise, a true arc (the turn itself is round) from
 * 2 o'clock the long way round to 12, where it straightens into a chevron pointing right, with the clock.
 */
const RING = "M18.93 9A8 8 0 1 1 12 5h1"
const HEAD = "M11 2l3 3-3 3"

/** 1 color: a ring arrow turning with the clock. */
export const RotateCw = createAnimatedIcon({
  name: "rotate-cw",
  family: "rotate",
  category: "actions",
  keywords: ["rotate right", "clockwise", "turn right", "rotate", "refresh", "redo", "spin"],
  slots: { primary: "ring arrow" },
  defaultVariant: "tumble",
  variants: {
    // the ring tips back like a hoop seen edge-on while it makes a full turn with the clock
    tumble: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { rotate: [0, 360], scaleY: [1, 0.35, 1], scale: [1, 1.08, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // winds the wrong way, then whips round twice with the clock and coasts to a stop
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { rotate: [0, -30, 720] },
          { duration: seconds, times: [0, 0.2, 1], ease: ["easeOut", ease.out] },
        ),
    },
    // turns over on its vertical axis: halfway round it runs counterclockwise, then it comes back
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { scaleX: [1, -1, 1], scale: [1, 1.1, 1], y: [0, -1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // the box runs x 4..20, y 2..21: its pivot is the ring's centre (12, 13)
    <g data-part="arrow" style={pivot("50% 57.89%")}>
      <path d={RING} />
      <path d={HEAD} />
    </g>
  ),
})
