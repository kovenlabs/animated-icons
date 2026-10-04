"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    user: "nod" | "tilt" | "pop"
  }
}

/** 2 colors: shoulders (primary), head (accent). */
export const User = createAnimatedIcon({
  name: "user",
  category: "users",
  keywords: ["person", "profile", "account", "avatar", "member", "people"],
  slots: { primary: "shoulders", accent: "head" },
  defaultVariant: "nod",
  variants: {
    // two small nods, the second a touch softer
    nod: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=head]",
          { y: [0, 1, 0, 0.6, 0], scaleY: [1, 0.95, 1, 0.97, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // a curious tilt from the neck, then back upright
    tilt: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=head]",
          { rotate: [0, -12, -12, 4, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
    // the head squeezes, pops, and settles; the shoulders give under it
    pop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            { scale: [1, 0.85, 1.15, 1] },
            { duration: seconds, times: [0, 0.25, 0.6, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=shoulders]",
            { scaleY: [1, 0.9, 1] },
            { duration: seconds * 0.5, ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a pointy-top hexagon head */}
      <path
        data-part="head"
        d="M12 3l4 2.5v4L12 12l-4-2.5v-4z"
        stroke={slot.accent}
        style={pivot("50% 100%")}
      />
      {/* chamfered shoulders, open at the bottom */}
      <path data-part="shoulders" d="M4 21v-2l3-3h10l3 3v2" style={pivot("50% 100%")} />
    </>
  ),
})
