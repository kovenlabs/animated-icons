"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "life-buoy": "spin" | "bob" | "throw"
  }
}

const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** The ring's inner and outer edges, as circle radii. */
const INNER = 4
const OUTER = 10

/** The four bands across the ring, on the diagonals, each running from the inner edge to the outer. */
const BANDS = [45, 135, 225, 315]
  .map((deg) => {
    const [cos, sin] = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
    return `M${fmt(12 + cos * INNER)} ${fmt(12 + sin * INNER)}L${fmt(12 + cos * OUTER)} ${fmt(12 + sin * OUTER)}`
  })
  .join("")

/** 2 colors: ring (primary), bands (accent). */
export const LifeBuoy = createAnimatedIcon({
  name: "life-buoy",
  category: "status",
  keywords: ["help", "support", "lifebuoy", "lifesaver", "rescue", "assistance", "safety", "help center"],
  slots: { primary: "ring", accent: "bands" },
  defaultVariant: "spin",
  variants: {
    // the buoy spins a quarter turn and settles; four bands make a quarter turn look like rest, so it snaps back unseen
    spin: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=buoy]",
          { rotate: [0, 100, 90, 0] },
          { duration: seconds, times: [0, 0.6, 0.999, 1], ease: [ease.inOut, "easeInOut", snap] },
        ),
    },
    // it floats on a swell: sinks a little, rises, and rocks gently as it settles
    bob: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=buoy]",
          { y: [0, 1.5, -1.5, 0.75, 0], rotate: [0, -6, 4, -2, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // thrown out to someone: it winds back, flies up and over turning, and lands with a squash
    throw: {
      duration: 900,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=toss]",
            { y: [0, 1, -2.5, 0, 0], scaleY: [1, 0.94, 1.03, 0.92, 1], scaleX: [1, 1.04, 0.98, 1.06, 1] },
            { duration: seconds, times: [0, 0.15, 0.5, 0.8, 1], ease: ["easeOut", "easeOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=buoy]",
            { rotate: [0, 0, 90, 90, 0] },
            { duration: seconds, times: [0, 0.15, 0.8, 0.999, 1], ease: ["linear", "easeInOut", "linear", snap] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="toss" style={pivot("50% 100%")}>
      <g data-part="buoy" style={pivot("50% 50%")}>
        {/* a life buoy is round, so its edges are true circles */}
        <circle cx="12" cy="12" r={OUTER} />
        <circle cx="12" cy="12" r={INNER} />
        <path d={BANDS} stroke={slot.accent} />
      </g>
    </g>
  ),
})
