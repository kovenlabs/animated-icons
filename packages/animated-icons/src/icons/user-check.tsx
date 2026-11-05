"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "user-check": "check" | "nod" | "pop"
  }
}

/** A check as wide as `user-plus`'s plus, centred in the badge zone (15..21 × 4..8): a short leg and a long one. */
const CHECK = "M15 6l2 2 4-4"

/** 2 colors: user (primary), check (accent). */
export const UserCheck = createAnimatedIcon({
  name: "user-check",
  family: "user",
  category: "users",
  keywords: ["verified user", "approved", "member", "confirmed", "friend", "following", "accepted"],
  slots: { primary: "user", accent: "check" },
  defaultVariant: "check",
  variants: {
    // the check fades out and redraws from its short leg while the user gives a small nod
    check: {
      duration: 750,
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
            { duration: seconds * 0.85, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=head]",
            { y: [0, 0, 1, 0], scaleY: [1, 1, 0.95, 1] },
            { duration: seconds, times: [0, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // two small nods, the second a touch softer, like `user`
    nod: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=head]",
          { y: [0, 1, 0, 0.6, 0], scaleY: [1, 0.95, 1, 0.97, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the check presses in and springs back past full size from its elbow, like a stamp of approval
    pop: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=check]",
          { scale: [1, 0.6, 1.2, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <>
      {/* the `user`, compacted into the left 2..14 like `user-plus`, so the badge zone stays free */}
      <path data-part="head" d="M8 4l3 2v4l-3 2-3-2V6z" style={pivot("50% 100%")} />
      <path data-part="shoulders" d="M2 21v-2l3-3h6l3 3v2" />
      {/* pivots on its elbow */}
      <path data-part="check" d={CHECK} stroke={slot.accent} style={pivot("33% 100%")} />
    </>
  ),
})
