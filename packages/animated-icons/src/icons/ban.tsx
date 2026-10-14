"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    ban: "strike" | "flip" | "deny"
  }
}

/** 2 colors: ring (primary), slash (accent). */
export const Ban = createAnimatedIcon({
  name: "ban",
  category: "security",
  keywords: ["block", "forbidden", "prohibited", "not allowed", "cancel", "denied", "restricted", "no entry"],
  slots: { primary: "ring", accent: "slash" },
  defaultVariant: "strike",
  variants: {
    // the slash fades out and strikes across again from the top-left, and the sign takes the blow:
    // squashed and knocked askew, then springs back
    strike: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.35, times: [0, 0.4, 0.55, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.6, times: [0, 0.2, 0.22, 1], ease: "easeIn" },
          ),
          animate(
            "[data-part=sign]",
            { scale: [1, 1, 0.84, 1.06, 1], rotate: [0, 0, -12, 4, 0] },
            { duration: seconds, times: [0, 0.6, 0.72, 0.86, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a road sign spun on its post: it turns round its upright axis in perspective and back
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sign]",
          { scaleX: [1, -1, 1], skewY: [0, 10, 0, -10, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // shakes its head no: swings side to side, turning away in perspective at each end, damped
    deny: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sign]",
          {
            x: [0, -1.5, 1.5, -1, 0.5, 0],
            rotate: [0, -14, 14, -8, 4, 0],
            scaleX: [1, 0.86, 0.86, 0.92, 0.97, 1],
          },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="sign" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle; the slash ends on it at 45° */}
      <circle cx="12" cy="12" r="9" />
      <path data-part="slash" d="M6 6l12 12" stroke={slot.accent} />
    </g>
  ),
})
