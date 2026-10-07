"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    blend: "mix" | "turn" | "orbit"
  }
}

/**
 * Two circles of radius 7, centred at (15, 9) and (9, 15), crossing at (8.06, 8.06) and (15.94, 15.94).
 * The lens they share is bounded by an arc of each.
 */
const LENS = "M8.06 8.06A7 7 0 0 0 15.94 15.94A7 7 0 0 0 8.06 8.06Z"

/** 2 colors: circles (primary), blended overlap (accent). */
export const Blend = createAnimatedIcon({
  name: "blend",
  category: "design",
  keywords: ["mix", "merge", "overlap", "venn", "combine", "blending mode", "intersection", "opacity"],
  slots: { primary: "circles", accent: "blended overlap" },
  defaultVariant: "mix",
  variants: {
    // the circles slide together into one, which swells as they fuse; they spring back apart past
    // their places and the blended overlap pops back in
    mix: {
      duration: 1200,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=front]",
            { x: [0, -3, -3, 0.8, 0], y: [0, 3, 3, -0.8, 0], scale: [1, 1, 1.15, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=back]",
            { x: [0, 3, 3, -0.8, 0], y: [0, -3, -3, 0.8, 0], scale: [1, 1, 1.15, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=lens]",
            { opacity: [1, 0, 0, 1, 1], scale: [1, 0.4, 0.4, 1.15, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.78, 1], ease: "easeOut" },
          ),
        ]),
    },
    // turns a full circle about its vertical axis, so the pair swaps diagonals halfway round
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=blend]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate("[data-part=blend]", { y: [0, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the pair spins half a turn about the overlap with a spring and snaps back unseen (each circle
    // has taken the other's place); the overlap swells as they go
    orbit: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=blend]",
            { rotate: [0, 180, 0] },
            { duration: seconds, times: [0, 0.999, 1], ease: [ease.overshoot, snap] },
          ),
          animate("[data-part=lens]", { scale: [1, 1.35, 1] }, { duration: seconds, times: [0, 0.4, 1], ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="blend" style={pivot("50% 50%")}>
      <path data-part="lens" d={LENS} fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      <circle data-part="front" cx={15} cy={9} r={7} style={pivot("50% 50%")} />
      <circle data-part="back" cx={9} cy={15} r={7} style={pivot("50% 50%")} />
    </g>
  ),
})
