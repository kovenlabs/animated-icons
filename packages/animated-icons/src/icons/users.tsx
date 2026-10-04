"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    users: "nod" | "peek" | "pop"
  }
}

/** 3 colors: front shoulders (primary), back user (secondary), front head (accent). */
export const Users = createAnimatedIcon({
  name: "users",
  family: "user",
  category: "users",
  keywords: ["people", "group", "team", "members", "contacts", "community", "accounts"],
  slots: { primary: "front shoulders", secondary: "back user", accent: "front head" },
  defaultVariant: "nod",
  variants: {
    // the front user nods, the one behind answers a beat later
    nod: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            { y: [0, 1, 0, 0.6, 0], scaleY: [1, 0.95, 1, 0.97, 1] },
            { duration: seconds * 0.75, ease: "easeInOut" },
          ),
          animate(
            "[data-part=back-head]",
            { y: [0, 1, 0, 0] },
            { duration: seconds * 0.55, delay: seconds * 0.45, ease: "easeInOut" },
          ),
        ]),
    },
    // the user behind rises to look over, then settles back
    peek: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=back]",
          { y: [0, -2, -2, 0] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // the front head squeezes and pops; the head behind echoes it, smaller
    pop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            { scale: [1, 0.88, 1.12, 1] },
            { duration: seconds * 0.8, times: [0, 0.25, 0.6, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=back-head]",
            { scale: [1, 1.1, 1] },
            { duration: seconds * 0.6, delay: seconds * 0.4, ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the user behind: only the right half shows, its lines stop clear of the front figure */}
      <g data-part="back" stroke={slot.secondary}>
        <path data-part="back-head" d="M16 3l4 2.5v4L16 12" style={pivot("0% 100%")} />
        <path d="M18 16h1l3 3v2" />
      </g>
      {/* the front user: the user icon's hexagon head over chamfered shoulders, one step left */}
      <path data-part="head" d="M9 3l4 2.5v4L9 12l-4-2.5v-4z" stroke={slot.accent} style={pivot("50% 100%")} />
      <path data-part="shoulders" d="M2 21v-2l3-3h8l3 3v2" />
    </>
  ),
})
