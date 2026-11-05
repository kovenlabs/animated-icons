"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "panel-right-close": "close" | "nudge"
  }
}

/** 3 colors: window frame (primary), panel edge (secondary), collapse chevron (accent). */
export const PanelRightClose = createAnimatedIcon({
  name: "panel-right-close",
  family: "panel",
  category: "layout",
  keywords: ["collapse sidebar", "hide sidebar", "close panel", "side panel", "drawer", "navigation", "layout"],
  slots: { primary: "window frame", secondary: "panel edge", accent: "collapse chevron" },
  defaultVariant: "close",
  variants: {
    // the chevron leads the panel shut against the right edge, holds, then both slide back
    close: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, times: [0, 0.3, 0.6, 1], ease: ["easeInOut", "linear", ease.out] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=edge]", { x: [0, 4, 4, 0] }, options),
          animate("[data-part=chevron]", { x: [0, 3, 3, 0] }, options),
        ])
      },
    },
    // the chevron taps right twice, pointing the way the panel will go
    nudge: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevron]",
          { x: [0, 2.5, 0, 2.5, 0] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <path data-part="edge" d="M15 4v16" stroke={slot.secondary} />
      {/* centred in the main area, pointing at the panel */}
      <path data-part="chevron" d="M8 9l3 3-3 3" stroke={slot.accent} />
    </>
  ),
})
