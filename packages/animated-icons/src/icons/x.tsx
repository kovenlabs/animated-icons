"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    x: "turn" | "pop" | "draw"
  }
}

/** 1 color. */
export const X = createAnimatedIcon({
  name: "x",
  category: "actions",
  keywords: ["close", "cancel", "dismiss", "remove", "delete", "cross", "exit"],
  slots: { primary: "cross" },
  defaultVariant: "turn",
  variants: {
    // a quarter turn that lands with a small overshoot. The cross looks the same a quarter turn
    // back, so it starts there and comes to rest at 0 without a visible jump.
    turn: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cross]",
          { rotate: [-90, 0], scale: [1, 0.85, 1] },
          { duration: seconds, ease: ease.overshoot },
        ),
    },
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=cross]", { scale: [1, 1.18, 0.96, 1] }, { duration: seconds, ease: ease.out }),
    },
    // fades out, then the strokes redraw one after the other; each is hidden while it is too short
    // to read, so the square cap never leaves a stray dot
    draw: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stroke-a]",
            { opacity: [1, 0, 0, 1, 1, 1], pathLength: [1, 1, 0, 0.15, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.2, 0.26, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=stroke-b]",
            { opacity: [1, 0, 0, 1, 1], pathLength: [1, 1, 0, 0.15, 1] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.51, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="cross" style={pivot("50% 50%")}>
      <path data-part="stroke-a" d="M6 6l12 12" />
      <path data-part="stroke-b" d="M18 6 6 18" />
    </g>
  ),
})
