"use client"

import { steps } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    loader: "spin" | "pulse" | "jelly"
  }
}

/** 8 square-capped spokes; the trailing ones fade so the ring reads as turning clockwise. */
const SPOKES = Array.from({ length: 8 }, (_, i) => ({ angle: i * 45, opacity: (10 - ((8 - i) % 8)) / 10 }))

/** 1 color. Loops forever with no rest by default: a loader that waits for hover is useless. */
export const Loader = createAnimatedIcon({
  name: "loader",
  category: "status",
  keywords: ["spinner", "loading", "progress", "wait", "busy", "pending"],
  slots: { primary: "spokes" },
  defaultVariant: "spin",
  defaults: { trigger: "auto", interval: 0 },
  variants: {
    // ticks round one spoke at a time, like a segmented spinner should
    spin: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=spokes]", { rotate: [0, 360] }, { duration: seconds, ease: steps(8) }),
    },
    pulse: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=spokes]",
          { scale: [1, 0.86, 1], opacity: [1, 0.55, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // a soft squash while it turns
    jelly: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=spokes]",
          { rotate: [0, 360], scaleX: [1, 1.08, 0.96, 1], scaleY: [1, 0.93, 1.04, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="spokes" style={pivot("50% 50%")}>
      {SPOKES.map(({ angle, opacity }) => (
        <path key={angle} d="M12 3v3.5" transform={`rotate(${angle} 12 12)`} strokeOpacity={opacity} />
      ))}
    </g>
  ),
})
