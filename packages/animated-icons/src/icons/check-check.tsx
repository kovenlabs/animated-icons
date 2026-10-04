"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "check-check": "draw" | "pop" | "stamp"
  }
}

/** 2 colors: first tick (primary), second tick (accent). */
export const CheckCheck = createAnimatedIcon({
  name: "check-check",
  family: "check",
  category: "status",
  keywords: ["read", "seen", "delivered", "double check", "all done", "verified", "receipt"],
  slots: { primary: "first tick", accent: "second tick" },
  defaultVariant: "draw",
  variants: {
    // each tick fades out and redraws from its short leg, the second right after the first; hidden
    // while too short to read
    draw: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["first", "second"].flatMap((tick, i) => [
            animate(
              `[data-part=${tick}]`,
              { opacity: [1, 0, 0, 1] },
              { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], delay: seconds * 0.25 * i, ease: "easeOut" },
            ),
            animate(
              `[data-part=${tick}]`,
              { pathLength: [1, 1, 0, 1] },
              { duration: seconds * 0.7, times: [0, 0.18, 0.2, 1], delay: seconds * 0.25 * i, ease: "easeOut" },
            ),
          ]),
        ),
    },
    // the second tick pops on the first, like a message being read. It grows from the tip of its short
    // leg, so the gap to the first tick never narrows and its long leg stays inside the frame
    pop: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate("[data-part=second]", { scale: [1, 1.15, 0.96, 1] }, { duration: seconds, ease: ease.out }),
    },
    // both lift, then stamp down with a little squash
    stamp: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ticks]",
          { y: [0, -3, 0, 0], scaleY: [1, 1.04, 0.9, 1] },
          { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="ticks" style={pivot("50% 100%")}>
      {/* two parallel ticks; the second sits 2 lower and its 2-unit short leg stops 2px clear of the
          first's long leg */}
      <path data-part="first" d="M2 11l5 5L17 6" />
      <path data-part="second" d="M13 16l2 2 6-6" stroke={slot.accent} style={pivot("0% 67%")} />
    </g>
  ),
})
