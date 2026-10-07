"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "shield-alert": "spin" | "shake" | "flash"
  }
}

/** 2 colors: shield (primary), exclamation mark (accent). */
export const ShieldAlert = createAnimatedIcon({
  name: "shield-alert",
  family: "shield",
  category: "security",
  keywords: ["security alert", "threat", "warning", "vulnerability", "breach", "danger", "unprotected", "risk"],
  slots: { primary: "shield", accent: "exclamation mark" },
  defaultVariant: "spin",
  variants: {
    // the shield jumps up toward you and spins a full turn on its upright axis, lands, and the mark
    // punches out of its face
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=guard]",
            { y: [0, -2, -2, 0, 0, 0], scale: [1, 1.1, 1.1, 1, 1, 1], scaleY: [1, 1, 1, 0.92, 1.03, 1] },
            { duration: seconds * 0.8, times: [0, 0.2, 0.6, 0.75, 0.88, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=shield]",
            { scaleX: [1, -1, 1] },
            { duration: seconds * 0.55, delay: seconds * 0.08, ease: "easeInOut" },
          ),
          animate(
            "[data-part=mark]",
            { scale: [1, 1, 1.32, 1] },
            { duration: seconds, times: [0, 0.62, 0.78, 1], ease: ease.overshoot },
          ),
        ]),
    },
    // the shield shudders on its point as the mark jolts bigger
    shake: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=guard]",
            { rotate: [0, -12, 10, -8, 6, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=mark]",
            { scale: [1, 1.28, 1.28, 1] },
            { duration: seconds, times: [0, 0.15, 0.65, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the mark blinks twice like a warning light and the shield throbs with each blink
    flash: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mark]",
            { opacity: [1, 0, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.65, 0.9, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=guard]",
            { scale: [1, 1, 1.12, 1, 1.12, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.65, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="guard" style={pivot("50% 100%")}>
      <g data-part="shield" style={pivot("50% 50%")}>
        {/* the shield family's faceted outline: flat shoulders, straight sides, three facets down to the point */}
        <path d="M12 2l8 3v7l-3 5-5 4-5-4-3-5V5z" />
        <g data-part="mark" style={pivot("50% 50%")}>
          <path d="M12 6.5v5" stroke={slot.accent} />
          <rect x="11" y="14.5" width="2" height="2" fill={slot.accent} stroke="none" />
        </g>
      </g>
    </g>
  ),
})
