"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    gauge: "sweep" | "redline" | "wobble"
  }
}

/**
 * A dial is round, so it gets true arcs: r 9 around the hub (12, 14), open at the bottom from 30°
 * to 150°. The scale runs from 150° clockwise over the top to 315°; the red zone covers 340°–30°,
 * 25° on from it so their caps stay 2 clear.
 */
const SCALE = "M4.206 18.5A9 9 0 0 1 18.364 7.636"
const ZONE = "M20.457 10.922A9 9 0 0 1 19.794 18.5"

/** 3 colors: dial (primary), red zone (secondary), needle + hub (accent). */
export const Gauge = createAnimatedIcon({
  name: "gauge",
  category: "charts",
  keywords: ["speedometer", "meter", "dashboard", "performance", "speed", "level", "dial", "kpi"],
  slots: { primary: "dial", secondary: "red zone", accent: "needle + hub" },
  defaultVariant: "sweep",
  variants: {
    // the needle drops to the bottom of the scale, sweeps up into the red zone and settles back
    sweep: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=needle]",
          { rotate: [0, -115, 50, -6, 0] },
          { duration: seconds, times: [0, 0.3, 0.68, 0.86, 1], ease: ["easeInOut", "easeInOut", "easeOut", "easeInOut"] },
        ),
    },
    // the needle pegs into the red zone and shudders there while the zone flashes, then falls back
    redline: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=needle]",
            { rotate: [0, 45, 37, 45, 39, 45, 0] },
            { duration: seconds, times: [0, 0.25, 0.37, 0.49, 0.6, 0.72, 1], ease: [ease.out, "easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=zone]",
            { opacity: [1, 1, 0.3, 1, 0.3, 1, 1] },
            { duration: seconds, times: [0, 0.25, 0.37, 0.49, 0.6, 0.72, 1], ease: "linear" },
          ),
        ]),
    },
    // a nervous reading: the needle flicks either side of its value and calms down
    wobble: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=needle]",
          { rotate: [0, -20, 15, -8, 3, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <path d={SCALE} />
      <path data-part="zone" d={ZONE} stroke={slot.secondary} />
      {/* turns on its foot, the hub; short enough to clear the dial by 2 at every angle */}
      <path data-part="needle" d="M12 14l3.5-3.5" stroke={slot.accent} style={pivot("0% 100%")} />
      <rect x="10" y="12" width="4" height="4" fill={slot.accent} stroke="none" />
    </>
  ),
})
