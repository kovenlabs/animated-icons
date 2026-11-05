"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { badgeGlyph } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "user-minus": "remove" | "nod" | "shake"
  }
}

/** 2 colors: user (primary), minus (accent). */
export const UserMinus = createAnimatedIcon({
  name: "user-minus",
  family: "user",
  category: "users",
  keywords: ["remove user", "remove member", "unfollow", "delete user", "kick", "leave", "unfriend"],
  slots: { primary: "user", accent: "minus" },
  defaultVariant: "remove",
  variants: {
    // the minus is pulled into its right end and stretches back out; the user bows a little as it goes
    remove: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=minus]",
            { scaleX: [1, 0, 1.15, 1] },
            { duration: seconds, times: [0, 0.35, 0.75, 1], ease: ["easeIn", ease.overshoot, "easeOut"] },
          ),
          animate(
            "[data-part=head]",
            { y: [0, 1, 1, 0], scaleY: [1, 0.95, 0.95, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 1], ease: "easeInOut" },
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
    // the head gives a small, damped "no" from the neck
    shake: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=head]", { rotate: [0, -12, 10, -6, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      {/* the `user`, compacted into the left 2..14 like `user-plus`, so the badge zone stays free */}
      <path data-part="head" d="M8 4l3 2v4l-3 2-3-2V6z" style={pivot("50% 100%")} />
      <path data-part="shoulders" d="M2 21v-2l3-3h6l3 3v2" />
      <path data-part="minus" d={badgeGlyph.minus()} stroke={slot.accent} style={pivot("100% 50%")} />
    </>
  ),
})
