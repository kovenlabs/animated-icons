"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "at-sign": "ping" | "write" | "spin"
  }
}

/**
 * One stroke, as the glyph is written: down the bowl's right side, out along a short hook, then round
 * an octagonal ring that stops short at the bottom, leaving the lower-right open.
 */
const TAIL = "M16 8v8h4l2-2V7l-5-5H7L2 7v10l5 5h10"

/** 2 colors: stem and ring (primary), bowl (accent). */
export const AtSign = createAnimatedIcon({
  name: "at-sign",
  category: "communication",
  keywords: ["mention", "email address", "at", "tag", "handle", "username", "contact"],
  slots: { primary: "stem + ring", accent: "bowl" },
  defaultVariant: "ping",
  variants: {
    // the bowl dips in and springs back a touch past rest, like a mention landing
    ping: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bowl]",
          { scale: [1, 0.7, 1.1, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the ring is written again in one stroke from the top of the stem; hidden while too short to read
    write: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tail]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=tail]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.12, 0.14, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // one full turn on its centre, settling exactly where it started
    spin: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=at]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <g data-part="at" style={pivot("50% 50%")}>
      {/* a square bowl, the "a"; its right side is shared with the stem */}
      <rect data-part="bowl" x="8" y="8" width="8" height="8" stroke={slot.accent} style={pivot("50% 50%")} />
      <path data-part="tail" d={TAIL} />
    </g>
  ),
})
