"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "panel-left-open": "open" | "nudge"
  }
}

/** 3 colors: window frame (primary), panel edge (secondary), expand chevron (accent). */
export const PanelLeftOpen = createAnimatedIcon({
  name: "panel-left-open",
  family: "panel",
  category: "layout",
  keywords: ["expand sidebar", "show sidebar", "open panel", "side panel", "drawer", "navigation", "layout"],
  slots: { primary: "window frame", secondary: "panel edge", accent: "expand chevron" },
  defaultVariant: "open",
  variants: {
    // the panel tucks against the left edge, then sweeps open, pushing the chevron along to the right
    open: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, times: [0, 0.25, 0.4, 0.8, 1], ease: ["easeInOut", "linear", ease.out, "easeInOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=edge]", { x: [0, -4, -4, 1, 0] }, options),
          animate("[data-part=chevron]", { x: [0, 0, 0, 2, 0] }, options),
        ])
      },
    },
    // the chevron taps right twice, pointing the way the panel will open
    nudge: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevron]",
          { x: [0, 2, 0, 2, 0] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <path data-part="edge" d="M9 4v16" stroke={slot.secondary} />
      {/* in the main area, pointing away from the panel */}
      <path data-part="chevron" d="M14 9l3 3-3 3" stroke={slot.accent} />
    </>
  ),
})
