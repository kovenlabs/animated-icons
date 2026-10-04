"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "badge-check": "verify" | "stamp" | "twist"
  }
}

/**
 * A faceted rosette: eight points on a radius-10 circle, notched 2px in between (radius 8), so it reads
 * as the scalloped seal at any corner style.
 */
const BADGE =
  "M12 2 15.061 4.609 19.071 4.929 19.391 8.939 22 12 19.391 15.061 19.071 19.071 15.061 19.391 12 22 8.939 19.391 4.929 19.071 4.609 15.061 2 12 4.609 8.939 4.929 4.929 8.939 4.609Z"

/** 2 colors: badge (primary), check (accent). */
export const BadgeCheck = createAnimatedIcon({
  name: "badge-check",
  category: "status",
  keywords: ["verified", "approved", "certified", "official", "trusted", "seal", "quality"],
  slots: { primary: "badge", accent: "check" },
  defaultVariant: "verify",
  variants: {
    // the check fades out and redraws from its short leg (hidden while too short to read), and the
    // badge swells once as it lands. The badge only ever grows, so it never closes on the check
    verify: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=check]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=check]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.8, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=badge]",
            { scale: [1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.55, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
    // lifts, then stamps down with a little squash, like a seal pressed onto paper
    stamp: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=seal]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.03, 0.93, 1] },
          { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // the rosette twists on its centre like a medal on a ribbon, the check riding along
    twist: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=seal]",
          { rotate: [0, -16, 12, -5, 0] },
          { duration: seconds, times: [0, 0.3, 0.6, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="seal" style={pivot("50% 50%")}>
      <path data-part="badge" d={BADGE} style={pivot("50% 50%")} />
      {/* the circle-check tick: a short 45° leg, a longer steeper one */}
      <path data-part="check" d="M8 12l3 3 5-6" stroke={slot.accent} style={pivot("40% 100%")} />
    </g>
  ),
})
