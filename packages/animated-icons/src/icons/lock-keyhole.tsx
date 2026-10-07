"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "lock-keyhole": "unlock" | "rattle" | "spin"
  }
}

/** 2 colors: body (primary), shackle and keyhole (accent). */
export const LockKeyhole = createAnimatedIcon({
  name: "lock-keyhole",
  family: "lock",
  category: "security",
  keywords: ["padlock", "keyhole", "locked", "secure", "private", "protected", "encryption", "password"],
  slots: { primary: "body", accent: "shackle + keyhole" },
  defaultVariant: "unlock",
  variants: {
    // the keyhole turns, the shackle springs up and swings open toward you on its left leg, holds, swings
    // back and clacks shut, and the keyhole turns home
    unlock: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=keyhole]",
            { rotate: [0, 90, 90, 0] },
            { duration: seconds, times: [0, 0.14, 0.86, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=shackle]",
            {
              y: [0, 0, -3, -3, -3, -3, 0, 0],
              scaleX: [1, 1, 1, -0.55, -0.55, 1, 1, 1],
            },
            {
              duration: seconds,
              times: [0, 0.12, 0.26, 0.44, 0.62, 0.78, 0.88, 1],
              ease: ["linear", ease.overshoot, "easeInOut", "linear", "easeInOut", ease.in, "linear"],
            },
          ),
          animate(
            "[data-part=lock]",
            { scaleY: [1, 1, 0.94, 1] },
            { duration: seconds, times: [0, 0.88, 0.93, 1], ease: "easeOut" },
          ),
        ]),
    },
    // someone tugs at it: the shackle jerks against the body twice while the lock rattles side to side
    rattle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=lock]", { x: [0, -2, 2, -2, 2, -1, 0] }, { duration: seconds, ease: "linear" }),
          animate(
            "[data-part=shackle]",
            { y: [0, -1.5, 0, -1.5, 0] },
            { duration: seconds * 0.7, ease: "easeOut" },
          ),
        ]),
    },
    // the padlock lifts and turns a full turn on its upright axis; its back has no keyhole, so the keyhole
    // is gone while the back faces you
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lock]",
            { y: [0, -2, -2, 0] },
            { duration: seconds, times: [0, 0.2, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=turn]",
            { scaleX: [1, -1, 1] },
            { duration: seconds * 0.8, delay: seconds * 0.1, ease: "easeInOut" },
          ),
          animate(
            "[data-part=keyhole]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.301, 0.7, 0.701, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="lock" style={pivot("50% 100%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        {/* the lock's squared-off shackle, hinged on its left leg */}
        <path data-part="shackle" d="M8 11V5h8v6" stroke={slot.accent} style={pivot("0% 100%")} />
        <path d="M5 11h14v10H5z" />
        {/* a keyhole: a round head over a flared foot */}
        <g data-part="keyhole" fill={slot.accent} stroke="none" style={pivot("50% 50%")}>
          <circle cx="12" cy="15.5" r="1.5" />
          <path d="M11.25 16.5h1.5l.75 1.5h-3z" />
        </g>
      </g>
    </g>
  ),
})
