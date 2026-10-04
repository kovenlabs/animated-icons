"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-check": "draw" | "pop" | "stamp"
  }
}

/** 2 colors: ring (primary), check (accent). */
export const CircleCheck = createAnimatedIcon({
  name: "circle-check",
  family: "circle",
  category: "status",
  keywords: ["success", "done", "complete", "approved", "verified", "ok", "confirmed"],
  slots: { primary: "ring", accent: "check" },
  defaultVariant: "draw",
  variants: {
    // the check fades out and redraws from its short leg (hidden while too short to read), and the
    // ring swells once as it lands. The ring only ever grows, so it never closes on the check
    draw: {
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
            "[data-part=ring]",
            { scale: [1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.55, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
    // ring and check pulse together on their centre, like a heartbeat; the ring fills the frame, so
    // the beat stays small enough to keep it inside
    pop: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=beat]",
          { scale: [1, 1.05, 1, 1.025, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // lifts, then stamps down with a little squash; the ring fills the frame, so the lift is 1px
    stamp: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { y: [0, -1, 0, 0], scaleY: [1, 1, 0.9, 1] },
          { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // the badge lands on its base (stamp); the inner group beats on its centre (pop)
    <g data-part="badge" style={pivot("50% 100%")}>
      <g data-part="beat" style={pivot("50% 50%")}>
        {/* a ring is round, so it gets a true circle */}
        <circle data-part="ring" cx="12" cy="12" r="10" style={pivot("50% 50%")} />
        <path data-part="check" d="M8 12l3 3 5-6" stroke={slot.accent} style={pivot("40% 100%")} />
      </g>
    </g>
  ),
})
