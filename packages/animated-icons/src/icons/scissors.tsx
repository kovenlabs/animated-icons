"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    scissors: "snip" | "cut"
  }
}

/**
 * Both blades turn about the screw at (12, 12). Each pivot is that point inside its own blade's box:
 * the upper blade spans 3..19 × 3..19, the lower one 3..19 × 5..21.
 */
const UPPER_PIVOT = pivot("56.25% 56.25%")
const LOWER_PIVOT = pivot("56.25% 43.75%")

/** How far each blade turns to close: 15° keeps the finger rings 2.5px apart when shut. */
const SHUT = 15

/** 2 colors: blades (primary), finger rings (accent). */
export const ScissorsIcon = createAnimatedIcon({
  name: "scissors",
  category: "design",
  keywords: ["cut", "snip", "trim", "clip", "shears", "crop", "craft"],
  slots: { primary: "blades", accent: "finger rings" },
  defaultVariant: "snip",
  variants: {
    // two quick snips: the blades swing shut about the screw and spring back open
    snip: {
      duration: 700,
      run: ({ animate, seconds }) => {
        const transition = { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=upper]", { rotate: [0, -SHUT, 0, -SHUT, 0] }, transition),
          animate("[data-part=lower]", { rotate: [0, SHUT, 0, SHUT, 0] }, transition),
        ])
      },
    },
    // the scissors push forward into a cut, snipping once on the way, and draw back
    cut: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const transition = { duration: seconds, times: [0, 0.3, 0.55, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=scissors]", { x: [0, 2, 2, 0] }, transition),
          animate("[data-part=upper]", { rotate: [0, 0, -SHUT, 0] }, transition),
          animate("[data-part=lower]", { rotate: [0, 0, SHUT, 0] }, transition),
        ])
      },
    },
  },
  render: () => (
    <g data-part="scissors">
      {/* each blade is a ring and a straight edge through the screw; they cross in an open X */}
      <g data-part="upper" style={UPPER_PIVOT}>
        <circle cx="6" cy="6" r="3" stroke={slot.accent} />
        <path d="M8 8 19 19" />
      </g>
      <g data-part="lower" style={LOWER_PIVOT}>
        <circle cx="6" cy="18" r="3" stroke={slot.accent} />
        <path d="M8 16 19 5" />
      </g>
    </g>
  ),
})
