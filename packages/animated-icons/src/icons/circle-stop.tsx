"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-stop": "press" | "pop" | "turn"
  }
}

/** 2 colors: ring (primary), stop square (accent). */
export const CircleStop = createAnimatedIcon({
  name: "circle-stop",
  family: "circle",
  category: "media",
  keywords: ["stop", "halt", "end", "record stop", "cancel", "stop button", "finish"],
  slots: { primary: "ring", accent: "stop square" },
  defaultVariant: "press",
  variants: {
    // pressed like a stop button: the whole badge dips in and springs back
    press: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { scale: [1, 0.86, 1.04, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the square punches out from the middle and settles
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=stop]", { scale: [1, 1.25, 0.95, 1] }, { duration: seconds, ease: ease.out }),
    },
    // the square makes a quarter turn and lands with an overshoot. It looks the same a quarter turn
    // back, so it starts there and comes to rest at 0 without a visible jump
    turn: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=stop]",
          { rotate: [-90, 0], scale: [1, 0.8, 1] },
          { duration: seconds, ease: ease.overshoot },
        ),
    },
  },
  render: () => (
    <g data-part="badge" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      {/* an open 6×6 square, 2px clear of the ring even mid-turn */}
      <path data-part="stop" d="M9 9h6v6H9z" stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
