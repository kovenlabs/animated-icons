"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    umbrella: "open" | "shake"
  }
}

/** A faceted dome closed along a flat rim. */
const CANOPY = "M2 12l1.5-4L7 5l5-1 5 1 3.5 3 1.5 4z"

/** Drops flung off each end of the rim, each with the way it flies (out and down). */
const DROPS = [
  { d: "M3 15v1.5", x: -2 },
  { d: "M21 15v1.5", x: 2 },
]

/** 2 colors: umbrella (primary), rain drops (accent). */
export const Umbrella = createAnimatedIcon({
  name: "umbrella",
  category: "weather",
  keywords: ["rain", "weather", "protection", "insurance", "shelter", "cover", "wet", "safe"],
  slots: { primary: "umbrella", accent: "rain drops" },
  defaultVariant: "open",
  variants: {
    // the canopy folds down against the shaft and springs open again
    open: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=canopy]",
          { scaleX: [1, 0.25, 0.25, 1.06, 1], scaleY: [1, 1.15, 1.15, 0.97, 1] },
          { duration: seconds, times: [0, 0.3, 0.45, 0.8, 1], ease: ["easeIn", "linear", ease.out, "easeInOut"] },
        ),
    },
    // a brisk shake on its handle flings the rain off both ends of the rim
    shake: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=umbrella]",
            { rotate: [0, -10, 8, -5, 2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          ...DROPS.map(({ x }, i) =>
            animate(
              `[data-part=drop-${i}]`,
              { opacity: [0, 1, 0], x: [0, x, x * 1.5], y: [0, 1.5, 3] },
              { duration: seconds * 0.5, delay: seconds * (0.15 + i * 0.15), ease: "easeOut" },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {DROPS.map(({ d }, i) => (
          <path key={d} data-part={`drop-${i}`} d={d} style={flash()} />
        ))}
      </g>
      <g data-part="umbrella" style={pivot("50% 100%")}>
        <g data-part="canopy" style={pivot("50% 0%")}>
          <path d="M12 4V2" />
          <path d={CANOPY} />
        </g>
        {/* the shaft ends in a squared J hook */}
        <path d="M12 12v7.5l1.5 1.5h1l1.5-1.5v-1" />
      </g>
    </>
  ),
})
