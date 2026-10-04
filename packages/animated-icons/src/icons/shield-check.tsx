"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "shield-check": "secure" | "pulse" | "tilt"
  }
}

/** 2 colors: shield (primary), check (accent). */
export const ShieldCheck = createAnimatedIcon({
  name: "shield-check",
  family: "shield",
  category: "security",
  keywords: ["protected", "secure", "verified", "safe", "security", "trusted", "antivirus"],
  slots: { primary: "shield", accent: "check" },
  defaultVariant: "secure",
  variants: {
    // the check fades out and redraws from its short leg (hidden while too short to read), and the
    // shield swells once as it lands. The shield only ever grows, so it never closes on the check
    secure: {
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
            "[data-part=shield]",
            { scale: [1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.55, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
    // shield and check pulse together, like a heartbeat
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=guard]",
          { scale: [1, 1.08, 1, 1.04, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the shield raises and turns to parry, then settles upright
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=guard]",
          { rotate: [0, -10, -10, 3, 0], y: [0, -1.5, -1.5, 0, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="guard" style={pivot("50% 100%")}>
      {/* a faceted shield: flat shoulders, straight sides, three facets down to the point */}
      <path data-part="shield" d="M12 2l8 3v7l-3 5-5 4-5-4-3-5V5z" style={pivot("50% 50%")} />
      {/* the check icon's tick at shield size: a short 45° leg, a longer steeper one */}
      <path data-part="check" d="M8 12l3 3 5-6" stroke={slot.accent} style={pivot("40% 100%")} />
    </g>
  ),
})
