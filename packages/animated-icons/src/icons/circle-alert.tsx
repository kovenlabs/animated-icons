"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-alert": "shake" | "pulse" | "flash"
  }
}

/** 2 colors: ring (primary), exclamation mark (accent). */
export const CircleAlert = createAnimatedIcon({
  name: "circle-alert",
  family: "circle",
  category: "status",
  keywords: ["error", "warning", "attention", "info", "problem", "exclamation", "issue"],
  slots: { primary: "ring", accent: "exclamation mark" },
  defaultVariant: "shake",
  variants: {
    // a quick no-no shake on its centre
    shake: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { rotate: [0, -12, 10, -7, 4, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // swells twice, the second time softer, to call for attention
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { scale: [1, 1.12, 1, 1.06, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the mark blinks off and on twice, like a warning light
    flash: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { opacity: [1, 0, 1, 0, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="badge" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      <g data-part="mark">
        <path d="M12 7v6" stroke={slot.accent} />
        <rect x="11" y="16" width="2" height="2" fill={slot.accent} stroke="none" />
      </g>
    </g>
  ),
})
