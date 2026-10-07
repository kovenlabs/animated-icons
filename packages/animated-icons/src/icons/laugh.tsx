"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    laugh: "giggle" | "roll" | "tip"
  }
}

/** 1 color: face, eyes and mouth (primary). */
export const Laugh = createAnimatedIcon({
  name: "laugh",
  category: "social",
  keywords: ["lol", "haha", "funny", "joy", "emoji", "happy", "grin", "reaction"],
  slots: { primary: "face + eyes + mouth" },
  defaultVariant: "giggle",
  variants: {
    // shaking with laughter: the face bounces on the spot, squashing as it lands, rocking side to
    // side, and the mouth gapes and closes with every "ha"
    giggle: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=laugh]",
            { y: [0, -2.5, 0, -2, 0, -1.5, 0], scaleY: [1, 1.04, 0.92, 1.03, 0.94, 1.02, 1] },
            { duration: seconds, ease: ["easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn"] },
          ),
          animate("[data-part=face]", { rotate: [0, -8, 6, -6, 4, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=mouth]",
            { scaleY: [1, 1.35, 0.8, 1.3, 0.8, 1.2, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // rolling on the floor: a wind-up, then one full roll that lands with a squash
    roll: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=face]",
            { rotate: [0, -25, 360] },
            { duration: seconds * 0.8, times: [0, 0.25, 1], ease: ["easeOut", ease.overshoot] },
          ),
          animate(
            "[data-part=laugh]",
            { y: [0, 0, -2.5, 0, 0], scaleY: [1, 1, 1.03, 0.9, 1] },
            { duration: seconds, times: [0, 0.2, 0.5, 0.8, 1], ease: ["linear", "easeOut", "easeIn", "easeOut"] },
          ),
        ]),
    },
    // throws its head back: the features slide up and flatten like the face is tipping away, the mouth
    // gapes, then it rocks forward past upright and settles
    tip: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: ["easeOut", "linear", "easeInOut", "easeInOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=features]", { y: [0, -2.5, -2.5, 1, 0], scaleY: [1, 0.8, 0.8, 1.05, 1] }, timing),
          animate("[data-part=mouth]", { scaleY: [1, 1.3, 1.3, 1, 1] }, timing),
          animate("[data-part=laugh]", { scaleY: [1, 0.95, 0.95, 1.02, 1], y: [0, -0.5, -0.5, 0.5, 0] }, timing),
        ])
      },
    },
  },
  render: () => (
    <g data-part="laugh" style={pivot("50% 100%")}>
      <g data-part="face" style={pivot("50% 50%")}>
        {/* a face is round, so it gets a true circle */}
        <circle cx="12" cy="12" r="10" />
        <g data-part="features" style={pivot("50% 50%")}>
          {/* eyes squeezed shut into two peaks */}
          <path d="M7 9.5l2-2 2 2M13 9.5l2-2 2 2" />
          {/* a wide open laugh: flat top lip, raked sides, narrower bottom */}
          <path data-part="mouth" d="M7 14h10l-2.5 4h-5z" style={pivot("50% 0%")} />
        </g>
      </g>
    </g>
  ),
})
