"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-lightning": "strike" | "flicker" | "rumble"
  }
}

/** A zigzag bolt from inside the cloud down to the frame's bottom edge: two parallel blades and a step. */
const BOLT = "M13 10l-3 6h4l-3 6"

/** 2 colors: cloud (primary), bolt (accent). */
export const CloudLightning = createAnimatedIcon({
  name: "cloud-lightning",
  family: "cloud",
  category: "weather",
  keywords: ["storm", "thunder", "lightning", "weather", "thunderstorm", "bolt", "electric"],
  slots: { primary: "cloud", accent: "bolt" },
  defaultVariant: "strike",
  variants: {
    // the bolt goes dark, then strikes down out of the cloud in one stroke and flashes once
    strike: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bolt]",
            { opacity: [1, 0, 0, 1, 0.3, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.33, 0.6, 0.75, 1], ease: "linear" },
          ),
          animate(
            "[data-part=bolt]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.29, 0.3, 0.5, 1], ease: ["linear", "linear", ease.out, "linear"] },
          ),
          animate(
            "[data-part=cloud]",
            { y: [0, 0, -1, 0] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeOut" },
          ),
        ]),
    },
    // an unsteady charge: the bolt stutters out twice and catches
    flicker: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bolt]",
          { opacity: [1, 0.15, 1, 0.5, 0.1, 1] },
          { duration: seconds, times: [0, 0.12, 0.3, 0.45, 0.6, 1], ease: "linear" },
        ),
    },
    // thunder: the whole storm rattles
    rumble: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=storm]",
          { x: [0, -1, 1, -1, 1, 0], y: [0, 0.5, -0.5, 0.5, 0, 0] },
          { duration: seconds, ease: "linear" },
        ),
    },
  },
  render: () => (
    <g data-part="storm" style={pivot("50% 50%")}>
      {/* the faceted cloud of the cloud family, open along its base for the bolt */}
      <path data-part="cloud" d="M5 18l-3-3v-2l3-3h1l2-4 3-2h2l3 2 2 4h1l3 3v2l-3 3" />
      <path data-part="bolt" d={BOLT} stroke={slot.accent} />
    </g>
  ),
})
