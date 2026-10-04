"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    minus: "shrink" | "press" | "draw"
  }
}

/** 1 color. The bar is drawn as two arms from the centre, so it can grow outward. */
export const Minus = createAnimatedIcon({
  name: "minus",
  category: "actions",
  keywords: ["subtract", "remove", "decrease", "less", "reduce", "negative", "zoom out"],
  slots: { primary: "bar" },
  defaultVariant: "shrink",
  variants: {
    // pulls in toward its centre, then springs back past full length and settles
    shrink: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bar]",
          { scaleX: [1, 0.35, 1] },
          { duration: seconds, times: [0, 0.4, 1], ease: ["easeInOut", ease.overshoot] },
        ),
    },
    // pressed down like a key, then back up
    press: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bar]",
          { y: [0, 3, -0.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // fades out, then both arms draw out from the centre together; hidden while too short to read,
    // so the square cap never leaves a stray dot
    draw: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arm]",
          { opacity: [1, 0, 0, 1, 1, 1], pathLength: [1, 1, 0, 0.15, 1, 1] },
          { duration: seconds, times: [0, 0.15, 0.3, 0.36, 0.85, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <g data-part="bar" style={pivot("50% 50%")}>
      <path data-part="arm" d="M12 12H5" />
      <path data-part="arm" d="M12 12h7" />
    </g>
  ),
})
