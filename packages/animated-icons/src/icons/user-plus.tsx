"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { badgeGlyph } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "user-plus": "add" | "nod" | "pulse"
  }
}

/** 2 colors: user (primary), plus (accent). */
export const UserPlus = createAnimatedIcon({
  name: "user-plus",
  family: "user",
  category: "users",
  keywords: ["add user", "invite", "new member", "sign up", "follow", "add friend", "register"],
  slots: { primary: "user", accent: "plus" },
  defaultVariant: "add",
  variants: {
    // the plus turns in from a diagonal and lands square; the user answers with a small nod
    add: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plus]",
            { scale: [0, 1.15, 1], rotate: [-90, 0, 0] },
            { duration: seconds * 0.8, ease: ease.overshoot },
          ),
          animate(
            "[data-part=head]",
            { y: [0, 0, 1, 0], scaleY: [1, 1, 0.95, 1] },
            { duration: seconds, times: [0, 0.45, 0.7, 1], ease: "easeInOut" },
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
    // the plus swells once from its centre
    pulse: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=plus]", { scale: [1, 1.2, 1] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      {/* the `user`, compacted into the left 2..14 so the badge zone stays free: same 1:2 head to shoulders */}
      <path data-part="head" d="M8 4l3 2v4l-3 2-3-2V6z" style={pivot("50% 100%")} />
      <path data-part="shoulders" d="M2 21v-2l3-3h6l3 3v2" />
      <path data-part="plus" d={badgeGlyph.plus()} stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
