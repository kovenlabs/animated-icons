"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bike: "pedal" | "hop"
  }
}

/** Wheel hubs: the wheels are round, so they get true circles. */
const HUBS = [6, 18] as const

/** 2 colors: frame (primary), wheels and spokes (accent). */
export const Bike = createAnimatedIcon({
  name: "bike",
  category: "transport",
  keywords: ["bicycle", "cycling", "ride", "cycle", "commute", "sport", "pedal"],
  slots: { primary: "frame", accent: "wheels + spokes" },
  defaultVariant: "pedal",
  variants: {
    // spokes blur into view and turn a full revolution as the bike edges forward
    pedal: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=spokes]",
            { rotate: [0, 360], opacity: [0, 1, 1, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=bike]", { x: [0, 1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // a bunny hop: pops a wheelie, leaves the ground and lands
    hop: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bike]",
          { y: [0, -0.5, -3, 0, 0], rotate: [0, -8, -3, 1, 0] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeOut", "easeOut", "easeIn", ease.out] },
        ),
    },
  },
  render: () => (
    <g data-part="bike" style={pivot("15% 100%")}>
      {/* a four-sided frame, the seat tube rising to the saddle, the fork rising to the bars */}
      <path d="M6 15h6l4-6h-6ZM12 15 9 6M7.5 6h3M18 15 15 6h3" />
      <g stroke={slot.accent}>
        {HUBS.map((cx) => (
          <circle key={cx} cx={cx} cy="15" r="4" />
        ))}
        {HUBS.map((cx) => (
          <path key={cx} data-part="spokes" d={`M${cx} 12.5v5M${cx - 2.5} 15h5`} style={flash()} />
        ))}
      </g>
    </g>
  ),
})
