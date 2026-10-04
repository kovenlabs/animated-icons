"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    plus: "turn" | "pulse" | "grow"
  }
}

/** Fades an arm out, then draws it from the centre between `from` and `to` (fractions of the cycle). */
const drawOn = (from: number, to: number) => ({
  keyframes: { opacity: [1, 0, 0, 1, 1, 1], pathLength: [1, 1, 0, 0.15, 1, 1] },
  times: [0, 0.15, from, from + 0.06, to, 1],
})

/** 1 color. Each bar is drawn as two arms from the centre, so it can grow outward. */
export const Plus = createAnimatedIcon({
  name: "plus",
  category: "actions",
  keywords: ["add", "new", "create", "insert", "more", "increase"],
  slots: { primary: "cross" },
  defaultVariant: "turn",
  variants: {
    // a quarter turn with a pop. The plus looks the same a quarter turn back, so it starts there
    // and comes to rest at 0 without a visible jump.
    turn: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cross]",
          { rotate: [-90, 0], scale: [1, 1.15, 1] },
          { duration: seconds, ease: ease.overshoot },
        ),
    },
    // two soft beats, the second smaller
    pulse: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cross]",
          { scale: [1, 1.15, 1, 1.07, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // fades out, then the vertical arms draw out from the centre, then the horizontal ones; each arm
    // is hidden while it is too short to read, so the square cap never leaves a stray dot
    grow: {
      duration: 850,
      run: ({ animate, seconds }) => {
        const vertical = drawOn(0.2, 0.6)
        const horizontal = drawOn(0.45, 0.9)
        return Promise.all([
          animate("[data-part=arm-v]", vertical.keyframes, { duration: seconds, times: vertical.times, ease: "easeOut" }),
          animate("[data-part=arm-h]", horizontal.keyframes, {
            duration: seconds,
            times: horizontal.times,
            ease: "easeOut",
          }),
        ])
      },
    },
  },
  render: () => (
    <g data-part="cross" style={pivot("50% 50%")}>
      <path data-part="arm-v" d="M12 12V5" />
      <path data-part="arm-v" d="M12 12v7" />
      <path data-part="arm-h" d="M12 12H5" />
      <path data-part="arm-h" d="M12 12h7" />
    </g>
  ),
})
