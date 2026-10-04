"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    info: "pulse" | "hop" | "tilt"
  }
}

/** 2 colors: ring (primary), "i" mark (accent). The `circle-alert` mark turned upside down: dot on top, stem below. */
export const Info = createAnimatedIcon({
  name: "info",
  category: "status",
  keywords: ["information", "about", "help", "details", "tooltip", "hint", "notice"],
  slots: { primary: "ring", accent: "i mark" },
  defaultVariant: "pulse",
  variants: {
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
    // the "i" hops up on its foot, staying clear of the ring, and lands with a small squash
    hop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { y: [0, -2, 0, 0], scaleY: [1, 1, 0.9, 1] },
          { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // tilts its head, curious, then straightens up
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { rotate: [0, -14, -14, 4, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="badge" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      <g data-part="mark" style={pivot("50% 100%")}>
        <rect x="11" y="6" width="2" height="2" fill={slot.accent} stroke="none" />
        <path d="M12 11v6" stroke={slot.accent} />
      </g>
    </g>
  ),
})
