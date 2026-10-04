"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    refresh: "spin" | "wind" | "nudge"
  }
}

/** 1 color: two arrows chasing each other round an octagon. */
export const Refresh = createAnimatedIcon({
  name: "refresh",
  category: "actions",
  keywords: ["reload", "sync", "update", "retry", "rotate", "repeat"],
  slots: { primary: "arrows" },
  defaultVariant: "spin",
  variants: {
    spin: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=arrows]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // winds back a little, then turns a full circle and lands
    wind: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrows]",
          { rotate: [0, -30, 360] },
          { duration: seconds, times: [0, 0.3, 1], ease: ["easeOut", ease.overshoot] },
        ),
    },
    // a partial turn that springs back, like a stuck retry
    nudge: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrows]",
          { rotate: [0, 40, -6, 0] },
          { duration: seconds, times: [0, 0.45, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="arrows" style={pivot("50% 50%")}>
      {/* each half of the octagon runs into a mitered L-shaped head */}
      <path d="M4 12V9l5-5h6l4 4" />
      <path d="M20 5v4h-4" />
      <path d="M20 12v3l-5 5H9l-4-4" />
      <path d="M4 19v-4h4" />
    </g>
  ),
})
