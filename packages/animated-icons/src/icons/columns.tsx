"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    columns: "resize" | "shift"
  }
}

/** 2 colors: frame (primary), column dividers (accent). */
export const Columns = createAnimatedIcon({
  name: "columns",
  category: "layout",
  keywords: ["columns", "split", "panes", "table", "layout", "grid", "three columns"],
  slots: { primary: "frame", accent: "column dividers" },
  defaultVariant: "resize",
  variants: {
    // the middle column widens as both dividers part, then settles back with a small give
    resize: {
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=left]",
            { x: [0, -3, 0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeInOut", ease.out, "easeOut"] },
          ),
          animate(
            "[data-part=right]",
            { x: [0, 3, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeInOut", ease.out, "easeOut"] },
          ),
        ]),
    },
    // the columns rebalance in a wave: the left divider slides right and back, then the right one
    shift: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["left", "right"].map((part, i) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, 3, 0] },
              { duration: seconds * 0.65, delay: seconds * 0.35 * i, ease: "easeInOut" },
            ),
          ),
        ),
    },
  },
  render: () => (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <g stroke={slot.accent}>
        <path data-part="left" d="M9 4v16" />
        <path data-part="right" d="M15 4v16" />
      </g>
    </>
  ),
})
