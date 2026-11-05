"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "panel-right": "toggle" | "resize"
  }
}

/** 2 colors: window frame (primary), panel edge (accent). `panel-left` mirrored. */
export const PanelRight = createAnimatedIcon({
  name: "panel-right",
  family: "panel",
  category: "layout",
  keywords: ["sidebar", "side panel", "inspector", "drawer", "navigation", "right panel", "layout"],
  slots: { primary: "window frame", accent: "panel edge" },
  defaultVariant: "toggle",
  variants: {
    // the panel slides shut against the right edge, holds, then slides back open
    toggle: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=edge]",
          { x: [0, 4, 4, 0] },
          { duration: seconds, times: [0, 0.3, 0.6, 1], ease: ["easeInOut", "linear", ease.out] },
        ),
    },
    // the panel edge is dragged wider, then springs back with a small give
    resize: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=edge]",
          { x: [0, -4, 1, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <path data-part="edge" d="M15 4v16" stroke={slot.accent} />
    </>
  ),
})
