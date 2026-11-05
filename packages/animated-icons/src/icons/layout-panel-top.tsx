"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "layout-panel-top": "pop" | "drop"
  }
}

/** 2 colors: lower tiles (primary), top panel (accent). */
export const LayoutPanelTop = createAnimatedIcon({
  name: "layout-panel-top",
  family: "layout",
  category: "layout",
  keywords: ["panels", "header", "banner", "tiles", "dashboard", "template", "page layout"],
  slots: { primary: "lower tiles", accent: "top panel" },
  defaultVariant: "pop",
  variants: {
    // the panels shrink away together, then pop back in one by one: the top panel, then each tile
    pop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=panel]",
          { scale: [1, 0, 0, 1.12, 1] },
          {
            duration: seconds * 0.65,
            times: [0, 0.2, 0.35, 0.75, 1],
            ease: ["easeIn", "linear", ease.overshoot, "easeOut"],
            delay: stagger(seconds * 0.15),
          },
        ),
    },
    // the top panel lifts away and fades, then drops back into place with a light landing
    drop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=panel][data-index='0']",
            { y: [0, -3, -3, 0] },
            { duration: seconds, times: [0, 0.3, 0.45, 1], ease: ["easeIn", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=panel][data-index='0']",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.7, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <rect data-part="panel" data-index="0" x="3" y="3" width="18" height="7" stroke={slot.accent} style={pivot("50% 50%")} />
      <rect data-part="panel" data-index="1" x="3" y="14" width="7" height="7" style={pivot("50% 50%")} />
      <rect data-part="panel" data-index="2" x="14" y="14" width="7" height="7" style={pivot("50% 50%")} />
    </>
  ),
})
