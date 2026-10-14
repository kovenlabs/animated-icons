"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "database-zap": "zap" | "charge" | "rattle"
  }
}

/** 2 colors: drum (primary), bolt and middle ring (accent). */
export const DatabaseZap = createAnimatedIcon({
  name: "database-zap",
  family: "database",
  category: "development",
  keywords: ["database", "fast query", "cache", "power", "performance", "electric", "storage", "realtime"],
  slots: { primary: "drum", accent: "bolt + middle ring" },
  defaultVariant: "zap",
  variants: {
    // the bolt strikes top to bottom and flickers, and the drum takes the hit: it slumps under the jolt
    // while its ring flickers with the current
    zap: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bolt]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.05, 0.06, 0.28, 1], ease: ["linear", "linear", ease.in, "linear"] },
          ),
          // hidden while it is too short to read, then a couple of after-flickers
          animate(
            "[data-part=bolt]",
            { opacity: [1, 1, 0, 0, 1, 0.2, 1, 0.3, 1] },
            { duration: seconds, times: [0, 0.05, 0.06, 0.08, 0.1, 0.36, 0.42, 0.5, 0.58], ease: "linear" },
          ),
          animate(
            "[data-part=drum]",
            { scaleY: [1, 1, 0.84, 1.0, 0.94, 1], scaleX: [1, 1, 1.02, 0.99, 1.01, 1] },
            { duration: seconds, times: [0, 0.28, 0.38, 0.55, 0.68, 0.85], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ring]",
            { opacity: [1, 1, 0.15, 1, 0.15, 1] },
            { duration: seconds, times: [0, 0.3, 0.38, 0.46, 0.54, 0.64], ease: "linear" },
          ),
        ]),
    },
    // the bolt pumps twice like a charger and each pump runs a fresh current round the ring
    // (hidden while it is too short to read)
    charge: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bolt]",
            { scale: [1, 0.7, 1.2, 0.75, 1.2, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.5, 0.65, 0.9], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ring]",
            { pathLength: [1, 1, 0, 1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.25, 0.26, 0.48, 0.6, 0.61, 0.85], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ring]",
            { opacity: [1, 1, 0, 0, 1, 1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.25, 0.26, 0.28, 0.3, 0.6, 0.61, 0.63, 0.65], ease: "linear" },
          ),
        ]),
    },
    // the bolt turns over like a card and the lid rattles flat and back twice under it, as if the
    // drum were humming with power
    rattle: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bolt]",
            { scaleX: [1, -1, 1], skewY: [0, 14, 0, -14, 0], scale: [1, 1.12, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=lid]",
            { scaleY: [1, 0.4, 1, 0.55, 1] },
            { duration: seconds * 0.7, delay: seconds * 0.15, ease: "easeInOut" },
          ),
          animate(
            "[data-part=drum]",
            { scaleY: [1, 0.93, 1, 0.96, 1] },
            { duration: seconds * 0.7, delay: seconds * 0.15, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a drum is round, so its rims are true ellipses and elliptical arcs; the bolt takes its lower
          right, so the walls stop short of it */}
      <g data-part="drum" style={pivot("50% 100%")}>
        <ellipse data-part="lid" cx="12" cy="5" rx="9" ry="3" style={pivot("50% 50%")} />
        <path d="M3 5v13A9 3 0 0 0 13 20.98" />
        <path d="M21 5v2" />
        <path data-part="ring" d="M3 12A9 3 0 0 0 13 14.98" stroke={slot.accent} />
      </g>
      <path data-part="bolt" d="M20 11l-3 5h4l-3 5" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
