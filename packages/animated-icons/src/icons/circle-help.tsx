"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-help": "tilt" | "hop" | "pulse"
  }
}

/** A faceted question mark: a flat-topped hook that steps down into a short stem, 2px clear of its dot. */
const HOOK = "M9 8.5L10.5 6h3L15 8.5v1.5l-3 2v1"

/** 2 colors: ring (primary), question mark (accent). */
export const CircleHelp = createAnimatedIcon({
  name: "circle-help",
  family: "circle",
  category: "status",
  keywords: ["help", "question", "support", "faq", "help center", "info", "unknown"],
  slots: { primary: "ring", accent: "question mark" },
  defaultVariant: "tilt",
  variants: {
    // the question mark tilts side to side on its dot, the way a head tilts at a puzzle
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { rotate: [0, -12, 9, -5, 0] },
          {
            duration: seconds,
            times: [0, 0.25, 0.5, 0.75, 1],
            ease: "easeInOut",
          },
        ),
    },
    // the question mark hops and lands with a small squash; the hop stays under the ring's top
    hop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { y: [0, -1.5, 0, 0], scaleY: [1, 1.04, 0.92, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the whole badge breathes in and out once
    pulse: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { scale: [1, 1.1, 0.97, 1] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <g data-part="badge" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      {/* tilts and lands on its dot */}
      <g data-part="mark" style={pivot("50% 100%")}>
        <path d={HOOK} stroke={slot.accent} />
        <rect x="11" y="16" width="2" height="2" fill={slot.accent} stroke="none" />
      </g>
    </g>
  ),
})
