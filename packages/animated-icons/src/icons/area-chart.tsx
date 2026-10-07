"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "area-chart": "lift" | "rise" | "slosh"
  }
}

/** The area under a line that goes up 3, down 4, up 5 (every leg at 45°), closed 4 clear of both axes. */
const AREA = "M7 17v-5l3-3 4 4 5-5v9z"

/** 2 colors: axes (primary), area (accent). */
export const AreaChart = createAnimatedIcon({
  name: "area-chart",
  category: "charts",
  keywords: ["chart", "graph", "analytics", "volume", "trend", "statistics", "stacked area", "report"],
  slots: { primary: "axes", accent: "area" },
  defaultVariant: "lift",
  variants: {
    // the area peels up off the chart toward you, leaving its faint footprint behind, and lays back down
    lift: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=area]",
            { x: [0, 1.5, 1.5, 0], y: [0, -2.5, -2.5, 0], scale: [1, 1.12, 1.12, 1] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeOut", "linear", ease.inOut] },
          ),
          animate(
            "[data-part=footprint]",
            { opacity: [0, 0.35, 0.35, 0] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the area drains into the baseline and floods back up, overshooting before it settles
    rise: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=area]",
          { scaleY: [1, 0, 0, 1.2, 1] },
          { duration: seconds, times: [0, 0.25, 0.35, 0.7, 1], ease: ["easeIn", "linear", "easeOut", "easeInOut"] },
        ),
    },
    // the values slosh: the area tips one way and the other on its baseline, heaving as it goes
    slosh: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=area]",
          { skewY: [0, -9, 7, -4, 0], scaleY: [1, 1.18, 0.85, 1.06, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <path d="M3 3v18h18" />
      <g stroke={slot.accent}>
        <path data-part="footprint" d={AREA} style={flash()} />
        <path data-part="area" d={AREA} style={pivot("50% 100%")} />
      </g>
    </>
  ),
})
