"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    expand: "burst" | "cascade" | "zoom"
  }
}

/** The four arrows, clockwise from top-left: each one's outward direction and the corner it grows from. */
const ARROWS = [
  { part: "nw", x: -1, y: -1, origin: "0% 0%", head: "M3 9V3h6", shaft: "M4 4l5 5" },
  { part: "ne", x: 1, y: -1, origin: "100% 0%", head: "M15 3h6v6", shaft: "M20 4l-5 5" },
  { part: "se", x: 1, y: 1, origin: "100% 100%", head: "M21 15v6h-6", shaft: "M20 20l-5-5" },
  { part: "sw", x: -1, y: 1, origin: "0% 100%", head: "M9 21H3v-6", shaft: "M4 20l5-5" },
] as const

/** 1 color: four diagonal arrows pointing out to the corners. */
export const Expand = createAnimatedIcon({
  name: "expand",
  category: "layout",
  keywords: ["enlarge", "fullscreen", "grow", "scale up", "resize", "maximize", "stretch"],
  slots: { primary: "corner arrows" },
  defaultVariant: "burst",
  variants: {
    // all four arrows crouch toward the middle, then fire out to their corners and settle
    burst: {
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all(
          ARROWS.map(({ part, x, y }) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, -x * 1.5, x, 0], y: [0, -y * 1.5, y, 0] },
              { duration: seconds, times: [0, 0.4, 0.62, 1], ease: ["easeOut", ease.in, ease.overshoot] },
            ),
          ),
        ),
    },
    // round the clock, each arrow folds into its corner and springs back out, one after the other
    cascade: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          ARROWS.map(({ part }, i) =>
            animate(
              `[data-part=${part}]`,
              { scale: [1, 0.3, 1.15, 1] },
              { duration: seconds * 0.55, delay: seconds * 0.15 * i, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
            ),
          ),
        ),
    },
    // the frame falls back into the distance, fading, and rushes forward to fill the view
    zoom: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrows]",
          { scale: [1, 0.5, 1], opacity: [1, 0.4, 1] },
          { duration: seconds, times: [0, 0.4, 1], ease: ["easeIn", ease.out] },
        ),
    },
  },
  render: () => (
    <g data-part="arrows" style={pivot("50% 50%")}>
      {/* each arrow moves as one piece: a right-angled head in the corner, its shaft stopping short of the point */}
      {ARROWS.map(({ part, origin, head, shaft }) => (
        <g key={part} data-part={part} style={pivot(origin)}>
          <path d={head} />
          <path d={shaft} />
        </g>
      ))}
    </g>
  ),
})
