"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    route: "trace" | "arrive" | "depart"
  }
}

/** 2 colors: path + start (primary), destination (accent). */
export const Route = createAnimatedIcon({
  name: "route",
  category: "navigation",
  keywords: ["path", "itinerary", "directions", "journey", "trip", "way", "transport line", "road"],
  slots: { primary: "path + start", accent: "destination" },
  defaultVariant: "trace",
  variants: {
    // the path fades out and redraws from the start to the destination; hidden while too short to read
    trace: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=path]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.35, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=path]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.15, 0.17, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the destination pops, as if reached
    arrive: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=end]",
          { scale: [1, 0.8, 1.2, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
        ),
    },
    // the start hops, ready to set off
    depart: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate("[data-part=start]", { y: [0, -2.5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      <rect data-part="start" x="3" y="16" width="6" height="6" />
      {/* a winding path: out from the start, round a bend, back across, round another, on to the end */}
      <path data-part="path" d="M9 19h9l2-2v-3l-2-2H6l-2-2V7l2-2h9" />
      <rect data-part="end" x="15" y="2" width="6" height="6" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
