"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-dot": "select" | "press" | "pulse"
  }
}

/** 2 colors: ring (primary), dot (accent). */
export const CircleDot = createAnimatedIcon({
  name: "circle-dot",
  family: "circle",
  category: "actions",
  keywords: ["radio", "selected", "option", "choice", "checked", "target", "record"],
  slots: { primary: "ring", accent: "dot" },
  defaultVariant: "select",
  variants: {
    // the dot pops in from nothing and lands with a little overshoot, like a radio being picked
    select: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate("[data-part=dot]", { scale: [0, 1] }, { duration: seconds, ease: ease.overshoot }),
    },
    // pressed like a button: the whole radio dips in and springs back
    press: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=radio]",
          { scale: [1, 0.88, 1.03, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the dot beats twice inside the still ring, the second time softer
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=dot]",
          { scale: [1, 1.2, 1, 1.1, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="radio" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      {/* a solid square dot, well clear of the ring even at its widest pulse: the corners round it at render */}
      <rect data-part="dot" x="9" y="9" width="6" height="6" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </g>
  ),
})
