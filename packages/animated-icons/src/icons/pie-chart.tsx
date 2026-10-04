"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "pie-chart": "pop" | "spin" | "draw"
  }
}

/**
 * A pie is round, so it gets true arcs (r 9 around 12,12). The top-right quarter is the slice; the
 * rest of the pie is an open arc that stops 30° short of the slice on both sides, so its ends stay
 * 2 clear of the slice's edges.
 */
const SLICE = "M12 12V3A9 9 0 0 1 21 12Z"
const BODY = "M19.794 16.5A9 9 0 1 1 7.5 4.206"

/** 2 colors: pie (primary), slice (accent). */
export const PieChartIcon = createAnimatedIcon({
  name: "pie-chart",
  category: "charts",
  keywords: ["chart", "pie", "donut", "share", "proportion", "percentage", "analytics", "breakdown"],
  slots: { primary: "pie", accent: "slice" },
  defaultVariant: "pop",
  variants: {
    // the slice is pulled out from the centre along its diagonal and slots back in
    pop: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=slice]",
          { x: [0, 1.5, 1.5, 0], y: [0, -1.5, -1.5, 0], scale: [1, 1.05, 1.05, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeOut", "linear", "easeInOut"] },
        ),
    },
    // the whole pie turns once about its centre, carrying the slice round with it
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate("[data-part=pie]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the pie's rim winds back on clockwise, then the slice drops into the gap
    // (the rim is hidden while it is too short to read)
    draw: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=body]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=body]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.7, times: [0, 0.17, 0.18, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=slice]",
            { scale: [1, 0, 0, 1], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.12, 0.65, 1], ease: ["easeIn", "linear", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="pie" style={pivot("50% 50%")}>
      <path data-part="body" d={BODY} />
      {/* scales from its point, the centre of the pie */}
      <path data-part="slice" d={SLICE} stroke={slot.accent} style={pivot("0% 100%")} />
    </g>
  ),
})
