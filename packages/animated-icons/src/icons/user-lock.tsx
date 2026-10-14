"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "user-lock": "lock" | "shake" | "spin"
  }
}

/** 2 colors: user (primary), padlock (accent). */
export const UserLock = createAnimatedIcon({
  name: "user-lock",
  family: "user",
  category: "security",
  keywords: ["locked account", "private profile", "restricted user", "secure account", "access control", "permissions", "blocked user"],
  slots: { primary: "user", accent: "padlock" },
  defaultVariant: "lock",
  variants: {
    // the shackle springs open, hangs, then slams shut: the padlock squashes on the impact and the
    // user nods along
    lock: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=shackle]",
            { y: [0, -3.5, -3.5, 0] },
            { duration: seconds * 0.7, times: [0, 0.3, 0.6, 1], ease: [ease.out, "linear", ease.in] },
          ),
          animate(
            "[data-part=padlock]",
            { scaleY: [1, 1, 0.8, 1.06, 1], scaleX: [1, 1, 1.12, 0.97, 1] },
            { duration: seconds, times: [0, 0.7, 0.78, 0.9, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=head]",
            { y: [0, 0, 1.5, 0], scaleY: [1, 1, 0.92, 1] },
            { duration: seconds, times: [0, 0.72, 0.84, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // access denied: the padlock rattles hard on its shackle and the user recoils from it
    shake: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=padlock]",
            { rotate: [0, -6, 9, -5, 5, -2, 0], x: [0, 0, 0.5, 0, 0.3, 0, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { rotate: [0, -16, -16, 0], x: [0, -1.5, -1.5, 0], y: [0, 0.5, 0.5, 0] },
            { duration: seconds, times: [0, 0.2, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the padlock hops and spins a full turn on its upright axis, landing with a squash
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=padlock]",
            { y: [0, -2.5, -2.5, 0, 0, 0], scaleY: [1, 1.08, 1, 0.82, 1.05, 1] },
            { duration: seconds, times: [0, 0.2, 0.6, 0.72, 0.86, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=turn]",
            { scaleX: [1, -1, 1] },
            { duration: seconds * 0.5, delay: seconds * 0.1, ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { rotate: [0, 10, 10, 0] },
            { duration: seconds, times: [0, 0.25, 0.65, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the `user`, compacted into the left: its far shoulder hides behind the padlock */}
      <path data-part="head" d="M8 4l3 2v4l-3 2-3-2V6z" style={pivot("50% 100%")} />
      <path d="M2 21v-2l3-3h4" />
      <g data-part="padlock" stroke={slot.accent} style={pivot("50% 100%")}>
        <g data-part="turn" style={pivot("50% 50%")}>
          <path data-part="shackle" d="M14.5 15v-3h4v3" />
          <path d="M13 15h7v6h-7z" />
        </g>
      </g>
    </>
  ),
})
