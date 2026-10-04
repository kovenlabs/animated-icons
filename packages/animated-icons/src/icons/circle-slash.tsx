"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-slash": "strike" | "shake" | "pulse"
  }
}

/** The bar, corner to corner at 45°, stopping on the ring's inner edge (r 9) so even a square cap stays inside it. */
const BAR = "M5.636 5.636 18.364 18.364"

/** 2 colors: ring (primary), bar (accent). */
export const CircleSlash = createAnimatedIcon({
  name: "circle-slash",
  family: "circle",
  category: "status",
  keywords: ["ban", "block", "forbidden", "prohibited", "not allowed", "disabled", "deny"],
  slots: { primary: "ring", accent: "bar" },
  defaultVariant: "strike",
  variants: {
    // the bar fades out and strikes across again from the top-left; the ring swells as it lands
    strike: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bar]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=bar]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.75, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=ring]",
            { scale: [1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.55, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a firm no-no shake on its centre
    shake: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { rotate: [0, -12, 10, -7, 4, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // swells twice, the second time softer, like a warning sign pulsing
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { scale: [1, 1.1, 1, 1.05, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="badge" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle */}
      <circle data-part="ring" cx="12" cy="12" r="10" style={pivot("50% 50%")} />
      <path data-part="bar" d={BAR} stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
