"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "battery-charging": "surge" | "pulse" | "jolt"
  }
}

/**
 * 2 colors: shell + terminal (primary), bolt (accent). The bolt bursts through the shell: its top and
 * bottom edges open 2 clear of the bolt where it crosses them.
 */
export const BatteryCharging = createAnimatedIcon({
  name: "battery-charging",
  family: "battery",
  category: "devices",
  keywords: ["charging", "power", "energy", "plug", "recharge", "electric", "battery"],
  slots: { primary: "shell + terminal", accent: "bolt" },
  defaultVariant: "surge",
  variants: {
    // the bolt fades, then the current redraws it from tip to tip
    // (hidden while it has no length, so its cap never shows as a dot)
    surge: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bolt]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.25, 0.27, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=bolt]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.25, 0.85, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the bolt swells and dims twice, like a charging light breathing
    pulse: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bolt]",
          { scale: [1, 1.15, 1, 1.15, 1], opacity: [1, 0.35, 1, 0.35, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // a jolt of current: the whole battery shudders on the spot
    jolt: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=battery]",
          { x: [0, -1, 1, -1, 1, 0], rotate: [0, -4, 4, -4, 4, 0] },
          { duration: seconds, ease: "linear" },
        ),
    },
  },
  render: () => (
    <g data-part="battery" style={pivot("50% 50%")}>
      {/* the shell, left and right halves, open where the bolt crosses its top and bottom */}
      <path d="M5 6H2v12h3M15 6h3v12h-3" />
      <rect x="19" y="10" width="2" height="4" fill={slot.primary} stroke="none" />
      {/* point-symmetric about the shell's centre (10, 12), tips poking out through the gaps */}
      <path data-part="bolt" d="M11 3 7.5 12h5L9 21" stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
