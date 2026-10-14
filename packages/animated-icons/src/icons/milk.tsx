"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    milk: "slosh" | "pop" | "drink"
  }
}

/** 2 colors: bottle (primary), cap and milk (accent). */
export const Milk = createAnimatedIcon({
  name: "milk",
  category: "commerce",
  keywords: ["bottle", "dairy", "drink", "breakfast", "grocery", "beverage", "food"],
  slots: { primary: "bottle", accent: "cap + milk" },
  defaultVariant: "slosh",
  variants: {
    // the bottle rocks onto one bottom corner, then the other, and the milk inside stays level and
    // sloshes after it
    slosh: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const beat = { duration: seconds, times: [0, 0.18, 0.36, 0.54, 0.7, 0.84, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=rock-l]", { rotate: [0, -8, 0, 0, 0, -3, 0] }, beat),
          animate("[data-part=rock-r]", { rotate: [0, 0, 0, 7, 0, 0, 0] }, beat),
          animate("[data-part=milk]", { skewY: [0, 12, -6, -12, 6, 4, 0] }, beat),
        ])
      },
    },
    // squeezed, the bottle shoots its cap up out of the frame; the milk surges up, and the cap tumbles
    // back down onto the neck
    pop: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bottle]",
            { scaleX: [1, 0.86, 1.06, 0.98, 1], scaleY: [1, 1, 0.95, 1, 1] },
            { duration: seconds, times: [0, 0.22, 0.32, 0.45, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=cap]",
            { y: [0, 0, -14, -14, 0, -1.2, 0], rotate: [0, 0, 60, -30, 0, 0, 0] },
            {
              duration: seconds,
              times: [0, 0.22, 0.42, 0.55, 0.78, 0.88, 1],
              ease: ["linear", ease.out, "linear", ease.in, "easeOut", "easeIn"],
            },
          ),
          animate(
            "[data-part=milk]",
            { y: [0, 0, -2, 0.5, 0] },
            { duration: seconds, times: [0, 0.22, 0.36, 0.55, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // three big gulps: the level drops a step with each and the bottle pinches in, then it refills
    drink: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const beat = {
          duration: seconds,
          times: [0, 0.1, 0.22, 0.32, 0.44, 0.54, 0.7, 1],
          ease: ["easeOut", "linear", "easeOut", "linear", "easeOut", "linear", ease.out] satisfies Easing[],
        }
        return Promise.all([
          animate("[data-part=milk]", { y: [0, 1.2, 1.2, 2.4, 2.4, 3.6, 3.6, 0] }, beat),
          animate("[data-part=bottle]", { scaleX: [1, 0.92, 1, 0.92, 1, 0.92, 1, 1] }, beat),
        ])
      },
    },
  },
  render: () => (
    <g data-part="rock-l" style={pivot("0% 100%")}>
      {/* nested pivots: the outer group tips on the left bottom corner, the inner one on the right */}
      <g data-part="rock-r" style={pivot("100% 100%")}>
        <g data-part="bottle" style={pivot("50% 100%")}>
          {/* a chamfered-shoulder bottle under a square cap */}
          <path d="M9 7 7 10v11h10V10l-2-3Z" />
          <path data-part="milk" d="M7 13h1l2 2 2-2 2 2 2-2h1" stroke={slot.accent} style={pivot("50% 50%")} />
        </g>
        <path data-part="cap" d="M9 3h6v4H9Z" stroke={slot.accent} style={pivot("50% 100%")} />
      </g>
    </g>
  ),
})
