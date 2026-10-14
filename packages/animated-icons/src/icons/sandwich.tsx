"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sandwich: "stack" | "flip" | "squeeze"
  }
}

/** 2 colors: bread (primary), lettuce (accent). */
export const Sandwich = createAnimatedIcon({
  name: "sandwich",
  category: "commerce",
  keywords: ["bread", "lunch", "snack", "sub", "toast", "deli", "meal", "food"],
  slots: { primary: "bread", accent: "lettuce" },
  defaultVariant: "stack",
  variants: {
    // the top slice and the lettuce fly out the top, then drop back in order: the lettuce lands on the
    // bottom slice, the bread lands on the lettuce, each with a squash. The lettuce always stays below
    // the bread: it leaves later and comes back sooner
    stack: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=top]",
            { y: [0, -16, -16, 0, 0] },
            { duration: seconds, times: [0, 0.28, 0.55, 0.82, 1], ease: [ease.in, "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=lettuce]",
            { y: [0, 0, -16, -16, 0, 0] },
            {
              duration: seconds,
              times: [0, 0.1, 0.38, 0.45, 0.7, 1],
              ease: ["linear", ease.in, "linear", ease.in, "linear"],
            },
          ),
          animate(
            "[data-part=lettuce]",
            { scaleY: [1, 1, 0.6, 1, 0.7, 1] },
            { duration: seconds, times: [0, 0.7, 0.76, 0.82, 0.88, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=bottom]",
            { scaleY: [1, 1, 0.8, 1, 1] },
            { duration: seconds, times: [0, 0.7, 0.76, 0.86, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the top slice presses down, leaps and flips over a full turn like a pancake, and slaps back down
    // onto the lettuce
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=top]",
            { y: [0, 1, -1, -1, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.65, 0.78, 1], ease: ["easeInOut", ease.out, "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=top]",
            { scaleY: [1, 1, -1, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=lettuce]",
            { scaleY: [1, 0.75, 1, 1, 0.65, 1.1, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.75, 0.82, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // squeezed like a bite: the top presses the lettuce flat, then everything springs back up past rest
    squeeze: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const beat = { duration: seconds, times: [0, 0.3, 0.6, 0.8, 1], ease: [ease.in, "easeOut", "easeInOut", "easeInOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=top]", { y: [0, 2.5, -1, 0.3, 0] }, beat),
          animate("[data-part=lettuce]", { scaleY: [1, 0.5, 1.2, 0.95, 1] }, beat),
          animate("[data-part=bottom]", { scaleY: [1, 0.9, 1, 1, 1] }, beat),
        ])
      },
    },
  },
  render: () => (
    <>
      {/* two slices with chamfered crusts around a band of lettuce */}
      <path data-part="bottom" d="M2 18h20l-1 4H3Z" style={pivot("50% 100%")} />
      <path
        data-part="lettuce"
        d="M3 14l2.25-2.5 2.25 2.5 2.25-2.5 2.25 2.5 2.25-2.5 2.25 2.5 2.25-2.5 2.25 2.5"
        stroke={slot.accent}
        style={pivot("50% 50%")}
      />
      <path data-part="top" d="M3 3h18l1 4H2Z" style={pivot("50% 50%")} />
    </>
  ),
})
