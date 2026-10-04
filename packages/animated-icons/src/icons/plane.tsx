"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    plane: "takeoff" | "bank"
  }
}

/** 1 color: airliner and contrails. */
export const PlaneIcon = createAnimatedIcon({
  name: "plane",
  category: "transport",
  keywords: ["flight", "airplane", "travel", "airport", "trip", "aviation", "fly"],
  slots: { primary: "airliner + contrails" },
  defaultVariant: "takeoff",
  variants: {
    // climbs out the top of the frame, its contrails streaming behind, and comes back in from below
    takeoff: {
      clip: true,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plane]",
            { y: [0, -8, 8, 0], scale: [1, 1.08, 0.94, 1], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=trail]",
            { opacity: [0, 1, 0], y: [0, 3] },
            { duration: seconds * 0.4, delay: seconds * 0.08, ease: "easeOut" },
          ),
        ]),
    },
    // rolls into a left bank, then a right one, and levels its wings
    bank: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=plane]",
          { rotate: [0, -14, 10, -4, 0], scaleX: [1, 0.82, 0.88, 0.96, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* contrails from the wingtips, only while it flies */}
      <g data-part="trail" style={flash()}>
        <path d="M3 18v2" />
        <path d="M21 18v2" />
      </g>
      {/* top view, all straight edges: pointed nose, swept wings, a small tailplane */}
      <path
        data-part="plane"
        d="M12 2l2 2.5V9l8 4v2l-8-2v5l2.5 2v1.5L12 20.5l-4.5 1V20l2.5-2v-5l-8 2v-2l8-4V4.5Z"
        style={pivot("50% 50%")}
      />
    </>
  ),
})
