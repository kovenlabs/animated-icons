"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-play": "nudge" | "press" | "pulse"
  }
}

/** A right-pointing triangle centred on the ring, over the same 8..16 band as `circle-pause`'s bars. */
const TRIANGLE = "M10 8v8l6-4Z"

/** 2 colors: ring (primary), triangle (accent). */
export const CirclePlay = createAnimatedIcon({
  name: "circle-play",
  family: "circle",
  category: "media",
  keywords: ["play", "start", "resume", "video", "audio", "player", "media"],
  slots: { primary: "ring", accent: "triangle" },
  defaultVariant: "nudge",
  variants: {
    // the triangle leans forward, the way it is about to go, and settles
    nudge: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=play]",
          { x: [0, 2, -0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // pressed like a button: the triangle dips, then springs back a touch past full size
    press: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=play]",
          { scale: [1, 0.8, 1.1, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
        ),
    },
    // the whole badge breathes in and out once, like `circle-pause`
    pulse: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { scale: [1, 1.1, 0.97, 1] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="badge" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      {/* solid: a stroked triangle this small would leave a hole narrower than 2px */}
      <path data-part="play" d={TRIANGLE} fill={slot.accent} stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
