"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    rainbow: "arc" | "flip" | "shimmer"
  }
}

/**
 * Three bands, outside in, each a true half circle (a rainbow is round) round (12, 17), drawn from
 * the left foot to the right, 4 apart so a 2px gap stays between them.
 */
const BANDS = [
  { r: 10, color: slot.primary },
  { r: 6, color: slot.secondary },
  { r: 2, color: slot.accent },
]

/** 3 colors: outer band (primary), middle band (secondary), inner band (accent). */
export const Rainbow = createAnimatedIcon({
  name: "rainbow",
  category: "weather",
  keywords: ["weather", "spectrum", "colors", "pride", "arc", "after rain", "hope", "prism"],
  slots: { primary: "outer band", secondary: "middle band", accent: "inner band" },
  defaultVariant: "arc",
  variants: {
    // the bands fade out, then paint across the sky from left to right, outside in, each giving a
    // little bounce as its right foot lands
    arc: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=band]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds * 0.7, times: [0, 0.15, 0.31, 0.42, 1], delay: stagger(seconds * 0.15), ease: "easeOut" },
          ),
          animate(
            "[data-part=band]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.7, times: [0, 0.29, 0.3, 1], delay: stagger(seconds * 0.15), ease: ["linear", "linear", "easeOut"] },
          ),
          animate(
            "[data-part=band]",
            { scale: [1, 1, 1.08, 1] },
            {
              duration: seconds * 0.45,
              times: [0, 0.4, 0.7, 1],
              delay: stagger(seconds * 0.15, { startDelay: seconds * 0.4 }),
              ease: "easeOut",
            },
          ),
        ]),
    },
    // the rainbow hops up, turns a full circle on its upright axis in the air, and lands with a squash
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: [1, 1, -1, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=rainbow]",
            { y: [0, -3, -3, 0, 0, 0], scaleY: [1, 1.05, 1, 1, 0.82, 1] },
            { duration: seconds, times: [0, 0.2, 0.65, 0.8, 0.88, 1], ease: ["easeOut", "linear", "easeIn", "easeOut", ease.overshoot] },
          ),
        ]),
    },
    // a wave of light runs out through the bands, inside out, each swelling from its feet and settling
    shimmer: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=band]",
          { scale: [1, 1.12, 1] },
          { duration: seconds * 0.6, delay: stagger(seconds * 0.2, { from: "last" }), ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="rainbow" style={pivot("50% 100%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        {BANDS.map(({ r, color }) => (
          <path
            key={r}
            data-part="band"
            d={`M${12 - r} 17a${r} ${r} 0 0 1 ${2 * r} 0`}
            stroke={color}
            style={pivot("50% 100%")}
          />
        ))}
      </g>
    </g>
  ),
})
