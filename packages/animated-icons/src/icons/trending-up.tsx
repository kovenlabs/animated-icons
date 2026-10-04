"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "trending-up": "draw" | "surge" | "climb"
  }
}

/** 1 color. */
export const TrendingUp = createAnimatedIcon({
  name: "trending-up",
  family: "trending",
  category: "charts",
  keywords: ["trend", "growth", "increase", "rise", "gain", "profit", "stocks", "up"],
  slots: { primary: "trend line + head" },
  defaultVariant: "draw",
  variants: {
    // the line redraws from its start, and the head snaps on once the line reaches it
    // (both hidden while they are too small to read)
    draw: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=line]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=line]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.75, times: [0, 0.16, 0.17, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { scale: [1, 0, 0, 1], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.1, 0.65, 1], ease: ["easeIn", "linear", ease.overshoot] },
          ),
        ]),
    },
    // shoots off the top-right corner and climbs back in from the bottom-left
    surge: {
      duration: 750,
      clip: true,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=trend]",
          { x: [0, 7, -7, 0], y: [0, -7, 7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // the trend steepens about its starting point, then settles back
    climb: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=trend]",
          { rotate: [0, -10, 2.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // line and head move as one piece; the whole trend turns on the line's first point
    <g data-part="trend" style={pivot("0% 100%")}>
      {/* stops one diagonal short of the head's corner, so its cap stays inside the head's miter */}
      <path data-part="line" d="M3 17l6-6 4 4 7-7" />
      <path data-part="head" d="M15 7h6v6" style={pivot("100% 0%")} />
    </g>
  ),
})
