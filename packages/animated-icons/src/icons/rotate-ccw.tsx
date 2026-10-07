"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "rotate-ccw": "tumble" | "spin" | "flip"
  }
}

/**
 * One ring arrow running counterclockwise: a true arc (the turn itself is round) from 10 o'clock the long
 * way round to 12, where it straightens into a chevron pointing left, against the clock.
 */
const RING = "M5.07 9A8 8 0 1 0 12 5h-1"
const HEAD = "M13 2l-3 3 3 3"

/** 1 color: a ring arrow turning against the clock. */
export const RotateCcw = createAnimatedIcon({
  name: "rotate-ccw",
  family: "rotate",
  category: "actions",
  keywords: ["rotate left", "counterclockwise", "anticlockwise", "turn left", "rotate", "reset", "spin back"],
  slots: { primary: "ring arrow" },
  defaultVariant: "tumble",
  variants: {
    // the ring tips back like a hoop seen edge-on while it makes a full turn against the clock
    tumble: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { rotate: [0, -360], scaleY: [1, 0.35, 1], scale: [1, 1.08, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // winds the wrong way, then whips round twice against the clock and coasts to a stop
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { rotate: [0, 30, -720] },
          { duration: seconds, times: [0, 0.2, 1], ease: ["easeOut", ease.out] },
        ),
    },
    // turns over on its vertical axis: halfway round it runs clockwise, then it comes back
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
