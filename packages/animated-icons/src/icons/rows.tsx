"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    rows: "resize" | "split"
  }
}

/** 2 colors: frame (primary), row divider (accent). */
export const Rows = createAnimatedIcon({
  name: "rows",
  category: "layout",
  keywords: ["rows", "split", "horizontal split", "panes", "stack", "layout", "two rows", "table"],
  slots: { primary: "frame", accent: "row divider" },
  defaultVariant: "resize",
  variants: {
    // the divider is dragged up, making the bottom row taller, then settles back with a small give
    resize: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=divider]",
          { y: [0, -3, 0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeInOut", ease.out, "easeOut"] },
        ),
    },
    // the divider closes into the middle and vanishes, then splits the frame again from the centre out
    split: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=divider]",
            { scaleX: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.3, 0.4, 1], ease: ["easeIn", "linear", ease.out] },
          ),
          animate(
            "[data-part=divider]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.4, 0.45, 1], ease: "linear" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <path data-part="divider" d="M4 12h16" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
